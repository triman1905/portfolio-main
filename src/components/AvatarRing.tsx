import { useEffect, useRef } from "react";

const AvatarRing = ({ size = 96 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const S = size + 20; // canvas is slightly larger than avatar
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = S / 2, cy = S / 2;
    const R = size / 2 + 4; // orbit radius just outside avatar

    let angle = 0;
    let frame: number;

    const dots = Array.from({ length: 8 }, (_, i) => ({
      offset: (i / 8) * Math.PI * 2,
      size: i % 3 === 0 ? 3 : 1.8,
      hue: i % 2 === 0 ? 180 : 270,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      angle += 0.018;

      // Faint orbit track
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "hsla(180, 100%, 70%, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Spinning arc segment
      ctx.beginPath();
      ctx.arc(cx, cy, R, angle, angle + Math.PI * 1.2);
      ctx.strokeStyle = "hsla(180, 100%, 70%, 0.7)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(180, 100%, 70%)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Counter arc (purple)
      ctx.beginPath();
      ctx.arc(cx, cy, R, -angle * 0.6, -angle * 0.6 + Math.PI * 0.5);
      ctx.strokeStyle = "hsla(270, 100%, 75%, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "hsl(270, 100%, 75%)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Orbiting dots
      for (const dot of dots) {
        const a = angle + dot.offset;
        const dx = cx + R * Math.cos(a);
        const dy = cy + R * Math.sin(a);
        ctx.beginPath();
        ctx.arc(dx, dy, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dot.hue}, 100%, 72%, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsl(${dot.hue}, 100%, 70%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
      }}
    />
  );
};

export default AvatarRing;
