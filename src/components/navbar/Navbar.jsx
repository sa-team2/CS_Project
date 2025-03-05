import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar({setIsLogoutModalOpen}) {
  const [selectedLink, setSelectedLink] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPath = location.pathname === '/admin';


  const isActive = (link) => {
    return selectedLink === link ? styles.active : ''; 
  };

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#commonFraudBox") {
      setSelectedLink("commonFraudBox");
    } else if (location.pathname === "/") {
      setSelectedLink("home");
      window.scrollTo(0, 0);
    } else if (location.pathname === "/website" && location.hash === "#statisticsBox") {
      setSelectedLink("statisticsBox");
    } else if (location.pathname === "/website") {
      setSelectedLink("website");
      window.scrollTo(0, 0);
    } else if (location.pathname === "/admin") {
        setSelectedLink("admin");
    }
  }, [location.pathname, location.hash]); 
  
  
  


  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarBox}>
        <div className={styles.navbarIcon}>
          <div>
            <img src="/icon.png" alt="logo" width={125} onClick={() => navigate("/")} />
          </div>
        </div>
        <div className={styles.navbarList}>
          {!isAdminPath && (
            <div className={styles.navbarLink}>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("home")}`}
                  onClick={() => { 
                    navigate("/");
                  }} 
                >
                  首頁
                </a>
              </div>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("commonFraudBox")}`}
                  onClick={() => { 
                    setSelectedLink("commonFraudBox");
                    navigate("/#commonFraudBox");
                  }} 
                >
                  常見手法
                </a>
              </div>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("website")}`}
                  onClick={() => { 
                    setSelectedLink("website");
                    navigate("/website"); 
                  }} 
                >
                  詐騙檢測
                </a>
              </div>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("statisticsBox")}`}
                  onClick={() => { 
                    setSelectedLink("statisticsBox");
                    navigate("/website#statisticsBox"); 
                  }} 
                >
                  統計圖表
                </a>
              </div>
            </div>
          )}

          {isAdminPath && (
            <div className={styles.navbarLink}>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("admin")}`}
                  onClick={() => { 
                    navigate("/admin");
                  }} 
                >
                  資料集更新
                </a>
              </div>
              <div>
                <a 
                  className={`${styles.navbarAnchor} ${isActive("logout")}`}
                  onClick={() => { 
                    setIsLogoutModalOpen(true)
                  }} 
                >
                  登出
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="nav-menu" style={{ justifyContent: 'space-between' }}>

        {!isAdminPath && (<>
          <Link to="/" className={`nav-a ${isActive('/')}`}><div>騙局雷達</div></Link>
          <div className="nav-option">
            <Link to="/Fraud" className={`nav-a ${isActive('/Fraud')}`}><div>常見手法</div></Link>
            <Link to="/Website" className={`nav-a ${isActive('/Website')}`}><div>詐騙檢測</div></Link>
            <Link to="/Statistics" className={`nav-a ${isActive('/Statistics')}`}><div>統計圖表</div></Link>
          </div>
        </>)}


        {isAdminPath && (<>
          <Link to="/Admin" className={`nav-a ${isActive('/')}`}><div>騙局雷達</div></Link>
          <div className="nav-option">
            <div className={`nav-a ${currentView === 'AdminUpload' ? 'active' : ''}`} onClick={onAdminUploadClick} style={{ cursor: 'pointer' }}><div>資料集更新</div></div>
            <div className={`nav-a ${currentView === 'AdminPreview' ? 'active' : ''}`} onClick={onAdminPreviewClick} style={{ cursor: 'pointer' }}><div>準確度回報</div></div>

            <div className="nav-a" onClick={onLogoutClick} style={{ cursor: 'pointer' }}>
              <div>登出</div>
            </div>
          </div>
        </>)}
      </div> */}
    </div>
  );
}

export default Navbar;