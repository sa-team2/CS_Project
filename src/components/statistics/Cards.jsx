import React, { useState, useEffect } from 'react';
import './Cards.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFire, faCrosshairs, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function Cards() {
  const [totalDataCount, setTotalDataCount] = useState(0);  // 資料總數
  const [topType, setTopType] = useState('');               // 熱門詐騙類型
  const [accuracy, setAccuracy] = useState(0);              // 辨識準確度
  const [topKeyword, setTopKeyword] = useState('');         // 熱門詐騙關鍵字

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 撈取 Statistics 資料
        const querySnapshot = await getDocs(collection(db, 'Statistics'));
        let maxFrequency = 0;
        let topScamType = '';

        // 讀取 finalStatistics 文件
        const finalDocRef = doc(db, 'Statistics', 'finalStatistics');
        const finalDocSnapshot = await getDoc(finalDocRef);

        if (finalDocSnapshot.exists()) {
          const finalData = finalDocSnapshot.data();
          setTotalDataCount(finalData.totalDataCount || 0);
          const formattedAccuracy = finalData.finalAccuracy !== undefined ? finalData.finalAccuracy.toFixed(2) : 0;
          setAccuracy(formattedAccuracy);
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Frequency > maxFrequency) {
            maxFrequency = data.Frequency;
            topScamType = data.Type;
          }
        });

        setTopType(topScamType);

        // 讀取 Outcome/KeywordStats 文件
// 找出出現次數最多的關鍵字
const keywordStatsRef = doc(db, 'Outcome', 'KeywordStats');
const keywordStatsSnap = await getDoc(keywordStatsRef);
const keywordStats = keywordStatsSnap.data();
if (keywordStats) {
  const sortedKeywords = Object.entries(keywordStats).sort((a, b) => b[1] - a[1]);
  setTopKeyword(sortedKeywords[0][0]);
}


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
          <Card.Title><b>熱門詐騙關鍵字：</b></Card.Title>
          <Card.Text className="cardtext-custom">
          <FontAwesomeIcon icon={faCrosshairs} /> {topKeyword || '載入中...'}
          {/* icon={faCrosshairs} */}
          </Card.Text>
        </Card.Body>
      </Card>

    </>
  );
}

export default Cards;
