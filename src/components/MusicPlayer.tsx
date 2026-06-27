"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __startMusic?: () => void;
  }
}

/**
 * Invisible background-music player.
 * Listens to a global window event trigger `window.__startMusic()`
 * which is called when the user taps/opens the envelope.
 *
 * Place your MP3 at:  public/music/taaj.mp3
 */

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    window.__startMusic = () => {
      audio.volume = 0.45;
      audio.play().catch(() => {});
    };

    return () => {
      delete window.__startMusic;
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music/taaj.mp3"
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
