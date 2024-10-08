import React, { useState } from 'react';
import './Website.css';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faMessage, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { TXTCheckUpload } from './TXTCheck';
import { URLCheckTextArea } from './URLCheck';
import { MSGCheckInput } from './MSGCheck';

function Website() {
  const [activeComponent, setActiveComponent] = useState('MSGCheck');

  const renderComponent = () => {
    console.log(`Rendering component for ${activeComponent}`);
    switch (activeComponent) {
      case 'MSGCheck':
        {
          return <MSGCheckInput />;
        }
      case 'URLCheck':
        {
          return <URLCheckTextArea />;
        }
      case 'TXTCheck':
        {
          return <TXTCheckUpload />;
        }
      default:
        return null;
    }
  };

  const title =
    activeComponent === "MSGCheck"
      ? "文字檢測"
      : activeComponent === "URLCheck"
      ? "網址檢測"
      : activeComponent === "TXTCheck"
      ? "檔案、圖片檢測"
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
                onClick={() => setActiveComponent('MSGCheck')}
                className={activeComponent === "MSGCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faMessage} className="icon" />
                文字檢測
              </div>
              <div
                onClick={() => setActiveComponent('URLCheck')}
                className={activeComponent === "URLCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faLink} className="icon" />
                網址檢測
              </div>
              <div
                onClick={() => setActiveComponent('TXTCheck')}
                className={activeComponent === "TXTCheck" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faFileLines} className="icon" />
                檔案、圖片檢測
              </div>
            </div>
            <div className="tab-content">
              {renderComponent()}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Website;
