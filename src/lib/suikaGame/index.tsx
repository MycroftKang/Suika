import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import useMatterJS from "./useMatterJS";
import { gameResult } from "./useMatterJS";
import { Fruit, SpecialItem, getRandomFruitFeature } from './object/Fruit';
import GameOverModal from './gameOverModal';
import Intro from './intro';
import Header from './header';
import { GameResult } from './GameResult';
import LeaderBoardModal from './leaderBoardModal';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);
let startBombCount: number | undefined;

const SuikaGame = () => {
  const { t } = useTranslation();
  
  const [bestScore, setBestScore] = useState(0);
  const [score, setScore] = useState(0);
  const [bombItemCount, setBombItemCount] = useState<number>(0);
  const [nextItem, setNextItem] = useState<Fruit | SpecialItem>(getRandomFruitFeature()?.label as Fruit | SpecialItem);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isShowRank, setIsShowRank] = useState<boolean>(false);
  const [loadUserInfo, setLoadUserInfo] = useState<boolean>(false);
  const [loadedUserInfo, setLoadedUserInfo] = useState<boolean>(false);

  const { clear, createFixedItem } = useMatterJS({ score, setScore, bombItemCount, setBombItemCount, nextItem, setNextItem, isGameOver, setIsGameOver });

  useEffect(() => {
    const bestScore = localStorage.getItem('bestScore');
    if (bestScore) setBestScore(Number(bestScore));

    const bombCount = localStorage.getItem('cumBombCount');
    if (bombCount) setBombItemCount(Number(bombCount));

    if (startBombCount === undefined)
    {
      startBombCount = Number(bombCount);
    }
  }, [isGameOver]);

  useEffect(() => {
    const task = async () => {
      if (!GameResult.isNewUser()) {
        setLoadUserInfo(true);
        await GameResult.loadUserInfo();
        setLoadedUserInfo(true);
      }
    }
    task();
  }, []);

  useEffect(() => {
    if (isStart) {
      if (bombItemCount > 50) {
        setBombItemCount(50);
        return;
      }

      localStorage.setItem('cumBombCount', bombItemCount.toString());
    }
  }, [bombItemCount]);

  useEffect(() => {
    if(isGameOver) {
      const bestScore = localStorage.getItem('bestScore') || 0;
      
      if (score > Number(bestScore)) {
        localStorage.setItem('bestScore', score.toString());
        localStorage.setItem('bestScoreUpdatedAt', new Date().getTime().toString());
      }

      gameResult?.gameOver(score, bombItemCount);

      if (loadedUserInfo) {
        gameResult?.send().then(() => {
          if (score > Number(bestScore)) {
            setIsShowRank(true);
          }
        });
      } else if (!loadUserInfo && GameResult.isNewUser()) {
        setLoadUserInfo(true);
        GameResult.loadUserInfo().then(() => {
          setLoadedUserInfo(true);
          gameResult?.send().then(() => {
            if (score > Number(bestScore)) {
              setIsShowRank(true);
            }
          });
        });
      }

      gtag("event", "game_over", {
        "score": score,
        "bestScore": score > Number(bestScore) ? score : Number(bestScore),
        "bombCount": bombItemCount,
        "bombCountAtStart": startBombCount,
        "userAgent": navigator.userAgent,
        "date": new Date(),
      })
    }
  }, [isGameOver]);

  const handleTryAgain = () => {
    setScore(0);
    // setBombItemCount(0);
    // setNextItem(getRandomFruitFeature(true)?.label as Fruit);
    startBombCount = undefined;
    setIsGameOver(false);
    clear();
  }

  const handleBombItem = () => {
    if (bombItemCount > 0) {
      if (createFixedItem(SpecialItem.BOMB)) {
        setBombItemCount(prev => prev - 1);
      }
    }
  }

  const handleGameStart = () => {
    setIsStart(true);
  }
  
  const handleCloseRankModal = () => {
    setIsShowRank(false);
  }
  
  const handleShowRankModal = () => {
    if (loadedUserInfo) {
      setIsShowRank(true);
    } else if (!loadUserInfo && GameResult.isNewUser()) {
      setLoadUserInfo(true);
      GameResult.loadUserInfo().then(() => {
        setLoadedUserInfo(true);
        setIsShowRank(true);
      });
    }
  }

  const getBestScore = () => {
    return score > bestScore ? score : bestScore;
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: t("meta.title") as string,
        text: t("meta.description") as string,
        url: 'https://game.mulgyeol.com/',
      })
        .then(() => console.log('done'))
        .catch((error) => console.log(error));
    } else {
      const urlToCopy = window.location.href;

      // Clipboard API를 지원하는지 확인
      if (document.queryCommandSupported("copy")) {
        const input = document.createElement("input");
        input.value = urlToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      } else {
        navigator.clipboard.writeText(urlToCopy)
      }
    }
  }

  return (
    <>
    <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="title" content={t("meta.title") as string} />
        <meta name="description" content={t("meta.description") as string} />
        <meta name="keywords" content={t("meta.keywords") as string} />
        <meta property="og:title" content={t("meta.title") as string} />
        <meta property="og:description" content={t("meta.description") as string} />
    </Helmet>
    <div className={cx('gameArea')}>
      <div className={`${cx('shareButton')} top-0 end-0 p-3`} style={{position: "absolute", zIndex: 1, pointerEvents: "auto", display: !isStart ? "block" : "none"}}>
        <button type="button" className='btn' onClick={share} style={{width: "1.8em", height: "1.8em", padding: 0, opacity: "0.85"}}>
        <img src="/share.svg" className="" alt="" style={{width: "1.8em"}}/>
        </button>
      </div>
      <div className={cx('gameWrap')} style={{ visibility: isStart ? 'visible' : 'hidden'}}>
        <div className={cx('canvasArea')}>
          <Header bestScore={bestScore} score={score} bombItemCount={bombItemCount} nextItem={nextItem} onClick={handleBombItem} isStart={isStart} />
          <div id={'canvasWrap'} className={cx('canvasWrap')}/>
        </div>
      </div>

      <Intro isVisible={!isStart} loadedUserInfo={loadedUserInfo} handleGameStart={handleGameStart} handleShowRankModal={handleShowRankModal} />
      <GameOverModal isVisible={isGameOver} onClick={handleTryAgain} score={score} />
      <LeaderBoardModal isVisible={isShowRank} loadUserInfo={loadedUserInfo} bestScore={getBestScore()} onClick={handleCloseRankModal}></LeaderBoardModal>
      </div>
    </>
  )
}

export default SuikaGame;
