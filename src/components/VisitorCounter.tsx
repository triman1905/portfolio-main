import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { count: total, error } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      if (!error && total !== null) {
        setCount(total);
      }
    };

    fetchCount();

    // Subscribe to real-time inserts
    const channel = supabase
      .channel("page_views_count")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_views" }, () => {
        setCount((prev) => (prev !== null ? prev + 1 : 1));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (count !== null) {
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [count]);

  if (count === null) return null;

  return (
    <div
      className="flex items-center gap-2 text-xs text-muted-foreground"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon" />
      </span>
      <span>
        <span className="text-foreground font-medium font-display">
          {count.toLocaleString()}
        </span>{" "}
        developers visited
      </span>
    </div>
  );
};

export default VisitorCounter;
