import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingMascot from "@/components/FloatingMascot";
import WaterText from "@/components/WaterText";
import { BookOpen, FileText } from "lucide-react";

interface Publication {
  type: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
}

const publications: Publication[] = [
  {
    type: "Book Chapter",
    title: "Prompt Engineering and Optimization for Large Language Models",
    detail: "Bentham Science — submitted to Scopus-indexed publication.",
    icon: <BookOpen className="w-5 h-5 text-primary" />,
  },
  {
    type: "Research Paper",
    title:
      "Value-Latency in AI-Driven Organizations: The Hidden Delay Between Algorithmic Decisions and Human Well-Being",
    detail: "A Human Sustainability Perspective.",
    icon: <FileText className="w-5 h-5 text-primary" />,
  },
];

const Publications = () => {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <FloatingMascot />
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        <div className="mb-2">
          <WaterText text="Publications" as="h1" className="text-4xl md:text-5xl" />
        </div>
        <div className="h-0.5 w-full bg-foreground/20 mb-10" />

        <div className="space-y-8">
          {publications.map((pub) => (
            <div key={pub.title} className="flex gap-4 items-start">
              <div className="mt-1 shrink-0">{pub.icon}</div>
              <div>
                <p className="text-foreground font-bold text-base">
                  {pub.type}:{" "}
                  <span className="font-normal">{pub.title}</span>
                </p>
                <p className="text-muted-foreground text-sm mt-1">{pub.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Publications;
