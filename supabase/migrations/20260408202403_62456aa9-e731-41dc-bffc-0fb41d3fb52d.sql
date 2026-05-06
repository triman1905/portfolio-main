
-- Page views table for visitor analytics
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views
CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can read (admin dashboard)
CREATE POLICY "Authenticated users can read page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);

-- Guestbook entries table
CREATE TABLE public.guestbook_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Anyone can read guestbook entries
CREATE POLICY "Anyone can read guestbook entries"
ON public.guestbook_entries
FOR SELECT
TO anon, authenticated
USING (true);

-- Anyone can insert guestbook entries
CREATE POLICY "Anyone can insert guestbook entries"
ON public.guestbook_entries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
