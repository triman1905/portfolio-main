import { Trophy, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import GlowCard from "@/components/GlowCard";
import AnimatedDivider from "@/components/AnimatedDivider";
import ScrambleHeading from "@/components/ScrambleHeading";

interface Achievement {
  year: string;
  items: { title: string; organizer: string; medal: string }[];
}

const achievements: Achievement[] = [
  {
    year: "2025",
    items: [
      { title: "Hackathon at IIIT Delhi's E-Summit 2025", organizer: "IIIT Delhi", medal: "🥇 1st Place" },
      { title: "HACK'25", organizer: "IIIT Delhi", medal: "🥉 3rd Place" },
    ],
  },
  {
    year: "2024",
    items: [
      { title: "Code Genesis (Uncharted)", organizer: "CSI-INNOWAVE, MAIT", medal: "🥉 3rd Place" },
    ],
  },
  {
    year: "2023",
    items: [
      { title: "ENGAGE 4.0 Hackathon", organizer: "NorthCap University", medal: "🥉 3rd Place" },
      { title: "Hackathon", organizer: "Techshiva Institute", medal: "🥈 2nd Place" },
    ],
  },
];

const AchievementCard = ({ item, delay }: { item: { title: string; organizer: string; medal: string }; delay: number }) => {
  const { ref, isVisible } = useScrollReveal(0.15);
  return (
    <div ref={ref}>
      <GlowCard
        className="bg-secondary/50 border border-border rounded-lg p-4 flex items-center justify-between gap-4 hover:border-neon/30 transition-colors duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1) rotateX(0deg)" : "translateY(30px) scale(0.94) rotateX(-8deg)",
          transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-neon" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
            <p className="text-muted-foreground text-xs">Organized by {item.organizer}</p>
          </div>
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{item.medal}</span>
      </GlowCard>
    </div>
  );
};

const AchievementsSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal(0.2);
  let cardIndex = 0;

  return (
    <section id="achievements" className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <AnimatedDivider />
      <div className="pt-6">
        <ScrambleHeading className="mb-8">🏆 Hackathons & Achievements</ScrambleHeading>
        <div className="space-y-6">
          {achievements.map((group, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-neon" />
                <span className="text-foreground font-semibold text-sm">{group.year}</span>
              </div>
              <div className="space-y-3 ml-6">
                {group.items.map((item, j) => {
                  const delay = cardIndex++ * 120;
                  return <AchievementCard key={j} item={item} delay={delay} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
