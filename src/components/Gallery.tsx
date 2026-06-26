"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* Real couple photos */
const IMAGES = [
  { src: "/gallery/photo1.jpeg", w: 576, h: 1024, alt: "A sweet moment together" },
  { src: "/gallery/photo2.jpeg", w: 750, h: 900, alt: "Smiling together" },
  { src: "/gallery/photo3.jpeg", w: 810, h: 1080, alt: "The ring ceremony" },
  { src: "/gallery/photo4.png",  w: 810, h: 608,  alt: "Rings & bangles" },
  { src: "/gallery/photo5.jpeg", w: 810, h: 1080, alt: "A day out at Kalsang" },
  { src: "/gallery/photo6.jpeg", w: 810, h: 1080, alt: "Together always" },
];

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* scroll-reveal */
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLElement>(".gallery-item");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-up-active");
        }),
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  /* Keyboard navigation */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight")
        setLightboxIdx((prev) => (prev === null ? 0 : (prev + 1) % IMAGES.length));
      if (e.key === "ArrowLeft")
        setLightboxIdx((prev) =>
          prev === null ? 0 : (prev - 1 + IMAGES.length) % IMAGES.length
        );
    },
    [lightboxIdx]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Lock body scroll when lightbox is open */
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef}>
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-subheading">Memories</p>
          <h2 className="section-heading" style={{ marginTop: "0.25rem" }}>
            Our Gallery
          </h2>
        </motion.div>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-icon">✦</span>
          <div className="divider-line" />
        </div>

        <div className="gallery-grid">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{ opacity: 0, transform: "translateY(30px)", transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s` }}
              onClick={() => setLightboxIdx(i)}
              role="button"
              tabIndex={0}
              aria-label={`View ${img.alt}`}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(i)}
              ref={(el) => {
                if (!el) return;
                const io = new IntersectionObserver(([entry]) => {
                  if (entry.isIntersecting) {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                    io.disconnect();
                  }
                }, { threshold: 0.1 });
                io.observe(el);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <div
        className={`lightbox${lightboxIdx !== null ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setLightboxIdx(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        {lightboxIdx !== null && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lightbox-img"
              src={IMAGES[lightboxIdx].src}
              alt={IMAGES[lightboxIdx].alt}
            />
            <button
              className="lightbox-close"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              onClick={() =>
                setLightboxIdx((prev) =>
                  prev === null ? 0 : (prev - 1 + IMAGES.length) % IMAGES.length
                )
              }
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="lightbox-nav lightbox-next"
              onClick={() =>
                setLightboxIdx((prev) =>
                  prev === null ? 0 : (prev + 1) % IMAGES.length
                )
              }
              aria-label="Next image"
            >
              ›
            </button>
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(212,175,55,0.7)",
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              {lightboxIdx + 1} / {IMAGES.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
