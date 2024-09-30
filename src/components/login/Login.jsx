import './Login.css'; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import welcome_user from '../../images/welcome_user.png';
import user from '../../images/user.png';
import padlock from '../../images/padlock.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleDragOver = (event) => {
    event.preventDefault(); 
  };
  
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/Admin'); 
  };

  return (
    <>
      <Helmet>
        <title>登入</title>
      </Helmet>
      <div className="login-background">
        <motion.div className='frame'
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2.5 }} 
        >
          <div>
            <img src={ welcome_user } alt="welcome_user icon" width="200px" />
          </div>
          <div className="welcome">管理員</div>
          <div className="email">
            <input 
              type="text" 
              placeholder="帳號:" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              onDragOver={ handleDragOver }
            />
            <img src={ user } alt="user icon" width="23px" />
          </div>
          <div className="password">
            <input 
              type="password" 
              placeholder="密碼:" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <img src={ padlock } alt="padlock icon" width="23px" />
          </div>
          <button className="login btn1" onClick={handleLogin}>
            <span className="btn-txt">登入</span>
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default Login;
