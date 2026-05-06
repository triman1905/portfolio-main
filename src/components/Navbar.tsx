import { Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAudioContext } from "@/contexts/AudioContext";
import NewDelhiWeather from "@/components/NewDelhiWeather";

const Navbar = () => {
  const { musicPlaying, toggleMusic } = useAudioContext();
  const [darkMode, setDarkMode] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinkClass =
    "relative group font-display font-semibold text-sm tracking-wide text-foreground transition-all duration-300 hover:text-foreground hover:drop-shadow-[0_0_8px_hsl(0_0%_100%/0.6)]";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden pointer-events-none">
        <div
          className="h-full transition-all duration-100 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, hsl(180, 100%, 70%), hsl(270, 100%, 75%))",
            boxShadow: "0 0 8px hsl(180, 100%, 70%), 0 0 16px hsl(180, 100%, 50%)",
          }}
        />
      </div>
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
      <Link
        to="/"
        className={`font-display text-lg font-bold text-foreground tracking-wider relative group transition-all duration-300 hover:drop-shadow-[0_0_12px_hsl(0_0%_100%/0.7)] ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
      >
        <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2">
          Triman
        </span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_8px_hsl(0_0%_100%/0.4)]" />
      </Link>
      <div className="flex items-center gap-5">
        <Link to="/proof-of-work" className={navLinkClass}>
          <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
            proof-of-work
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_6px_hsl(0_0%_100%/0.3)]" />
        </Link>
        <Link to="/publications" className={navLinkClass}>
          <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
            publications
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_6px_hsl(0_0%_100%/0.3)]" />
        </Link>
        <Link to="/certifications" className={navLinkClass}>
          <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
            certifications
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_6px_hsl(0_0%_100%/0.3)]" />
        </Link>

        {/* Live Delhi weather — compact inline for navbar */}
        <NewDelhiWeather compact />
        <button
          onClick={toggleMusic}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-all"
          title={musicPlaying ? "Mute music" : "Play ambient music"}
        >
          {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-all"
          title="Toggle theme"
        >
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
