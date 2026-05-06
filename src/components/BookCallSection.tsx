import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedDivider from "@/components/AnimatedDivider";

const OrbitButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 220;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = SIZE / 2, cy = SIZE / 2;

    const orbitDots = Array.from({ length: 5 }, (_, i) => ({
      angle: (i / 5) * Math.PI * 2,
      radius: 92 + (i % 2) * 10,
      size: 2 + (i % 3),
      speed: 0.008 + i * 0.003,
      hue: i % 2 === 0 ? 180 : 270,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const isHov = hoverRef.current;
      const speed = isHov ? 3 : 1;

      // Outer orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, 92, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(180, 100%, 70%, ${isHov ? 0.25 : 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, 102, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(270, 100%, 75%, ${isHov ? 0.15 : 0.06})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Spinning arc
      angleRef.current += 0.015 * speed;
      const arcStart = angleRef.current;
      const arcLen = isHov ? Math.PI * 1.8 : Math.PI * 1.1;

      ctx.beginPath();
      ctx.arc(cx, cy, 92, arcStart, arcStart + arcLen);
      ctx.strokeStyle = `hsla(180, 100%, 70%, ${isHov ? 0.9 : 0.5})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = isHov ? 18 : 8;
      ctx.shadowColor = "hsl(180, 100%, 70%)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Counter-rotating arc (purple)
      const arcStart2 = -angleRef.current * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 102, arcStart2, arcStart2 + Math.PI * 0.6);
      ctx.strokeStyle = `hsla(270, 100%, 75%, ${isHov ? 0.7 : 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(270, 100%, 75%)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Orbiting dots
      for (const dot of orbitDots) {
        dot.angle += dot.speed * speed;
        const dx = cx + dot.radius * Math.cos(dot.angle);
        const dy = cy + dot.radius * Math.sin(dot.angle);
        ctx.beginPath();
        ctx.arc(dx, dy, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dot.hue}, 100%, 72%, ${isHov ? 0.9 : 0.5})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${dot.hue}, 100%, 70%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <a
        href="https://cal.com/triman.py/30min"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => { setHovered(true); hoverRef.current = true; }}
        onMouseLeave={() => { setHovered(false); hoverRef.current = false; }}
        className="relative z-10 flex flex-col items-center justify-center gap-2 w-36 h-36 rounded-full border-2 transition-all duration-500 group"
        style={{
          borderColor: hovered ? "hsl(180, 100%, 60%)" : "hsl(var(--border))",
          background: hovered
            ? "radial-gradient(circle, hsl(180 100% 50% / 0.15) 0%, hsl(180 100% 50% / 0.03) 100%)"
            : "hsl(var(--secondary))",
          boxShadow: hovered
            ? "0 0 30px hsl(180 100% 50% / 0.4), 0 0 60px hsl(180 100% 50% / 0.15), inset 0 0 20px hsl(180 100% 70% / 0.08)"
            : "0 0 8px hsl(180 100% 50% / 0.1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        <span className="text-3xl">📅</span>
        <span
          className="text-sm font-semibold text-center leading-tight px-2 transition-colors duration-300"
          style={{ color: hovered ? "hsl(180, 100%, 70%)" : "hsl(var(--foreground))" }}
        >
          Book a Free Call
        </span>
      </a>
    </div>
  );
};

const BookCallSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section ref={ref} className="max-w-3xl mx-auto px-6 md:px-8 py-12">
      <div
        className="flex flex-col items-center text-center gap-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <p className="text-muted-foreground text-base italic max-w-sm">
          If you've read this far, you might be interested in what I do.
        </p>
        <OrbitButton />
      </div>
    </section>
  );
};

export default BookCallSection;
