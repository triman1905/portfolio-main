import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import GlowCard from "@/components/GlowCard";
import AnimatedDivider from "@/components/AnimatedDivider";

interface LinkItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  preview: { title: string; subtitle: string; detail?: string };
}

const links: LinkItem[] = [
  {
    icon: <Github className="w-6 h-6" />, label: "GitHub",
    href: "https://github.com/triman1905",
    preview: { title: "TRIMAN KAUR", subtitle: "triman1905", detail: "AI-ML enthusiast · 77 Repos · 184 contributions" },
  },
  {
    icon: <Mail className="w-6 h-6" />, label: "Gmail",
    href: "mailto:trimankaur1905@gmail.com",
    preview: { title: "Email", subtitle: "trimankaur1905@gmail.com", detail: "Drop me a message anytime" },
  },
  {
    icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn",
    href: "https://www.linkedin.com/in/triman-kaur-bb9182204",
    preview: { title: "Triman Kaur", subtitle: "AI Engineer · Data Scientist", detail: "B.Tech CSE · Vivekananda Institute" },
  },
  {
    icon: <FileText className="w-6 h-6" />, label: "Resume",
    href: "/Triman_Kaur_Resume.pdf",
    preview: { title: "Triman Kaur — Resume", subtitle: "AI/ML · Data Science · Python", detail: "Download or view my full resume" },
  },
];

const SocialCard = ({ link, delay }: { link: LinkItem; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: `opacity 0.5s ease, transform 0.5s ease`,
      }}
    >
      <GlowCard className="rounded-lg">
        <a
          href={link.href}
          target={link.href.startsWith("mailto:") || link.href.startsWith("/") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg hover:bg-muted hover:shadow-[0_0_20px_hsl(180_100%_50%/0.15)] transition-all duration-300 group"
        >
          <span className="text-muted-foreground group-hover:text-neon group-hover:scale-110 transition-all duration-300">
            {link.icon}
          </span>
          <span className="text-foreground text-sm">{link.label}</span>
        </a>
      </GlowCard>

      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-card border border-border rounded-lg shadow-xl p-4 z-50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-neon shrink-0">
              {link.icon}
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold truncate">{link.preview.title}</p>
              <p className="text-muted-foreground text-xs truncate">{link.preview.subtitle}</p>
            </div>
          </div>
          {link.preview.detail && (
            <p className="text-muted-foreground text-xs leading-relaxed">{link.preview.detail}</p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border" />
        </div>
      )}
    </div>
  );
};

const AnimatedConnectTitle = () => {
  const { ref, isVisible } = useScrollReveal(0.01);
  const [revealed, setRevealed] = useState(false);
  const text = "LET'S CONNECT";

  useEffect(() => {
    if (isVisible && !revealed) setRevealed(true);
  }, [isVisible, revealed]);

  // Fallback: reveal after 300ms regardless
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="relative py-8 md:py-12 overflow-hidden">
      <h2
        className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tighter text-center relative z-10 text-foreground"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0) scale(1)" : "translateY(60px) scale(0.8)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          textShadow: "0 0 10px hsla(190, 100%, 70%, 0.2), 0 0 30px hsla(190, 100%, 70%, 0.1)",
        }}
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0) rotateX(0deg)" : "translateY(40px) rotateX(-90deg)",
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 50}ms`,
              animation: revealed ? `waterFloat 2.8s ease-in-out infinite ${i * 0.12}s` : "none",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>

      {revealed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 60 + i * 80,
                height: 60 + i * 80,
                borderColor: `hsla(190, 90%, 70%, ${0.25 - i * 0.05})`,
                animation: `waterRippleExpand 3s ease-out infinite ${i * 0.6}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <div
          className="h-[2px] rounded-full"
          style={{
            width: revealed ? "60%" : "0%",
            background: "linear-gradient(90deg, transparent, hsla(190, 90%, 70%, 0.8), hsla(210, 80%, 75%, 0.6), transparent)",
            transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
          }}
        />
      </div>

      <p
        className="text-muted-foreground text-sm text-center mt-4 relative z-10"
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 0.8s ease 1.2s",
        }}
      >
        Find me on these platforms
      </p>

      <style>{`
        @keyframes waterFloat {
          0%, 100% { transform: translateY(0); text-shadow: 0 0 8px hsla(190, 100%, 70%, 0.2); }
          50% { transform: translateY(-2px); text-shadow: 0 0 16px hsla(190, 100%, 70%, 0.35); }
        }
        @keyframes waterRippleExpand {
          0% { transform: scale(0.3); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const ConnectSection = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <AnimatedDivider />
      <div className="pt-6">
        <AnimatedConnectTitle />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {links.map((link, i) => (
            <SocialCard key={i} link={link} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
