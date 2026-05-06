import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const FONT_SIZE = 11;
    const COLS = Math.floor(W / FONT_SIZE);
    const drops: number[] = Array(COLS).fill(1).map(() => Math.random() * -20);
    const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ∑∆π";

    let frame: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const alpha = 0.15 + Math.random() * 0.25;
        ctx.fillStyle = `hsla(180, 100%, 65%, ${alpha})`;
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
};

const Footer = () => {
  return (
    <footer className="relative max-w-3xl mx-auto px-6 md:px-8 py-8 border-t border-border overflow-hidden">
      <div className="absolute inset-0" style={{ height: "100%", width: "100%" }}>
        <MatrixRain />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <p
          className="text-xs text-center font-mono tracking-widest"
          style={{
            color: "hsl(180, 100%, 70%)",
            textShadow: "0 0 10px hsl(180, 100%, 70%), 0 0 20px hsl(180, 100%, 50%)",
            animation: "footerPulse 3s ease-in-out infinite",
          }}
        >
          © 2026 Triman Kaur
        </p>
        <p
          className="text-xs text-center font-mono"
          style={{
            color: "hsl(270, 100%, 75%)",
            textShadow: "0 0 8px hsl(270, 100%, 75%)",
            opacity: 0.7,
          }}
        >
          built with ♥ &amp; caffeine
        </p>
      </div>
      <style>{`
        @keyframes footerPulse {
          0%, 100% { text-shadow: 0 0 10px hsl(180,100%,70%), 0 0 20px hsl(180,100%,50%); }
          50% { text-shadow: 0 0 20px hsl(180,100%,80%), 0 0 40px hsl(180,100%,60%), 0 0 60px hsl(180,100%,50%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
