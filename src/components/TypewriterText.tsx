import { useEffect, useState } from "react";

const TypewriterText = ({ texts, className }: { texts: string[]; className?: string }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={className}>
      {texts[textIndex].slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypewriterText;
