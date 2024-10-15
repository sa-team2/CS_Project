import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';  // 移除 Spinner 引用
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Rating from './Rating';
import './TXTCheck.css';

function TXTCheckUpload() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // 添加新的状态来跟踪加载完成
  const [pythonResult, setPythonResult] = useState('未知');
  const [keywords, setKeywords] = useState([]); // 存储多个关键字
  const [types, setType] = useState('無');
  const [reminds, setReminds] = useState('無');
  const [prevents, setPrevent] = useState('無');
  const [FraudRate, setFraudRate] = useState(null); // 存储 FraudRate
  const [ID, setID] = useState('');

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
    setIsLoaded(false);
  }

  const handleShow = () => {
    setShow(true);
    setIsLoading(true); // 开始显示 loading
    setTimeout(() => {
      setIsLoading(false); // 模拟加载完成
      setIsLoaded(true);   // 加载完成后显示结果
    }, 1500);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
      try {
        const response = await fetch('/api/fetch-content', { // 更新为图片上传的 API 路径
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        // 处理后端返回的 Python 结果
        if (data.pythonResult) {
          setID(data.ID);
          const matchedKeywords = data.pythonResult.Match || [];
          console.log('Response from server:', data);

          const keywords = matchedKeywords.map(keywordObj => keywordObj.MatchKeyword);
          const remind = matchedKeywords.map(keywordObj => keywordObj.Remind);
          const prevent = matchedKeywords.map(keywordObj => keywordObj.Prevent);
          
          setPythonResult(data.pythonResult.FraudResult || '未知');
          setKeywords(keywords);
          setType(types.join(', ')); // 将所有类型拼接成字符串
          setReminds(remind.join(', '));
          setPrevent(prevent.join(', '));
          const fraudRate = parseFloat(data.pythonResult.FraudRate);
          setFraudRate(Math.round(fraudRate * 100) / 100); // 保留两位小数
        } else {
          setID('');
          setPythonResult('未知');
          setKeywords([]);
          setType('無');
          setReminds('無');
          setPrevent('無');
          setFraudRate(null);        
        }

        return true;

      } catch (error) {
        console.error('Error while uploading the file:', error);
        resetResults();
        return false;
      }
    } else {
      alert("請選擇一個文件。");
      return false;
    }
  };

  
  const handleCombinedClick = async (event) => {
    const isValid = await handleFileUpload(event); 
    if (isValid) {
      handleShow();
    } 
  };

  return (
    <>
        <label htmlFor="file-input" className="drop-container">
          <span className="drop-title">拖曳檔案至此</span>
          <span className="drop-title">或</span><br></br>
          <input type="file" accept="image/*" required id="file-input"/>
        </label>
        <div>
          <div className="btn-txt-area">
            <button type='submit' className='txt-submit' onClick={handleCombinedClick}>
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
  <Rating pythonResult={pythonResult} keywords={keywords} types={types} FraudRate={FraudRate} ID={ID} reminds={reminds} prevents={prevents} />
            )}
          </Modal.Body>
          {isLoaded && (
            <Modal.Footer>  
              <Button className='txt-jump' onClick={handleClose}>
                跳過
              </Button>
              <Button className='txt-enter' onClick={handleClose}>
                送出
              </Button>
            </Modal.Footer>
          )}
          </Modal>
        </div>
    </>
  );
}

export { TXTCheckUpload };
