import "@patternfly/react-core/dist/styles/base.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Admin.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignOutAltIcon } from '@patternfly/react-icons';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../navbar/Navbar';
import AdminUpload from './AdminUpload';
import AdminPreview from './AdminPreview';

export const MultipleFileUploadBasic = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [adminPreviewClick, setAdminPreviewClick] = useState(false);
  const [adminUploadClick, setAdminUploadClick] = useState(true);
  const navigate = useNavigate();
  const alertShownRef = useRef(false);
  const [activeTab, setActiveTab] = useState("file");

  const getTabStyle = () => {
    switch (activeTab) {
        case "file":
            return { width: "180px", left: "0" };
        case "report":
            return { width: "180px", left: "170px" };
        default:
            return { width: "175px", left: "0" };
    }
  };

  // 檢查登入狀態
  useEffect(() => {
    const userAuthenticated = sessionStorage.getItem('username');
    const currentView = sessionStorage.getItem('currentView') || 'AdminUpload';

    if (!userAuthenticated && !alertShownRef.current) {
      alert('請先登入帳號及密碼');
      alertShownRef.current = true; 
      navigate('/login'); 
    } else if (userAuthenticated) {
      sessionStorage.setItem('currentView', currentView);

      if (currentView === 'AdminPreview') {
        setAdminPreviewClick(true);
        setAdminUploadClick(false);
        console.log("Switched to AdminPreview"); // Debugging
      } else {
        setAdminPreviewClick(false);
        setAdminUploadClick(true);
        console.log("Switched to AdminUpload"); // Debugging
      }
    }
  }, [navigate]); 

  const handleLogout = () => {
    sessionStorage.clear();
    alertShownRef.current = false; 
    navigate("/login");
  };


  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };
  
  const userAuthenticated = sessionStorage.getItem('username');

  return (
    <>
      <div className={styles.adminRoot}>
        {userAuthenticated && (
          <Navbar setIsLogoutModalOpen={setIsLogoutModalOpen}/>
        )}

        <motion.div className={styles.adminContent}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
        >
        <div className={styles.adminMain}>
            <div className={styles.adminTopic}>
              <div className={styles.adminTitle}>
                資料集更新 Dataset Update
              </div>
              {/* <div className={styles.adminSubtitle}>
                Dataset Update
              </div> */}
            </div>
            {/* 類似Tab的感覺 */}
            <div className={styles.tabs}>
              <a  onClick={() => setActiveTab("file")}>上傳檔案</a>
              <a  onClick={() => setActiveTab("report")}>檢測回報</a>
              <div className={styles.tabsTransition} style={getTabStyle()}></div>
            </div>
        </div>
        <div>
            {activeTab === "file" && <AdminUpload />}
            {activeTab === "report" && <AdminPreview />}
        </div>
        </motion.div>

        {isLogoutModalOpen && (
            <div className={styles.mOverlay}>
              <div className={styles.mContent}>
                <SignOutAltIcon style={{ fontSize: '80px', marginTop: '35px' }} />
                <h4 className={styles.mTitle}>是否要登出？</h4>
                <div className={styles.adminColArea}>
                  <button className={styles.adminLogout} onClick={handleLogout}>登出</button>
                  <button className={styles.adminSkip} onClick={closeLogoutModal}>取消</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default MultipleFileUploadBasic;
