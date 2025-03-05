import { useState, useEffect } from "react";
import styles from "./CharacterNickname.module.css"
import { User, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizContext } from "./QuizContext";

function CharacterNickname() {
    const [nickname, setNickname] = useState("");
    const { characterInformation, setCharacterInformation } = useQuizContext();
    const characters = ["male", "female", "kid"];
    const [currentIndex, setCurrentIndex] = useState(
        characterInformation.selectedRole ? characters.indexOf(characterInformation.selectedRole) : 0
    );
    
    // 切換到上一個角色
    const handlePrevCharacter = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
    };
    
    // 切換到下一個角色
    const handleNextCharacter = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % characters.length);
    };

    useEffect(() => {
        if (characterInformation.confirmNickname) {
            setNickname(characterInformation.confirmNickname);
        }
    }, [characterInformation.confirmNickname]);

    return (
        <>
            <div className={styles.alertContainer}>
                <UserCog className={styles.alertIcon} />
                <p className={styles.characterUsernameAlert}>
                    請先選取角色和輸入暱稱，再選擇測驗類型
                </p>
            </div>
            
            <div className={styles.characterContainer}>

                {/* 角色區塊 */}
                <div className={styles.characterImgContainer}>
                {characters.map((char, index) => (
                    <img
                        key={char}
                        src={`/${char}.png`}
                        alt={char}
                        className={`${styles.image} ${styles[`pos${(index - currentIndex + characters.length) % characters.length}`]}`}
                    />
                    ))}
                </div>
                
                <div className={styles.characterSelection}>
                    {/* 左方向鍵 */}
                    <ChevronLeft className={styles.arrow} onClick={handlePrevCharacter} />
                    {/* 右方向鍵 */}
                    <ChevronRight className={styles.arrow} onClick={handleNextCharacter} />
                </div>
            </div>

        <div className={styles.nicknameContainer}>
            <div className={styles.waveGroup}>
                <div className={styles.inputContainer}>
                    <User className={`${styles.userIcon} ${nickname && styles.userIconBlack }`}  />
                    <input 
                        required 
                        type="text" 
                        className={`${styles.input} ${nickname && styles.inputBorderBottom }`}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={10}
                    />
                    
                    <label className={styles.label}>
                        {["請", "輸", "入", "暱", "稱"].map((char, index) => (
                            <span 
                                key={index} 
                                className={styles.labelChar} 
                                style={{ "--index": index }}
                            >
                                {char}
                            </span>
                        ))}
                    </label>
                    <div className={styles.charCount}>
                        {nickname.length}/10
                    </div>
                </div>
                <div className={styles.confirmButtonContianer}>
                    <button 
                        className={`${styles.confirmButton} ${nickname && styles.confirmButtonBlack}`} 
                        disabled={!nickname}  
                        onClick={() => {
                            setCharacterInformation({
                                selectedRole: characters[currentIndex],
                                confirmNickname: nickname
                            });
                        }}
                    >
                        確定
                    </button>
                </div>
            </div>
        </div>
            {/* <div className={styles.avatar}>
            <div className={styles.card}>
                <div className={styles.wrapper}>
                <img className={styles.coverImage} src="/dark_rider-cover.jpg"></img>
                </div>
                <img className={styles.title} src="/dark_rider-title.png"></img>
                <img className={styles.character} src="/dark_rider-character.webp"></img>
            </div>
            </div> */}
        </>
    )
}

export default CharacterNickname