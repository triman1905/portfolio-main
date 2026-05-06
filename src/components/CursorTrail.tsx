import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const sparks: Spark[] = [];
    let frame: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 1,
          maxLife: 25 + Math.random() * 20,
          size: 1.5 + Math.random() * 2.5,
          hue: Math.random() > 0.5 ? 180 : 270 + Math.random() * 30,
        });
      }
      // Cap sparks
      if (sparks.length > 200) sparks.splice(0, sparks.length - 200);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // gravity
        s.vx *= 0.98;
        s.life -= 1 / s.maxLife;

        if (s.life <= 0) { sparks.splice(i, 1); continue; }

        const alpha = s.life * 0.9;
        const radius = s.size * s.life;

        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 72%, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 72%, ${alpha * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9990, opacity: 0.85 }}
    />
  );
};

export default CursorTrail;
