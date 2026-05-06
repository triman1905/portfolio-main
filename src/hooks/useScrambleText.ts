import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const useScrambleText = (text: string, active: boolean, speed = 40) => {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    iterRef.current = 0;

    if (frameRef.current) clearInterval(frameRef.current);

    frameRef.current = setInterval(() => {
      const iteration = iterRef.current;
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iterRef.current += 0.5;
      if (iteration >= text.length) {
        clearInterval(frameRef.current!);
        setDisplayed(text);
      }
    }, speed);

    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [active, text, speed]);

  return displayed;
};
