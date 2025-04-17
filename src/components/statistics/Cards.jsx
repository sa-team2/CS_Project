import React, { useState, useEffect } from 'react';
import './Cards.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFire, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function Cards() {
  const [totalDataCount, setTotalDataCount] = useState(0);  // 資料總數
  const [topType, setTopType] = useState('');               // 熱門詐騙類型
  const [accuracy, setAccuracy] = useState(0);              // 辨識準確度

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Statistics'));
        let maxFrequency = 0;
        let topScamType = '';

        // 讀取finalStatistics
        const finalDocRef = doc(db, 'Statistics', 'finalStatistics');
        const finalDocSnapshot = await getDoc(finalDocRef);

        if (finalDocSnapshot.exists()) {
          const finalData = finalDocSnapshot.data();
          setTotalDataCount(finalData.totalDataCount || 0);  // 設定資料總數
          
          //取到小數點兩位
          const formattedAccuracy = finalData.finalAccuracy !== undefined ? finalData.finalAccuracy.toFixed(2) : 0;
          setAccuracy(formattedAccuracy);  // 設定辨識準確度
        }
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.Frequency > maxFrequency) {
            maxFrequency = data.Frequency;
            topScamType = data.Type;
          }
        });

        setTopType(topScamType);

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
            <FontAwesomeIcon icon={faCrosshairs} /> 78.55%
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Cards;
