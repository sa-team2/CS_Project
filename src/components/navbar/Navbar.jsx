import AdminUpload from '../admin/AdminUpload';
import AdminPreview from '../admin/AdminPreview';
import './Navbar.css';
import { Link, useLocation} from 'react-router-dom';

function Navbar({ onLogoutClick, onAdminUploadClick, onAdminPreviewClick, currentView}) {
  const location = useLocation();
  const isAdminPath = location.pathname === '/Admin';
  const isActive = (path) => location.pathname === path ? 'active' : '';
  console.log("Navbar Rendered with currentView:", currentView);
  return (
    <nav className="nav-container">
      <div className="nav-menu" style={{ justifyContent: 'space-between' }}>
        {/* 如果不是 Admin 路径，显示完整导航菜单 */}
        {!isAdminPath && (<>
          <Link to="/" className={`nav-a ${isActive('/')}`}><div>蹦蹦「詐」彈</div></Link>
          <div className="nav-option">
            <Link to="/Fraud" className={`nav-a ${isActive('/Fraud')}`}><div>常見手法</div></Link>
            <Link to="/Website" className={`nav-a ${isActive('/Website')}`}><div>詐騙檢測</div></Link>
            <Link to="/Statistics" className={`nav-a ${isActive('/Statistics')}`}><div>統計圖表</div></Link>
          </div>
        </>)}

        {/* 如果是 Admin 路径，显示 Admin 链接 */}
        {isAdminPath && (<>
          <Link to="/Admin" className={`nav-a ${isActive('/')}`}><div>蹦蹦「詐」彈</div></Link>
          <div className="nav-option">
            <div className={`nav-a ${currentView === 'AdminUpload' ? 'active' : ''}`} onClick={onAdminUploadClick} style={{ cursor: 'pointer' }}><div>管理系統</div></div>
            <div className={`nav-a ${currentView === 'AdminPreview' ? 'active' : ''}`} onClick={onAdminPreviewClick} style={{ cursor: 'pointer' }}><div>預覽畫面</div></div>
            {/* 这里调用传递的 onLogoutClick 处理程序 */}
            <div className="nav-a" onClick={onLogoutClick} style={{ cursor: 'pointer' }}>
              <div>登出</div>
            </div>
          </div>
        </>)}
      </div>
    </nav>
  );
}

export default Navbar;
