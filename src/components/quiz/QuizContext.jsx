import { createContext, useState, useContext, useEffect } from "react";

const QuizContext = createContext();


export const QuizProvider = ({ children }) => {
  //---
  const [isFirstRender, setIsFirstRender] = useState(() => {
    const sessionFirstRender = sessionStorage.getItem("isFirstRender");
    return sessionFirstRender ? JSON.parse(sessionFirstRender) : true;  
  });

  useEffect(() => {
    sessionStorage.setItem("isFirstRender", JSON.stringify(isFirstRender));
  }, [isFirstRender]);

  //---
  const [svgColor, setSvgColor] = useState(() => sessionStorage.getItem("svgColor") || "#000000");

  useEffect(() => {
    sessionStorage.setItem("svgColor", svgColor);
  }, [svgColor]);

  //---
  const [characterInformation, setCharacterInformation] = useState(() => {
    const sessionCharacterInformation = sessionStorage.getItem("characterInformation");
    return sessionCharacterInformation ? JSON.parse(sessionCharacterInformation) : { selectedRole: "male", confirmNickname: "" };
  });

  useEffect(() => {
    sessionStorage.setItem("characterInformation", JSON.stringify(characterInformation));
  }, [characterInformation.confirmNickname]); 

  //---
  const [fraudType, setFraudType] = useState(sessionStorage.getItem("fraudType") || null);
  const [typeName, setTypeName] = useState(sessionStorage.getItem("typeName") || null);
   
   useEffect(() => {
    if (fraudType) {
      sessionStorage.setItem("fraudType", fraudType);

      if (fraudType === 'romanceFraud') {
        setTypeName('交友戀愛詐騙');
      } else if (fraudType === 'shoppingFraud') {
        setTypeName('購物詐騙');
      } else if (fraudType === 'investmentFraud') {
        setTypeName('投資詐騙');
      } else if (fraudType === 'imperFraud') {
        setTypeName('冒名詐騙');
      } else {
        setTypeName(null);
      }
    } else {
      setTypeName(null);
    }
  }, [fraudType]);

  useEffect(() => {
    if (typeName) {
      sessionStorage.setItem("typeName", typeName);
    }
  }, [typeName]);
  
  
  const [correctAnswer, setCorrectAnswer] = useState([]);

  const allScripts = {
    romanceFraud: [
      {
        background: "起初他們在交友軟體閒聊，交換了私人聯繫方式後每天從早聊到晚，分享彼此生活，甚至最後交往了。",
        script: [
          { character: "character1", text: "寶寶早安，昨天晚上睡得好嗎～" },
          { character: "character2", text: "寶貝早安，我昨天晚上有夢到你哦！" },
          { character: "character1", text: "真的嗎!!!一大早看到這個訊息真的好開心。" },
          { character: "character2", text: "寶貝今天要去工作嗎？" },
          { character: "character1", text: "對呀，你可以幫我加這個 LINE ID 嗎？ aa25738" },
          { character: "character2", text: "這是要做什麼的呀～" },
          { character: "character1", text: "這是我很好的廠商給我的私下回扣，我們員工不能領，你能幫我用一下嗎？我明天帶你去吃無菜單料理！" },
          { character: "character2", text: "好哇好哇!!!要私訊他什麼呢？" },
          { character: "character1", text: "跟他說是陳傳媒請你來領回扣的。" },
          { character: "character2", text: "他跟我說要先匯10,000給他耶寶貝，我錢不太夠。" },
          { character: "character1", text: "你先跟別人借一下，反正等等就能還了。" },
          { character: "character2", text: "還是你先匯給我，我怕是詐騙。" },
          { character: "character1", text: "不會啦～我跟他認識很久了，不是詐騙，我之前也請其他朋友幫我領過。" },
          { character: "character2", text: "還是你請其他朋友幫你，我還是有點不相信。" },
          { character: "character1", text: "你開心就好，我們都在一起這麼久了你還不相信我嗎？" },
          { character: "character2", text: "我盡力想幫你了。" },
          { character: "character1", text: "你就是不相信我才會在那邊猜測，明天也不用去吃了，就這樣吧..." },
          { character: "character2", text: "好啦我跟我爸借，你不要生氣好不好。" },
          { character: "character1", text: "好啦～就知道寶貝最愛我了！" }
        ],
        tips: "真正愛你的人是不會情緒勒索你的，突然要請你加別人的LINE也要多加注意。"
      },
      {
        background: "你在網路上認識一名自稱駐泰國之軍人，對方頻繁傳訊息問候獻殷勤，雙方進而產生感情以老公老婆互稱。",
        script: [
          { character: "character1", text: "老婆，我最近投資獲利很多！你看一下你的網路銀行，我匯了一些錢給你買好看的名牌包。" },
          { character: "character2", text: "哇!!!謝謝老公，我看到了～" },
          { character: "character1", text: "這個投資獲利這麼多，我都想邀請老婆一起合資下注了，這樣可以賺更多錢。" },
          { character: "character2", text: "我想想看哦...這個有金額下限嗎？" },
          { character: "character1", text: "一次最低五萬元，所以才想找老婆一起合資，這樣老婆也可以賺到錢！" },
          { character: "character2", text: "那這樣我要匯多少呢老公？" },
          { character: "character1", text: "我覺得可以多一點，這樣獲利會更多，我們以後也可以更輕鬆養老。" },
          { character: "character2", text: "好～那我匯十萬給你！有獲利再跟我說。" },
          { character: "character1", text: "好耶，老婆有在為我們的未來著想，一起努力投資。" }
        ],
        tips: "對方是沒有見過面的人，投資的途徑也不清楚，避免被不切實際的甜言蜜語沖昏頭。"
      },
      {
        background: "你們在交友軟體上認識，對方之前被前男友騙了200萬，希望能和真誠的你走到最後。",
        script: [
          { character: "character1", text: "我之前被前男友騙了200萬，真的不想再遇到渣男了...我覺得跟你聊天很開心！" },
          { character: "character2", text: "心疼你，雖然我不是什麼會花言巧語的人，但我覺得你很特別，跟你聊得很舒服。" },
          { character: "character1", text: "對呀～我們真的很合！其實我一直在找一個可以信任、一起努力的伴侶。" },
          { character: "character2", text: "那我算是嗎？" },
          { character: "character1", text: "當然是啊!!!對了寶貝，你有聽過ONBUY嗎？這個投資機會很好，我最近靠這個賺了不少錢。" },
          { character: "character2", text: "ONBUY？我沒聽過欸。" },
          { character: "character1", text: "你去Google看看，網路上蠻多成功案例的，資金滾很快！" },
          { character: "character2", text: "真的嗎？但我還是不太懂，投資不是很危險嗎？" },
          { character: "character1", text: "沒關係我教你！其實這比買股票還簡單，你只要用USDT（泰達幣）入場，然後每天都能領固定的分紅！" },
          { character: "character2", text: "感覺好像很厲害，但這種真的能賺嗎？" },
          { character: "character1", text: "你相信我嘛，我已經賺了快50萬了！而且現在加入還有額外的推薦獎勵，你放10萬進去，兩週內就能拿回15萬。" },
          { character: "character2", text: "真的嗎？" },
          { character: "character1", text: "當然是真的！不然你可以先試試小額，1萬就好，我陪你操作！" }
        ],
        tips: "就算是自己心中蠻信任的人邀你投資，也要謹慎而行。"
      },
    ],

    shoppingFraud: [
      {
        background: "你在FaceBook二手社團發布貼文，有人私訊你說他想要購買。",
        script: [
          { character: "character1", text: "您好，我有留言說要買二手的 iPhone。" },
          { character: "character2", text: "貼文中的手機狀況及價格您可以接受嗎？" },
          { character: "character1", text: "可以的，您方便黑貓宅配上門取件嗎？我可以先匯款。" },
          { character: "character2", text: "沒問題，要怎麼操作呢？" },
          { character: "character1", text: "幫我填寫一下您的資料，我的收件資料已經填好了https://tw55.t-catvzha.shop。" },
          { character: "character2", text: "我填寫完了，請問您匯款了嗎？我好像還沒收到。" },
          { character: "character1", text: "匯款了，您是第一次使用嗎？需要找客服認證才能收款。" },
          { character: "character2", text: "好的沒問題。" },
          { character: "character1", text: "收到匯款之後，工作人員會打電話和你確定貨物、時間及地址。" },
        ],
        tips: "黑貓貨到付款訂單僅支援「現金」支付。"
      },
      {
        background: "你在Threads發布販售貼文，有人私訊你說他想要購買。",
        script: [
          { character: "character1", text: "您好，我想要收這個小烤箱。" },
          { character: "character2", text: "您好，您是住哪呢？我只接受台中面交哦。" },
          { character: "character1", text: "可以幫我寄送嗎？運費我吸收。" },
          { character: "character2", text: "好，也可以，您想用什麼方式的寄送呢？" },
          { character: "character1", text: "請問可以透過7-11交貨便匯款嗎？" },
          { character: "character2", text: "可以的。" },
          { character: "character1", text: "我這邊開單付款，填好收貨地址後您直接填寫寄貨的超商地址就可以了。" },
          { character: "character2", text: "錢是匯入交貨便那邊嗎？" },
          { character: "character1", text: "是的 https://zpt.oas-tw.us/index.php?id=5528" },
          { character: "character2", text: "填寫好了，明天出貨給您哦。" },
          { character: "character1", text: "好的，太感謝了。" }
        ],
        tips: "7-11交貨便是取件付款的交易方式，並且是寄件方做資料填寫，若對方貼網址給你請你填寫，並說明他已經匯款，就是詐騙哦！"
      },
      {
        background: "有人在FB社團出售拓元系統演唱會的票，剛好有你想收購的價位跟張數。",
        script: [
          { character: "character2", text: "您好，我想問票價及排數。" },
          { character: "character1", text: "是12排的，每張加500，這邊只收全額匯款，收到錢後會給您取票號碼，屆時自行取票就可以了。" },
          { character: "character2", text: "所以費用是 $4500+$500=$5000 嗎？可以台北面交嗎？" },
          { character: "character1", text: "目前只接受全額匯款哦。" },
          { character: "character2", text: "好，那您給我匯款帳號。" },
          { character: "character1", text: "(007)23768070081，匯好請回傳收據。" },
          { character: "character2", text: "（圖片）" },
          { character: "character1", text: "取票序號：36118625，您再到超商機台取票就可以了。" },
        ],
        tips: "應該要收到兩組號碼，取票序號及取票號碼，盡量走面交以減少受騙機率，也可以請賣家螢幕錄影確定是否真的有此票券。"
      },
    ],

    investmentFraud: [
      {
        background: "在工作中認識了這個人，平常會簡單問候，有一天突然問你要不要投資。",
        script: [
          { character: "character1", text: "你對投資醫美診所有興趣嗎？" },
          { character: "character2", text: "投資什麼醫美診所呀，怎麼突然問我？" },
          { character: "character1", text: "因為現有的股東跟醫生吵架想退股。" },
          { character: "character2", text: "你們自己也都有投資嗎？。" },
          { character: "character1", text: "有啊，我目前投12%，還剩下8%，1%是14萬，你有興趣嗎？" },
          { character: "character2", text: "聽起來是不錯，但我應該不會投資這麼多，你們是要找一次能8%的嗎？" },
          { character: "character1", text: "對，希望是用我的名義去投，所以是先借我然後我去簽這樣，我再每個月固定還你，如果現階段沒認，就是醫生吃去這些股份" },
          { character: "character2", text: "我大概懂你的意思了，等於現在需要112萬嗎？" },
          { character: "character1", text: "對，想辦法先吃下來。" },
          { character: "character2", text: "我先思考一下，畢竟是一筆大數目。" },
          { character: "character1", text: "好啊，不然至少4%也行，看你想不想要被動收入。" },
          { character: "character2", text: "可以，那我錢怎麼給你，一個月大概還我多少。" },
          { character: "character1", text: "你直接轉到我帳戶，我再用我的名義去跟醫生簽，帳號你那邊有嘛，一個月還你6萬，分12期這樣，剩下的當利息。" },
          { character: "character2", text: "好，剛剛匯給你了。" },
        ],
        tips: "整個交易都掌握在對方手中，沒有保障。"
      },
      {
        background: "你在網路上看到一個「創新當沖基金」的投資途徑，想嘗試看看。",
        script: [
          { character: "character2", text: "您好，想了解創新當沖基金的運作模式。" },
          { character: "character1", text: "這是比較適合沒什麼時間盯盤的人，因為這是一次給我們多一點的基金，提前跟我們說你要投資及當沖哪一支股票，系統會自動處理。" },
          { character: "character2", text: "那想問有什麼顧問費嗎？看到其他群組都需要有顧問費。" },
          { character: "character1", text: "沒有的，我們這邊只是想有一個地方大家可以互動交流，但會需要20%的保管費，也會撥一部份以各位名義捐贈。" },
          { character: "character2", text: "20%感覺有點多，想問還有什麼跟其他證券系統不一樣的地方嗎？" },
          { character: "character1", text: "一般的股票買賣都需要手續費，放在長期當沖上面會有大量的手續費，是吧！" },
          { character: "character2", text: "是沒錯。" },
          { character: "character1", text: "當你要投資時在系統操作，就能賺到比一般當沖還多的錢，畢竟減少蠻多手續費的。" },
          { character: "character2", text: "聽起來好像不錯，我之前就是常常玩當沖，又一直看手續費會不會影響到收益，蠻麻煩的。" },
          { character: "character1", text: "是吧！可以嘗試看看這種創新的投資方法，而且每天都會有老師給建議。" },
        ],
        tips: "投資有賺有賠，還是走較多人用的系統投資較有保障，並且由別人代操金錢風險也很大。"
      },
      {
        background: "你被邀進一個投資群組，並加了投資助理，想嘗試看看裡面的建議股票。",
        script: [
          { character: "character1", text: "您好，近期我將重新佈局一檔「內線飆股」，預計收益可達25-80%，建議先去辦理複委託哦～不然無法操作。" },
          { character: "character2", text: "好的，明天我剛好有空可以去辦理。" },
          { character: "character1", text: "明天下午將正式開啟這次的飆股佈局，只要按照老師提示的價格買入就可達到預期收益，有問題可以再問我。" },
          { character: "character2", text: "好，我明天先試試看。" },
          { character: "character1", text: "本次佈局標的：天平道合08577.HK，掛單價位：1.11，買進股數15000，買進資金$60000台幣。" },
          { character: "character2", text: "已買入，謝謝。" },
          { character: "character1", text: "目前已經佈局好了，需要報名投資梯隊。第一梯隊，首次佈局，預期停利80%；第二梯隊，第二佈局，預期停利40%；第三梯隊，最後佈局，預期停利15%。" },
          { character: "character2", text: "第一梯隊，我這邊有500萬。" },
          { character: "character1", text: "等等午間12點整入場，股票名稱：高門集團、股票代碼：08412、掛單價格：0.24、買入股數：5700000股、買入金額：500萬、目標價位：0.52。" },
        ],
        tips: "這種佈局通常是以先大量投資某支股票讓你有點獲利，並從中操作其他支股票，讓你在後續的投資上虧損或成為他們的棋子。"
      },
    ],

    imperFraud: [
      {
        background: "你接獲一則來自郵局專員的訊息，說你的帳戶有問題。",
        script: [
          { character: "character1", text: "你好，我是新莊郵局專員陳傳媒，請問你是王志翔嗎？" },
          { character: "character2", text: "沒錯，請問怎麼了嗎？" },
          { character: "character1", text: "我這邊接到通知，有人拿你的證件授權書去領錢，請問是你認識的人嗎？" },
          { character: "character2", text: "啊？？？我不知道欸，那我現在應該要怎麼做。" },
          { character: "character1", text: "需要先將財產移至安全帳戶。" },
          { character: "character2", text: "是一定要移動嗎？還是我可以先報警呢？" },
          { character: "character1", text: "不用，我們這邊會幫你處理好，只要先將財產進行移動代管公證，處理好後會再歸還。" },
          { character: "character2", text: "好，再請你告訴我要怎麼做。" },
          { character: "character1", text: "你現在帳戶財產有900萬元，等等匯款至以下帳戶即可700-14524879524123。" },
          { character: "character2", text: "好。" }
        ],
        tips: "若有接獲訊息或來電，聲稱為某行員或政府機關，請先查明該身分，勿輕易將錢轉移。"
      },
      {
        background: "你接獲一則來自銀行專員的訊息，說你的帳戶遭凍結。",
        script: [
          { character: "character1", text: "您好，請問是劉小姐嗎？" },
          { character: "character2", text: "是，請問您是？" },
          { character: "character1", text: "我是中國信託銀行新莊分行人員，王欣義。請問您近期有來辦理提款卡嗎？" },
          { character: "character2", text: "沒有欸，怎麼了嗎？" },
          { character: "character1", text: "我們這邊發現有人盜用您的身分辦理提款卡，導致帳戶凍結。" },
          { character: "character2", text: "那怎麼辦，我現在去分行找您處理嗎？" },
          { character: "character1", text: "沒關係，不用多跑一趟，在手機app處理即可。" },
          { character: "character2", text: "好，是中國信託的網銀app嗎？" },
          { character: "character1", text: "是的，先將錢轉至我們這邊的代管帳戶，等解凍結後就會轉回給您。822-1548751264258496" },
          { character: "character2", text: "沒問題，我現在馬上轉。" },
        ],
        tips: "若有接獲訊息或來電，聲稱為某行員或政府機關，請先查明該身分，勿輕易將錢轉移。"
      },
      {
        background: "你接獲一則來自發票載具的訊息，說你的發票歸戶有誤。",
        script: [
          { character: "character1", text: "請問是許小姐嗎？您有一張電子發票的歸戶有錯誤，會導致後續若有中獎無法匯款。" },
          { character: "character2", text: "那我要怎麼處理呢？" },
          { character: "character1", text: "請點選我們寄給您的郵件連結，進入頁面後更新您的信用卡與手機號碼以完成驗證。" },
          { character: "character2", text: "好的，可是只要輸入手機號碼就能歸戶吧。" },
          { character: "character1", text: "信用卡號是拿來雙重驗證的哦～" },
          { character: "character2", text: "我填完了，怎麼跳出扣款訊息？是正常的嗎？" },
          { character: "character1", text: "這是測試金額，不會真正扣款，請您放心。" },
          { character: "character2", text: "好，謝謝。" },
        ],
        tips: "發票載具若歸戶有誤，只需填寫手機號碼、身分證字號及載具號碼，請勿在不明網站中填寫信用卡號等個人資訊。"
      },
    ]
  };  

  const correctAnswerMappings = {
    romanceFraud: [
      allScripts.romanceFraud[0].script[4].text,
      allScripts.romanceFraud[1].script[2].text,
      allScripts.romanceFraud[2].script[4].text
    ],
    shoppingFraud: [
      allScripts.shoppingFraud[0].script[2].text,
      allScripts.shoppingFraud[1].script[4].text,
      allScripts.shoppingFraud[2].script[3].text
    ],
    investmentFraud: [
      allScripts.investmentFraud[0].script[6].text, 
      allScripts.investmentFraud[1].script[1].text, 
      allScripts.investmentFraud[2].script[0].text
    ],
    imperFraud: [
      allScripts.imperFraud[0].script[6].text, 
      allScripts.imperFraud[1].script[6].text, 
      allScripts.imperFraud[2].script[2].text
    ]
  };

  useEffect(() => {
    if (fraudType) {
      const correctAnswer = correctAnswerMappings[fraudType] || [];
      setCorrectAnswer(correctAnswer);
    }
  }, [fraudType]); 

  const [errorCount, setErrorCount] = useState({});
  const [scores, setScores] = useState({});

  // 計算錯誤次數對應的分數
  const calculateScore = (mistakes = 0) => {
    if (mistakes === 0) return 100; 
    if (mistakes === 1) return 80;
    if (mistakes === 2) return 60;
    if (mistakes === 3) return 40;
    if (mistakes === 4) return 20;
    return 0;
  };

  // 更新錯誤次數（但不直接更新分數）
  const updateErrorCount = (level, mistakes) => {
    setErrorCount(prev => ({ ...prev, [level]: mistakes }));
  };

  // 當 `errorCount` 變更時，透過 `useEffect` 更新 `scores`
  useEffect(() => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      Object.keys(errorCount).forEach(level => {
      newScores[level] = calculateScore(errorCount[level] ?? 0);
    });
      return newScores;
    });
  }, [errorCount]); // ✅ 只有 `errorCount` 更新時才會執行



  return (
    <QuizContext.Provider 
      value={{ 
        isFirstRender, setIsFirstRender, 
        svgColor, setSvgColor,
        characterInformation, setCharacterInformation,
        typeName, setTypeName,
        fraudType, setFraudType,
        allScripts, correctAnswer,
        errorCount, updateErrorCount,
        scores
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  return useContext(QuizContext);
};
