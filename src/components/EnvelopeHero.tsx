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

declare global {
  interface Window {
    __startMusic?: () => void;
  }
}

export default function EnvelopeHero() {
  const [isOpen, setIsOpen] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  /* petals generated client-side only to avoid SSR hydration mismatch */
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
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
  }, []);

  /* Fade out envelope overlay after animations complete */
  useEffect(() => {
    if (!isOpen) return;
    const goneTimer = setTimeout(() => setEnvelopeGone(true), 3200);
    return () => clearTimeout(goneTimer);
  }, [isOpen]);

  const handleOpenClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    /* Start background music (instantly bypasses browser restrictions since it's user-initiated) */
    window.__startMusic?.();
  };

  const scrollDown = () => {
    const next = document.getElementById("countdown");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Definitions for shared SVG gradients (e.g. gold gradient) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#F3E5AB" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Envelope overlay ── */}
      <AnimatePresence>
        {!envelopeGone && (
          <motion.div
            className="envelope-wrapper"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "fixed", inset: 0, overflow: "hidden" }}
          >
            {/* Traditional Indian hanging marigold Toran (garland) at the top */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "1200px",
              height: "80px",
              opacity: 0.1,
              pointerEvents: "none",
              zIndex: 0,
            }}>
              <svg viewBox="0 0 1000 80" width="100%" height="100%" preserveAspectRatio="none">
                {/* Dotted string */}
                <line x1="0" y1="10" x2="1000" y2="10" stroke="url(#gold-grad)" strokeWidth="1.5" strokeDasharray="3 4" />
                {/* Garland arcs and hanging marigold flowers / mango leaves */}
                {Array.from({ length: 15 }, (_, i) => {
                  const cx = (i * 70) + 35;
                  return (
                    <g key={i}>
                      {/* Swag line */}
                      <path d={`M ${cx - 35} 10 Q ${cx} 30 ${cx + 35} 10`} fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                      {/* Hanging marigold bells */}
                      <line x1={cx} y1="10" x2={cx} y2="45" stroke="url(#gold-grad)" strokeWidth="1" />
                      <circle cx={cx} cy="45" r="5" fill="url(#gold-grad)" />
                      <circle cx={cx} cy="52" r="3" fill="url(#gold-grad)" />
                      {/* Mango leaves (triangles) */}
                      <polygon points={`${cx-35},10 ${cx-30},28 ${cx-40},28`} fill="url(#gold-grad)" opacity="0.8" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Corner Illustrations - Top Left */}
            <div style={{
              position: "absolute",
              top: "-20px",
              left: "-20px",
              width: "clamp(120px, 25vw, 220px)",
              height: "clamp(120px, 25vw, 220px)",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
            }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <path d="M 0,0 C 50,0 120,40 120,120 C 120,60 180,20 200,0 C 150,50 150,150 0,200 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="15" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="80" cy="80" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <path d="M 10,10 Q 50,20 100,100" fill="none" stroke="url(#gold-grad)" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Corner Illustrations - Top Right */}
            <div style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "clamp(120px, 25vw, 220px)",
              height: "clamp(120px, 25vw, 220px)",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
              transform: "scaleX(-1)",
            }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <path d="M 0,0 C 50,0 120,40 120,120 C 120,60 180,20 200,0 C 150,50 150,150 0,200 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="15" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="80" cy="80" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <path d="M 10,10 Q 50,20 100,100" fill="none" stroke="url(#gold-grad)" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Corner Illustrations - Bottom Left */}
            <div style={{
              position: "absolute",
              bottom: "-20px",
              left: "-20px",
              width: "clamp(120px, 25vw, 220px)",
              height: "clamp(120px, 25vw, 220px)",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
              transform: "scaleY(-1)",
            }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <path d="M 0,0 C 50,0 120,40 120,120 C 120,60 180,20 200,0 C 150,50 150,150 0,200 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="15" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="80" cy="80" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <path d="M 10,10 Q 50,20 100,100" fill="none" stroke="url(#gold-grad)" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Corner Illustrations - Bottom Right */}
            <div style={{
              position: "absolute",
              bottom: "-20px",
              right: "-20px",
              width: "clamp(120px, 25vw, 220px)",
              height: "clamp(120px, 25vw, 220px)",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
              transform: "scale(-1)",
            }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <path d="M 0,0 C 50,0 120,40 120,120 C 120,60 180,20 200,0 C 150,50 150,150 0,200 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="15" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="80" cy="80" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <path d="M 10,10 Q 50,20 100,100" fill="none" stroke="url(#gold-grad)" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Left Side Hanging Diya/Bell Decoration (Hidden on mobile) */}
            <div className="env-side-deco-left" style={{
              position: "absolute",
              top: "20%",
              left: "4%",
              width: "80px",
              height: "300px",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
            }}>
              <svg viewBox="0 0 80 300" width="100%" height="100%">
                {/* Hanging chain */}
                <line x1="40" y1="0" x2="40" y2="280" stroke="url(#gold-grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Decorative element 1 */}
                <circle cx="40" cy="60" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" />
                <path d="M 30,60 L 40,45 L 50,60 Z" fill="url(#gold-grad)" />
                
                {/* Decorative element 2 (Mandala bead) */}
                <circle cx="40" cy="140" r="16" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="40" cy="140" r="8" fill="none" stroke="url(#gold-grad)" strokeWidth="0.8" />
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i * 360) / 8;
                  const rad = (angle * Math.PI) / 180;
                  return <line key={i} x1={40 + 8 * Math.cos(rad)} y1={140 + 8 * Math.sin(rad)} x2={40 + 16 * Math.cos(rad)} y2={140 + 16 * Math.sin(rad)} stroke="url(#gold-grad)" strokeWidth="0.6" />;
                })}

                {/* Hanging Diya Lamp at the bottom */}
                <g transform="translate(40, 240)">
                  {/* Oil Lamp bowl */}
                  <path d="M -25,0 C -25,18 25,18 25,0 C 20,-8 10,-12 0,-12 C -10,-12 -20,-8 -25,0 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                  {/* Diya flame */}
                  <path d="M 0,-12 C -4,-18 0,-28 0,-28 C 0,-28 4,-18 0,-12 Z" fill="url(#gold-grad)" />
                  {/* Hanging bell underneath */}
                  <path d="M -8,12 L 8,12 L 5,24 L -5,24 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" />
                  <circle cx="0" cy="27" r="2.5" fill="url(#gold-grad)" />
                </g>
              </svg>
            </div>

            {/* Right Side Hanging Diya/Bell Decoration (Hidden on mobile) */}
            <div className="env-side-deco-right" style={{
              position: "absolute",
              top: "20%",
              right: "4%",
              width: "80px",
              height: "300px",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 0,
            }}>
              <svg viewBox="0 0 80 300" width="100%" height="100%">
                {/* Hanging chain */}
                <line x1="40" y1="0" x2="40" y2="280" stroke="url(#gold-grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Decorative element 1 */}
                <circle cx="40" cy="60" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" />
                <path d="M 30,60 L 40,45 L 50,60 Z" fill="url(#gold-grad)" />
                
                {/* Decorative element 2 (Mandala bead) */}
                <circle cx="40" cy="140" r="16" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                <circle cx="40" cy="140" r="8" fill="none" stroke="url(#gold-grad)" strokeWidth="0.8" />
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i * 360) / 8;
                  const rad = (angle * Math.PI) / 180;
                  return <line key={i} x1={40 + 8 * Math.cos(rad)} y1={140 + 8 * Math.sin(rad)} x2={40 + 16 * Math.cos(rad)} y2={140 + 16 * Math.sin(rad)} stroke="url(#gold-grad)" strokeWidth="0.6" />;
                })}

                {/* Hanging Diya Lamp at the bottom */}
                <g transform="translate(40, 240)">
                  {/* Oil Lamp bowl */}
                  <path d="M -25,0 C -25,18 25,18 25,0 C 20,-8 10,-12 0,-12 C -10,-12 -20,-8 -25,0 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
                  {/* Diya flame */}
                  <path d="M 0,-12 C -4,-18 0,-28 0,-28 C 0,-28 4,-18 0,-12 Z" fill="url(#gold-grad)" />
                  {/* Hanging bell underneath */}
                  <path d="M -8,12 L 8,12 L 5,24 L -5,24 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" />
                  <circle cx="0" cy="27" r="2.5" fill="url(#gold-grad)" />
                </g>
              </svg>
            </div>

            <div 
              className={`envelope-container ${isOpen ? "open" : ""}`}
              onClick={handleOpenClick}
            >
              <div className="envelope-3d">
                
                {/* 1. Envelope Back */}
                <div className="env-back" />

                {/* 2. Top Flap (folds open upwards) */}
                <div className="env-top-flap">
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="env-flap-svg">
                    <polygon points="0,0 100,0 50,50" fill="#600000" />
                    <polyline points="0,0 50,50 100,0" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                  </svg>
                </div>

                {/* 3. Invitation Card (slides out of envelope pocket) */}
                <div className="env-card">
                  <div className="env-card-border">
                    <div className="env-card-pattern">✦</div>
                    <span className="env-card-sub">WEDDING INVITATION</span>
                    <h2 className="env-card-names">Nivedita &amp; Abhishek</h2>
                    
                    <div className="env-card-divider">
                      <span className="env-divider-line" />
                      <span className="env-divider-dot">✦</span>
                      <span className="env-divider-line" />
                    </div>
                    
                    <p className="env-card-date">25 · NOVEMBER · 2026</p>
                    <p className="env-card-location">PEERAGARHI, DELHI</p>
                  </div>
                </div>

                {/* 4. Left Flap */}
                <div className="env-left-flap">
                  <svg viewBox="0 0 50 100" preserveAspectRatio="none" className="env-flap-svg">
                    <polygon points="0,0 50,50 0,100" fill="#750505" />
                    <polyline points="0,0 50,50 0,100" fill="none" stroke="url(#gold-grad)" strokeWidth="0.75" />
                  </svg>
                </div>

                {/* 5. Right Flap */}
                <div className="env-right-flap">
                  <svg viewBox="0 0 50 100" preserveAspectRatio="none" className="env-flap-svg">
                    <polygon points="50,0 0,50 50,100" fill="#750505" />
                    <polyline points="50,0 0,50 50,100" fill="none" stroke="url(#gold-grad)" strokeWidth="0.75" />
                  </svg>
                </div>

                {/* 6. Bottom Flap */}
                <div className="env-bottom-flap">
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="env-flap-svg">
                    <polygon points="0,50 50,0 100,50" fill="#800808" />
                    <polyline points="0,50 50,0 100,50" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                  </svg>
                </div>

                {/* 7. Wax Seal (fades out as envelope opens) */}
                <div className="env-seal-wrapper">
                  <div className="env-seal">
                    <span className="env-seal-icon">✦</span>
                  </div>
                </div>

              </div>
            </div>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  position: "absolute",
                  bottom: "9%",
                  pointerEvents: "none",
                  textAlign: "center",
                  padding: "0 1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-pinyon), cursive",
                    fontSize: "clamp(2.8rem, 8vw, 4rem)",
                    color: "#FFF2B2",
                    textShadow: "0 0 16px rgba(212,175,55,0.45), 0 2px 5px rgba(0,0,0,0.6)",
                    animation: "env-cue-pulse 2s ease-in-out infinite",
                    display: "block",
                  }}
                >
                  Tap to Open
                </span>
              </motion.div>
            )}
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
