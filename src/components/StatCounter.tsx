import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

const STATS: Stat[] = [
  { label: "Hackathons", value: 5, suffix: "+", icon: "🏆" },
  { label: "Projects Built", value: 15, suffix: "+", icon: "🚀" },
  { label: "Internships", value: 4, suffix: "", icon: "💼" },
  { label: "Cups of Coffee", value: 999, suffix: "+", icon: "☕" },
];

const useCountUp = (target: number, duration: number, active: boolean) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
};

const StatItem = ({ stat, delay }: { stat: Stat; delay: number }) => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const count = useCountUp(stat.value, 1800, isVisible);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center gap-1 p-4 rounded-xl border transition-all duration-500 cursor-default select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.9)",
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        borderColor: hovered ? "hsl(180, 100%, 60%)" : "hsl(var(--border))",
        background: hovered
          ? "radial-gradient(ellipse at center, hsl(180 100% 50% / 0.07) 0%, transparent 70%)"
          : "hsl(var(--secondary) / 0.4)",
        boxShadow: hovered ? "0 0 20px hsl(180 100% 50% / 0.2)" : "none",
      }}
    >
      <span className="text-2xl">{stat.icon}</span>
      <div
        className="text-3xl font-bold font-mono tabular-nums"
        style={{
          color: "hsl(180, 100%, 70%)",
          textShadow: hovered
            ? "0 0 12px hsl(180, 100%, 70%), 0 0 24px hsl(180, 100%, 50%)"
            : "0 0 6px hsl(180, 100%, 70% / 0.5)",
          transition: "text-shadow 0.3s",
        }}
      >
        {count}{stat.suffix}
      </div>
      <p className="text-xs text-muted-foreground font-medium text-center">{stat.label}</p>
    </div>
  );
};

const StatCounter = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal(0.2);

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 py-8">
      <h2
        ref={titleRef}
        className="text-xl font-display font-bold text-foreground mb-6 tracking-wide"
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        📊 By the Numbers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} delay={i * 120} />
        ))}
      </div>
    </section>
  );
};

export default StatCounter;
