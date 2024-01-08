import { useState } from 'react';
import styles from './index.module.scss';
import classNames from "classnames/bind";
import html2canvas from 'html2canvas';


const cx = classNames.bind(styles);

interface GameOverModalProps {
  isVisible: boolean;
  onClick: () => void;
  score: number;
}

let timeout: NodeJS.Timeout | null = null;

const GameOverModal = ({ isVisible, onClick, score }: GameOverModalProps) => {
  const [toastVisible, setToastVisible] = useState(false);

  if (!isVisible) return null;

  const target = document.querySelector("#canvasWrap > canvas") as HTMLElement;

  if (target) {
    html2canvas(target, {allowTaint:true,  backgroundColor:"#cfa76f"}).then((canvas) => {
      let dtag = document.getElementById("gframe");

      canvas.style.width = "60%";
      canvas.style.borderRadius = "9px";
      canvas.style.removeProperty("height");
      if (dtag) {
        dtag.innerHTML = '';
        dtag.appendChild(canvas);
      }
    })
  }


  const share = () => {

    if (navigator.share) {
      navigator.share({
        title: '수박 만들기 게임',
        text: '과일들을 모아 수박을 만들어보세요.',
        url: 'https://game.mulgyeol.com/',
      })
        .then(() => console.log('done'))
        .catch((error) => console.log(error));
    } else {
      timeout && clearTimeout(timeout);

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

      setToastVisible(true);
      timeout = setTimeout(() => {
        setToastVisible(false);
      }, 2800)
    }
  }

  return (
    <div className={cx('gameOverArea')}>
      <span className={cx('text')}>GAME OVER</span>
      <span className={cx('score')}>SCORE: {score}</span>
      <div id='gframe' className={cx('gframe')}></div>
      <button className={cx('btn')} onClick={onClick}>↻ TRY AGAIN</button>
      <div className={cx('linkArea')}>
        {/* <a href={'https://forms.gle/QbPDG6rzT4spywyf6'} target='_blank' className={cx('formsLink')}>의견 남기기</a> */}
        <button className={cx('shareaBtn')} onClick={share}>공유하기</button>
      </div>
      <div className={cx('toastArea', { show: toastVisible })}>🍉URL이 복사되었습니다.</div>
    </div>
  )
}

export default GameOverModal;
