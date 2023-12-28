import confetti from 'canvas-confetti';

const useConfetti = () => {
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 1 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 90,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 90,
    });
    fire(0.35, {
      spread: 90,
      startVelocity: 75,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 90,
      startVelocity: 55,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 90,
      startVelocity: 75,
    });
  };

  const fireRapidStarConfetti = () => {
    const end = Date.now() + (5 * 1000);
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 80,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 100,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  return {
    fireConfetti,
    fireRapidStarConfetti
  }
}

export default useConfetti;