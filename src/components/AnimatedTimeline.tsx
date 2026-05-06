import { useEffect, useRef, useState } from "react";
import WaterText from "./WaterText";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  icon: string;
  type: "education" | "work" | "achievement" | "project";
}

const timeline: TimelineEntry[] = [
  { year: "2022", title: "Started B.Tech in Computer Science", description: "Began my journey in Computer Science & Engineering, diving deep into programming and data structures.", icon: "🎓", type: "education" },
  { year: "2024", title: "GSSoC'24 Open Source Contributor", description: "Contributed to open source projects during GirlScript Summer of Code, achieving Rank 521.", icon: "🌐", type: "achievement" },
  { year: "2024", title: "Encryptix Web Dev Internship", description: "Completed web development internship building real-world applications.", icon: "💻", type: "work" },
  { year: "2024", title: "Internshala Student Partner", description: "Appointed as ISP, bridging the gap between students and industry opportunities.", icon: "🤝", type: "work" },
  { year: "2025", title: "TBO Tek — Data Science Intern", description: "Working on data science & engineering projects at TBO Tek Limited, applying ML and analytics at scale.", icon: "📊", type: "work" },
  { year: "2025", title: "Investrix — Microsoft Winner", description: "Won Code Genesis hackathon at CSI-INNOWAVE, MAIT with Investrix, a blockchain-AI investment platform.", icon: "🏆", type: "achievement" },
  { year: "2025", title: "1st Place — IIIT Delhi E-Summit", description: "Won Designathon at E-Summit 2025 hosted by E-Cell IIIT Delhi.", icon: "🥇", type: "achievement" },
  { year: "2025", title: "HACK'25 Winner — MSIT", description: "Won HACK'25 hackathon, showcasing innovative problem-solving.", icon: "🏆", type: "achievement" },
  { year: "2025", title: "Oracle Cloud Certified", description: "Earned Oracle Cloud Infrastructure Generative AI Professional certification.", icon: "☁️", type: "education" },
];

const typeColors: Record<string, string> = {
  education: "border-blue-500/50 bg-blue-500/10",
  work: "border-green-500/50 bg-green-500/10",
  achievement: "border-yellow-500/50 bg-yellow-500/10",
  project: "border-purple-500/50 bg-purple-500/10",
};

const TimelineItem = ({ entry, index }: { entry: TimelineEntry; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex items-center w-full mb-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
      {/* Content */}
      <div
        className={`w-full md:w-5/12 transition-all duration-700 ${
          visible
            ? "opacity-100 translate-x-0 translate-y-0"
            : isLeft
            ? "opacity-0 -translate-x-12 translate-y-4"
            : "opacity-0 translate-x-12 translate-y-4"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className={`p-5 rounded-lg border ${typeColors[entry.type]} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{entry.icon}</span>
            <span className="text-xs font-display text-muted-foreground tracking-wider">{entry.year}</span>
          </div>
          <h3 className="font-display font-bold text-foreground text-sm mb-1">{entry.title}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">{entry.description}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex w-2/12 justify-center">
        <div
          className={`w-4 h-4 rounded-full border-2 border-neon bg-background transition-all duration-500 ${
            visible ? "scale-100 shadow-[0_0_12px_hsl(var(--neon)/0.5)]" : "scale-0"
          }`}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
        />
      </div>

      {/* Spacer */}
      <div className="hidden md:block w-5/12" />
    </div>
  );
};

const AnimatedTimeline = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const containerH = rect.height;

      if (rect.top > windowH) { setLineHeight(0); return; }
      if (rect.bottom < 0) { setLineHeight(100); return; }

      const scrolled = Math.min(Math.max((windowH - rect.top) / (containerH + windowH * 0.5), 0), 1);
      setLineHeight(scrolled * 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-20 px-6 md:px-12 relative overflow-hidden" id="timeline">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <WaterText text="my journey" as="h2" className="text-3xl md:text-4xl" />
          <p className="text-muted-foreground mt-4">From student to builder — a timeline of growth</p>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Animated line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="w-full h-full bg-border" />
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-neon to-neon/30"
              style={{ height: `${lineHeight}%`, transition: "height 0.1s linear" }}
            />
          </div>

          {timeline.map((entry, i) => (
            <TimelineItem key={i} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedTimeline;
