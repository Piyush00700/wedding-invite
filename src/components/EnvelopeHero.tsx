"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Petal types ── */
interface Petal {
  id: number;
  left: string;
  duration: string;
  delay: string;
  size: string;
  color: string;
  rotate: string;
}

const PETAL_COLORS = [
  "#f4a0a0",
  "#f7bfbf",
  "#e87070",
  "#f9c5c5",
  "#e06060",
  "#f5d0b0",
  "#f0a0c0",
];

export default function EnvelopeHero() {
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  /* petals generated client-side only to avoid SSR hydration mismatch */
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    /* remove envelope overlay after animation ends */
    const timer = setTimeout(() => setEnvelopeGone(true), 3700);

    /* generate random petals only on client */
    setPetals(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: `${6 + Math.random() * 8}s`,
        delay: `${Math.random() * 8}s`,
        size: `${14 + Math.random() * 16}px`,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        rotate: `${Math.random() * 360}deg`,
      }))
    );

    return () => clearTimeout(timer);
  }, []);

  const scrollDown = () => {
    const next = document.getElementById("countdown");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Envelope overlay ── */}
      <AnimatePresence>
        {!envelopeGone && (
          <motion.div
            className="envelope-wrapper"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="envelope">
              <div className="env-body">
                <div className="env-flap" />
                <div className="env-seal">✦</div>
                <div className="env-card">
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      color: "var(--maroon)",
                      fontSize: "1.1rem",
                      fontStyle: "italic",
                      letterSpacing: "0.05em",
                    }}
                  >
                    You are cordially invited…
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating petals — client-only, no SSR ── */}
      <div className="petals-container">
        {petals.map((p) => (
          <div
            key={p.id}
            className="petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
              transform: `rotate(${p.rotate})`,
              borderRadius: "50% 0 50% 0",
            }}
          />
        ))}
      </div>

      {/* ── Hero section ── */}
      <section
        id="home"
        ref={sectionRef}
        className="hero-section"
      >
        {/* Decorative background mandala */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <svg viewBox="0 0 400 400" width="600" height="600">
            <circle cx="200" cy="200" r="190" fill="none" stroke="#8B0000" strokeWidth="1" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="#8B0000" strokeWidth="1" />
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x1 = 200 + 130 * Math.cos(rad);
              const y1 = 200 + 130 * Math.sin(rad);
              const x2 = 200 + 190 * Math.cos(rad);
              const y2 = 200 + 190 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="0.5" />;
            })}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 360) / 8;
              const rad = (angle * Math.PI) / 180;
              const cx = 200 + 155 * Math.cos(rad);
              const cy = 200 + 155 * Math.sin(rad);
              return <circle key={i} cx={cx} cy={cy} r="12" fill="none" stroke="#8B0000" strokeWidth="0.8" />;
            })}
            <circle cx="200" cy="200" r="30" fill="none" stroke="#D4AF37" strokeWidth="1" />
            <circle cx="200" cy="200" r="15" fill="none" stroke="#8B0000" strokeWidth="1" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          {/* Top ornament */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.7, duration: 0.8 }}
            style={{
              color: "var(--gold)",
              fontSize: "1.5rem",
              marginBottom: "1rem",
              letterSpacing: "0.5em",
            }}
          >
            ✦ ✦ ✦
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.9, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--text-mid)",
              marginBottom: "1.5rem",
            }}
          >
            The wedding of
          </motion.p>

          {/* Names */}
          <motion.h1
            className="hero-names"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.0, duration: 1, ease: "easeOut" }}
          >
            Nivedita
            <span className="hero-ampersand">&amp;</span>
            Abhishek
          </motion.h1>

          {/* Date */}
          <motion.p
            className="hero-date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.3, duration: 0.8 }}
          >
            25 · November · 2026
          </motion.p>

          {/* Location */}
          <motion.p
            className="hero-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 0.8 }}
          >
            Mapple Gold Banquets, Peeragarhi
          </motion.p>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 4.7, duration: 0.8 }}
            style={{
              width: "200px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              margin: "2rem auto 0",
            }}
          />
        </motion.div>

        {/* Scroll arrow */}
        <button
          onClick={scrollDown}
          className="scroll-arrow"
          aria-label="Scroll down"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>
    </>
  );
}
