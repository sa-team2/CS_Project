import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Rating from './Rating';
import './MSGCheck.css';

function MSGCheckTitle() {
  return (
    <>
      <div className="tab-box">
        <h1>簡訊檢測</h1>
        <div className="function-subtitle">
          <p className="function-subtitle-text">一鍵掃描簡訊內容，檢測潛在詐騙隱患，保護您的個資及財務。</p>
        </div>
      </div>
    </>
  );
}

export { MSGCheckTitle };

function MSGCheckInput() {
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setPythonResult] = useState('未知'); // Store python result
  const [keywords, setKeywords] = useState([]); // Store the extracted keywords
  const [type, setType] = useState('無'); // Store the type of fraud

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const clearTextarea = () => {
    setText(''); 
  };

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
  }

  const handleShow = () => {
    setShow(true);
    const timer = setInterval(() => {
      setIsLoading(true);
      clearInterval(timer); 
    }, 1500);
  };
  const handleTextSubmit = async (event) => {
    event.preventDefault();
    if (text) {
      try {
        const response = await fetch('/api/fetch-content', { // 更新 API 路径
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
  
        const data = await response.json();
  
        // Debugging: Check the response data
        console.log('Response data:', data);
  
        if (data.pythonResult) {
          const matchedKeywords = data.pythonResult.matched_keywords || [];
          const keywordsArray = matchedKeywords.map(keywordObj => keywordObj.keyword);
          const typesArray = matchedKeywords.map(keywordObj => keywordObj.type);
  
          setPythonResult(data.pythonResult.result || '未知');
          setKeywords(keywordsArray);
          setType(typesArray.join(', '));
        } else {
          console.log('Python Result: 未知');
          console.log('Matched Keywords: []');
          setPythonResult('未知');
          setKeywords([]);
          setType('無');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      handleShow();

      setIsLoading(false);
    } else {
      alert('請輸入簡訊內容!');
    }
  };
  
  return (
    <>
      <div className="msg-area">
        <div className="msg-input">
          <textarea value={text} onChange={handleChange} placeholder='請輸入或貼上簡訊內容...' />
        </div>
        <div>
          <button className='msg-submit' onClick={handleTextSubmit}>
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
          <button className='msg-clear' onClick={clearTextarea}>清除</button>

          <Modal className="modal-custom" show={show} onHide={handleClose} backdrop="static" centered>
            <Modal.Header closeButton>
              <Modal.Title><b>檢測結果：</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Rating pythonResult={result} keyword={keywords} type={type} />
            </Modal.Body>
            {isLoading && (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  跳過
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  送出
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export { MSGCheckInput };
