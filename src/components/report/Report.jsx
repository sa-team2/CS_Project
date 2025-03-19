import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import styles from './Website.module.css';
import Navbar from '../navbar/Navbar';
import { TXTReport } from './TXTReport';
import { URLReport } from './URLReport';
import { MSGReport } from './MSGReport';
import Statistics from '../statistics/Statistics';

function Report() {
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
            return { width: "200px", left: "0" };
        case "url":
            return { width: "200px", left: "195px" };
        case "file":
            return { width: "200px", left: "400px" };
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
                    <a  onClick={() => setActiveTab("text")}>文字回報</a>
                    <a  onClick={() => setActiveTab("url")}>網址回報</a>
                    <a  onClick={() => setActiveTab("file")}>檔案、圖片回報</a>
                    <div className={styles.tabsTransition} style={getTabStyle()}></div>
                  </div>
                  <div className={styles.testTopic}>
                    <div className={styles.testTitle}>
                      {activeTab === "text" && "文字回報 Text Scan"}
                      {activeTab === "url" && "網址回報 URL Scan"}
                      {activeTab === "file" && "檔案、圖片回報 File & Image Scan"} 
                    </div>
                    {/* <div className={styles.testSubtitle}>
                      {activeTab === "text" && ""}
                      {activeTab === "url" && ""}
                      {activeTab === "file" && ""} 
                    </div> */}
                  </div>
              </div>

              
              {/* 顯示對應組件的內容 */}
              <div className={styles.content}>
                    {activeTab === "text" && <MSGReport />}
                    {activeTab === "url" && <URLReport />}
                    {activeTab === "file" && <TXTReport />}
              </div>
          </div>
      </div> 
      
      <div className={styles.stepsBox}>
        <video src="/faurdtest.mp4" autoPlay loop muted playsInline></video>
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

                    <li ref={stepRefs[0]} data-index="1" className={progressHeight > 0 ? styles.active : null}>
                      <p style={{ fontSize: '30px' }}><b>選取回報型態</b></p>
                      <p>若為文字類型、或是文字夾雜網址，選擇「文字回報」；
                          單純為網址，選擇「網址回報」；
                          對話紀錄截圖、或是檔案型態，選擇「檔案、圖片回報」。</p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>1</span>
                      </div>
                    </li>
                    <li ref={stepRefs[1]} data-index="2" className={progressHeight >= 50 ? styles.active : null}>
                      <p style={{ fontSize: '30px' }}><b>輸入內容</b></p>
                      <p>可藉由複製將文字及網址貼上，也可直接在文字框進行輸入；
                          圖片及檔案可按中間區域的「選擇檔案」上傳。</p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>2</span>
                      </div>
                    </li>
                    <li ref={stepRefs[2]} data-index="3" className={progressHeight >= 90 ? styles.active : null}>
                      <p style={{ fontSize: '30px' }}><b>按回報等待結果</b></p>
                      <p>按下方或右側的「回報」後，會藉由系統訓練的模型進行相似度辨識，
                          若資料內容及圖片過多，可能需要等待一下。</p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>3</span>
                      </div>
                    </li>
                    {/* <li ref={stepRefs[2]} data-index="3" className={progressHeight >= 90 ? styles.active : null}>
                      <p style={{ fontSize: '30px' }}><b>回報結果及回報</b></p>
                      <p>回報報告左側的百分比為「與詐騙的相似度」，可以藉由百分比高低判斷是否要繼續交易或操作；
                          右側也會提供可能的「詐騙類型」及「關鍵字依據」，並提供提醒及如何防範。
                          若想對於回報結果進行「準確度回報」，可按左下方的⭐。
                      </p>

                      <div className={styles.iconHolder}>
                          <span className={styles.stepsNumber}>4</span>
                      </div>
                    </li> */}
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

export default Report;
