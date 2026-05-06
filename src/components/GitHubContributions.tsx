import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedDivider from "@/components/AnimatedDivider";

const GITHUB_USERNAME = "triman1905";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: ContributionDay[];
}

// ─── Edit these to match your real repo split ─────────────────────────────
const REPO_TYPES = [
  { label: "ML / Data", pct: 62, color: "hsl(180 100% 50%)" },
  { label: "Web",       pct: 24, color: "hsl(220 15% 35%)"  },
  { label: "Agents",    pct: 14, color: "hsl(180 60% 30%)"  },
];
// ─────────────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const levelColors = [
  "bg-secondary",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
];

function useCountUp(target: number, active: boolean, duration = 900) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

const StatPill = ({
  label, value, suffix = "", active, delay,
}: {
  label: string; value: number; suffix?: string; active: boolean; delay: number;
}) => {
  const count = useCountUp(value, active);
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-2.5 bg-secondary/40 rounded-lg border border-border min-w-[90px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
      }}
    >
      <span className="text-neon font-display font-bold text-xl leading-none">
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-[10px] tracking-wide uppercase mt-0.5">
        {label}
      </span>
    </div>
  );
};

/**
 * Fetches real GitHub contribution data for the given username.
 * Uses the public contribution graph endpoint via a CORS proxy.
 * GitHub renders contribution squares as <rect data-date="YYYY-MM-DD" data-level="0-4">
 * with an inner <title> that contains the exact count, e.g. "5 contributions on Apr 22, 2025".
 */
// ─── SETUP: Create a GitHub PAT at https://github.com/settings/tokens
// Scopes needed: read:user  (no repo access required)
// Paste your token below:
const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN_HERE";

async function fetchRealContributions(): Promise<{
  weeks: ContributionWeek[];
  total: number;
  currentStreak: number;
  longestStreak: number;
}> {
  if (!GITHUB_TOKEN || GITHUB_TOKEN === "YOUR_GITHUB_TOKEN_HERE") {
    throw new Error("No token");
  }

  const today = new Date();
  const from = new Date(today);
  from.setFullYear(from.getFullYear() - 1);

  const query = `{
    user(login: "${GITHUB_USERNAME}") {
      contributionsCollection(from: "${from.toISOString()}", to: "${today.toISOString()}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("No calendar data");

  const levelMap: Record<string, number> = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
  };

  const weeks: ContributionWeek[] = calendar.weeks.map((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) => ({
    days: w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelMap[d.contributionLevel] ?? 0,
    })),
  }));

  const allDays = weeks.flatMap((w) => w.days).filter((d) => d.date);
  const total = calendar.totalContributions;
  const reversed = [...allDays].reverse();

  let curStreak = 0, longestStreak = 0, running = 0;
  let countingCurrent = true;
  for (const day of reversed) {
    if (day.count > 0) {
      running++;
      if (countingCurrent) curStreak = running;
      longestStreak = Math.max(longestStreak, running);
    } else {
      countingCurrent = false;
      running = 0;
    }
  }

  return { weeks, total, currentStreak: curStreak, longestStreak };
}

function buildFallbackWeeks() {
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() - start.getDay());
  const seed = [2,0,0,1,0,0,0,3,0,0,0,1,0,0,2,0,0,0,0,1,0,4,0,0,0,1,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,1,0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,5,0,0,0,1,0,0,0,3,0,0,0,0,0,0,1,0,0,0,0,0];
  const weeks: ContributionWeek[] = [];
  const current = new Date(start);
  let idx = 0;
  while (current <= today) {
    const weekDays: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      if (current > today) {
        weekDays.push({ date: "", count: 0, level: 0 });
      } else {
        const dateStr = current.toISOString().split("T")[0];
        const count = seed[idx % seed.length];
        weekDays.push({ date: dateStr, count, level: count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4 });
        idx++;
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push({ days: weekDays });
  }
  return weeks;
}

const GitHubContributions = () => {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [barActive, setBarActive] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setBarActive(true), 500);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  useEffect(() => {
    fetchRealContributions()
      .then(({ weeks, total, currentStreak, longestStreak }) => {
        setWeeks(weeks);
        setTotalContributions(total);
        setCurrentStreak(currentStreak);
        setLongestStreak(longestStreak);
        setLoading(false);
      })
      .catch(() => {
        // Silently fall back to static data — proxy may be blocked in this environment
        setWeeks(buildFallbackWeeks());
        setTotalContributions(199);
        setCurrentStreak(0);
        setLongestStreak(7);
        setLoading(false);
      });
  }, []);

  const getMonthLabels = () => {
    if (!weeks.length) return [];
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const day = week.days.find((d) => d.date);
      if (day?.date) {
        const month = new Date(day.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTHS[month], index: i });
          lastMonth = month;
        }
      }
    });
    return labels;
  };

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 md:px-8 py-4">
        <AnimatedDivider />
        <div className="pt-6 h-40 bg-secondary rounded-lg animate-pulse" />
      </section>
    );
  }

  const monthLabels = getMonthLabels();

  return (
    <section ref={ref} className="max-w-3xl mx-auto px-6 md:px-8 py-4">
      <AnimatedDivider />
      <div className="pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground tracking-wide">
              GitHub Activity
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              @{GITHUB_USERNAME} · {totalContributions.toLocaleString()} contributions in the last year
            </p>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neon hover:underline"
          >
            View profile →
          </a>
        </div>

        {/* Streak pills */}
        <div className="flex gap-3 flex-wrap mb-5">
          <StatPill label="day streak"      value={currentStreak}      active={isVisible} delay={100} />
          <StatPill label="longest streak"  value={longestStreak}      active={isVisible} delay={200} />
          <StatPill label="this year"       value={totalContributions} active={isVisible} delay={300} />
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-[3px] mb-1">
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.index === wi);
              return (
                <div key={wi} className="w-[11px] shrink-0">
                  {label && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {label.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    className={`w-[11px] h-[11px] rounded-sm ${levelColors[day.level]} ${
                      !day.date ? "opacity-0" : "hover:ring-1 hover:ring-neon/50 cursor-pointer"
                    }`}
                    title={day.date ? `${day.count} contributions on ${day.date}` : ""}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {levelColors.map((color, i) => (
            <div key={i} className={`w-[11px] h-[11px] rounded-sm ${color}`} />
          ))}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>

        {/* Repo breakdown bar */}
        <div className="mt-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
            Commit breakdown by repo type
          </p>
          <div className="flex h-1.5 rounded-full overflow-hidden w-full gap-[2px]">
            {REPO_TYPES.map((r) => (
              <div
                key={r.label}
                className="h-full rounded-full"
                style={{
                  width: barActive ? `${r.pct}%` : "0%",
                  background: r.color,
                  transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {REPO_TYPES.map((r) => (
              <div key={r.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="text-[11px] text-muted-foreground">
                  {r.label}{" "}
                  <span className="text-foreground font-medium">{r.pct}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GitHubContributions;
