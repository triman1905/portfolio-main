import { useEffect, useState, useCallback } from "react";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  // Start hidden; show only when a real mouse move is detected
  const [usingMouse, setUsingMouse] = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
    setUsingMouse(true);
  }, []);

  // Hide cursor when user switches to touch
  const onTouch = useCallback(() => {
    setUsingMouse(false);
    setVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("mousedown", () => setClicking(true));
    window.addEventListener("mouseup", () => setClicking(false));
    window.addEventListener("mouseleave", () => setVisible(false));
    window.addEventListener("mouseenter", () => { if (usingMouse) setVisible(true); });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [onMove, onTouch, usingMouse]);

  // Trail follows with delay
  useEffect(() => {
    let raf: number;
    const follow = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  // Detect hoverable elements
  useEffect(() => {
    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest("a, button, [role='button'], input, textarea, .hover-scale, .glow-card");
      setHovering(!!isHoverable);
    };
    window.addEventListener("mousemove", checkHover);
    return () => window.removeEventListener("mousemove", checkHover);
  }, []);

  // Don't render at all until we know a mouse is being used
  if (!usingMouse) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {/* Main dot */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div
          className="rounded-full bg-foreground"
          style={{
            width: clicking ? 6 : 8,
            height: clicking ? 6 : 8,
            transition: "width 0.15s, height 0.15s",
          }}
        />
      </div>
      {/* Trail ring */}
      <div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: trailPos.x,
          top: trailPos.y,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div
          className="rounded-full border-2"
          style={{
            width: hovering ? 50 : 32,
            height: hovering ? 50 : 32,
            borderColor: hovering ? "hsl(var(--neon))" : "hsl(var(--foreground) / 0.5)",
            backgroundColor: hovering ? "hsl(var(--neon) / 0.08)" : "transparent",
            boxShadow: hovering ? "0 0 20px hsl(var(--neon) / 0.3)" : "none",
            transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;