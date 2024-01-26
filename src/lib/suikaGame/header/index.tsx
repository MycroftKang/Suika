import { Fruit, SpecialItem } from '../object/Fruit';
import { getRenderWidth } from '../object/Size';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import { useState } from 'react';

const cx = classNames.bind(styles);

let lastBombItemCount: number;

interface HeaderProps {
  bestScore: number;
  score: number;
  bombItemCount: number;
  nextItem: null | Fruit | SpecialItem;
  onClick: () => void;
  isStart: boolean;
}

const Header = ({ score, bestScore, bombItemCount, nextItem, onClick, isStart }: HeaderProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getBestScore = () => {
    return score > bestScore ? score : bestScore;
  }

  let bombItemClass = 'bg-secondary';

  if (bombItemCount >= 50) {
    bombItemClass = 'bg-success';
  } else if (bombItemCount > 0) {
    bombItemClass = 'bg-danger';
  }
  
  
  if (isStart) { 
    if ((lastBombItemCount != undefined && bombItemCount > lastBombItemCount)) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
    
    lastBombItemCount = bombItemCount;
  }

  return (
    <div className={cx('headerArea')} style={{ maxWidth: getRenderWidth() + 4 }}>
      <div className={cx('bestScoreArea')}>
        <span className={cx('text')}>BEST</span>
        <span className={cx('number')}>{getBestScore()}</span>
      </div>
      <div className={cx('scoreArea')}>
        <span className={cx('score')}>{score}</span>
      </div>
      <div className={cx('itemArea')}>
        <div className={cx('next')}>
          <button className={`${cx('itemBtn')} ${isAnimating ? cx('zoom-in-out'): ''}`} onClick={onClick}>
            <img className={cx('img')} src={require('../../../resource/BOMB.png')}></img>
            <span id='itemBadge' className={`position-absolute start-100 translate-middle badge rounded-pill ${bombItemClass}`} style={{fontSize: "0.6em", top:"85%"}}>
              {bombItemCount}
              <span className="visually-hidden">Bomb</span>
            </span>
          </button>
        </div>
      </div>
      <div className={cx('nextArea')}>
        <span className={cx('text')}>NEXT</span>
        <div className={cx('next')}>
          <span className={cx('img')} style={{ backgroundImage: `url(${require('../../../resource/' + nextItem + '.png')})` }} />
        </div>
      </div>
    </div>
  )
}

export default Header;
