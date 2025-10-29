import confetti from "canvas-confetti";

export function ConfettiFireworks() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 20, spread: 360, ticks: 30 };
  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;
  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 60;
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 300);
}

export function ConfettiSideCannons() {
  const end = Date.now() + 3 * 1000;
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 60,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
      ticks: 30,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 60,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
      ticks: 40,
    });
    requestAnimationFrame(frame);
  };
  frame();
}

export function randomCelebration() {
  const number = Math.random();
  if (true) {
    ConfettiFireworks();
  } else {
    ConfettiSideCannons();
  }
}
