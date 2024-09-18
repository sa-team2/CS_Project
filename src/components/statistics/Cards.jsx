import React, { useState, useEffect } from 'react';
import './Cards.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFire, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

function Cards() {
  const [totalDataCount, setTotalDataCount] = useState(0);  // 資料總數
  const [topType, setTopType] = useState('');               // 熱門詐騙類型
  const [accuracy, setAccuracy] = useState(0);              // 辨識準確度

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Statistics'));
        let totalCount = 0;
        let maxFrequency = 0;
        let totalAccuracy = 0;
        let typeCount = 0;
        let topScamType = '';

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalCount += data.Frequency;

          // 累加所有的準確度
          if (data.Accuracy !== undefined) {
            totalAccuracy += data.Accuracy;
            typeCount++;
          }

          // 找最熱門的詐騙類型
          if (data.Frequency > maxFrequency) {
            maxFrequency = data.Frequency;
            topScamType = data.Type;
          }
        });

        setTotalDataCount(totalCount);
        setTopType(topScamType);


        const averageAccuracy = typeCount > 0 ? (totalAccuracy / typeCount).toFixed(2) : 0;
        setAccuracy(averageAccuracy);

      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card className="card-custom bg-gradient-pink">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>資料數量：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={faDatabase} /> {totalDataCount}+
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Card className="card-custom bg-gradient-blue">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>熱門詐騙類型：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={faFire} /> {topType || '載入中...'}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="card-custom bg-gradient-green">
        <Card.Body className="cardbody-custom">
          <Card.Title><b>辨識準確度：</b></Card.Title>
          <Card.Text className="cardtext-custom">
            <FontAwesomeIcon icon={faCrosshairs} /> {accuracy}%
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Cards;
