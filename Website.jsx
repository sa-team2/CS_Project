import React, { useState } from 'react';
import './Website.css';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faMessage, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { TXTCheckTitle, TXTCheckUpload } from './TXTCheck';
import { URLCheckTitle, URLCheckTextArea } from './URLCheck';
import { MSGCheckTitle, MSGCheckInput } from './MSGCheck';

function Website() {
  const [activeComponent, setActiveComponent] = useState('URLCheck');
  const [apiResponse, setApiResponse] = useState(null);


  const handleUrlSubmit = async (url) => {
    try {
      const response = await fetch('/api/fetch-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error('獲取內容失敗:', error);
      setApiResponse({ success: false, message: '獲取失敗' });
    }
  };

  const renderComponent = (component) => {
    console.log(`Rendering component for ${activeComponent}`);
    switch (activeComponent) {
      case 'URLCheck':
        if (component === 'title') {
          return <URLCheckTitle />;
        } else if (component === 'input') {
          return <URLCheckTextArea onSubmit={handleUrlSubmit} />;
        }
        break;
      case 'MSGCheck':
        if (component === 'title') {
          return <MSGCheckTitle />;
        } else if (component === 'input') {
          return <MSGCheckInput />;
        }
        break;
      case 'TXTCheck':
        if (component === 'title') {
          return <TXTCheckTitle />;
        } else if (component === 'input') {
          return <TXTCheckUpload />;
        }
        break;
      default:
        return null;
    }
  };

  const title =
    activeComponent === "URLCheck"
      ? "網頁檢測"
      : activeComponent === "MSGCheck"
      ? "簡訊檢測"
      : activeComponent === "TXTCheck"
      ? "對話檢測"
      : "位址錯誤";

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
        >
          <Navbar />
          <div className="website-container">
            <div className="function-container">
              <div
                onClick={() => setActiveComponent('URLCheck')}
                className={activeComponent === "URLCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faLink} className="icon" />
                網頁檢測
              </div>
              <div
                onClick={() => setActiveComponent('MSGCheck')}
                className={activeComponent === "MSGCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faMessage} className="icon" />
                簡訊檢測
              </div>
              <div
                onClick={() => setActiveComponent('TXTCheck')}
                className={activeComponent === "TXTCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faFileLines} className="icon" />
                對話檢測
              </div>
            </div>
            <div className="tab-content">
              <div className="tab-box">{renderComponent('title')}</div>
              {renderComponent('input')}
              {apiResponse && (
                <div className="api-response">
                  <h2>API 回應:</h2>
                  <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Website;
