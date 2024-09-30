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
            <Navbar />
            <div className='bk'>
                <div className="background-img">
                <motion.div 
                    className="home-container"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: '100%', transition:{ duration: 1.5 }}}
                >
                    <div className="btn-container">
                        <Link to='./Website' className="website-check">
                            <button className="home-btn mr-150">
                                <span> 🔎詐騙檢測 </span>
                            </button>
                        </Link>
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