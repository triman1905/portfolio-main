import { useEffect, useState } from "react";

// ─── SETUP ────────────────────────────────────────────────────────────────────
// 1. Go to https://developer.spotify.com/dashboard and create an app
// 2. Set redirect URI to: http://localhost:8888/callback
// 3. Add your Client ID and Client Secret below
// 4. Get a refresh token using the Spotify OAuth flow (scope: user-read-currently-playing)
//    You can use: https://spotify-refresh-token-generator.netlify.app
// 5. Paste all three values below
const SPOTIFY_CLIENT_ID = "YOUR_CLIENT_ID";
const SPOTIFY_CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const SPOTIFY_REFRESH_TOKEN = "YOUR_REFRESH_TOKEN";
// ─────────────────────────────────────────────────────────────────────────────

interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  songUrl: string;
  progress: number;
  duration: number;
}

async function getAccessToken(): Promise<string> {
  const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchNowPlaying(): Promise<NowPlaying | null> {
  if (
    !SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === "YOUR_CLIENT_ID" ||
    !SPOTIFY_REFRESH_TOKEN || SPOTIFY_REFRESH_TOKEN === "YOUR_REFRESH_TOKEN"
  ) return null;

  try {
    const token = await getAccessToken();
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 204 || res.status > 400) return null;
    const data = await res.json();
    if (!data || !data.item) return null;

    return {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
      albumArt: data.item.album.images[0]?.url ?? "",
      songUrl: data.item.external_urls.spotify,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
    };
  } catch {
    return null;
  }
}

const SpotifyBars = ({ playing }: { playing: boolean }) => (
  <div className="flex items-end gap-[2px] h-3">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-[3px] rounded-full bg-[#1DB954]"
        style={{
          height: playing ? `${[6, 12, 9, 14][i - 1]}px` : "4px",
          animation: playing ? `spotifyBar 0.8s ease-in-out infinite ${i * 0.12}s` : "none",
          transition: "height 0.3s ease",
        }}
      />
    ))}
    <style>{`
      @keyframes spotifyBar {
        0%, 100% { transform: scaleY(0.4); }
        50% { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

const SpotifyNowPlaying = () => {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNowPlaying();
      setTrack(data);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !track) return null;

  const progressPct = Math.round((track.progress / track.duration) * 100);

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-secondary/60 border border-border rounded-xl px-3 py-2.5 hover:border-neon/30 transition-all duration-300 max-w-[260px]"
    >
      {/* Album art */}
      <div className="relative flex-shrink-0">
        <img
          src={track.albumArt}
          alt={track.title}
          className="w-9 h-9 rounded-md object-cover"
        />
        {/* Spotify logo overlay */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1DB954] flex items-center justify-center">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-xs font-medium text-foreground truncate group-hover:text-neon transition-colors">
            {track.title}
          </p>
          <SpotifyBars playing={track.isPlaying} />
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
        {/* Progress bar */}
        <div className="mt-1.5 h-[2px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1DB954] rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </a>
  );
};

export default SpotifyNowPlaying;
