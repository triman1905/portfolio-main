import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedDivider from "@/components/AnimatedDivider";
import ScrambleHeading from "@/components/ScrambleHeading";

const techs = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "Hugging Face", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
  { name: "LangChain", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Power BI", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
  { name: "n8n", icon: "https://n8n.io/favicon.ico" },
  { name: "CrewAI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
];

interface Bubble {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number;
}

const BubbleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, frame = 0;

    const bubbles: Bubble[] = Array.from({ length: 25 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0006,
      vz: (Math.random() - 0.5) * 0.001,
      size: 12 + Math.random() * 40,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBubble = (x: number, y: number, r: number, depth: number) => {
      // Main sphere - glossy white
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
      g.addColorStop(0, `rgba(255, 255, 255, ${0.9 * depth})`);
      g.addColorStop(0.3, `rgba(220, 230, 245, ${0.5 * depth})`);
      g.addColorStop(0.7, `rgba(180, 200, 230, ${0.2 * depth})`);
      g.addColorStop(1, `rgba(140, 160, 200, ${0.05 * depth})`);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Specular highlight
      const sg = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, 0, x - r * 0.25, y - r * 0.3, r * 0.5);
      sg.addColorStop(0, `rgba(255, 255, 255, ${0.7 * depth})`);
      sg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      // Rim light
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * depth})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Sort by z for depth ordering
      bubbles.sort((a, b) => a.z - b.z);

      bubbles.forEach(b => {
        b.x += b.vx + Math.sin(t * 0.0005 + b.y * 5) * 0.0003;
        b.y += b.vy + Math.cos(t * 0.0004 + b.x * 3) * 0.0002;
        b.z += b.vz * 0.1;

        // Wrap
        if (b.x < -0.05) b.x = 1.05;
        if (b.x > 1.05) b.x = -0.05;
        if (b.y < -0.05) b.y = 1.05;
        if (b.y > 1.05) b.y = -0.05;
        if (b.z < 0.2) b.vz = Math.abs(b.vz);
        if (b.z > 1) b.vz = -Math.abs(b.vz);

        const scale = 0.5 + b.z * 0.5;
        const r = b.size * scale;
        const px = b.x * w;
        const py = b.y * h;

        drawBubble(px, py, r, b.z);
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};


const MagneticTechCard = ({ tech }: { tech: { name: string; icon: string } }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setOffset({ x: dx * 6, y: dy * 6 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setHovered(false); }}
      className="flex flex-col items-center gap-2 px-4 py-3 bg-secondary/80 backdrop-blur-sm rounded-lg shrink-0 min-w-[80px] transition-all duration-200 cursor-default select-none"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${hovered ? 1.12 : 1})`,
        boxShadow: hovered ? "0 0 18px hsl(180 100% 50% / 0.25)" : "none",
        borderColor: hovered ? "hsl(180, 100%, 60%)" : "transparent",
        border: "1px solid",
        transition: hovered ? "transform 0.1s ease, box-shadow 0.2s, border-color 0.2s" : "transform 0.4s ease, box-shadow 0.3s, border-color 0.3s",
      }}
    >
      <img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" />
      <span className="text-foreground text-xs font-medium">{tech.name}</span>
    </div>
  );
};

const TechStack = () => {
  const doubled = [...techs, ...techs];
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section
      ref={ref}
      className="max-w-3xl mx-auto px-6 md:px-8 py-4 relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <AnimatedDivider />
      <div className="pt-6 relative">
        <BubbleCanvas />
        <ScrambleHeading className="mb-2 relative z-10">Stack I use</ScrambleHeading>
        <p className="text-muted-foreground text-sm mb-8 relative z-10">
          Technologies I work with to build products that solve real problems
        </p>
        <div className="overflow-hidden relative z-10">
          <div className="flex gap-4 animate-marquee w-max">
            {doubled.map((tech, i) => (
              <MagneticTechCard key={i} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;