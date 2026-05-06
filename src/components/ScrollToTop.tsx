import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Orbit ring canvas animation
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const SIZE = 56;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2 - 4;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      angleRef.current += hovered ? 0.06 : 0.025;
      const a = angleRef.current;

      // Orbit track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "hsla(180, 100%, 70%, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glowing arc
      const arcLen = hovered ? Math.PI * 1.5 : Math.PI * 0.9;
      const grad = ctx.createConicalGradient
        ? null // fallback below
        : null;
      ctx.beginPath();
      ctx.arc(cx, cy, r, a, a + arcLen);
      ctx.strokeStyle = "hsla(180, 100%, 70%, 0.85)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "hsl(180, 100%, 70%)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Orbiting dot
      const dotX = cx + r * Math.cos(a + arcLen);
      const dotY = cy + r * Math.sin(a + arcLen);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(180, 100%, 80%)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(180, 100%, 70%)";
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, hovered]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ width: 56, height: 56 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: 56, height: 56 }}
      />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: hovered
            ? "radial-gradient(circle, hsl(180 100% 70% / 0.2) 0%, hsl(180 100% 70% / 0.05) 100%)"
            : "hsl(var(--secondary))",
          border: "1px solid hsl(var(--border))",
          boxShadow: hovered
            ? "0 0 20px hsl(180 100% 50% / 0.4), 0 0 40px hsl(180 100% 50% / 0.15), inset 0 0 10px hsl(180 100% 70% / 0.1)"
            : "none",
        }}
      >
        <ArrowUp
          className="w-5 h-5 transition-colors duration-300"
          style={{ color: hovered ? "hsl(180, 100%, 70%)" : "hsl(var(--muted-foreground))" }}
        />
      </button>
    </div>
  );
};

export default ScrollToTop;
