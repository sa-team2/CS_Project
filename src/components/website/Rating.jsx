import React from 'react';
import './Rating.css';
import chroma from 'chroma-js'; 
import { Rate, Row } from 'antd';
import { Card, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowPointer, faCheck } from '@fortawesome/free-solid-svg-icons';

const getBackground = (progress) => {
  const degrees = progress * 3.6;
  return `
    conic-gradient(
      rgb(255, 68, 51) 0deg, 
      orange ${Math.min(degrees, 90)}deg, 
      yellow ${Math.min(degrees, 180)}deg, 
      rgb(154, 205, 50) ${Math.min(degrees, 270)}deg, 
      green ${Math.min(degrees, 360)}deg,
      gainsboro ${Math.min(degrees, 360)}deg
    )
  `;
};

const getColorAtProgress = (progress) => {
  const degrees = progress * 3.6;

  const colorStops = [
    { color: 'rgb(255, 68, 51)', stop: 0 },
    { color: 'orange', stop: 90 },
    { color: 'yellow', stop: 180 },
    { color: 'rgb(154, 205, 50)', stop: 270 },
    { color: 'green', stop: 360 },
  ];

  let color1, color2;
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (degrees >= colorStops[i].stop && degrees <= colorStops[i + 1].stop) {
      color1 = colorStops[i];
      color2 = colorStops[i + 1];
      break;
    }
  }

  if (color1 && color2) {
    const ratio = (degrees - color1.stop) / (color2.stop - color1.stop);
    return chroma.mix(color1.color, color2.color, ratio).hex();
  } else {
    return 'gray'; 
  }
};

function Rating({ pythonResult, keyword, type }) {
  const [progress, setProgress] = React.useState(0);
  const [riskLevel, setRiskLevel] = React.useState('中風險'); // 默认风险等级

  React.useEffect(() => {
    // 模拟进度增加
    let progressStartValue = 0;
    const progressEndValue = 20;
    const speed = 15;

    const interval = setInterval(() => {
      progressStartValue++;
      setProgress(progressStartValue);
      let newRiskLevel;
      if (progressEndValue <= 50) {
        newRiskLevel = '高風險';
      } else if (progressEndValue <= 75) {
        newRiskLevel = '中風險';
      } else {
        newRiskLevel = '低風險';
      }
      setRiskLevel(newRiskLevel);

      if (progressStartValue === progressEndValue) {
        clearInterval(interval);
      }
    }, speed);
  }, []);

  const sign = ['非常不滿意', '不滿意', '普通', '滿意', '非常滿意'];
  const [value, setValue] = React.useState(3);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">如何防範</Popover.Header>
      <Popover.Body>
        <ul>
          <li>投資皆有風險，不要相信「穩賺不賠」等用詞。</li>
          <li>檢查投資公司的背景和合法性。</li>
          <li>警惕來自不明來源的投資資訊。</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const getRiskLevel = () => {
    if (progress <= 50) {
      return (
        <ul className="rating-ul">
          <li>等級：<FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#ff0000"}} /> 高風險</li>
          <li>提醒：立即停止操作且避免提供任何個人資訊。</li>
        </ul>
      )
    } else if (progress <= 70) {
      return (
        <ul className="rating-ul">
          <li>等級：<FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#FFD43B"}} /> 中風險</li>
          <li>提醒：保持警惕、暫緩交易，並核實資訊的真實性。</li>
        </ul>
      )
    } else {
      return (
        <ul className="rating-ul">
          <li>等級：<FontAwesomeIcon icon={faCheck} style={{color: "#0ec48d"}} /> 低風險</li>
          <li>提醒：辯識結果為安全內容，仍須留意潛在的詐騙行為。</li>
        </ul>
      )
    }
  };

  return (
    <div className="rating-container">
      {progress === 0 ? (
        <div id="loading-container">
          <label className="loading-title">檢測中 ...</label>
          <span className="loading-circle sp1">
            <span className="loading-circle sp2">
              <span className="loading-circle sp3"></span>
            </span>
          </span>
        </div>
      ) : (
        <>
          <div className="container-1">
            <div className="circular-progress" style={{ background: getBackground(progress) }}>
              <span className="progress-value" style={{ color: getColorAtProgress(progress) }}>
                {`${progress}%`}
              </span>
              <span className="text" style={{ color: getColorAtProgress(progress) }}>
                {pythonResult} {/* 显示 pythonResult */}
              </span>
            </div>
            <Row align="middle" justify="center">
              <div style={{ fontSize: '20px' }}>準確度回報：</div>
              <Rate tooltips={sign} onChange={setValue} value={value} />
            </Row>
          </div>
          <div className="container-2">
            <Card className="card-rating">
              <Card.Body>
                <Card.Title><b>風險等級：</b></Card.Title>
                <Card.Text>
                    {getRiskLevel()}
                </Card.Text>
              </Card.Body>
            </Card>

            {(riskLevel === "高風險" || riskLevel === "中風險") && (
              <>
                <Card className="card-rating">
                  <Card.Body>
                    <Card.Title><b>詐騙類型：</b></Card.Title>
                    <Card.Text>
                    <ul className="rating-ul">
                          <li>類型：{type || '無'}</li>
                        </ul>
                    </Card.Text>
                      <Card.Text>
                        <ul className="rating-ul">
                          <li>關鍵字詞：{keyword && keyword.length > 0 ? keyword.join(', ') : '無'}</li>
                        </ul>
                      </Card.Text>
                    

                  </Card.Body>
                </Card>

                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                  <Button variant="success" className="prevent"><b>如何防範 <FontAwesomeIcon icon={faArrowPointer} /></b></Button>
                </OverlayTrigger>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Rating;
