import { useEffect, useRef, useState } from "react";
import avatarGirl from "@/assets/avatar-girl.png";

const INTRO_FADE_START = 1800;
const INTRO_END = 2800;

type IntroPhase = "waiting" | "intro" | "fadeout" | "done";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<IntroPhase>("waiting");
  const [avatarReady, setAvatarReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.src = avatarGirl;
    const markReady = () => { if (!cancelled) setAvatarReady(true); };
    if (image.complete) markReady();
    else { image.onload = markReady; image.onerror = markReady; }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!avatarReady) return;
    setPhase("intro");
    const fadeTimer = window.setTimeout(() => setPhase("fadeout"), INTRO_FADE_START);
    const doneTimer = window.setTimeout(() => { setPhase("done"); onComplete(); }, INTRO_END);
    return () => { window.clearTimeout(fadeTimer); window.clearTimeout(doneTimer); };
  }, [avatarReady, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let w = window.innerWidth, h = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      size: 0.6 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 0.002,
      speedY: -0.001 - Math.random() * 0.003,
      alpha: 0.1 + Math.random() * 0.5,
      hue: Math.random() > 0.5 ? 180 : 280,
    }));

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 6,
      rx: 100 + Math.random() * 160,
      ry: 70 + Math.random() * 110,
      size: 30 + Math.random() * 50,
      speed: 0.4 + Math.random() * 0.4,
      hue: [180, 280, 320, 200, 260, 340][i],
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const time = t * 0.0008;
      const cx = w / 2, cy = h * 0.52;

      const bg = ctx.createRadialGradient(w / 2, h * 0.25, 30, w / 2, h / 2, Math.max(w, h) * 0.75);
      bg.addColorStop(0, "hsla(260, 60%, 12%, 1)");
      bg.addColorStop(0.5, "hsla(240, 60%, 6%, 1)");
      bg.addColorStop(1, "hsla(220, 70%, 3%, 1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        p.x = (p.x + p.speedX + 1) % 1;
        p.y = (p.y + p.speedY + 1) % 1;
        const flicker = 0.5 + 0.5 * Math.sin(t * 0.003 + p.x * 10);
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size * flicker, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha * flicker})`;
        ctx.fill();
      });

      orbs.forEach((orb, i) => {
        const a = time * orb.speed + orb.angle;
        const x = cx + Math.cos(a) * orb.rx;
        const y = cy + Math.sin(a) * orb.ry;
        const g = ctx.createRadialGradient(x, y, 0, x, y, orb.size);
        g.addColorStop(0, `hsla(${orb.hue}, 100%, 75%, 0.6)`);
        g.addColorStop(0.4, `hsla(${orb.hue}, 100%, 60%, 0.2)`);
        g.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        if (i < 3) {
          ctx.save();
          ctx.strokeStyle = `hsla(${orb.hue}, 100%, 70%, 0.1)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(cx, cy, orb.rx, orb.ry, a * 0.15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
      cg.addColorStop(0, "hsla(280, 100%, 72%, 0.18)");
      cg.addColorStop(0.4, "hsla(180, 100%, 72%, 0.1)");
      cg.addColorStop(1, "transparent");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, w, h);

      const fg = ctx.createRadialGradient(cx, h * 0.85, 0, cx, h * 0.85, 300);
      fg.addColorStop(0, "hsla(280, 100%, 60%, 0.12)");
      fg.addColorStop(1, "transparent");
      ctx.fillStyle = fg;
      ctx.fillRect(0, 0, w, h);

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div
          className="relative"
          style={{
            width: "clamp(240px, 38vw, 400px)",
            opacity: avatarReady ? 1 : 0,
            transform: phase === "waiting"
              ? "translate3d(0, 12vh, 0) scale(0.7)"
              : phase === "fadeout"
                ? "translate3d(0, -5vh, 0) scale(1.1)"
                : "translate3d(0, 0, 0) scale(1)",
            transition: "opacity 0.5s ease-out, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Aura glow */}
          <div
            className="absolute inset-[-20%] rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(280, 100%, 65%, 0.3), hsla(180, 100%, 65%, 0.15) 45%, transparent 70%)",
              filter: "blur(30px)",
              animation: "introAura 2.5s ease-in-out infinite",
            }}
          />

          {/* Rotating rings */}
          <div className="absolute left-1/2 top-1/2 rounded-full" style={{
            width: "130%", height: "130%", transform: "translate(-50%, -50%)",
            border: "1px solid hsla(180, 100%, 75%, 0.12)",
            animation: "orbitRing 8s linear infinite",
          }} />
          <div className="absolute left-1/2 top-1/2 rounded-full" style={{
            width: "105%", height: "115%", transform: "translate(-50%, -50%)",
            border: "1px solid hsla(280, 100%, 70%, 0.1)",
            animation: "orbitRingReverse 6s linear infinite",
          }} />
          <div className="absolute left-1/2 top-1/2 rounded-full" style={{
            width: "150%", height: "90%", transform: "translate(-50%, -50%)",
            border: "1px dashed hsla(180, 100%, 80%, 0.06)",
            animation: "orbitRing 14s linear infinite",
          }} />

          {/* Neon sweep */}
          <div className="absolute inset-y-[15%] left-[-25%] right-[-25%]" style={{
            background: "linear-gradient(90deg, transparent, hsla(280, 100%, 75%, 0.4), hsla(180, 100%, 75%, 0.4), transparent)",
            filter: "blur(16px)",
            animation: "scanSweep 3s ease-in-out infinite",
            mixBlendMode: "screen",
          }} />

          {/* Dancing avatar with expressive movement like the boy character */}
          <div
            className="relative z-10"
            style={{
              animation: "girlHeadTilt 4s ease-in-out infinite",
            }}
          >
            <img
              src={avatarGirl}
              alt="Animated intro avatar"
              width={720} height={900}
              draggable={false}
              className="block h-auto w-full select-none"
              style={{
                filter: "drop-shadow(0 0 20px hsla(280, 100%, 70%, 0.4)) drop-shadow(0 0 50px hsla(180, 100%, 70%, 0.3))",
                animation: "girlBodyDance 2.4s ease-in-out infinite, girlBounce 1.2s ease-in-out infinite",
                transformOrigin: "center bottom",
              }}
            />
          </div>

          {/* Floor glow */}
          <div className="absolute inset-x-[5%] bottom-[0%] h-14 rounded-full" style={{
            background: "radial-gradient(ellipse, hsla(280, 100%, 65%, 0.3), hsla(180, 100%, 70%, 0.15) 50%, transparent 80%)",
            filter: "blur(20px)",
            animation: "shadowPulse 0.6s ease-in-out infinite",
          }} />

          {/* Sparkle dots */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              left: `${8 + (i * 7.5) % 84}%`,
              top: `${5 + (i * 8.3) % 85}%`,
              background: `hsla(${i % 2 === 0 ? 180 : 280}, 100%, 80%, 0.8)`,
              animation: `sparkle ${1.2 + (i % 3) * 0.6}s ease-in-out infinite ${(i * 0.25) % 2}s`,
            }} />
          ))}

          {/* Energy pulse rings */}
          {[0, 1, 2].map(i => (
            <div key={`pulse-${i}`} className="absolute left-1/2 top-1/2 rounded-full pointer-events-none" style={{
              width: `${80 + i * 30}%`,
              height: `${80 + i * 30}%`,
              transform: "translate(-50%, -50%)",
              border: "1px solid hsla(180, 100%, 80%, 0.15)",
              animation: `energyPulse 2s ease-out infinite ${i * 0.5}s`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes girlBodyDance {
          0%, 100% { transform: translateX(0) rotate(0deg) scaleY(1); }
          25% { transform: translateX(6px) rotate(1.5deg) scaleY(0.98); }
          50% { transform: translateX(-6px) rotate(-1.5deg) scaleY(1); }
          75% { transform: translateX(4px) rotate(1deg) scaleY(0.99); }
        }

        @keyframes girlHeadTilt {
          0%, 100% { transform: perspective(800px) rotateY(0deg) rotateZ(0deg); }
          33% { transform: perspective(800px) rotateY(3deg) rotateZ(1deg); }
          66% { transform: perspective(800px) rotateY(-3deg) rotateZ(-1deg); }
        }

        @keyframes girlBounce {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -10px; }
        }

        @keyframes introAura {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        @keyframes scanSweep {
          0% { transform: translateX(-130%) skewX(-15deg); opacity: 0; }
          15% { opacity: 0.2; }
          50% { opacity: 0.6; }
          100% { transform: translateX(130%) skewX(-15deg); opacity: 0; }
        }

        @keyframes orbitRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes orbitRingReverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }

        @keyframes shadowPulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.85); }
          50% { opacity: 0.8; transform: scaleX(1.15); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes energyPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;