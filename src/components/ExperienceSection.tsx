import { Briefcase, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import GlowCard from "@/components/GlowCard";
import AnimatedDivider from "@/components/AnimatedDivider";
import ScrambleHeading from "@/components/ScrambleHeading";

interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  link?: string;
  bullets: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "TBO (Travel Boutique Online)",
    role: "Data Science Intern",
    date: "June 2025 – Aug 2025",
    link: "https://www.tbo.com/",
    bullets: [
      "Built interactive dashboards to visualize key business metrics and support strategic decision-making.",
      "Used AWS Athena to write complex SQL queries, retrieve data, and establish relationships across multiple tables.",
      "Developed an email classification model with 96% accuracy using a self-built machine learning approach.",
    ],
  },
  {
    company: "Encryptix",
    role: "Web Developer Intern",
    date: "Aug 2024 – Sept 2024",
    link: "https://encryptix.in/",
    bullets: [
      "Developed responsive and user-friendly web interfaces using HTML, CSS, and JavaScript.",
      "Collaborated on real-world web development tasks, focusing on functionality, performance, and UI consistency.",
      "Debugged and optimized existing code to improve website performance and user experience.",
    ],
  },
  {
    company: "Techshiva Institute",
    role: "Web Developer Intern",
    date: "July 2024 – Aug 2024",
    link: "https://techshiva.in/",
    bullets: [
      "Constructed the user interface for the institute's primary web presence.",
      "Troubleshot, tested, and resolved issues prior to software deployment.",
      "Applied SEO best practices to improve website visibility and search engine rankings.",
    ],
  },
];

const ExpCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.15);
  return (
    <GlowCard
      className="bg-secondary/50 border border-border rounded-lg p-5 hover:border-neon/30 transition-colors duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0) rotateY(0deg)" : index % 2 === 0 ? "translateX(-60px) rotateY(-5deg)" : "translateX(60px) rotateY(5deg)",
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 200}ms`,
      }}
    >
      <div ref={ref}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-neon" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{exp.role}</h3>
              <p className="text-neon text-xs font-medium">
                {exp.link ? (
                  <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {exp.company}
                  </a>
                ) : exp.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {exp.date}
          </div>
        </div>
        <ul className="space-y-1.5 ml-13 pl-4">
          {exp.bullets.map((b, j) => (
            <li key={j} className="text-muted-foreground text-xs flex items-start gap-2">
              <span className="text-neon mt-1.5 shrink-0">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlowCard>
  );
};

const ExperienceSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal(0.2);

  return (
    <section id="experience" className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <AnimatedDivider />
      <div className="pt-6">
        <ScrambleHeading className="mb-8">💼 Work Experience</ScrambleHeading>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <ExpCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
