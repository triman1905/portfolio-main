import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaterText from "@/components/WaterText";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Eye, Users, Clock, TrendingUp, Lock } from "lucide-react";

const ADMIN_PASSWORD = "triman2025admin";

interface PageView {
  id: string;
  page_path: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViews = useCallback(async () => {
    setLoading(true);
    // Since we need auth for reading, sign in anonymously won't work
    // For now we fetch all we can
    const { data } = await supabase
      .from("page_views")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (data) setViews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchViews();
  }, [authenticated, fetchViews]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <form onSubmit={handleLogin} className="p-8 rounded-lg border border-border bg-card/50 backdrop-blur-sm max-w-sm w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 mx-auto mb-3 text-neon" />
            <h1 className="font-display font-bold text-foreground text-xl">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter password to view analytics</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-neon/50 mb-4"
          />
          <button type="submit" className="w-full px-4 py-2.5 rounded-md bg-neon text-background font-display font-bold text-sm hover:shadow-[0_0_20px_hsl(var(--neon)/0.4)] transition-all">
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Analytics calculations
  const totalViews = views.length;
  const today = new Date().toDateString();
  const todayViews = views.filter((v) => new Date(v.created_at).toDateString() === today).length;

  // Page breakdown
  const pageBreakdown = views.reduce((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageData = Object.entries(pageBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Daily views (last 7 days)
  const dailyViews: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyViews[key] = 0;
  }
  views.forEach((v) => {
    const d = new Date(v.created_at);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (key in dailyViews) dailyViews[key]++;
  });

  const dailyData = Object.entries(dailyViews).map(([date, count]) => ({ date, count }));

  const COLORS = ["hsl(180, 100%, 50%)", "hsl(68, 100%, 50%)", "hsl(280, 100%, 60%)", "hsl(340, 80%, 55%)", "hsl(200, 80%, 50%)"];

  // Unique visitors (approximate by user_agent)
  const uniqueAgents = new Set(views.map((v) => v.user_agent)).size;

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-16">
        <div className="text-center mb-12">
          <WaterText text="analytics" as="h1" className="text-4xl md:text-5xl" />
          <p className="text-muted-foreground mt-4">Visitor insights for your portfolio</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading analytics...</div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Total Views", value: totalViews, icon: Eye },
                { label: "Today", value: todayViews, icon: TrendingUp },
                { label: "Unique Visitors", value: uniqueAgents, icon: Users },
                { label: "Pages Tracked", value: Object.keys(pageBreakdown).length, icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-neon mb-2" />
                  <p className="font-display font-bold text-2xl text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <h3 className="font-display font-bold text-foreground mb-4">Views (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <XAxis dataKey="date" tick={{ fill: "hsl(220, 5%, 55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220, 5%, 55%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220, 15%, 8%)", border: "1px solid hsl(220, 10%, 15%)", borderRadius: 8, color: "hsl(60, 5%, 90%)" }} />
                    <Bar dataKey="count" fill="hsl(180, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <h3 className="font-display font-bold text-foreground mb-4">Pages Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} (${value})`}>
                      {pageData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(220, 15%, 8%)", border: "1px solid hsl(220, 10%, 15%)", borderRadius: 8, color: "hsl(60, 5%, 90%)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent views */}
            <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <h3 className="font-display font-bold text-foreground mb-4">Recent Views</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Page</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Referrer</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {views.slice(0, 20).map((v) => (
                      <tr key={v.id} className="border-b border-border/50">
                        <td className="py-2 text-foreground">{v.page_path}</td>
                        <td className="py-2 text-muted-foreground">{v.referrer || "Direct"}</td>
                        <td className="py-2 text-muted-foreground">{new Date(v.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
