import React, { useEffect, useState } from 'react';
import './NewsList.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

function NewsList() {
  const [articles, setArticles] = useState([]);  // 用來存放從後端抓取到的資料
  const [loading, setLoading] = useState(true);  // 設置加載狀態
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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
    <div style={{ marginTop: '150px'}}>
      <h1 className='news-topic'><FontAwesomeIcon icon={faNewspaper} /> 時事詐騙新聞</h1>
      {articles.length === 0 ? (
        <p>載入失敗</p>
      ) : (
        <div className="articles-container">
          {articles.map((article, index) => (
            <motion.div
              key={ index }
              className="article"
              initial="hidden"
              whileInView="visible"
              variants={ fadeInVariants }
              transition={{ duration: 1 }}
            >
              <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={ article.img } alt="載入中..." />
                <Card.Body>
                  <Card.Title>
                    {article.title.length > 20 ? `${article.title.substring(0, 20)}...` : article.title}
                  </Card.Title>
                  <Card.Text>
                    {article.description.length > 50 ? `${article.description.substring(0, 50)}...` : article.description}
                  </Card.Text>
                  <div className="text-end">
                    <Button variant="dark" href={ article.link } target="_blank">查看更多</Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsList;
