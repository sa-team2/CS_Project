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
        const querySnapshot = await getDocs(collection(db, 'Outcome'));
        let totalCalculatedAccuracy = 0;
        let recordCount = 0;
        let matchTypeCount = {}; // 用於記錄每個 MatchType 的出現次數

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const stars = data.Stars;
          const fraudRate = data.PythonResult?.FraudRate;
          const matches = data.PythonResult?.Match;

          // 計算辨識準確度
          if (stars !== undefined && fraudRate !== undefined) {
            let adjustedFraudRate;
            if ((fraudRate >= 50 && fraudRate <= 75) || (fraudRate >= 0 && fraudRate <= 25)) {
              adjustedFraudRate = 100 - fraudRate; 
            } else {
              adjustedFraudRate = fraudRate; 
            }
            const starsScore = stars * 20;
            const weightedAccuracy = (starsScore * 0.3) + (adjustedFraudRate * 0.7);
            totalCalculatedAccuracy += weightedAccuracy;
            recordCount++;
          }

          // 處理 MatchType 的計算
          if (matches) {
            matches.forEach(match => {
              const matchType = match.MatchType;
              if (matchTypeCount[matchType]) {
                matchTypeCount[matchType] += 1; // 增加出現次數
              } else {
                matchTypeCount[matchType] = 1; // 初始化次數
              }
            });
          }
        });

        // 找到出現次數最多的 MatchType
        const maxMatchType = Object.entries(matchTypeCount).reduce((prev, current) => {
          return (prev[1] > current[1]) ? prev : current;
        }, ['', 0]);

        setTopType(maxMatchType[0] || '無資料'); // 設定熱門詐騙類型

        // 計算最終辨識準確度
        const finalAccuracy = recordCount > 0 ? (totalCalculatedAccuracy / recordCount).toFixed(2) : 0;
        setTotalDataCount(recordCount);
        setAccuracy(finalAccuracy);

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
