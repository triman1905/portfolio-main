import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingMascot from "@/components/FloatingMascot";
import WaterText from "@/components/WaterText";
import { Github, ExternalLink } from "lucide-react";
import { useState, useRef } from "react";

import projectInvestrix from "@/assets/project-investrix.jpg";
import projectSqlWarehouse from "@/assets/project-sql-warehouse.jpg";
import projectColdEmail from "@/assets/project-cold-email.jpg";
import projectNewsletter from "@/assets/project-newsletter.jpg";
import projectTelegram from "@/assets/project-telegram.jpg";
import projectFloatchat from "@/assets/project-floatchat.jpg";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  badges?: string[];
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "Investrix",
    description:
      "A decentralized investment platform leveraging Plotch.ai for AI-driven recommendations and Aptos blockchain for secure bidding and fraud-proof transactions. It connects investors with SMEs through a competitive bidding system while prioritizing sustainable and Make in India initiatives.",
    image: projectInvestrix,
    tags: ["React.js", "Firebase", "TensorFlow", "Aptos Smart Contracts"],
    badges: ["🏆 Codegenesis — Microsoft Winner"],
    github: "https://github.com/adithyanotfound/Investrix",
  },
  {
    title: "SQL Data Warehouse & Analytics",
    description:
      "A modern end-to-end data warehouse project using Medallion Architecture (Bronze, Silver, Gold layers) with ETL pipelines, star schema modeling, and SQL-based analytics for customer behavior, product performance, and sales trend insights.",
    image: projectSqlWarehouse,
    tags: ["SQL Server", "SSMS", "ETL", "Data Modeling", "Star Schema"],
    github: "https://github.com/triman1905/sql-data-warehouse-project-final",
  },
  {
    title: "Cold Email AI Agent",
    description:
      "An AI-powered cold emailing agent that automatically generates personalized outreach emails, optimizes subject lines, and improves response rates using intelligent automation with minimal human intervention.",
    image: projectColdEmail,
    tags: ["n8n", "AI Agent", "OpenAI/Groq LLM", "Email APIs", "Automation"],
    github: "https://github.com/triman1905/cold-emailing-agent",
  },
  {
    title: "Newsletter AI Agent",
    description:
      "An intelligent newsletter agent that curates content, summarizes information, and automatically generates high-quality newsletters with consistent tone and structure for ready-to-send output.",
    image: projectNewsletter,
    tags: ["n8n", "AI Agent", "OpenAI/Groq LLM", "Content APIs", "Automation"],
    github: "https://github.com/triman1905/n8n-Newsletter-Agent",
  },
  {
    title: "Telegram AI Agent",
    description:
      "A smart Telegram AI agent that listens to user messages, understands intent, executes workflows, and responds intelligently using integrated tools with context-aware memory.",
    image: projectTelegram,
    tags: ["Telegram Bot API", "n8n", "AI Agent", "OpenAI/Groq LLM", "Google Calendar API"],
    github: "https://github.com/triman1905/Telegram-personal-agent",
  },
  {
    title: "Floatchat",
    description:
      "A modern chat application built with real-time messaging capabilities, intuitive UI, and seamless communication features for teams and communities.",
    image: projectFloatchat,
    tags: ["React", "Node.js", "WebSockets", "Chat API"],
    github: "https://github.com/triman1905/Floatchat-git",
  },
  {
    title: "Dr. Krishi — KrishiAI",
    description:
      "An AI-powered crop disease advisory platform for Indian farmers. Farmers send a photo via WhatsApp or SMS and receive Hinglish treatment advice in seconds, powered by LangGraph agents, ResNet-50 CNN, XGBoost, and GPT-4o Vision. Features auto-escalation to senior agronomists, RAG knowledge base from ICAR docs, IoT sensor integration, and a Razorpay freemium payment model.",
    image: projectFloatchat,
    tags: ["FastAPI", "Python", "GPT-4o", "LangGraph", "CrewAI", "WhatsApp API", "Supabase", "Docker", "RAG", "ResNet-50"],
    badges: ["🌾 AgriTech · AI for Bharat"],
    github: "https://github.com/triman1905/krishi-app",
    live: "https://krishi-app-zhr1.onrender.com",
  },
  {
    title: "Autonomous Agentic AI Framework",
    description:
      "A production-grade AI research assistant built with CrewAI that turns any topic into a structured, citation-backed report — similar to Perplexity Deep Research. Five specialized agents (Planner, Search, Validator, Extractor, Synthesizer) run a 3-stage iterative pipeline, pulling from arXiv, IEEE, ACL, GitHub, and the web via Exa and Tavily. Every claim is grounded in verified sources with no hallucination.",
    image: projectColdEmail,
    tags: ["Python", "CrewAI", "OpenAI GPT-4o", "Exa API", "Tavily", "arXiv", "Multi-Agent", "RAG"],
    github: "https://github.com/triman1905/Autonomous-Agentic-AI-Framework",
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
    setGlare({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setHovering(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative group"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${hovering ? 1.03 : 1})`,
          boxShadow: hovering
            ? `0 20px 40px -15px hsl(var(--neon) / 0.2), 0 0 30px -10px hsl(var(--neon) / 0.15)`
            : "0 4px 6px -1px rgba(0,0,0,0.1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare overlay */}
        {hovering && (
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-lg"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            }}
          />
        )}

        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-foreground text-lg">{project.title}</h3>
            <div className="flex gap-2">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-neon transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-neon transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {project.badges && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.badges.map((badge) => (
                <span key={badge} className="text-xs px-2 py-0.5 rounded-full bg-neon/10 text-neon font-medium">
                  {badge}
                </span>
              ))}
            </div>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProofOfWork = () => {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <FloatingMascot />
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 md:px-8 py-16">
        <div className="text-center mb-4">
          <WaterText text="proof of work" as="h1" className="text-4xl md:text-5xl" />
        </div>
        <p className="text-muted-foreground text-center mb-12">
          A showcase of my work and side projects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ProofOfWork;
