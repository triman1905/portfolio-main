import { Volume2, VolumeX, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAudioContext } from "@/contexts/AudioContext";
import NewDelhiWeather from "@/components/NewDelhiWeather";

const Navbar = () => {
  const { musicPlaying, toggleMusic } = useAudioContext();
  const [darkMode, setDarkMode] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

  const navLinks = [
    { to: "/proof-of-work", label: "proof-of-work" },
    { to: "/publications", label: "publications" },
    { to: "/certifications", label: "certifications" },
  ];

  return (
    <>
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

        <div className="flex items-center justify-between px-5 md:px-12 py-4">
          {/* Logo */}
          <Link
            to="/"
            className={`font-display text-lg font-bold text-foreground tracking-wider relative group transition-all duration-300 hover:drop-shadow-[0_0_12px_hsl(0_0%_100%/0.7)] ${hasAnimated ? "animate-fade-in" : "opacity-0"}`}
          >
            <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2">
              Triman
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_8px_hsl(0_0%_100%/0.4)]" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={navLinkClass}>
                <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                  {link.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 group-hover:w-full shadow-[0_0_6px_hsl(0_0%_100%/0.3)]" />
              </Link>
            ))}

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

          {/* Mobile: icon controls + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleMusic}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-all"
              title={musicPlaying ? "Mute music" : "Play ambient music"}
            >
              {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div
            className="absolute top-[57px] left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border px-5 py-6 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display font-semibold text-base tracking-wide text-foreground py-3 border-b border-border/40 last:border-0 transition-colors active:opacity-70"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <NewDelhiWeather compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;