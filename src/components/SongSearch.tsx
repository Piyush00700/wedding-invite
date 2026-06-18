"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface SongItem {
  title: string;
  subtitle: string;   // "Song • Artist • Xm plays"
  thumbnail: string;
  browseId: string;
  type: string;
}

interface SongSearchProps {
  value: string;
  onChange: (song: string) => void;
}

/* ── 2-second debounce hook ── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ── Bold-highlight the matched portion ── */
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={i} style={{ color: "var(--maroon)" }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/* ── Dropdown rendered into <body> via portal ── */
function DropdownPortal({
  anchor,
  children,
}: {
  anchor: HTMLElement | null;
  children: React.ReactNode;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!anchor) return;

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchor]);

  if (typeof window === "undefined" || !anchor) return null;

  return createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
}

/* ── Extract artist / play count from subtitle ── */
function getArtist(subtitle: string) {
  return subtitle.split("•")[1]?.trim() ?? "";
}
function getPlays(subtitle: string) {
  return subtitle.split("•")[2]?.trim() ?? "";
}

export default function SongSearch({ value, onChange }: SongSearchProps) {
  const [query, setQuery] = useState(value);
  const [items, setItems] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selected, setSelected] = useState<SongItem | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 2000);

  /* ── Fetch on debounced query change ── */
  useEffect(() => {
    // Skip fetch if user just selected this exact song
    if (selected && debouncedQuery === selected.title) return;

    if (debouncedQuery.trim().length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setOpen(false);

    fetch(`/api/song-search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: abortRef.current.signal,
    })
      .then((r) => r.json())
      .then(({ items: result }: { items: SongItem[] }) => {
        setItems(result ?? []);
        setOpen((result ?? []).length > 0);
        setActiveIdx(-1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setItems([]);
          setLoading(false);
        }
      });
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        // Also allow clicks inside the portal dropdown
        const portal = document.getElementById("song-portal-root");
        if (!portal?.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Select a song ── */
  const select = useCallback(
    (item: SongItem) => {
      setSelected(item);
      setQuery(item.title);
      onChange(item.title);
      setOpen(false);
      setItems([]);
    },
    [onChange]
  );

  /* ── Keyboard navigation ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) select(items[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* ── Input ── */}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          id="rsvp-song"
          className="form-input"
          type="text"
          placeholder='Search a Bollywood song… e.g. "Tum Hi Ho"'
          value={query}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => items.length > 0 && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setSelected(null);
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="song-listbox"
          aria-activedescendant={activeIdx >= 0 ? `song-option-${activeIdx}` : undefined}
          style={{ paddingRight: "2.75rem" }}
        />

        {/* Right status icon */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "0.9rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.1rem",
            pointerEvents: "none",
            color: "var(--gold)",
          }}
        >
          {loading ? (
            <span style={{ display: "inline-block", animation: "song-spin 0.7s linear infinite" }}>
              ◌
            </span>
          ) : selected ? (
            <span style={{ color: "#2a9d2a", fontSize: "1rem" }}>✓</span>
          ) : (
            "🎙️"
          )}
        </span>
      </div>

      {/* ── Portal Dropdown — renders into <body> to escape overflow:hidden ── */}
      <DropdownPortal anchor={inputRef.current}>
        <div id="song-portal-root">
          <AnimatePresence>
            {open && items.length > 0 && (
              <motion.ul
                id="song-listbox"
                role="listbox"
                initial={{ opacity: 0, y: -6, scaleY: 0.93 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -6, scaleY: 0.93 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  background: "#fff",
                  border: "1.5px solid rgba(212,175,55,0.45)",
                  borderRadius: "12px",
                  boxShadow: "0 16px 48px rgba(139,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
                  listStyle: "none",
                  padding: "0.4rem",
                  margin: 0,
                  transformOrigin: "top center",
                  overflow: "hidden",
                }}
              >
                {/* Header row */}
                <li
                  style={{
                    padding: "0.3rem 0.75rem 0.5rem",
                    fontFamily: "var(--font-lato), sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    borderBottom: "1px solid rgba(212,175,55,0.15)",
                    marginBottom: "0.3rem",
                  }}
                >
                  🎵 Top {items.length} from YouTube Music
                </li>

                {items.map((item, i) => (
                  <motion.li
                    key={item.browseId || item.title}
                    id={`song-option-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(item);
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.55rem 0.65rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: i === activeIdx ? "rgba(212,175,55,0.1)" : "transparent",
                      borderLeft: i === activeIdx ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                      transition: "background 0.12s, border-color 0.12s",
                    }}
                  >
                    {/* Thumbnail */}
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt=""
                        width={40}
                        height={40}
                        style={{
                          borderRadius: "6px",
                          objectFit: "cover",
                          flexShrink: 0,
                          border: "1px solid rgba(212,175,55,0.25)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "6px",
                          background: "rgba(212,175,55,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          flexShrink: 0,
                        }}
                      >
                        🎵
                      </div>
                    )}

                    {/* Text */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-lato), sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--text-dark)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Highlighted text={item.title} query={query} />
                      </div>
                      {item.subtitle && (
                        <div
                          style={{
                            fontFamily: "var(--font-lato), sans-serif",
                            fontSize: "0.74rem",
                            color: "var(--text-mid)",
                            marginTop: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {getArtist(item.subtitle)}
                          {getPlays(item.subtitle) && (
                            <span style={{ opacity: 0.55, marginLeft: "0.4rem" }}>
                              · {getPlays(item.subtitle)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Type badge */}
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "0.62rem",
                        fontFamily: "var(--font-lato), sans-serif",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        background: item.type === "songs" ? "rgba(212,175,55,0.13)" : "rgba(139,0,0,0.08)",
                        color: item.type === "songs" ? "#a07a00" : "var(--maroon)",
                        fontWeight: 600,
                      }}
                    >
                      {item.type === "songs" ? "♪ Song" : "▶ Video"}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </DropdownPortal>

      {/* ── Selected confirmation chip ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            style={{
              marginTop: "0.6rem",
              padding: "0.55rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(212,175,55,0.07)",
              border: "1.5px solid rgba(212,175,55,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: "0.85rem",
              color: "var(--text-mid)",
            }}
          >
            <span style={{ color: "#2a9d2a", fontWeight: 700 }}>✓</span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <strong style={{ color: "var(--maroon)" }}>{selected.title}</strong>
              {selected.subtitle && (
                <span style={{ opacity: 0.7, marginLeft: "0.3rem" }}>
                  · {getArtist(selected.subtitle)}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setQuery("");
                onChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear selection"
              style={{
                flexShrink: 0,
                background: "none",
                border: "none",
                color: "var(--text-mid)",
                cursor: "pointer",
                fontSize: "0.9rem",
                opacity: 0.5,
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes song-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
