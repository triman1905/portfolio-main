import { useEffect, useRef, useState } from "react";

const FloatingMascot = () => {
  const [pos, setPos] = useState({ x: -60, y: window.innerHeight / 2 });
  const [usingMouse, setUsingMouse] = useState(false);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const vel = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const dirRef = useRef(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setUsingMouse(true);
    };

    // Hide mascot when user switches to touch input
    const handleTouch = () => {
      setUsingMouse(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    const moveInterval = setInterval(() => {
      frame.current += 1;
      setPos((prev) => {
        const targetX = mouse.current.x - 20;
        const targetY = mouse.current.y - 22;
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          vel.current.x += dx * 0.005;
          vel.current.y += dy * 0.005;
          dirRef.current = dx > 0 ? 1 : -1;
        } else {
          vel.current.x *= 0.85;
          vel.current.y *= 0.85;
        }

        const maxSpeed = 3;
        const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
        if (speed > maxSpeed) {
          vel.current.x = (vel.current.x / speed) * maxSpeed;
          vel.current.y = (vel.current.y / speed) * maxSpeed;
        }

        if (Math.abs(vel.current.x) < 0.05) vel.current.x = 0;
        if (Math.abs(vel.current.y) < 0.05) vel.current.y = 0;

        return {
          x: prev.x + vel.current.x,
          y: prev.y + vel.current.y,
        };
      });
    }, 30);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
      clearInterval(moveInterval);
    };
  }, []);

  // Don't render until we detect actual mouse usage
  if (!usingMouse) return null;

  const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
  const isMoving = speed > 0.3;
  const legCycle = isMoving ? Math.sin(frame.current * 0.4) * 12 : 0;

  return (
    <div
      className="fixed z-50 pointer-events-none select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scaleX(${dirRef.current})`,
        transition: "transform 0.2s",
      }}
    >
      <svg width="40" height="44" viewBox="0 0 100 110">
        {/* Body */}
        <ellipse cx="50" cy="60" rx="22" ry="18" fill="white" />
        {/* Head */}
        <circle cx="55" cy="38" r="14" fill="white" />
        {/* Long ears */}
        <ellipse cx="47" cy="14" rx="5" ry="18" fill="white" />
        <ellipse cx="47" cy="14" rx="3" ry="14" fill="#f0e0e8" opacity="0.5" />
        <ellipse cx="60" cy="18" rx="4.5" ry="16" fill="white" transform="rotate(10, 60, 18)" />
        <ellipse cx="60" cy="18" rx="2.5" ry="12" fill="#f0e0e8" opacity="0.5" transform="rotate(10, 60, 18)" />
        {/* Eye */}
        <circle cx="60" cy="36" r="3" fill="#222" />
        <circle cx="61" cy="35" r="1" fill="white" />
        {/* Nose */}
        <circle cx="65" cy="40" r="2" fill="#e8b0b0" />
        {/* Whiskers */}
        <line x1="67" y1="39" x2="80" y2="37" stroke="#ccc" strokeWidth="0.8" />
        <line x1="67" y1="41" x2="80" y2="42" stroke="#ccc" strokeWidth="0.8" />
        {/* Tail */}
        <circle cx="28" cy="55" r="7" fill="white" />
        {/* Front legs */}
        <rect x="58" y="72" width="5" height="14" rx="2.5" fill="white"
          transform={`rotate(${legCycle}, 60, 72)`} />
        <rect x="48" y="72" width="5" height="14" rx="2.5" fill="white"
          transform={`rotate(${-legCycle}, 50, 72)`} />
        {/* Back legs */}
        <rect x="38" y="70" width="5.5" height="15" rx="2.5" fill="#f5f5f5"
          transform={`rotate(${-legCycle * 0.8}, 40, 70)`} />
        <rect x="32" y="70" width="5.5" height="15" rx="2.5" fill="#f5f5f5"
          transform={`rotate(${legCycle * 0.8}, 34, 70)`} />
      </svg>
    </div>
  );
};

export default FloatingMascot;