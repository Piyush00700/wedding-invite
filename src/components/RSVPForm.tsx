"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SongSearch from "./SongSearch";

const FUNCTIONS = [
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Wedding Ceremony",
];

interface FormData {
  name: string;
  phone: string;
  guests: string;
  functions: string[];
  performSong: string;   // "yes" | "no" | ""
  songName: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  guests?: string;
  functions?: string;
  performSong?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your full name.";
  if (!data.phone.trim() || !/^\d{10}$/.test(data.phone.replace(/\s|-/g, "")))
    errors.phone = "Please enter a valid 10-digit phone number.";
  if (!data.guests) errors.guests = "Please select number of guests.";
  if (data.functions.length === 0)
    errors.functions = "Please select at least one function.";
  if (!data.performSong)
    errors.performSong = "Please let us know if you'd like to perform.";
  return errors;
}

export default function RSVPForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    guests: "",
    functions: [],
    performSong: "",
    songName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckbox = (fn: string) => {
    setForm((prev) => ({
      ...prev,
      functions: prev.functions.includes(fn)
        ? prev.functions.filter((f) => f !== fn)
        : [...prev.functions, fn],
    }));
    if (errors.functions) setErrors((prev) => ({ ...prev, functions: undefined }));
  };

  const handleSongName = (song: string) => {
    setForm((prev) => ({ ...prev, songName: song }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="rsvp-section">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-subheading">Will You Join Us?</p>
          <h2 className="section-heading" style={{ marginTop: "0.25rem" }}>
            RSVP
          </h2>
        </motion.div>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-icon">✦</span>
          <div className="divider-line" />
        </div>

        <motion.div
          className="rsvp-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success ── */
              <motion.div
                key="success"
                className="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <span className="success-icon">🎊</span>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-text">
                  We can&apos;t wait to celebrate with you! 🎊
                  <br />
                  <span style={{ color: "var(--gold)", fontStyle: "italic" }}>
                    With love, Nivedita &amp; Abhishek
                  </span>
                </p>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-name">
                    Full Name *
                  </label>
                  <input
                    id="rsvp-name"
                    className={`form-input${errors.name ? " error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-phone">
                    Phone Number *
                  </label>
                  <input
                    id="rsvp-phone"
                    className={`form-input${errors.phone ? " error" : ""}`}
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    maxLength={12}
                  />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                {/* Guests */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-guests">
                    Number of Guests *
                  </label>
                  <select
                    id="rsvp-guests"
                    className={`form-select${errors.guests ? " error" : ""}`}
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                  >
                    <option value="">Select number of guests</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                  {errors.guests && <p className="error-text">{errors.guests}</p>}
                </div>

                {/* Functions */}
                <div className="form-group">
                  <label className="form-label">Attending Which Functions? *</label>
                  <div className="checkbox-group">
                    {FUNCTIONS.map((fn) => (
                      <label key={fn} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={form.functions.includes(fn)}
                          onChange={() => handleCheckbox(fn)}
                          id={`fn-${fn.toLowerCase().replace(/\s/g, "-")}`}
                        />
                        {fn}
                      </label>
                    ))}
                  </div>
                  {errors.functions && (
                    <p className="error-text">{errors.functions}</p>
                  )}
                </div>

                {/* Perform a Song */}
                <div className="form-group">
                  <label className="form-label">🎤 Want to Perform a Song? *</label>
                  <p
                    style={{
                      fontFamily: "var(--font-lato), sans-serif",
                      fontSize: "0.82rem",
                      color: "var(--text-mid)",
                      marginBottom: "0.6rem",
                      fontStyle: "italic",
                    }}
                  >
                    The Sangeet stage is open — grab the mic if you dare! 🎶
                  </p>
                  <div className="radio-group" style={{ gap: "1.25rem" }}>
                    {[{ val: "yes", emoji: "🎵", label: "Yes, I'll perform!" }, { val: "no", emoji: "👏", label: "No, I'll cheer!" }].map(
                      ({ val, emoji, label }) => (
                        <label
                          key={val}
                          className="radio-label"
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            border: `1.5px solid ${
                              form.performSong === val
                                ? "var(--gold)"
                                : "rgba(212,175,55,0.2)"
                            }`,
                            background:
                              form.performSong === val
                                ? "rgba(212,175,55,0.08)"
                                : "transparent",
                            transition: "all 0.2s",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name="performSong"
                            value={val}
                            checked={form.performSong === val}
                            onChange={handleChange}
                            id={`perform-${val}`}
                          />
                          {emoji} {label}
                        </label>
                      )
                    )}
                  </div>
                  {errors.performSong && (
                    <p className="error-text">{errors.performSong}</p>
                  )}
                </div>

                {/* Song search — shown only if user picks yes */}
                {form.performSong === "yes" && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="form-label" htmlFor="rsvp-song">
                      Which song? 🎼
                    </label>
                    <p
                      style={{
                        fontFamily: "var(--font-lato), sans-serif",
                        fontSize: "0.78rem",
                        color: "var(--text-mid)",
                        marginBottom: "0.5rem",
                        fontStyle: "italic",
                      }}
                    >
                      Type to search from YouTube Music 🎧
                    </p>
                    <SongSearch value={form.songName} onChange={handleSongName} />
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirm Attendance ✦
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
