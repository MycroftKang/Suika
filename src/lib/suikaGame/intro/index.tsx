import {Fruit} from '../object/Fruit';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import { GameResult } from "../GameResult";
import { useEffect, useState } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';



const cx = classNames.bind(styles);

interface IntroProps {
  isVisible: boolean;
  loadUserInfo: boolean;
  handleGameStart: () => void;
  handleShowRankModal: () => void;
}

const Intro = ({isVisible, loadUserInfo,handleGameStart, handleShowRankModal}: IntroProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShowPWACard, setIsShowPWACard] = useState<boolean>(false);

  const handleBeforeInstallPrompt = (event: any) => {
    event.preventDefault();

    setDeferredPrompt(event);
    setIsShowPWACard(true);
  };
  
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);
  
  const positionCircularly = (totalElements: number, index: number) => {
    const radius = 150; // 조절 가능한 원의 반지름
    const angle = (2 * Math.PI * index) / totalElements;

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return {
      top: `calc(50% + ${y}px - 24px)`,
      left: `calc(50% + ${x}px - 24px)`,
    };
  };

  const fruitItemEls = Object.keys(Fruit).slice(0, Object.keys(Fruit).length - 1).map((fruit, index) => {
    const itemPositions = positionCircularly(11, index);

    return (
      <li key={fruit} className={cx('listItem')}
          style={{
            backgroundImage: `url(${require('../../../resource/' + fruit + '.png')})`,
            top: itemPositions.top,
            left: itemPositions.left
          }}/>
    )
  })

  const onClick = async () => {
    handleGameStart();
  }

  if (!isVisible) return null;

  let userName = "Loading..."
  
  if (loadUserInfo) {
    userName = GameResult.userName;
  }

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          handlePWACardClose();
          gtag("event", "PWAAccepted", {})
        } else {
          gtag("event", "PWARejected", {})
        }

        setDeferredPrompt(null);
      });
    }
  };

  const handlePWACardClose = () => {
    setIsShowPWACard(false);
  }

  return (
    <div className={cx('introArea')}>
      <ul className={cx('listWrap')}>{fruitItemEls}</ul>

      <div className={cx('titleArea')}>
        <button className={cx('btn')} onClick={onClick}>GAME START</button>
      </div>

      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 1, pointerEvents: "auto", display: isShowPWACard ? "block" : "none"}}>
        <Card>
          {/* <Card.Header>Featured</Card.Header> */}
          <Card.Body>
            <div className='' style={{display: "flex"}}>
              <img src="/maskable_icon_x72.png" className="rounded mb-2 me-2" alt="" style={{width: "15%"}}/>
              <div className='d-flex justify-content-between align-items-center' style={{flex: "auto"}}>
                <Card.Title>
                      Suika with Bomb
                </Card.Title>
                <CloseButton style={{marginBottom: "0.5rem"}} onClick={handlePWACardClose}/>
              </div>
              </div>
            <Card.Text style={{marginBottom: "1rem"}}>
              홈 또는 앱스 화면에 바로가기를 추가합니다.
              </Card.Text>
            <Button variant="primary" style={{paddingLeft: "1.5rem", paddingRight: "1.5rem"}} onClick={handleInstall}>홈 화면에 추가</Button>
          </Card.Body>
        </Card>
      </ToastContainer>

      <button className={`${cx('rank-btn')}`} onClick={handleShowRankModal}>{userName}</button>
      {/* <a href={'https://github.com/MycroftKang/Suika#readme'} target='_blank' className={cx('patchLink')}>{GameResult.userName}</a> */}
      {/* <span className={cx('version')}>v1.0.5</span> */}
    </div>
  )
}

export default Intro;
