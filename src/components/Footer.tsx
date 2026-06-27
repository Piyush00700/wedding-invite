"use client";

import { motion } from "framer-motion";

/* Decorative mandala SVG */
function MandalaSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      width="120"
      height="120"
      style={{ opacity: 0.4 }}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="95" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="55" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="100" cy="100" r="6" fill="#D4AF37" />
      {/* Spokes */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 18 * Math.cos(rad);
        const y1 = 100 + 18 * Math.sin(rad);
        const x2 = 100 + 95 * Math.cos(rad);
        const y2 = 100 + 95 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D4AF37"
            strokeWidth="0.4"
            opacity="0.6"
          />
        );
      })}
      {/* Petal circles */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 75 * Math.cos(rad);
        const cy = 100 + 75 * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="8"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.8"
          />
        );
      })}
      {/* Inner petals */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 360) / 8 + 22.5;
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 45 * Math.cos(rad);
        const cy = 100 + 45 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="6"
            ry="10"
            fill="rgba(212,175,55,0.15)"
            stroke="#D4AF37"
            strokeWidth="0.5"
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Mandala */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <MandalaSVG />
        </div>

        {/* Names */}
        <p className="footer-names">Abhishek &amp; Nivedita</p>
        <p className="footer-tagline">25 November 2026 · Mapple Gold Banquets, Peeragarhi</p>

        {/* Gold ornament */}
        <div
          style={{
            color: "var(--gold)",
            letterSpacing: "0.5em",
            fontSize: "1.2rem",
            marginBottom: "1.5rem",
          }}
        >
          ✦ ✦ ✦
        </div>

        {/* Love quote */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "1.25rem",
            fontStyle: "italic",
            color: "rgba(255, 248, 240, 0.7)",
            maxWidth: "480px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
          }}
        >
          &ldquo;Two souls, one heart, forever together.&rdquo;
        </p>

        {/* Divider */}
        <div
          style={{
            width: "200px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
            margin: "0 auto 1.5rem",
          }}
        />

        {/* Contact */}
        <div className="footer-contact">
          <p>📍 Mapple Gold Banquets, Peeragarhi, New Delhi</p>
          <p style={{ marginTop: "0.4rem" }}>
            For queries:{" "}
            <span style={{ color: "var(--gold)" }}>+91 98765 43210</span>
          </p>
        </div>

        {/* Copyright */}
        <p className="footer-copy">
          Made with ❤️ · Abhishek &amp; Nivedita · 2026
        </p>
      </motion.div>
    </footer>
  );
}
