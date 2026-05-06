import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      await supabase.from("page_views").insert({
        page_path: location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
    };
    track();
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
