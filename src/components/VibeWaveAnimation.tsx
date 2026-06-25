import { useRef, useEffect } from 'react';

interface VibeWaveAnimationProps {
  healthState: 'Shining' | 'Balance' | 'Tension' | 'Overload' | string;
  healthScore: number;
}

const PALETTES: Record<string, string[]> = {
  Shining: ['#E6B85C', '#A8D5E5', '#7A9BBA'],
  Balance: ['#34C759', '#2ecc71', '#27ae60'],
  Tension: ['#FF9F0A', '#f39c12', '#e67e22'],
  Overload: ['#FF453A', '#e74c3c', '#c0392b'],
};

export default function VibeWaveAnimation({ healthState, healthScore }: VibeWaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = PALETTES[healthState] || PALETTES.Balance;
    const amp = 6 + (healthScore / 100) * 18;
    const speed = 0.006 + (1 - healthScore / 100) * 0.02;

    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += speed;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.filter = 'blur(40px)';

      const waveCount = 4;
      for (let wv = 0; wv < waveCount; wv++) {
        ctx.beginPath();
        const alpha = 0.2 - wv * 0.04;
        ctx.fillStyle = palette[wv % palette.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0');

        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 3) {
          const phase = x * 0.015 + time + wv * 1.8;
          const y = h / 2 + Math.sin(phase) * (amp + wv * 5) + Math.sin(phase * 1.5 + wv * 0.7) * (amp * 0.35) + Math.cos(phase * 0.7 + wv) * (amp * 0.2);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [healthState, healthScore]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
