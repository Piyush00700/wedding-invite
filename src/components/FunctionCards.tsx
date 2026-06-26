"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const EVENTS = [
  {
    name: "Mehendi",
    icon: "🌸",
    date: "Sunday, 22 November 2026",
    time: "11:00 AM onwards",
    venue: "Our Home",
    bg: "#90BE6D",
    textColor: "#1a3a0a",
    overlayColor: "rgba(144,190,109,0.55)",
    bgImage: "/event-bg/mehendi.png",
    mapsUrl: "https://maps.google.com/?q=Peeragarhi+Delhi",
  },
  {
    name: "Haldi",
    icon: "🌿",
    date: "Monday, 23 November 2026",
    time: "11:00 AM onwards",
    venue: "Mapple Gold Banquets, Peeragarhi",
    bg: "#F9C74F",
    textColor: "#3a2800",
    overlayColor: "rgba(249,199,79,0.55)",
    bgImage: "/event-bg/haldi.png",
    mapsUrl:
      "https://maps.google.com/?q=Mapple+Gold+Banquets+Peeragarhi+Delhi",
  },
  {
    name: "Sangeet",
    icon: "🎶",
    date: "Monday, 23 November 2026",
    time: "3:00 PM onwards",
    venue: "Mapple Gold Banquets, Peeragarhi",
    bg: "#6A4C93",
    textColor: "#f5e6ff",
    overlayColor: "rgba(106,76,147,0.60)",
    bgImage: "/event-bg/sangeet.png",
    mapsUrl:
      "https://maps.google.com/?q=Mapple+Gold+Banquets+Peeragarhi+Delhi",
  },
  {
    name: "Wedding Ceremony",
    icon: "🔥",
    date: "Tuesday, 24 November 2026",
    time: "8:00 PM onwards",
    venue: "Mapple Gold Banquets, Peeragarhi",
    bg: "#8B0000",
    textColor: "#D4AF37",
    overlayColor: "rgba(139,0,0,0.62)",
    bgImage: "/event-bg/wedding.png",
    mapsUrl:
      "https://maps.google.com/?q=Mapple+Gold+Banquets+Peeragarhi+Delhi",
  },
];

/* Icon SVGs */
function CalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

export default function FunctionCards() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Intersection Observer for scroll-triggered animation */
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".event-card");
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (entry.target as HTMLElement).classList.add("visible");
            }, Number((entry.target as HTMLElement).dataset.delay || 0));
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="events" className="functions-section" ref={sectionRef}>
      <div className="section-wrapper">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-subheading">Join Us For</p>
          <h2 className="section-heading" style={{ marginTop: "0.25rem" }}>
            Wedding Functions
          </h2>
        </motion.div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: "0" }}>
          <div className="divider-line" />
          <span className="divider-icon">✦</span>
          <div className="divider-line" />
        </div>

        {/* Cards */}
        <div className="cards-grid">
          {EVENTS.map((event, i) => (
            <div
              key={event.name}
              className="event-card"
              data-delay={i * 120}
              style={{
                backgroundColor: event.bg,
                color: event.textColor,
                boxShadow: `0 8px 30px ${event.bg}55`,
                backgroundImage: `url(${event.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Colour overlay so text stays readable */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: event.overlayColor,
                  backdropFilter: "blur(1px)",
                  zIndex: 0,
                }}
              />
              {/* Card content above overlay */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <span className="event-icon">{event.icon}</span>
                <h3
                  className="event-name"
                  style={{ color: event.textColor }}
                >
                  {event.name}
                </h3>
                <div className="event-details" style={{ color: event.textColor }}>
                  <div className="event-detail-row">
                    <CalIcon />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail-row">
                    <ClockIcon />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail-row">
                    <PinIcon />
                    <span>{event.venue}</span>
                  </div>
                </div>
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-btn"
                  style={{ color: event.textColor }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
