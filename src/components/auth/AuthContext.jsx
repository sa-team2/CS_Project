import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = 檢查中
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/check', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.logged_in) {
          setIsLoggedIn(true);
          setUserInfo(data);
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (error) {
      console.error('檢查登入狀態失敗:', error);
      setIsLoggedIn(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('後端登出成功');
      } else {
        console.warn('後端登出可能失敗，但繼續清除前端狀態');
      }
    } catch (error) {
      console.error('登出請求失敗，但繼續清除前端狀態:', error);
    }
    
    // 清除前端登入狀態
    setIsLoggedIn(false);
    setUserInfo(null);
    
    localStorage.removeItem('redirectPath');
    return true;
  };

  const requireAuth = () => {
    if (isLoggedIn === false) {
      // 儲存完整路徑到 localStorage
      localStorage.setItem('redirectPath', window.location.pathname + window.location.search + window.location.hash);
      return '/login-user';
    }
    return null;
  };

  
  const handleLoginSuccess = () => {
    checkAuthStatus(); 
  };


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isLoggedIn,
    userInfo,
    isLoading,
    checkAuthStatus,
    logout,
    requireAuth,
    handleLoginSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
