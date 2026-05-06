import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedDivider from "@/components/AnimatedDivider";

const paragraphs = [
  "I'm probably not the developer you expect — I'm not here just to ship flashy demos or stack buzzwords. I'd rather be building intelligent systems that actually solve problems, backed by strong data and real logic, than debugging something meaningless at 3 AM.",
  "My world revolves around AI, Machine Learning, and data-driven systems. I love building models that think, analyze, and optimize — whether it's designing ML pipelines, engineering features, experimenting with architectures, or deploying models into real-world environments.",
  "I enjoy building from scratch. From training models in TensorFlow and Scikit-Learn to working with large datasets using Pandas and NumPy, optimizing SQL queries, designing scalable backend logic, and deploying solutions using AWS and Docker — I like owning the full lifecycle. I believe great systems aren't just powerful; they're cohesive. Every layer — data, model, infrastructure, and user experience — should just click.",
  "I don't cut corners. But I do have that jugaad spirit — the resourcefulness to find solutions when resources are limited and timelines are tight. Hackathons, ideathons, internships — each one has shaped how I think: practical, scalable, and impact-driven.",
  "Every project is a chance to learn something new. I'm still learning, still experimenting, and still coding every day.",
  "And yes… there's usually coffee involved ☕",
];

const BioSection = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <AnimatedDivider />
      <div className="space-y-6 text-muted-foreground leading-relaxed text-base pt-6">
        {paragraphs.map((text, i) => (
          <BioParagraph key={i} text={text} delay={i * 100} />
        ))}
      </div>
    </section>
  );
};

const BioParagraph = ({ text, delay }: { text: string; delay: number }) => {
  const { ref, isVisible } = useScrollReveal(0.2);
  return (
    <p
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) translateX(0)" : "translateY(20px) translateX(-15px)",
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {text}
    </p>
  );
};

export default BioSection;
