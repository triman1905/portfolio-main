import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrambleText } from "@/hooks/useScrambleText";

interface ScrambleHeadingProps {
  children: string;
  className?: string;
  threshold?: number;
  style?: React.CSSProperties;
}

const ScrambleHeading = ({ children, className = "", threshold = 0.2, style }: ScrambleHeadingProps) => {
  const { ref, isVisible } = useScrollReveal(threshold);
  const displayed = useScrambleText(children, isVisible, 38);

  return (
    <h2
      ref={ref}
      className={`text-xl font-display font-bold text-foreground tracking-wide ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {displayed}
    </h2>
  );
};

export default ScrambleHeading;
