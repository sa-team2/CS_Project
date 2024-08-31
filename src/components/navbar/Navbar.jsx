import './Navbar.css';
import { Link, useLocation} from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const showFullNavbar = location.pathname !== '/';
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="nav-container">
      <div className="nav-menu" style={{ justifyContent: showFullNavbar ? 'space-between' : 'center' }} >
        <Link to="/" className={`nav-a ${isActive('/')}`}><div>蹦蹦「詐」彈</div></Link>
         {showFullNavbar && (
          <div className="nav-option">
            <Link to="/Fraud" className={`nav-a ${isActive('/Fraud')}`}><div>常見手法</div></Link>
            <Link to="/Website" className={`nav-a ${isActive('/Website')}`}><div>詐騙檢測</div></Link>
            <Link to="/Statistics" className={`nav-a ${isActive('/Statistics')}`}><div>統計圖表</div></Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;