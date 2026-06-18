"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const WEDDING_DATE = new Date("2026-11-25T20:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/* Flipping number tile — accepts null for SSR placeholder */
function CountdownBox({ value, unit }: { value: number | null; unit: string }) {
  const displayVal = value === null ? "--" : pad(value);
  return (
    <div className="countdown-box">
      <motion.div
        key={displayVal}
        className="countdown-number"
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {displayVal}
      </motion.div>
      <span className="countdown-unit">{unit}</span>
    </div>
  );
}

export default function Countdown() {
  /* null = not yet mounted (server renders nothing to avoid hydration mismatch) */
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* populate immediately on mount, then tick every second */
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  /* scroll-reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="countdown" className="countdown-section" ref={sectionRef}>
      <div className="section-wrapper">
        <motion.p
          className="countdown-label fade-up"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Until We Say I Do
        </motion.p>

        <div className="countdown-grid">
          <CountdownBox value={time?.days ?? null} unit="Days" />
          <span className="countdown-separator">:</span>
          <CountdownBox value={time?.hours ?? null} unit="Hours" />
          <span className="countdown-separator">:</span>
          <CountdownBox value={time?.minutes ?? null} unit="Minutes" />
          <span className="countdown-separator">:</span>
          <CountdownBox value={time?.seconds ?? null} unit="Seconds" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            textAlign: "center",
            marginTop: "2.5rem",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "rgba(245, 228, 156, 0.7)",
            letterSpacing: "0.05em",
          }}
        >
          25 November 2026 · Mapple Gold Banquets, Peeragarhi
        </motion.div>
      </div>
    </section>
  );
}
