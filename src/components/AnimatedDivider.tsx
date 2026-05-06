import { useScrollReveal } from "@/hooks/useScrollReveal";

const AnimatedDivider = () => {
  const { ref, isVisible } = useScrollReveal(0.3);

  return (
    <div ref={ref} className="relative h-px w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--neon)), hsl(180 100% 50%), hsl(var(--neon)), transparent)",
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(180 100% 70% / 0.6), transparent)",
          filter: "blur(4px)",
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        }}
      />
    </div>
  );
};

export default AnimatedDivider;
