import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import WaterText from "./WaterText";
import { Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuestbookEntry {
  id: string;
  visitor_name: string;
  message: string;
  created_at: string;
}

const Guestbook = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  };

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName || !trimmedMsg) {
      toast({ title: "Please fill in both fields", variant: "destructive" });
      return;
    }
    if (trimmedName.length > 50 || trimmedMsg.length > 500) {
      toast({ title: "Name (max 50) or message (max 500) too long", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("guestbook_entries").insert({
      visitor_name: trimmedName,
      message: trimmedMsg,
    });

    if (error) {
      toast({ title: "Failed to post message", variant: "destructive" });
    } else {
      toast({ title: "Message posted! ✨" });
      setName("");
      setMessage("");
      fetchEntries();
    }
    setLoading(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <section className="py-20 px-6 md:px-12" id="guestbook">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <WaterText text="guestbook" as="h2" className="text-3xl md:text-4xl" />
          <p className="text-muted-foreground mt-4">Leave a message, say hello! 👋</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-12 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              maxLength={50}
              className="flex-1 px-4 py-2.5 rounded-md bg-secondary border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none transition-all duration-300"
              style={{
                borderColor: focusedField === "name" ? "hsl(180, 100%, 60%)" : "hsl(var(--border))",
                boxShadow: focusedField === "name" ? "0 0 16px hsl(180 100% 50% / 0.25), inset 0 0 8px hsl(180 100% 70% / 0.05)" : "none",
              }}
            />
          </div>
          <div className="flex gap-3">
            <textarea
              placeholder="Leave a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              maxLength={500}
              rows={2}
              className="flex-1 px-4 py-2.5 rounded-md bg-secondary border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none transition-all duration-300 resize-none"
              style={{
                borderColor: focusedField === "message" ? "hsl(180, 100%, 60%)" : "hsl(var(--border))",
                boxShadow: focusedField === "message" ? "0 0 16px hsl(180 100% 50% / 0.25), inset 0 0 8px hsl(180 100% 70% / 0.05)" : "none",
              }}
            />
            <button
              ref={btnRef}
              type="submit"
              disabled={loading}
              onClick={handleRipple}
              className="self-end px-4 py-2.5 rounded-md bg-neon text-background font-display font-bold text-sm hover:shadow-[0_0_20px_hsl(var(--neon)/0.4)] transition-all disabled:opacity-50 flex items-center gap-2 relative overflow-hidden"
            >
              {ripple && (
                <span
                  className="absolute pointer-events-none rounded-full bg-white/30"
                  style={{
                    width: 120,
                    height: 120,
                    left: ripple.x - 60,
                    top: ripple.y - 60,
                    animation: "ripple 0.6s ease-out forwards",
                  }}
                />
              )}
              <Send className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Post</span>
            </button>
          </div>
        </form>

        {/* Entries */}
        <div className="space-y-4">
          {entries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No messages yet. Be the first!</p>
            </div>
          )}
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg border border-border bg-card/30 backdrop-blur-sm hover:border-neon/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display font-bold text-foreground text-sm">{entry.visitor_name}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(entry.created_at)}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Ripple keyframe injected globally once
if (typeof document !== "undefined" && !document.getElementById("guestbook-ripple-style")) {
  const s = document.createElement("style");
  s.id = "guestbook-ripple-style";
  s.textContent = `@keyframes ripple { from { transform: scale(0); opacity: 1; } to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(s);
}

export default Guestbook;
