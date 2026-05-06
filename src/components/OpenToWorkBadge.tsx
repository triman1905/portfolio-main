import { useState, useEffect } from "react";

const OpenToWorkBadge = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="inline-flex flex-col gap-2 bg-secondary/60 border border-border rounded-xl px-4 py-3 backdrop-blur-sm">
        {/* Status pill */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs font-medium text-green-400 tracking-wide">Open to work</span>
        </div>

        {/* Role tags */}
        <div className="flex flex-wrap gap-1.5">
          {["ML Engineer", "Data Scientist", "AI Research", "Remote / Hybrid"].map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-neon/10 text-neon border border-neon/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenToWorkBadge;
