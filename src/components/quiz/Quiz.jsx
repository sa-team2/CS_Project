import styles from './Quiz.module.css'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import QuizTypeSelection from './QuizTypeSelection';
import CharacterNickname from './CharacterNickname';
import { useQuizContext } from "./QuizContext";


function Quiz() {
  const [isLoading, setIsLoading] = useState(true);
  const { isFirstRender, svgColor, characterInformation } = useQuizContext();
  const [dimensions, setDimensions] = useState({width: 0, height: 0})

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


  return (
    <div className={styles.quizContainer}>
      <div className={styles.pageTransition}>
        <div className={styles.tempbg} style={{opacity: dimensions.width > 0 ? 0 : 1, backgroundColor: svgColor}}></div>
        {dimensions.width > 0 && <SVG {...dimensions} isFirstRender={isFirstRender} svgColor={svgColor}></SVG>}
      </div>

      <motion.div
        className={styles.enterTransition}
        initial={{ opacity: 1 }} 
        animate={{ opacity: 0 }}
        transition={{ delay: 1, duration: 1 }} 
        >
      </motion.div>

      <motion.div
          className={styles.quizTitle}
          initial={{ scale: 1, width: "25%", y: 0 }} 
          animate={{ scale: 0.5, width: "50%", y: "-40vh" }}
          transition={{ delay: 1, duration: 1 }} 
        >
        詐 騙 測 驗
      </motion.div>
      

      <motion.div 
        className={styles.quizContent}
        initial={{ backgroundColor: "rgba(0, 0, 0, 0)", borderColor: "rgba(0, 0, 0, 0)"}}
        animate={{ backgroundColor: "rgba(0, 0, 0, 0.25)", borderColor: "rgba(0, 0, 0, 0.25)" }}
        transition={{ delay: 2, duration: 1 }} 
        onAnimationComplete={() => setIsLoading(false)}
      >
        
        {!isLoading && (
          <>
            <motion.div className={styles.quizContentLeft}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{ duration: 2 }} 
            >
              <CharacterNickname />
            </motion.div>

            <motion.div className={styles.quizContentRight}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{ duration: 2 }} 
            >
              <motion.div 
                className={styles.overlay}
                initial={{ opacity: 1 }}  
                animate={{ opacity: characterInformation.confirmNickname ? 0 : 1 }}  
                transition={{ duration: 1 }}  
                style={{ pointerEvents: characterInformation.confirmNickname ? "none" : "auto" }} 
              />
              <QuizTypeSelection />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Quiz

function SVG({ width, height, isFirstRender, svgColor}) {
  const svgPath =`
    M300 0
    L${width + 300} 0
    L${width + 300} ${height}
    L300 ${height}
    Q0 ${height / 2} 300 0
  `

  return (
    <motion.svg 
      className={styles.svg}
      initial={isFirstRender ? { x: "calc(100vw + 300px)" } : { x: "0" }}
      animate={{ x: "calc(100vw + 300px)"}}
      exit={{ left: "calc(-100vw - 600px)"}}
      transition={{ duration: 0.75, delay: 0.3, ease: [0.75, 0, 0.24, 1]}}
      fill={svgColor}
      >
      <path d={svgPath}></path>
    </motion.svg>
    );
}
