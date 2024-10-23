import "@patternfly/react-core/dist/styles/base.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
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

  // 檢查登入狀態
  useEffect(() => {
    const userAuthenticated = sessionStorage.getItem('username');
    const currentView = sessionStorage.getItem('currentView') || 'AdminUpload';

    if (!userAuthenticated && !alertShownRef.current) {
      alert('請先登入帳號及密碼');
      alertShownRef.current = true; 
      navigate('/Login'); 
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
    navigate("/Login");
  };

  const onLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const onAdminPreviewClick = () => {
    setAdminPreviewClick(true);
    setAdminUploadClick(false);
    sessionStorage.setItem('currentView', 'AdminPreview'); 
  };

  const onAdminUploadClick = () => {
    setAdminUploadClick(true);
    setAdminPreviewClick(false);
    sessionStorage.setItem('currentView', 'AdminUpload'); 
  };
  
  const userAuthenticated = sessionStorage.getItem('username');

  return (
    <>
      <Helmet>
        <title>管理介面</title>
      </Helmet>
      <div className="admin-root">
        {userAuthenticated && (
          <Navbar 
            onLogoutClick={onLogoutClick} 
            onAdminUploadClick={onAdminUploadClick} 
            onAdminPreviewClick={onAdminPreviewClick} 
            currentView={sessionStorage.getItem('currentView') || 'AdminUpload'}
          />
        )}
        <motion.div className="admin-content"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
        >
          {adminUploadClick && !adminPreviewClick && (
            <AdminUpload />
          )}
          {!adminUploadClick && adminPreviewClick && (
            <AdminPreview /> 
          )}
          {isLogoutModalOpen && (
            <div className="m-overlay">
              <div className="m-content">
                <SignOutAltIcon style={{ fontSize: '80px', marginTop: '35px' }} />
                <h4 className='m-title'>是否要登出？</h4>
                <div className="admin-col-area">
                  <button className='admin-enter' onClick={handleLogout}>登出</button>
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
