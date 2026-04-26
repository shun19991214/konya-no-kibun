const REVEAL_COLORS = ["#F97316", "#FBBF24", "#EF4444", "#10B981", "#6366F1"];

export async function fireRevealConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.5 },
    colors: REVEAL_COLORS,
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.5 },
    colors: REVEAL_COLORS,
  });
}
