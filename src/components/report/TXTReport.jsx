import React, { useState } from 'react';
import { db } from "../../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, addDoc } from "firebase/firestore";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './TXTReport.module.css';

function TXTReport() {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleAdditionalInfoChange = (e) => {
    setAdditionalInfo(e.target.value);
  };

  const clearAllFields = () => {
    setFile(null);
    setSource('');
    setAdditionalInfo('');
    document.getElementById('file-input').value = ''; // Clear file input
  };

  const handleReportSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('from', 'Report');     // 加入來源欄位

      // 在這裡列出 FormData 內容，檢查一下
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // 送出請求，並立刻回報成功
      setIsLoading(true);
      try {
        // 發送請求到後端
        const response = await fetch('/api/fetch-content', { 
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        // 立即顯示回報成功，不等待 Firestore 儲存的結果
        alert('回報成功！');
        clearAllFields();
  
        // 儲存回報資料到 Firestore
        await addDoc(collection(db, "Report"), {
          Report: file.name,
          Source: source || '未提供',
          AddNote: additionalInfo || '未提供',
          Timestamp: new Date().toISOString(),
          // 這裡存入從後端取得的 data
          Data: data,
        });
      } catch (error) {
        console.error('回報失敗:', error);
        alert("回報失敗，請稍後再試。");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('請選擇一個文件。');
    }
  };
  
  return (
    <div className={styles.reportContainer}>
      <div className={styles.fileInputContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.fieldLabel}>檔案、圖片回報</div>
          <label htmlFor="file-input" className={styles.dropContainer}>
            <span className={styles.dropTitle}>
              <UploadFileIcon fontSize='large' /> 拖曳檔案至此
            </span>
            <span className={styles.dropTitleOr}>或</span>
            <input type="file" accept="image/*" id="file-input" onChange={handleFileChange} />
          </label>

          <div className={styles.additionalFieldContainer}>
            <label className={styles.fieldLabel}>資料來源</label>
            <div className={styles.inputWrapper}>
              <textarea 
                className={styles.additionalTextarea}
                rows="2"
                value={source} 
                onChange={handleSourceChange} 
                placeholder='請輸入資料來源...'
              />
              {/* <button
                className={styles.clearBtn}
                onClick={() => setSource('')}
              >
                <ClearIcon />
              </button> */}
            </div>
          </div>
          
          <div className={styles.additionalFieldContainer}>
            <label className={styles.fieldLabel}>補充說明</label>
            <div className={styles.inputWrapper}>
              <textarea 
                className={styles.additionalTextarea}
                rows="3"
                value={additionalInfo} 
                onChange={handleAdditionalInfoChange} 
                placeholder='請輸入補充說明...'
              />
              {/* <button
                className={styles.clearBtn}
                onClick={() => setAdditionalInfo('')}
              >
                <ClearIcon />
              </button> */}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.btnTxtArea}>
            <button 
              className={styles.txtSubmit} 
              onClick={handleReportSubmit}
              disabled={isLoading}
            >
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
                           <span>回報</span>
                         </button>
                         <button className={styles.txtClear} onClick={clearAllFields}>清除</button>
                       </div>
                     </div>
                   </div>
                  </div>
                 );
               }
               
export { TXTReport };
