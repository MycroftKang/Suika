import {Fruit} from '../object/Fruit';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import { GameResult } from "../GameResult";

const cx = classNames.bind(styles);

interface IntroProps {
  isVisible: boolean;
  loadUserInfo: boolean;
  handleGameStart: () => void;
  handleShowRankModal: () => void;
}

const Intro = ({isVisible, loadUserInfo,handleGameStart, handleShowRankModal}: IntroProps) => {
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

  return (
    <div className={cx('introArea')}>
      <ul className={cx('listWrap')}>{fruitItemEls}</ul>

      <div className={cx('titleArea')}>
        <button className={cx('btn')} onClick={onClick}>GAME START</button>
      </div>

      <button className={`${cx('rank-btn')}`} onClick={handleShowRankModal}>{userName}</button>
      {/* <a href={'https://github.com/koreacat/suika-game#readme'} target='_blank' className={cx('patchLink')}>{GameResult.userName}</a> */}
      {/* <span className={cx('version')}>v1.0.5</span> */}
    </div>
  )
}

export default Intro;
