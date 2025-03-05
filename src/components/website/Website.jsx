import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import styles from './Website.module.css';
import Navbar from '../navbar/Navbar';
import { TXTCheckUpload } from './TXTCheck';
import { URLCheckTextArea } from './URLCheck';
import { MSGCheckInput } from './MSGCheck';
import Statistics from '../statistics/Statistics';

function Website() {
  const [activeTab, setActiveTab] = useState("text");
  const [activeStep, setActiveStep] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const stepRefs = [useRef(null), useRef(null), useRef(null)];
  const liHeights = useRef([]); // 用來記錄每個 li 的高度
  const statisticsRef = useRef(null);
  const location = useLocation();

  // 滾動到 statisticsBox
  const scrollToStatistics = () => {
      if (statisticsRef.current) {
          statisticsRef.current.scrollIntoView({ behavior: "smooth" });
      }
  };

  // 如果網址中帶有 #statisticsBox，自動滾動
  useEffect(() => {
      if (location.hash === "#statisticsBox") {
          scrollToStatistics();
      }
  }, [location]);


  const getTabStyle = () => {
    switch (activeTab) {
        case "text":
            return { width: "100px", left: "0" };
        case "url":
            return { width: "100px", left: "98px" };
        case "file":
            return { width: "150px", left: "198px" };
        default:
            return { width: "100px", left: "0" };
    }
  };

useEffect(() => {
  const updateLiHeights = () => {
    liHeights.current = stepRefs.map(ref => ref.current?.getBoundingClientRect().height || 0);
  };

  updateLiHeights();

  const handleScroll = () => {
    const stepsBox = document.querySelector(`.${styles.stepsBox}`);
    if (!stepsBox) return;

    const stepsBoxTop = stepsBox.offsetTop - window.scrollY * 0.5; 
    const totalHeight = liHeights.current.reduce((acc, height) => acc + height, 0);
    const currentScrollY = window.scrollY;

    if (currentScrollY < stepsBoxTop) {
      setProgressHeight(0); 
      setActiveStep(0);
      return;
    }

    const progress = ((currentScrollY - stepsBoxTop) / totalHeight) * 100;
    setProgressHeight(Math.min(Math.max(progress, 0), 100)); // 限制範圍在 0~100%

    let cumulativeHeight = stepsBoxTop;
    for (let i = 0; i < liHeights.current.length; i++) {
      cumulativeHeight += liHeights.current[i];
      if (currentScrollY < cumulativeHeight) {
        setActiveStep(i);
        break;
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateLiHeights);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateLiHeights);
  };
}, []);
  


  return (
    <>
      <div className={styles.testContainer}>
          <Navbar scrollToStatistics={scrollToStatistics}></Navbar>
          <div className={styles.testBox}>
              <div className={styles.testMain}>
                {/* 類似Tab的感覺 */}
                  <div className={styles.tabs}>
                    <a  onClick={() => setActiveTab("text")}>文字檢測</a>
                    <a  onClick={() => setActiveTab("url")}>網址檢測</a>
                    <a  onClick={() => setActiveTab("file")}>檔案、圖片檢測</a>
                    <div className={styles.tabsTransition} style={getTabStyle()}></div>
                  </div>
                  <div className={styles.testTopic}>
                    <div className={styles.testTitle}>
                      {activeTab === "text" && "文字檢測"}
                      {activeTab === "url" && "網址檢測"}
                      {activeTab === "file" && "檔案、圖片檢測"} 
                    </div>
                    <div className={styles.testSubtitle}>
                      {activeTab === "text" && "Text Scan"}
                      {activeTab === "url" && "URL Scan"}
                      {activeTab === "file" && "File & Image Scan"} 
                    </div>
                  </div>
              </div>

              
              {/* 顯示對應組件的內容 */}
              <div className={styles.content}>
                    {activeTab === "text" && <MSGCheckInput />}
                    {activeTab === "url" && <URLCheckTextArea />}
                    {activeTab === "file" && <TXTCheckUpload />}
              </div>
          </div>
      </div> 
      
      <div className={styles.stepsBox}>
        <video src="/demotest.mp4" autoPlay loop muted playsInline></video>
        <div className={styles.stepsOverlay}></div>
        <div className={styles.stepsMain}>
          <div className={styles.stepsContent}>
              <div className={styles.stepsTitle}>
                <h2>使用步驟</h2>
              </div>
              <div className={styles.stepsDescriptionBox}>
                <div className={styles.stepsDescription}>
                  <ul>
                    <div className={styles.stepsProgress}>
                      <div className={styles.inner} style={{ height: `${progressHeight}%` }}></div>
                    </div>

                    <li ref={stepRefs[0]} data-index="1" className={progressHeight > 0 && styles.active}>
                      <h4>Search your favourite topic</h4>
                      <p>LE SSERAFIM （韓語：르세라핌；日語：ルセラフィム）是韓國SOURCE MUSIC於2022年推出的女子音樂組合，成員是金采源、許允眞、洪恩採、宮脇咲良和中村一葉，由金采源擔任隊長，於2022年5月2日以迷你專輯《FEARLESS》出道。 </p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>1</span>
                      </div>
                    </li>
                    <li ref={stepRefs[1]} data-index="2" className={progressHeight >= 50 && styles.active}>
                      <h4 >Bookmark &amp; Keep it for yourself</h4>
                      <p >LE SSERAFIM （韓語：르세라핌；日語：ルセラフィム）是韓國SOURCE MUSIC於2022年推出的女子音樂組合，成員是金采源、許允眞、洪恩採、宮脇咲良和中村一葉，由金采源擔任隊長，於2022年5月2日以迷你專輯《FEARLESS》出道。</p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>2</span>
                      </div>
                    </li>
                    <li ref={stepRefs[2]} data-index="3" className={progressHeight >= 90 && styles.active }>
                      <h4 >Read &amp; Enjoy</h4>
                      <p >LE SSERAFIM （韓語：르세라핌；日語：ルセラフィム）是韓國SOURCE MUSIC於2022年推出的女子音樂組合，成員是金采源、許允眞、洪恩採、宮脇咲良和中村一葉，由金采源擔任隊長，於2022年5月2日以迷你專輯《FEARLESS》出道。</p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>3</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className={styles.statisticsBox} ref={statisticsRef}>
        <Statistics />
      </div>
    </>
  );
}

export default Website;
