import { useEffect, useRef, useState } from "react";

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If element is already in viewport on mount, mark visible immediately
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight + 50 &&
      rect.bottom > 0;
    if (inView) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: Math.min(threshold, 0.01), rootMargin: "0px 0px 80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
