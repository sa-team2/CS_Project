import React, { useEffect, useState } from 'react';
import styles from './NewsList.module.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function NewsList() {
  const [articles, setArticles] = useState([]);  // 用來存放從後端抓取到的資料
  const [loading, setLoading] = useState(true);  // 設置加載狀態
  const [currentIndex, setCurrentIndex] = useState(0);
  const articlesPerPage = 3; // 一次顯示 3 篇新聞
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + articlesPerPage) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - articlesPerPage < 0 ? articles.length - articlesPerPage : prevIndex - articlesPerPage
    );
  };

  useEffect(() => {
    // 定義抓取資料的函數
    async function fetchArticles() {
      try {
        const response = await fetch('http://localhost:917/');
        const data = await response.json();
        setArticles(data);  // 將抓取到的資料存放到 state
        setLoading(false);  // 資料加載完成，更新 loading 狀態
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    }

    fetchArticles();  // 請求資料
  }, []);  // useEffect 中的空依賴陣列表示這個效果只在元件第一次渲染時執行

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <>
      {articles.length === 0 ? (
        <p style={{color: "white", textAlign: "center"}}>載入失敗 QAQ</p>
      ) : (
        <>
          <div>
            <div className={styles.newsTitle}><FontAwesomeIcon icon={faNewspaper} /> 時事詐騙新聞</div>
            <div className={styles.newsSubTitle}>本區域將提供最新的詐騙事件報導，讓您了解當前的詐騙趨勢，並提高防範意識，避免成為受害者。</div>
          </div>

          <div className={styles.newsCarousel}>
            {/* 左箭頭 */}
            <button className={styles.carouselButtonLeft} onClick={handlePrev}>
              <ChevronLeftIcon fontSize='large'  />
            </button>

            {/* 新聞區塊 */}
            <motion.div
              className={styles.articlesContainer}
              key={currentIndex} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} 
            >
              <div className={styles.articlesContainer}>
                {articles.slice(currentIndex, currentIndex + articlesPerPage).map((article, index) => (
                  <motion.div
                    key={index}
                    className={styles.article}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInVariants}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className={styles.customCard}>
                      <Card.Img variant="top" src={article.img} className={styles.customCardImg}  alt="載入中..." />
                      <Card.Body>
                        <Card.Title className={styles.ellipsisTitle}>
                          {article.title}
                        </Card.Title>
                        <Card.Text>
                          {article.description.length > 70 ? `${article.description.substring(0, 70)}...` : article.description}
                        </Card.Text>
                        <div className={styles.seeMore}>
                          <Button variant="dark" href={article.link} target="_blank">
                            查看更多
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* 右箭頭 */}
            <button className={styles.carouselButtonRight} onClick={handleNext}>
              <ChevronRightIcon fontSize='large' />
            </button>
          </div>
        </>
      )}
      
    </>
  );
}

export default NewsList;
