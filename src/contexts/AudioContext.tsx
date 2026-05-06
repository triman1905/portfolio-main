import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface AudioContextType {
  musicPlaying: boolean;
  toggleMusic: () => void;
}

const AudioCtx = createContext<AudioContextType>({ musicPlaying: false, toggleMusic: () => {} });

export const useAudioContext = () => useContext(AudioCtx);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<any>(null);

  useEffect(() => {
    const AudioContextAPI = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextAPI) return;

    const ctx = new AudioContextAPI();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    const notes = [220, 261.63, 329.63, 392, 440];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;

      const g = ctx.createGain();
      g.gain.value = 0.12 - i * 0.015;
      osc.connect(g);
      g.connect(masterGain);
      g.connect(delay);

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.5 + i * 0.2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      oscillators.push(osc, lfo);
      gains.push(g);
    });

    const pulseOsc = ctx.createOscillator();
    pulseOsc.type = "sine";
    pulseOsc.frequency.value = 110;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0;
    pulseOsc.connect(pulseGain);
    pulseGain.connect(masterGain);
    oscillators.push(pulseOsc);

    const scheduleRhythm = () => {
      const now = ctx.currentTime;
      for (let i = 0; i < 64; i++) {
        const beatTime = now + i * 0.5;
        const accent = i % 4 === 0 ? 0.15 : i % 2 === 0 ? 0.08 : 0.04;
        pulseGain.gain.setValueAtTime(accent, beatTime);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.3);
      }
      return now + 32;
    };

    let rhythmTimer: number;
    const loopRhythm = () => {
      scheduleRhythm();
      rhythmTimer = window.setInterval(() => scheduleRhythm(), 16000);
    };

    audioRef.current = { ctx, masterGain, oscillators, gains, started: false, loopRhythm, rhythmTimer };

    return () => {
      clearInterval(rhythmTimer);
      oscillators.forEach((o) => { try { o.stop(); } catch {} });
      ctx.close();
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicPlaying) {
      if (!audio.started) {
        audio.ctx.resume();
        audio.oscillators.forEach((o: OscillatorNode) => o.start());
        audio.loopRhythm();
        audio.started = true;
      } else {
        audio.ctx.resume();
      }
      audio.masterGain.gain.linearRampToValueAtTime(0.35, audio.ctx.currentTime + 0.5);
    } else {
      audio.masterGain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.5);
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <AudioCtx.Provider value={{ musicPlaying, toggleMusic }}>
      {children}
    </AudioCtx.Provider>
  );
};
