import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, frame = 0;
    const FLEE_RADIUS = 120;
    const FLEE_STRENGTH = 4.5;
    const MAX_SPEED = 2.5;
    const COLORS = ["180, 100%, 70%", "270, 100%, 75%", "160, 100%, 65%"];

    const particles: {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number; pulse: number; color: string;
    }[] = [];

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

    const init = () => {
      resize();
      const count = Math.min(70, Math.floor((w * h) / 15000));
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: 1 + Math.random() * 2.2,
          alpha: 0.15 + Math.random() * 0.45,
          pulse: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < FLEE_RADIUS && dist > 0) {
          const force = (1 - dist / FLEE_RADIUS) * FLEE_STRENGTH;
          p.vx += (dx / dist) * force * 0.12;
          p.vy += (dy / dist) * force * 0.12;
        }
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) { p.vx = (p.vx / speed) * MAX_SPEED; p.vy = (p.vy / speed) * MAX_SPEED; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        p.pulse += 0.018;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.color}, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${a})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.09 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    init();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.65 }} />;
};

export default ParticleBackground;
