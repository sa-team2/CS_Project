import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Rating from './Rating';
import './URLCheck.css';

function URLCheckTitle() {
    return (
        <div className="tab-box">
            <div className="function-subtitle">
            </div>
        </div>
    );
}

export { URLCheckTitle };

function URLCheckTextArea() {
  const [url, setUrl] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // 加载状态
  const [isLoaded, setIsLoaded] = useState(false);    // 加载完成状态
  const [pythonResult, setPythonResult] = useState('未知');
  const [keyword, setKeyword] = useState([]); // 设为数组以存储多个关键字
  const [type, setType] = useState('無');
  const [FraudRate, setFraudRate] = useState(null); // 存储 FraudRate
  const [ID, setID] = useState('');

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
    setIsLoaded(false); // 重置加载状态
  };

  const handleShow = () => {
    setShow(true);
    setIsLoading(true); // 开始显示 loading
    setTimeout(() => {
      setIsLoading(false); // 模拟加载完成
      setIsLoaded(true);   // 加载完成后显示结果
    }, 1500); // 设置 1.5 秒的加载时间
  };

  const handleButtonClick = async () => {
    if (!url) {
        alert('請輸入或貼上網址');
        return;
    }

    console.log('Button clicked with URL:', url); // 確認按鈕點擊事件

    try {
      const response = await fetch('/api/fetch-content', { // 更新 API 路径
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }), // 传送 URL 作为请求内容
      });
  
      const data = await response.json();
      console.log('Response from server:', data);
  
      // 输出到终端机
      if (data.pythonResult) {
          setID(data.ID);
          // 提取 matched_keywords 并拆解
          const matchedKeywords = data.pythonResult.matched_keywords || [];

          // 处理 matched_keywords 数组
          const keywords = matchedKeywords.map(keywordObj => keywordObj.keyword);
          const types = matchedKeywords.map(keywordObj => keywordObj.type);
                    
          setPythonResult(data.pythonResult.result || '未知');
          setKeyword(keywords); // 存储关键字数组
          setType(types.join(', ')); // 存储所有类型的组合
          const fraudRate = parseFloat(data.pythonResult.FraudRate);
          const roundedFraudRate = Math.round(fraudRate * 100) / 100; // 保留两位小数
          setFraudRate(roundedFraudRate);

      } else {
          setID('');
          console.log('Python Result: 未知');
          console.log('Matched Keywords: []');
          setPythonResult('未知');
          setKeyword([]);
          setType('無');
          setFraudRate(null); // 无 FraudRate 数据
      }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleCombinedClick = async () => {
    await handleButtonClick();
    handleShow(); // 在数据处理后显示模态框并加载
  };

  return (
    <>
      <div className="">
        <div className="url-input">
          <input
              className="url-input"
              type='text'
              placeholder='請輸入或貼上網址...'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
          />
        </div>
        <div className="btn-url-area">
          <button className='url-submit' onClick={handleCombinedClick}>
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                fill="currentColor"
              ></path>
            </svg>
            <span>檢測</span>
          </button>
        </div>

        <Modal className="modal-custom" show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title><b>檢測結果：</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoading && (
              <div className="bubblingG">
                <span id="bubblingG_1"></span>
                <span id="bubblingG_2"></span>
                <span id="bubblingG_3"></span>
              </div>
            )}
            {isLoaded && (
              <Rating pythonResult={pythonResult} keyword={keyword} type={type} FraudRate={FraudRate} ID={ID}/>
            )}
          </Modal.Body>
          {isLoaded && (
            <Modal.Footer>
              <Button className='url-jump' onClick={handleClose}>
                跳過
              </Button>
              <Button className='url-enter' onClick={handleClose}>
                送出
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </div>
    </>
  );
}

export { URLCheckTextArea };
