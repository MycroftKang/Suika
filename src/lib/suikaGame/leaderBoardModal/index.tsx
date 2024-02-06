import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import { GameResult, ScoreInfo } from '../GameResult';


const cx = classNames.bind(styles);

interface LeaderBoardModalProps {
  isVisible: boolean;
  loadUserInfo: boolean;
  bestScore: number;
  onClick: () => void;
}

const LeaderBoardModal = ({ isVisible, loadUserInfo, bestScore, onClick }: LeaderBoardModalProps) => {
  const [myRank, setMyRank] = useState(0);
  const [ready, setReady] = useState(false);
  const [top3, setTop3] = useState<ScoreInfo[]>([]);

  useEffect(() => {
    if (isVisible && loadUserInfo) {
      setReady(false);
      GameResult.loadScoreRankInfo(false).then(() => {
        setMyRank(GameResult.calculateUserRank());
        setTop3(GameResult.getTop3Rank());
        setReady(true);
      });
    }
  }, [isVisible, loadUserInfo])

  if (!isVisible) return null;

  const css = ["gold-bg", "silver-bg", "bronz-bg"];

  return (
    <div className={cx('boardArea')}>
    <div className={cx("scoreboard")}>
      <ul className="list-group">
        <li className={`list-group-item d-flex justify-content-between align-items-center active`} aria-current="true" style={{fontSize: "1.1em", background: "#ff7c27", borderColor: "#ff7c27"}}>
          Ranking
          <div data-bs-theme="dark">
          <button type="button" className="btn-close float-right" aria-label="Close" onClick={onClick}></button>
          </div>
          </li>
        
        {
            ready ? top3.map((data, index) => (<li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
           <div>
                <span className={`badge ${cx(css[index])} rounded-pill ${cx("number-badge")}`}>{index + 1}</span>
                <span className="me-auto">{data.name}</span>
          </div>
          <div className='fw-bold'>
              {data.bestScore}
            </div>
          </li>)) : <li className="list-group-item placeholder-glow">
           <p>
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
            </p>
            </li>
        }
        {/* <li className="list-group-item d-flex justify-content-between align-items-center">
           <div>
            <span className={`badge ${cx("gold-bg")} rounded-pill ${cx("number-badge")}`}>1</span>
              <span className="me-auto">Apple12345</span>
          </div>
          <div className='fw-bold'>
              123454
            </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
           <div>
            <span className={`badge ${cx("silver-bg")} rounded-pill ${cx("number-badge")}`}>2</span>
              <span className="me-auto">Apple1235</span>
          </div>
          <div className='fw-bold'>
              123454
            </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
           <div>
            <span className={`badge ${cx("bronz-bg")} rounded-pill ${cx("number-badge")}`}>3</span>
              <span className="me-auto">Apple12345</span>
          </div>
          <div className='fw-bold'>
              123454
            </div>
        </li> */}
        {ready ? <li className={`list-group-item d-flex justify-content-between align-items-center ${cx("my-rank-list")}`}>
           <div>
              <span className={`badge bg-primary rounded-pill ${cx("my-rank-badge")}`}>{myRank}</span>
              <span className={cx("my-rank-name")}>{GameResult.userName}</span>
          </div>
          <div className='fw-bold' style={{fontSize: "1.2em"}}>
            {bestScore}
          </div>
        </li> : <li className={`list-group-item ${cx("my-rank-list")} placeholder-glow`}>
           <p>
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
            </p>
        </li>}
      </ul>
      </div>
      </div>
  )
}

export default LeaderBoardModal;
