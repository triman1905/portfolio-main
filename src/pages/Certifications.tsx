import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingMascot from "@/components/FloatingMascot";
import WaterText from "@/components/WaterText";
import { Trophy, GraduationCap, Award, Briefcase, Github, X, ZoomIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const hackathonCerts = [
  { title: "Hackathon at IIIT Delhi's E-Summit 2025", issuer: "IIIT Delhi", date: "2025", badge: "🥇 1st Place", image: null },
  { title: "HACK'25", issuer: "IIIT Delhi", date: "2025", badge: "🥉 3rd Place", image: null },
  { title: "Code Genesis (Uncharted)", issuer: "CSI-INNOWAVE, MAIT", date: "Feb 2025", badge: "🥉 3rd Place", image: "/certs/hackathon_codegenesis.jpg" },
  { title: "ENGAGE Hackathon 2024 (Momentum)", issuer: "NorthCap University", date: "Oct 2024", badge: "🥉 3rd Place", image: "/certs/hackathon_northcap.jpg" },
  { title: "CODE4CAUSE 2.0 — Hack With India", issuer: "NSUT Delhi (30hr Hackathon)", date: "Sept 2024", badge: "🏅 Top among 4,000 applicants", image: "/certs/hackathon_code4cause.jpg" },
  { title: "Hackathon", issuer: "Techshiva Institute", date: "Nov 2024", badge: "🏅 Participation", image: "/certs/hackathon_techshiva.jpg" },
];

const professionalCerts = [
  { title: "Oracle Cloud Infrastructure 2025 — Generative AI Professional", issuer: "Oracle Corporation", date: "Oct 2025", badge: "✅ Certified", image: "/certs/cert_oracle_genai.jpg" },
  { title: "Oracle Database@AWS — Certified Architect Professional", issuer: "Oracle Corporation", date: "Oct 2025", badge: "✅ Certified", image: "/certs/cert_oracle_aws.jpg" },
];

const courseCerts = [
  { title: "Data Science Mentorship Program (DSMP) 1.0", issuer: "CampusX — Nitish Singh", date: "Jan 2025", badge: "✅ Completed", image: "/certs/course_dsmp_campusx.jpg" },
  { title: "Ultimate Data Bootcamp 1.0", issuer: "Shridhar Mankar", date: "Mar 2025", badge: "✅ Completed", image: "/certs/cert_data_bootcamp.jpg" },
  { title: "Advanced Machine Learning: Data-Driven Insights & Models", issuer: "VIPS-TC, Dept. of CSE (Winter School)", date: "Jan 2025", badge: "✅ Completed", image: "/certs/course_ml_vips.jpg" },
  { title: "Problem Solving Using Python", issuer: "VIPS-TC, Dept. of CSE (Winter School)", date: "Dec 2024 – Jan 2025", badge: "✅ Completed", image: "/certs/course_python_vips.jpg" },
  { title: "Website Development With HTML", issuer: "TechShiva Institute", date: "Aug 2024", badge: "✅ Completed", image: "/certs/course_html_techshiva.jpg" },
];

const openSourceCerts = [
  { title: "GSSoC'24 Extended — Open Source Contributor", issuer: "GirlScript Foundation", date: "2024", badge: "🏅 Rank 521 · Score 850 · 9 PRs · 5 Badges", image: "/certs/opensource_gssoc.jpg" },
];

const internshipCerts = [
  { title: "Data Science & Engineering Intern", issuer: "TBO Tek Limited", date: "Aug 2025", badge: "✅ Completed", image: "/certs/intern_tbo.jpg" },
  { title: "Web Development Internship", issuer: "Encryptix", date: "Aug – Sept 2024", badge: "✅ Completed", image: "/certs/intern_encryptix.jpg" },
  { title: "Web Development Internship", issuer: "TechnoHacks Solutions Pvt. Ltd.", date: "July – Aug 2024", badge: "✅ Completed", image: "/certs/intern_technohacks.jpg" },
  { title: "Internshala Student Partner (ISP)", issuer: "Internshala (Scholiverse Educare)", date: "Aug 2024", badge: "✅ Appointed", image: "/certs/intern_internshala.jpg" },
];

const radarData = [
  { skill: "Data Science", value: 88 },
  { skill: "ML / AI", value: 82 },
  { skill: "Web Dev", value: 78 },
  { skill: "Cloud", value: 75 },
  { skill: "Python", value: 85 },
  { skill: "Open Source", value: 70 },
];

const xpData = [
  { name: "Data Science & ML", xp: 88, color: "#7F77DD" },
  { name: "Web Development",   xp: 78, color: "#1D9E75" },
  { name: "Cloud / Oracle",    xp: 75, color: "#378ADD" },
  { name: "Hackathons",        xp: 92, color: "#D85A30" },
  { name: "Open Source",       xp: 70, color: "#BA7517" },
];

const timelineEvents = [
  { date: "Jul '24", label: "HTML cert",     color: "#1D9E75" },
  { date: "Aug '24", label: "TechnoHacks",   color: "#1D9E75" },
  { date: "Aug '24", label: "Encryptix",     color: "#1D9E75" },
  { date: "Sep '24", label: "Code4Cause",    color: "#D85A30" },
  { date: "Oct '24", label: "NorthCap 3rd",  color: "#D85A30" },
  { date: "Nov '24", label: "Hackathon",     color: "#D85A30" },
  { date: "Jan '25", label: "Python + ML",   color: "#7F77DD" },
  { date: "Jan '25", label: "DSMP 1.0",      color: "#7F77DD" },
  { date: "Feb '25", label: "Code Genesis",  color: "#D85A30" },
  { date: "Mar '25", label: "Data Bootcamp", color: "#7F77DD" },
  { date: "Aug '25", label: "TBO Intern",    color: "#378ADD" },
  { date: "Oct '25", label: "Oracle x2",     color: "#378ADD" },
];

const SYMBOLS = ["nabla","lambda","sigma","mu","sum","pi","beta","theta","alpha","epsilon","Delta","rho"];
const SYMBOL_CHARS = ["∇","λ","σ","μ","∑","π","β","θ","α","ε","Δ","ρ"];

function FloatingSymbols() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const makeParticle = (w: number, h: number) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      sym: SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)],
      size: 11 + Math.random() * 9,
      speed: 0.18 + Math.random() * 0.28,
      drift: (Math.random() - 0.5) * 0.35,
      opacity: 0.045 + Math.random() * 0.07,
    });

    let particles: ReturnType<typeof makeParticle>[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 24 }, () => makeParticle(canvas.width, canvas.height));
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      particles.forEach((p) => {
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillStyle = dark
          ? `rgba(180,170,255,${p.opacity})`
          : `rgba(100,90,200,${p.opacity})`;
        ctx.fillText(p.sym, p.x, p.y);
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

function XPBars() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      {xpData.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-sm font-medium text-foreground">{d.name}</span>
            <span className="text-xs text-muted-foreground">{d.xp} XP</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: animated ? `${d.xp}%` : "0%",
                background: d.color,
                transition: "width 1400ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap gap-x-4 gap-y-5">
      {timelineEvents.map((e, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 0.4s ${i * 0.07}s ease, transform 0.4s ${i * 0.07}s ease`,
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
          <span className="text-[11px] font-medium text-foreground leading-tight text-center">{e.label}</span>
          <span className="text-[10px] text-muted-foreground">{e.date}</span>
        </div>
      ))}
    </div>
  );
}

interface CertItem {
  title: string;
  issuer: string;
  date: string;
  badge: string;
  image: string | null;
}

const CertCard = ({ cert, onView }: { cert: CertItem; onView: (img: string, title: string) => void }) => (
  <div className="bg-secondary/50 border border-border rounded-lg overflow-hidden hover:border-neon/30 transition-colors">
    {cert.image && (
      <div
        className="relative w-full overflow-hidden cursor-pointer group"
        style={{ height: "180px" }}
        onClick={() => onView(cert.image!, cert.title)}
      >
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    )}
    <div className="p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5 text-neon" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{cert.title}</h3>
          <p className="text-muted-foreground text-xs">{cert.issuer} · {cert.date}</p>
        </div>
      </div>
      <span className="text-sm font-medium whitespace-nowrap">{cert.badge}</span>
    </div>
  </div>
);

const Section = ({
  icon, title, certs, onView,
}: {
  icon: React.ReactNode;
  title: string;
  certs: CertItem[];
  onView: (img: string, title: string) => void;
}) => (
  <section className="mb-14">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-primary/10 neon-border flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-xl font-display font-bold text-foreground tracking-wide">{title}</h2>
    </div>
    <div className="grid gap-4">
      {certs.map((cert, i) => <CertCard key={i} cert={cert} onView={onView} />)}
    </div>
  </section>
);

const Certifications = () => {
  const [modalImg, setModalImg] = useState<{ src: string; title: string } | null>(null);
  const handleView = (src: string, title: string) => setModalImg({ src, title });
  const handleClose = () => setModalImg(null);

  return (
    <div className="min-h-screen bg-background bg-grid">
      <FloatingMascot />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        <div className="mb-2">
          <WaterText text="Certifications" as="h1" className="text-3xl md:text-4xl" />
        </div>
        <p className="text-muted-foreground mb-12">
          Awards, hackathon wins, professional certifications, and course completions.
        </p>

        {/* Stats Panel */}
        <div className="relative rounded-xl border border-border overflow-hidden mb-14">
          <div className="absolute inset-0 z-0">
            <FloatingSymbols />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Radar */}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Skill radar
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="rgba(127,119,221,0.18)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />
                  <Radar
                    name="Triman"
                    dataKey="value"
                    stroke="#7F77DD"
                    fill="#7F77DD"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#7F77DD", strokeWidth: 0 }}
                    animationBegin={200}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v} / 100`, "Level"]}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* XP Bars */}
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
                XP by domain
              </p>
              <XPBars />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative z-10 border-t border-border px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Journey · Jul 2024 → Oct 2025
            </p>
            <Timeline />
          </div>
        </div>

        {/* Cert Sections */}
        <Section icon={<Trophy className="w-5 h-5 text-neon" />}        title="Hackathons"                  certs={hackathonCerts}    onView={handleView} />
        <Section icon={<Award className="w-5 h-5 text-neon" />}         title="Professional Certifications"  certs={professionalCerts} onView={handleView} />
        <Section icon={<GraduationCap className="w-5 h-5 text-neon" />} title="Course Completions"           certs={courseCerts}       onView={handleView} />
        <Section icon={<Github className="w-5 h-5 text-neon" />}        title="Open Source"                  certs={openSourceCerts}   onView={handleView} />
        <Section icon={<Briefcase className="w-5 h-5 text-neon" />}     title="Internships"                  certs={internshipCerts}   onView={handleView} />
      </main>

      <Footer />
      <ScrollToTop />

      {modalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="relative max-w-3xl w-full bg-background rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate pr-4">{modalImg.title}</p>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={modalImg.src} alt={modalImg.title} className="w-full object-contain max-h-[80vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
