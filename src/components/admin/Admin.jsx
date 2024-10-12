import "@patternfly/react-core/dist/styles/base.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Button, EmptyState, EmptyStateActions, EmptyStateHeader, EmptyStateFooter } from '@patternfly/react-core';
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon';
import { SignOutAltIcon } from '@patternfly/react-icons';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../navbar/Navbar';
import { CheckCircleIcon } from '@patternfly/react-icons';

export const MultipleFileUploadBasic = () => {
  const [fileUploadShouldFail, setFileUploadShouldFail] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [readFileData, setReadFileData] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showStatus && currentFiles.length > 0) {
      setShowStatus(true);
    }
  }, [currentFiles, showStatus]);

  const removeFiles = (namesOfFilesToRemove) => {
    const newCurrentFiles = currentFiles.filter(currentFile => !namesOfFilesToRemove.includes(currentFile.name));
    setCurrentFiles(newCurrentFiles);
    const newReadFiles = readFileData.filter(readFile => !namesOfFilesToRemove.includes(readFile.fileName));
    setReadFileData(newReadFiles);
  };

  const updateCurrentFiles = (files) => {
    if (fileUploadShouldFail) {
      const corruptedFiles = files.map(file => ({
        ...file,
        name: file.name,
        lastModified: 'foo'
      }));
      setCurrentFiles(prevFiles => [...prevFiles, ...corruptedFiles]);
    } else {
      setCurrentFiles(prevFiles => [...prevFiles, ...files]);
      files.forEach(file => simulateFileRead(file)); // 开始读取文件
    }
  };

  const handleFileDrop = (event) => {
    const files = event.target.files;
    const currentFileCount = currentFiles.length;
    const newFileCount = files.length;

    if (currentFileCount + newFileCount > 3) {
      alert('一次最多只能上傳3個檔案');
      return;
    }

    updateCurrentFiles(Array.from(files));
  };

  const simulateFileRead = (file) => {
    const totalSteps = 10; // 读取过程的总步数
    let progress = 0;

    const intervalId = setInterval(() => {
      progress += 10; // 每次增加10%
      
      if (progress > 100) {
        progress = 100; // 限制最大进度为100
      }

      setReadFileData(prevReadFiles => {
        const updatedReadFiles = prevReadFiles.filter(readFile => readFile.fileName !== file.name);
        return [...updatedReadFiles, {
          fileName: file.name,
          loadResult: progress === 100 ? 'success' : 'loading',
          fileSize: file.size,
          progress // 更新当前文件的进度
        }];
      });

      if (progress === 100) {
        clearInterval(intervalId); // 读取完成后清除定时器
      }
    }, 500); // 每500毫秒更新一次进度
  };

  const handleLogin = () => {
    navigate('/Login');
  };

  const onLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };



  const handleFileUpload = async () => {
    try {
        // 创建一个 FormData 实例来上传文件
        const formData = new FormData();

        // 添加文件到 FormData
        currentFiles.forEach((file) => {
            formData.append('file', file); // 将每个文件添加到 FormData 中
        });

        // 发送 POST 请求到后端的文件上传端点
        const response = await fetch('/api/fetch-content', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('文件上传失败');
        }

        // 获取文件上传成功后的响应
        const result = await response.json();
        console.log('上传结果:', result);

        // 这里可以选择直接处理结果，或者做进一步的操作
        alert('文件上传成功，返回消息: ' + result.message);

    } catch (error) {
        console.error('上传文件时出错:', error);
        alert('上传文件时出错: ' + error.message);
    }
};


  

  const successfullyReadFileCount = readFileData.filter(fileData => fileData.loadResult === 'success').length;

  return (
    <>
      <Helmet>
        <title>管理介面</title>
      </Helmet>
      <div className="admin-root">
        <Navbar onLogoutClick={onLogoutClick} />
        <motion.div className="admin-content"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
        >
          <div className="admin-upload-container">
            <label className="admin-drop-container">
            <UploadIcon style={{ fontSize: '50px' }} />
            <div className="admin-drop-title">
              <span className="">拖曳檔案至此</span>
              <span className="">或</span>
            </div>
              <input
                type="file"
                multiple
                onChange={handleFileDrop}
              />
              <div className="admin-upload-button">選擇檔案</div>
              <span style={{ fontSize: '16px',marginTop:'20px' }}>檔案類型：JPEG, DOC, PDF, PNG, XLS, XLSX</span>
            </label>
            <div>
              {showStatus && currentFiles.length > 0 && (
                <div className='admin-drop-text'>
                  <p>{`${successfullyReadFileCount} / ${currentFiles.length} 檔案讀取成功`}</p>
                  {currentFiles.map(file => {
                    const fileData = readFileData.find(readFile => readFile.fileName === file.name);
                    const fileSize = fileData ? fileData.fileSize : 0; // 获取文件大小

                    return (
                      <div className='admin-txt-area' key={file.name}>
                        <div className="admin-left">
                          <button className='admin-jump' onClick={() => removeFiles([file.name])}>移除</button>
                          <span className="admin-file-name">{file.name}</span>
                          <span style={{ width: 'auto',paddingLeft:'10px' }}>({(fileSize / 1024).toFixed(2)} KB)</span>
                        </div>
                        <div className="admin-right">
                          {fileData && (
                          <>
                            <div className="progress-bar">
                              <div className="progress" style={{ width: `${fileData.progress}%` }} />
                            </div>
                            {fileData.loadResult === 'success' && (
                              <CheckCircleIcon style={{ color: "goldenrod", marginLeft: '10px' ,fontSize:'30px'}} />
                            )}
                          </>
                        )}
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="admin-submit">
            <button className="admin-enter" onClick={handleFileUpload}>更新</button>
            </div>
          </div>

          {isLogoutModalOpen && (
            <div className="m-overlay">
            <div className="m-content">
              <SignOutAltIcon style={{ fontSize: '80px', marginTop: '35px' }} />
              <h4 className='m-title'>是否要登出？</h4>
              <div className="admin-col-area">
                <button className='admin-enter' onClick={handleLogin}>登出</button>
                <button className='admin-jumps' onClick={closeLogoutModal}>取消</button>
              </div>
            </div>
          </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default MultipleFileUploadBasic;
