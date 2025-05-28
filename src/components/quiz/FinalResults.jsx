import React, { useState } from 'react';
import styles from './FinalResults.module.css';
import { motion } from 'framer-motion'; 
import { useNavigate } from "react-router-dom";
import CircularScore from './CircularScore';
import { useQuizContext } from "./QuizContext";
import UndoIcon from '@mui/icons-material/Undo';

const FinalResults = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState([false]); // 原本是三個，現在只需要一個
    const [returnIsDisable, setReturnIsDisable] = useState(true);
    const { svgColor, typeName, allScripts, fraudType, correctAnswer, errorCount, scores } = useQuizContext();
    const navigate = useNavigate();

    // 控制卡片翻轉
    const handleFlip = (index) => {
        const newFlipStates = [...isFlipped];
        newFlipStates[index] = !newFlipStates[index];
        setIsFlipped(newFlipStates);
        console.log(fraudType)
    };

    const colorMap = {
        "#ffe4e6": "rose",
        "#e6b976": "amber",
        "#d1fae5": "emerald",
        "#c0a4f5": "purple"
    };

    const getFillColor = (svgColor) => {
        return colorMap[svgColor] || "default"; 
    };

    return (
        <div className={styles.finalContainer}>
            <div className={styles.pageTransition}>
                <motion.div 
                    className={styles.nextStage}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 3 }, 
                    }}
                ></motion.div>
            </div>

            <motion.div
                className={styles.finalResultsTitle}
                initial={{ scale: 1, width: "25%", y: 0 }} 
                animate={{ scale: 0.5, width: "75%", y: "-41vh" }}
                transition={{ delay: 1, duration: 1 }} 
                onAnimationComplete={() => setReturnIsDisable(false)}
            >
                測 驗 結 果
            </motion.div>

            {!returnIsDisable && (
                <div className={styles.returnButton} id="returnButton">
                    <button onClick={() => navigate("/")}>
                        <UndoIcon /> 回首頁
                    </button>
                </div>
            )}

            <motion.div 
                className={styles.finalContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }} 
                onAnimationComplete={() => setIsLoading(false)}
            >
                {!isLoading && (
                    <>
                        <motion.div 
                            className={styles.fraudType}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }} 
                        >
                            測驗類型：
                            <span className={styles.fraudTypeColor}>{typeName}</span>
                        </motion.div>
                        <div className={styles.finalDetails}>
                            {[0].map((index) => (
                                <motion.div 
                                    key={0}
                                    className={`${styles.card} ${isFlipped[0] ? styles.rotate : null}`}
                                    initial={{ opacity: 0 }}  
                                    animate={{ opacity: 1 }}  
                                    transition={{ opacity: { delay: 0.5, duration: 0.5 } }} 
                                >
                                    <div className={styles.front}>
                                        <CircularScore progress={scores[0] || 0} />
                                        <div>
                                            <div>
                                                <p className={styles.scores}>{scores[0] || 0}</p>
                                                <p className={styles.label}>測驗分數</p>
                                            </div>
                                            <div>
                                                <p className={styles.incorrectClicks}>{errorCount[0] || 0}</p>
                                                <p className={styles.label}>錯誤次數</p>
                                            </div>
                                        </div>
                                        <div>
                                            Tips：{allScripts[fraudType][0].tips}
                                        </div>
                                        <button 
                                            className={`${styles.reviewButton} ${styles[getFillColor(svgColor)]}`}
                                            onClick={() => handleFlip(0)}
                                        >
                                            對話紀錄回顧
                                        </button>
                                    </div>
                                    <div className={styles.back}>
                                        <div className={styles.conversationReview}>
                                            {allScripts[fraudType][0].script?.map((message, i) => (
                                                <div key={i} className={message.character === 'character1' ? styles.recordsLeft : styles.recordsRight}>
                                                    <div
                                                        className={`${
                                                            message.character === 'character1' ? styles.recordsLeftText : styles.recordsRightText
                                                        } 
                                                        ${
                                                            (correctAnswer[0] === message.text ) && styles.correctAnswer 
                                                        }`}
                                                    >
                                                        {message.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            className={styles.reviewButton}
                                            onClick={() => handleFlip(0)}
                                        >
                                            返回
                                        </button>
                                    </div>
                                </motion.div>

                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default FinalResults;



// const FinalResults = ({ results }) => {
//     return (
//       <div className={styles.container}>
//         <motion.h1 
//           className={styles.title}
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           測驗結果
//         </motion.h1>
//         <div className={styles.columns}>
//           {results.map((result, index) => (
//             <motion.div 
//               key={index} 
//               className={styles.column}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2 * index, duration: 0.5 }}
//             >
//               <h2 className={styles.levelTitle}>關卡 {index + 1}</h2>
//               <p>分數：<span className={styles.score}>{result.score}</span></p>
//               <p>按錯次數：{result.mistakes}</p>
//               <p>正確的句子：{result.correctSentence}</p>
//               <button 
//                 className={styles.reviewButton}
//                 onClick={() => alert(`正在回顧關卡 ${index + 1}`)}
//               >
//                 回顧此關卡
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default FinalResults;