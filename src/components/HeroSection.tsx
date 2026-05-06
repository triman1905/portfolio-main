import heroBanner from "@/assets/hero-banner.jpg";
import avatar from "@/assets/avatar.png";
import { Github, Linkedin, Link as LinkIcon, Mail } from "lucide-react";
import TypewriterText from "@/components/TypewriterText";
import OpenToWorkBadge from "@/components/OpenToWorkBadge";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import VisitorCounter from "@/components/VisitorCounter";
import { useState } from "react";
import AvatarRing from "@/components/AvatarRing";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SocialItem {
  href: string;
  icon: React.ReactNode;
  preview: { title: string; subtitle: string };
}

const socials: SocialItem[] = [
  {
    href: "https://github.com/triman1905",
    icon: <Github className="w-5 h-5" />,
    preview: { title: "triman1905", subtitle: "77 Repos · AI-ML enthusiast" },
  },
  {
    href: "mailto:trimankaur1905@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    preview: { title: "Email", subtitle: "trimankaur1905@gmail.com" },
  },
  {
    href: "/Triman_Kaur_Resume.pdf",
    icon: <LinkIcon className="w-5 h-5" />,
    preview: { title: "Resume", subtitle: "View / Download PDF" },
  },
  {
    href: "https://www.linkedin.com/in/triman-kaur-bb9182204",
    icon: <Linkedin className="w-5 h-5" />,
    preview: { title: "Triman Kaur", subtitle: "AI Engineer · Data Scientist" },
  },
];

const SocialLink = ({ item, delay }: { item: SocialItem; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <a
        href={item.href}
        target={item.href.startsWith("/") ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center neon-border rounded-md text-neon hover:bg-neon hover:text-background hover:scale-110 hover:shadow-[0_0_15px_hsl(180_100%_50%/0.3)] transition-all duration-300"
      >
        {item.icon}
      </a>
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-card border border-border rounded-lg shadow-xl p-3 z-50 pointer-events-none animate-fade-in">
          <p className="text-foreground text-sm font-semibold truncate">{item.preview.title}</p>
          <p className="text-muted-foreground text-xs truncate">{item.preview.subtitle}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border" />
        </div>
      )}
    </div>
  );
};

const HeroSection = () => {
  const { ref: bannerRef, isVisible: bannerVisible } = useScrollReveal(0.1);
  const { ref: infoRef, isVisible: infoVisible } = useScrollReveal(0.1);

  return (
    <section className="relative">
      <div
        ref={bannerRef}
        className="relative w-full max-w-3xl mx-auto mt-4 px-4"
        style={{
          opacity: bannerVisible ? 1 : 0,
          transform: bannerVisible ? "translateY(0) scale(1) perspective(800px) rotateX(0deg)" : "translateY(40px) scale(0.95) perspective(800px) rotateX(-5deg)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="rounded-lg overflow-hidden">
          <img
            src={heroBanner}
            alt="Cyberpunk developer workspace"
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <p className="text-foreground text-sm md:text-lg tracking-[0.3em] font-display font-black uppercase animate-pulse drop-shadow-[0_0_15px_hsl(0_0%_100%/0.6)]">
              BUILD · SHIP · LEARN · REPEAT
            </p>
          </div>
        </div>
      </div>

      <div
        ref={infoRef}
        className="max-w-3xl mx-auto px-6 md:px-8"
        style={{
          opacity: infoVisible ? 1 : 0,
          transform: infoVisible ? "translateX(0) translateY(0)" : "translateX(-50px) translateY(10px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        <div className="-mt-12 relative z-10 inline-block">
          <div className="relative w-24 h-24">
            <AvatarRing size={96} />
            <img
              src={avatar}
              alt="Triman Kaur"
              className="w-24 h-24 rounded-full border-4 border-background object-cover hover:scale-110 hover:shadow-[0_0_25px_hsl(180_100%_50%/0.3)] transition-all duration-500 relative z-10"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-4 gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-wider text-foreground">
              TRIMAN KAUR
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              20 • engineer •{" "}
              <TypewriterText
                texts={["AI Engineer", "Data Scientist", "Builder 👩‍💻", "ML Enthusiast"]}
                className="text-neon"
              />
            </p>
            <div className="mt-3">
              <OpenToWorkBadge />
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-3">
              {socials.map((item, i) => (
                <SocialLink key={i} item={item} delay={i * 100} />
              ))}
            </div>
            <SpotifyNowPlaying />
            <VisitorCounter />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
