import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import useMatterJS from "./useMatterJS";
import { Fruit, SpecialItem, getRandomFruitFeature } from './object/Fruit';
import GameOverModal from './gameOverModal';
import Intro from './intro';
import Header from './header';

const cx = classNames.bind(styles);

const SuikaGame = () => {
  const [bestScore, setBestScore] = useState(0);
  const [score, setScore] = useState(0);
  const [bombItemCount, setBombItemCount] = useState<number>(0);
  const [nextItem, setNextItem] = useState<Fruit | SpecialItem>(getRandomFruitFeature()?.label as Fruit | SpecialItem);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { clear, createFixedItem } = useMatterJS({ score, setScore, bombItemCount, setBombItemCount, nextItem, setNextItem, isGameOver, setIsGameOver });

  useEffect(() => {
    const bestScore = localStorage.getItem('bestScore');
    if (bestScore) setBestScore(Number(bestScore));

    const bombCount = localStorage.getItem('cumBombCount');
    if (bombCount) setBombItemCount(Number(bombCount));
  }, [isGameOver]);

  useEffect(() => {
    if (bombItemCount > 99) {
      setBombItemCount(99);
      return;
    }
    localStorage.setItem('cumBombCount', bombItemCount.toString());
  }, [bombItemCount]);

  useEffect(() => {
    if(isGameOver) {
      const bestScore = localStorage.getItem('bestScore') || 0;
      if (score > Number(bestScore)) {
        localStorage.setItem('bestScore', score.toString());
        localStorage.setItem('bestScoreUpdatedAt', new Date().getTime().toString());
      }
    }
  }, [isGameOver]);

  const handleTryAgain = () => {
    setScore(0);
    // setBombItemCount(0);
    setNextItem(getRandomFruitFeature()?.label as Fruit);
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

  return (
    <div className={cx('gameArea')}>
      <div className={cx('gameWrap')} style={{ visibility: isStart ? 'visible' : 'hidden'}}>
        <div className={cx('canvasArea')}>
          <Header bestScore={bestScore} score={score} bombItemCount={bombItemCount} nextItem={nextItem} onClick={handleBombItem} isStart={isStart} />
          <div id={'canvasWrap'} className={cx('canvasWrap')}/>
        </div>
      </div>

      <Intro isVisible={!isStart} handleGameStart={handleGameStart}/>
      <GameOverModal isVisible={isGameOver} onClick={handleTryAgain} score={score} />
    </div>
  )
}

export default SuikaGame;
