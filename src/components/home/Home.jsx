import './Home.css';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../navbar/Navbar';
import home from '../../images/home.png';
import NewsList from './NewsList';

function Home() {
    const newsListRef = useRef(null);

    const scrollToDown = () => {
        if (newsListRef.current) {
            newsListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Helmet>
                <title>首頁</title>
            </Helmet>
            <div className='bk'>
                <div className="background-img">
                <motion.div 
                    className="home-container"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: '100%', transition:{ duration: 1.5 }}}
                >
                <Navbar />
                    <div className="box">
                        <div className="b1">
                            <h1 className="title">蹦蹦「詐」彈</h1>
                            <div className="subtitle">
                                <p className="subtitle-text">掌握詐騙常見手法，並結合網站檢測，守護我們的線上安全、個資及財務。</p>
                            </div>
                            <div className="btn-container">
                                <Link to='./Website' className="website-check">
                                    <button className="home-btn mr-150">
                                        <span> 🔎詐騙檢測 </span>
                                    </button>
                                </Link>
                                <Link to='./Fraud' className="learn-more">
                                    <button className="home-btn mr-150">
                                        <span> 常見手法 </span>
                                    </button>
                                </Link>
                                <Link to='./Statistics' className="learn-more">
                                    <button className="home-btn">
                                        <span> 統計圖表 </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className='b2'>
                            <img className="home-img" src={ home }></img>
                        </div>
                    </div>
                    
                    <div className="arrow-container" >
                        <div className='scrolltodown' onClick={ scrollToDown }>
                            <div className='arrow'></div>
                            <div className='arrow'></div>
                        </div>
                    </div>
                </motion.div> 
                </div>
                <div ref={ newsListRef }>
                    <NewsList />
                </div>
            </div>
        </>
    )
}

export default Home