"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __startMusic?: () => void;
  }
}

/**
 * Invisible background-music player.
 * Plays and loops only between the timestamps 1:11 (71s) and 1:30 (90s).
 *
 * Place your MP3 at:  public/music/taaj.mp3
 */

const START_TIME = 71; // 1:11 in seconds
const END_TIME = 90;   // 1:30 in seconds

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Handle loop check on time update
    const handleTimeUpdate = () => {
      if (audio.currentTime >= END_TIME) {
        audio.currentTime = START_TIME;
      }
    };

    // Ensure it starts from START_TIME when playing begins
    const handlePlay = () => {
      if (audio.currentTime < START_TIME || audio.currentTime > END_TIME) {
        audio.currentTime = START_TIME;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);

    window.__startMusic = () => {
      audio.volume = 0.45;
      audio.currentTime = START_TIME;
      audio.play().catch(() => {});
    };

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
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
