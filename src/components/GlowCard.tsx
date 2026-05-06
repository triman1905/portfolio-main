import { useRef, useState, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlowCard = ({ children, className = "", style }: GlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering && (
        <div
          className="absolute pointer-events-none z-0 transition-opacity duration-300"
          style={{
            width: 200,
            height: 200,
            left: glowPos.x - 100,
            top: glowPos.y - 100,
            background: "radial-gradient(circle, hsl(180 100% 50% / 0.15), transparent 70%)",
            borderRadius: "50%",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowCard;
