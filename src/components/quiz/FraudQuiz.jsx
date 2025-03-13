import React, { useState, useEffect, useRef } from 'react';
import styles from './FraudQuiz.module.css';
import UndoIcon from '@mui/icons-material/Undo';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ProgressBar from './ProgressBar';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "./QuizContext";
import GuideTour from './GuideTour';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import TelegramIcon from '@mui/icons-material/Telegram';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PanoramaIcon from '@mui/icons-material/Panorama';

function FraudQuiz() {
  // 教學導引步驟
  const [ run ] = useState(true);
  const steps = [
    {
      target: "#gameContainer",
      placement: "center",
      content: <p style={{fontSize: '30px'}}><b>是否要觀看教學引導？</b></p>,
    },
    {
      target: "#returnButton",
      placement: "bottom",
      content: (
        <>
          <h5></h5>
          <p style={{fontSize: '20px'}}><b>返回按鈕：回到測驗類型的選擇。</b></p>
          <h6><span style={{ color: "red" }}>*完成或跳過教學引導後將無法返回*</span></h6> 
        </>
      ),
    },
    {
      target: "#autoPlay",
      placement: "bottom",
      content: <p style={{fontSize: '20px'}}><b>自動播放：點擊後將自動播放對話，再次點擊即可關閉。</b></p>
    },
    {
      target: "#skipClick",
      placement: "bottom",
      content: <p style={{fontSize: '20px'}}><b>跳過對話：點擊後可跳過所有對話。</b></p>
    },
    {
      target: "#dialogueBox",
      placement: "top",
      content: <p style={{fontSize: '20px'}}><b>對話框：點擊以進行對話。</b></p>
    },
    {
      target: "#records",
      placement: "right",
      content: (
        <>
          <p style={{fontSize: '20px'}}><b>紀錄框：顯示當前的對話紀錄。</b></p>
          <hr></hr>
          <h6>對話結束時，當點選的句子呈現：</h6>
          <h5><span style={{ color: "green" }}>綠色</span> ➜ "<span style={{ color: "green" }}>回答正確</span>"</h5>
          <h5><span style={{ color: "red" }}>紅色</span> ➜ "<span style={{ color: "red" }}>回答錯誤</span>"</h5>
        </>
      )
    }
  ];

  const [currentConversation, setCurrentConversation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGuideTourActive, setIsGuideTourActive] = useState(true);
  const [records, setRecords] = useState([
    { character: "character1", text: "OOO先生/小姐您好，我是xxx的客服人員。" },
    { character: "character2", text: "您好，請問有甚麼事嗎?" },
    { character: "character1", text: "我們發現您有一筆交易出現問題，需要您到ATM前進行操作確認。" }
  ]);
  const [showRecords, setShowRecords] = useState(true);
  const [showBackStory, setShowBackStory] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isWaitingForOption, setIsWaitingForOption] = useState(false);
  const [isCharacterNameVisible, setIsCharacterNameVisible] = useState(true);
  const [question, setQuestion] = useState("");
  const [clickedText, setClickedText] = useState(null);
  const [ nextStageTransition, setNextStageTransition] = useState(false);
  const recordsRef = useRef(null); 
  const [dimensions, setDimensions] = useState({width: 0, height: 0})
  const [returnIsDisable, setReturnIsDisable] = useState(false);
  const [goFinalResults, setGoFinalResults] = useState(false);
  const [hiddenDuringTransition, setHiddenDuringTransition] = useState(false)
  const [errorCounts, setErrorCounts] = useState({});
  const { setIsFirstRender, svgColor, characterInformation, typeName, allScripts, fraudType, correctAnswer, errorCount, updateErrorCount} = useQuizContext();

  const navigate = useNavigate();

  const handleNextStage = () => {
    if ((currentConversation + 1) === allScripts[fraudType].length) {
      setGoFinalResults(true);
      setNextStageTransition(true);
      setTimeout(() => {
        navigate("/quiz/finalresults");
      }, 1500);
      // clearSession();
    } else {
      setCurrentConversation(currentConversation + 1);
      setCurrentIndex(0);  
      setRecords([]); 
      setShowRecords(false);
      setIsAutoPlay(false);
      setQuestion("");
      setHiddenDuringTransition(true);
      setNextStageTransition(true);
    }
    
  
};

  const handleDialogueClick = () => {
    if (Array.isArray(allScripts[fraudType][currentConversation].script[currentIndex]?.text)) {
      return;
    }

    if (currentIndex < allScripts[fraudType][currentConversation].script.length) {
      if (currentIndex === 0) {
        setShowRecords(true);
      }
        setRecords([...records, allScripts[fraudType][currentConversation].script[currentIndex]]);
        setCurrentIndex(currentIndex + 1);
    }

    if (currentIndex + 1 === allScripts[fraudType][currentConversation].script.length) {
        setIsCharacterNameVisible(false);
        setTimeout(() => {
            setQuestion("請選擇對話中，對方進行詐騙的關鍵句。");
        }, 500);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => {
      if (!prev && currentIndex === 0 && !showRecords) {
        setShowRecords(true);
        setRecords([allScripts[fraudType][currentConversation].script[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
      return !prev;
    });
  };

  const handleRecordClick = (clickedCharacter, clickedText) => {
    if (clickedCharacter === "character2") {
      return;
    } else {
      setClickedText(clickedText);
    }

    if (correctAnswer[currentConversation] !== clickedText) {
        setErrorCounts(prevCounts => {
            const newCount = (prevCounts[currentConversation] || 0) + 1;
            setTimeout(() => {
                updateErrorCount(currentConversation, newCount);
            }, 0);

            return { ...prevCounts, [currentConversation]: newCount };
        });
    } else {
      const currentMistakes = errorCount[currentConversation] || 0;
      updateErrorCount(currentConversation, currentMistakes);
  }
};

  const handleSkipClick = () => {
    if (currentIndex === 0) {
      setShowRecords(true);
    }
    
    setRecords((prevRecords) => [
      ...prevRecords,
      ...allScripts[fraudType][currentConversation].script.slice(currentIndex)
    ]);
    setCurrentIndex(allScripts[fraudType][currentConversation].script.length);
    setIsAutoPlay(false);
    setIsCharacterNameVisible(false);
    setTimeout(() => {
        setQuestion("請選擇對話中，對方進行詐騙的關鍵句。");
    }, 500);
  };

  const handleBack = () => {
    setIsFirstRender(false);
    navigate("/quiz");
  };

  useEffect(() => {
    if (!isGuideTourActive) {
      setRecords([]);
      setShowRecords(false);
      setNextStageTransition(true);
      setReturnIsDisable(true);
      setHiddenDuringTransition(true);
    }
  }, [isGuideTourActive]);
  
  useEffect(() => {
    let interval;
    if (isAutoPlay && !isWaitingForOption) {
      interval = setInterval(() => {
        if (currentIndex < allScripts[fraudType][currentConversation].script.length) {

          if (Array.isArray(allScripts[fraudType][currentConversation].script[currentIndex]?.text)) {
            setIsWaitingForOption(true);
            clearInterval(interval);
            return;
          }

          setRecords((prevRecords) => [...prevRecords, allScripts[fraudType][currentConversation].script[currentIndex]]);
          setCurrentIndex((prevIndex) => prevIndex + 1);

          if (currentIndex + 1 === allScripts[fraudType][currentConversation].script.length) {
            setIsAutoPlay(false);
            clearInterval(interval);
            setIsCharacterNameVisible(false);
            setTimeout(() => {
                setQuestion("請選擇對話中，對方進行詐騙的關鍵句。");
            }, 1000);
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlay, currentIndex, allScripts[fraudType][currentConversation].script, isWaitingForOption]);

  useEffect(() => {
    if (recordsRef.current) {
      recordsRef.current.scrollTop = recordsRef.current.scrollHeight;
    }
  }, [records]);


  useEffect (() => {
    const resize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    resize();
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    const preventScroll = () => {
      document.body.style.overflow = 'hidden'; 
    };
    const resetScroll = () => {
      document.body.style.overflow = ''; 
    };

    if (run) {
      preventScroll(); 
    } else {
      resetScroll(); 
    }

    return () => {
      resetScroll(); 
    };
  }, [run]);

  useEffect(() => {
    if (correctAnswer[currentConversation] === clickedText) {
      setTimeout(() => handleNextStage(), 1000); 
    }
  }, [clickedText])
  
  const stages = [
    { title: "測 驗 一", stage: "Stage 1" },
    { title: "測 驗 二", stage: "Stage 2" },
    { title: "測 驗 三", stage: "Stage 3" },
  ];

  const colorMap = {
    "#ffe4e6": "rgb(255, 154, 184)",
    "#fef3c7": "rgb(255, 204, 128)",
    "#d1fae5": "rgb(79, 218, 169)",
    "#EDE9FE": "rgb(201, 172, 255)"
  };

  const getFillColor = (svgColor) => {
    return colorMap[svgColor] || "white"; 
    };

  const getFraudBackgroundClass = (fraudType) => {
    if (fraudType === 'shoppingFraud') return styles.shoppingFraud;
    if (fraudType === 'romanceFraud') return styles.romanceFraud;
    if (fraudType === 'investmentFraud') return styles.investmentFraud;
    return '';
  };
    
  return (
    <div className={styles.gameContainer} id="gameContainer">
      
      <GuideTour 
      steps={steps} 
      run={run} 
      setIsGuideTourActive={setIsGuideTourActive} 
      />

      <div className={styles.pageTransition}>
        <div className={styles.tempbg} style={{opacity: dimensions.width > 0 ? 0 : 1, backgroundColor: svgColor}}></div>
        {dimensions.width > 0 && <SVG {...dimensions} svgColor={svgColor} goFinalResults={goFinalResults}></SVG>}
        <motion.p
          className={styles.temptitle} 
          style={{ color: getFillColor(svgColor) || 'white' }}
          initial={{ opacity: 1, x: 0}}
          animate={{ opacity: 0, x: -300}}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0.32, 0, 0.67, 0]
          }}
        >
          {typeName}
        </motion.p>

        { nextStageTransition && (
          <motion.div 
            className={styles.nextStage}
            initial={{ opacity: 0}}
            animate={{ opacity: [0, 1, 1, 0] }} 
            transition={{
              duration: 2.4, 
              times: [0, 0.25, 0.75, 1], 
              ease: "easeInOut", 
            }}
            onAnimationComplete={() => {
              setNextStageTransition(false);
              setShowBackStory(true)
              setIsCharacterNameVisible(true);
            }}
          >
            <p>{ !goFinalResults ? stages[currentConversation]?.title : "測驗結束" }</p>
            <p>{ !goFinalResults ? stages[currentConversation]?.stage : "Completed" }</p>
          </motion.div>
        )}
      </div>

      <div className={`${styles.background} ${getFraudBackgroundClass(fraudType)}`}></div>

      { showBackStory && (
        <div className={styles.backStory}>
          <p style={{ fontSize: '50px' }}><b>【情境 - {currentConversation + 1}】</b></p>
          <p style={{ fontSize: '30px' }}><b>{allScripts[fraudType][currentConversation].background}</b></p>
          <div className={styles.kickOff}>
            <button onClick={() => {
              setHiddenDuringTransition(false);
              setShowBackStory(false)
              }}>
                開始測驗
            </button>
          </div>
          
        </div>
      )}

      {!returnIsDisable && (
        <div className={styles.returnButton} id="returnButton">
          <button onClick={handleBack}><UndoIcon /> 返回</button>
        </div>
      )}
      
      {!hiddenDuringTransition && (
        <ProgressBar currentConversation={currentConversation}></ProgressBar>
      )}

      {!hiddenDuringTransition && (
        <div className={styles.dialogueBox} id="dialogueBox" onClick={handleDialogueClick}>
        {!isGuideTourActive && isCharacterNameVisible && (
          <div className={allScripts[fraudType][currentConversation].script[currentIndex]?.character === "character1" ? styles.characterName1 : styles.characterName2}>
           {allScripts[fraudType][currentConversation].script[currentIndex]?.character === "character1" ? "詐騙犯" : (characterInformation.confirmNickname || "我")}
          </div>
        )}

        <div>
          {Array.isArray(allScripts[fraudType][currentConversation].script[currentIndex]?.text) ? (
            <div className={styles.options}>
              {allScripts[fraudType][currentConversation].script[currentIndex]?.text.map((option, index) => (
                <button key={index} className={styles.option} onClick={() => handleOptionClick(option)}>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.dialogueText}>
              {isGuideTourActive ? records[2].text : allScripts[fraudType][currentConversation].script[currentIndex]?.text}
            </div>
          )}
          {question && <div className={styles.question}>{question}</div>}
        </div>
      </div>
      )}


      <div className={styles.content}>
        {!hiddenDuringTransition && (
          <div className={styles.characterLeft}>
              <img src="/faurd.PNG" alt="Character 1" className={`${styles.characterLeftImage} ${allScripts[fraudType][currentConversation].script[currentIndex]?.character === "character1" ? styles.myturn : null}`} />
          </div>
        )}
        <div className={styles.records} id="records" style={{ visibility: showRecords ? 'visible' : 'hidden' }}>
          <div className={styles.recordsHeader}>
            <AccountCircleIcon sx={{ fontSize: 42 }} />
            <div className={styles.state}>
            <p style={{fontSize: '20px'}}><b>賣家</b></p>
              <p>🟢上線中</p>
            </div>
            <div className={styles.function}>
              <LocalPhoneIcon sx={{ fontSize: 27.5 }}/>
              <VideocamIcon sx={{ fontSize: 27.5 }} />
              <MoreVertIcon sx={{ fontSize: 27.5 }} />
            </div>
          </div>
          <div className={styles.recordsContent} ref={recordsRef}>
            {records.map((entry, index) => (
              <div
                key={index}
                className={entry.character === 'character1' ? styles.recordsLeft : styles.recordsRight}
                onClick={() => handleRecordClick(entry.character, entry.text)} 
              >
                <div
                  className={`
                    ${
                      entry.character === 'character1' ? styles.recordsLeftText : styles.recordsRightText
                    } 
                    ${
                      entry.text.includes("OOO先生/小姐您好，我是xxx的客服人員。") ? styles.incorrectAnswer : 
                      entry.text.includes("我們發現您有一筆交易出現問題，需要您到ATM前進行操作確認。") ? styles.correctAnswer : ''
                    }
                    ${
                      (correctAnswer[currentConversation] === clickedText && entry.text === clickedText) ? styles.correctAnswer : 
                      (correctAnswer[currentConversation] !== clickedText && entry.text === clickedText) ? styles.incorrectAnswer : ''
                    }
                  `}
                >
                  {entry.text}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.recordsBottom}>
            <div className={styles.typingContainer}>
              <EmojiEmotionsIcon sx={{ marginLeft: "10px", color: "gray", fontSize: 27.5}}/>
              <p>發送訊息 . . .</p>
              <MicIcon sx={{ marginLeft: "auto", marginRight: "10px", color: "gray", fontSize: 27.5}}/>
            </div>
            <div className={styles.otherButtonContainer}>
              <CameraAltIcon 
              sx={{
                  backgroundColor:"rgba(255, 255, 255, 0.5)", 
                  boxSizing: "content-box", 
                  padding: "10px", 
                  borderRadius: "50%", 
                  color: "gray",
                  fontSize: 27.5}} 
              />
              <PanoramaIcon
                sx={{
                  backgroundColor:"rgba(255, 255, 255, 0.5)", 
                  boxSizing: "content-box", 
                  padding: "10px", 
                  borderRadius: "50%", 
                  color: "gray",
                  fontSize: 27.5}} 
              />
              <TelegramIcon 
                sx={{
                  backgroundColor:"rgba(255, 255, 255, 0.5)", 
                  boxSizing: "content-box", 
                  padding: "10px", 
                  borderRadius: "50%", 
                  color: "gray",
                  fontSize: 27.5}} 
              />
            </div>
          </div>
        </div>
        
        {!hiddenDuringTransition && (
          <div className={styles.characterRight}>
              <img src={`/${characterInformation.selectedRole}.PNG`}   alt="Character 2" className={`${styles.characterRightImage} ${allScripts[fraudType][currentConversation].script[currentIndex]?.character === "character2" ? styles.myturn : null}`} />
          </div>
        )}
      </div>

      {!hiddenDuringTransition && (
        <div className={styles.recordsControls}>
          <button onClick={toggleAutoPlay} id="autoPlay">
            {isAutoPlay ? (<><PauseIcon /> 暫停播放</>) : (<><PlayArrowIcon /> 自動播放</>)}
          </button>
          <button onClick={handleSkipClick} id="skipClick">
            <SkipNextIcon /> 跳過對話
          </button>
        </div>
      )}
    </div>
  );
}

export default FraudQuiz;


function SVG({ width, height, svgColor, goFinalResults}) {
  const svgPath = `
    M0 0
    L${width + 300} 0
    Q${width + 600} ${height / 2} ${width + 300} ${height} 
    L0 ${height}
    L0 0
  `
  
  return (
    <motion.svg 
      className={styles.svg}
      initial={{ x: 0 }}
      animate={{ x: "calc(-100vw - 600px)" }}
      exit={!goFinalResults ? { x: 0 } : null}
      transition={{ duration: 1, delay: 0.5, ease: [0.75, 0, 0.24, 1]}}
      fill={svgColor}
      >
      <path d={svgPath}></path>
    </motion.svg>
    );
}