import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface WaterTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}

const WaterText = ({ text, className = "", as: Tag = "h2" }: WaterTextProps) => {
  const { ref, isVisible } = useScrollReveal(0.2);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isVisible && !revealed) setRevealed(true);
  }, [isVisible, revealed]);

  return (
    <div ref={ref} className="relative inline-block">
      <Tag className={`font-display font-black tracking-tighter relative z-10 ${className}`}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block water-char"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0) rotateX(0deg)" : "translateY(30px) rotateX(-90deg)",
              transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 45}ms`,
              animationDelay: `${i * 0.12}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </Tag>

      {/* Ripple rings */}
      {revealed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 40 + i * 60,
                height: 40 + i * 60,
                borderColor: `hsla(190, 90%, 70%, ${0.2 - i * 0.05})`,
                animation: `waterRipple 3s ease-out infinite ${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .water-char {
          color: hsl(var(--foreground));
          text-shadow: 0 0 10px hsla(190, 100%, 70%, 0.2), 0 0 30px hsla(190, 100%, 70%, 0.1);
          animation: waterFloat 2.8s ease-in-out infinite;
        }

        @keyframes waterFloat {
          0%, 100% { transform: translateY(0); text-shadow: 0 0 8px hsla(190, 100%, 70%, 0.2); }
          50% { transform: translateY(-2px); text-shadow: 0 0 16px hsla(190, 100%, 70%, 0.35); }
        }

        @keyframes waterRipple {
          0% { transform: scale(0.4); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WaterText;
