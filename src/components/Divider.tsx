"use client";

import { motion } from "framer-motion";

interface DividerProps {
  icon?: string;
  color?: string;
}

export default function Divider({ icon = "✦", color = "var(--gold)" }: DividerProps) {
  return (
    <motion.div
      className="divider"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="divider-line" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <span className="divider-icon" style={{ color }}>{icon}</span>
      <div className="divider-line" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </motion.div>
  );
}
