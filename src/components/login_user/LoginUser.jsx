import './LoginUser.css'; 
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function LoginUser() {
  const [error, setError] = useState('');
  const hasProcessedLogin = useRef(false);
  const { handleLoginSuccess, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 專門處理 URL 參數變化（登入成功/失敗）
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    if (urlParams.get('error') === 'login_failed') {
      alert('登入失敗');
      setError('登入失敗，請重試');
    } else if (urlParams.get('login_success') === 'true' && !hasProcessedLogin.current) {
      hasProcessedLogin.current = true; 
      handleLoginSuccess(); 
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [location.search]); // 只監聽 URL search 參數


  useEffect(() => {
    if (!isLoading && isLoggedIn && !hasProcessedLogin.current) {
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, isLoading]);

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/google/login', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // 重新導向到 Google 登入頁面
        window.location.href = data.auth_url;
      } else {
        alert('登入失敗');
        setError('無法連接到登入服務');
      }
    } catch (err) {
      console.error('登入錯誤:', err);
      alert('登入失敗');
      setError('登入過程中發生錯誤，請稍後再試');
    }
  };


  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>載入中...</title>
        </Helmet>
        <div className="login-background">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            color: 'white',
            fontSize: '18px'
          }}>
            檢查登入狀態中...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>使用者登入</title>
      </Helmet>
      <div className="login-background">
        <motion.div className='frame'
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2.5 }} 
        >
          <div>
            <img src="/welcome_user.png" alt="welcome_user icon" width="200px" />
          </div>
          <div className="welcome">使用者登入</div>
          <div className="login">
            <button onClick={handleGoogleLogin} className="google-login-btn">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="google-btn-txt">使用 Google 登入</span>
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LoginUser;
