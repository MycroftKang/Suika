import {Fruit} from '../object/Fruit';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import { GameResult } from "../GameResult";
import { useEffect, useState } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

interface IntroProps {
  isVisible: boolean;
  loadedUserInfo: boolean;
  handleGameStart: () => void;
  handleShowRankModal: () => void;
}

const userBrowser = ((agent) => {
    switch (true) {
        case agent.indexOf("edge") > -1: return "MS Edge (EdgeHtml)";
        case agent.indexOf("edg") > -1: return "MS Edge Chromium";
        case agent.indexOf("samsungbrowser") > -1: return "samsung browser";
        case agent.indexOf("opr") > -1 && !!(window as any).opr: return "opera";
        case agent.indexOf("chrome") > -1 && !!(window as any).chrome: return "chrome";
        case agent.indexOf("trident") > -1: return "Internet Explorer";
        case agent.indexOf("firefox") > -1: return "firefox";
        case agent.indexOf("safari") > -1: return "safari";
        default: return "other";
    }
})(window.navigator.userAgent.toLowerCase());

const Intro = ({isVisible, loadedUserInfo, handleGameStart, handleShowRankModal}: IntroProps) => {
  const { t } = useTranslation();

  // useEffect(()=>{
  //   const titleElement = document.getElementsByTagName('title')[0]
  //   titleElement.innerHTML = t("intro.suika_with_bomb_title");
  // },[])
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShowPWACard, setIsShowPWACard] = useState<boolean>(false);
  const [isShowOpenWithChrome, setIsShowOpenWithChrome] = useState<boolean>(true);

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
    if (!window.navigator.userAgent.toLowerCase().includes("kakaotalk")) {
      window.addEventListener("beforeunload", (ev) => 
      {
          ev.preventDefault();
          return (ev.returnValue = 'Are you sure you want to close?');
      });
    }

    handleGameStart();
  }

  if (!isVisible) return null;

  let userName = "Loading..."
  
  if (loadedUserInfo) {
    userName = GameResult.userName;
  } else if (GameResult.isNewUser()) {
    userName = "Welcome";
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

  const handleOpenWithChromeClose = () => {
    setIsShowOpenWithChrome(false);
  }

  function isStandalone() {
    return !!(navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
  }

  const notSupportPWA = () => {
    return (userBrowser !== "chrome") && ((window.navigator as any).userAgentData?.platform === 'Android') && !isStandalone();
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
              {t("intro.shortcut_notice_description")}
              </Card.Text>
            <Button variant="primary" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }} onClick={handleInstall}>{t("intro.shortcut_notice_install_button")}</Button>
          </Card.Body>
        </Card>
      </ToastContainer>

      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 1, pointerEvents: "auto", display: !isShowPWACard && isShowOpenWithChrome && notSupportPWA() ? "block" : "none"}}>
        <Card>
          {/* <Card.Header>Featured</Card.Header> */}
          <Card.Body>
            <div className='' style={{display: "flex"}}>
              <img src="/maskable_icon_x72.png" className="rounded mb-2 me-2" alt="" style={{width: "15%"}}/>
              <div className='d-flex justify-content-between align-items-center' style={{flex: "auto"}}>
                <Card.Title>
                      Suika with Bomb
                </Card.Title>
                <CloseButton style={{marginBottom: "0.5rem"}} onClick={handleOpenWithChromeClose}/>
              </div>
              </div>
            <Card.Text style={{marginBottom: "1rem"}}>
              {t("intro.shortcut_notice_chrome")}
              </Card.Text>
            {/* <Button variant="primary" style={{paddingLeft: "1.5rem", paddingRight: "1.5rem"}} onClick={handleInstall}>크롬에서 열기</Button> */}
            <a className='btn btn-secondary' style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }} href="intent://game.mulgyeol.com#Intent;scheme=https;package=com.android.chrome;end">{t("intro.shortcut_notice_chrome_button")}</a>
          </Card.Body>
        </Card>
      </ToastContainer>

      <button className={`${cx('rank-btn')}`} onClick={handleShowRankModal}>{userName}</button>
      {/* <a href={'https://github.com/MycroftKang/Suika#readme'} target='_blank' className={cx('patchLink')}>{GameResult.userName}</a> */}
      <a className={cx('version')} href={'https://github.com/MycroftKang/Suika'}>© Mycroft Kang & Contributors</a>
    </div>
  )
}

export default Intro;
