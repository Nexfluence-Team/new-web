"use client";

/**
 * app/contact/page.tsx
 * Nexfluence — Contact Page
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header
 *  2. Contact Hero
 *  3. Contact Form + Info Cards (bento grid)
 *  4. Visit Us (map)
 *  5. Final CTA
 *  6. Footer
 */

import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent } from "react";

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://nexus-creator-4rni.onrender.com";

// ─────────────────────────────────────────────
// FONT
// ─────────────────────────────────────────────
const FONT = "'Rubik', sans-serif";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
function useWindowWidth(): number {
  const [w, setW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const cb = () => setW(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return w;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  bg:       "#ffffff",
  bgSub:    "#f7f6ff",
  bgCard:   "#f2f0ff",
  ink:      "#0a0612",
  inkDim:   "rgba(10,6,18,0.50)",
  inkDim2:  "rgba(10,6,18,0.72)",
  pink:     "#ff33bc",
  violet:   "#7c55ff",
  indigo:   "#6a66ff",
  grad:     "linear-gradient(90deg, #ff33bc, #7c55ff)",
  gradD:    "linear-gradient(135deg, #ff33bc, #7c55ff)",
  border:   "1px solid rgba(124,85,255,0.18)",
  borderH:  "1px solid rgba(255,51,188,0.45)",
  borderS:  "1px solid rgba(124,85,255,0.28)",
  cardBg:   "rgba(124,85,255,0.05)",
  cardBgM:  "rgba(124,85,255,0.09)",
  shadowSm: "0 2px 12px rgba(124,85,255,0.10)",
  shadowMd: "0 8px 32px rgba(124,85,255,0.14)",
  shadowLg: "0 20px 60px rgba(124,85,255,0.18)",
} as const;

// ─────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────
const SITE_MAX_W = 1200;

function sitePad(w: number): string {
  if (w < 640) return "0 20px";
  if (w < 900) return "0 32px";
  return "0 48px";
}

function siteOuter(w: number, mt = 96): React.CSSProperties {
  return {
    maxWidth: SITE_MAX_W,
    margin: `${mt}px auto 0`,
    padding: sitePad(w),
  };
}

type CSSProps = React.CSSProperties;

// ─────────────────────────────────────────────
// ICON HELPER
// ─────────────────────────────────────────────
function Icon({ name, size = 22, style }: { name: string; size?: number; style?: CSSProps }) {
  return (
    <img
      src={`/icons/${name}.svg`}
      width={size}
      height={size}
      alt=""
      style={{ display: "block", flexShrink: 0, ...style }}
    />
  );
}

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
      textTransform: "uppercase", color: C.pink,
      marginBottom: 16, fontFamily: FONT,
    }}>
      <span style={{ display: "block", width: 20, height: 1, background: C.pink, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function GradientText({ children, style }: { children: React.ReactNode; style?: CSSProps }) {
  return (
    <span style={{
      background: C.grad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      display: "inline",
      fontFamily: FONT,
      ...style,
    }}>
      {children}
    </span>
  );
}

interface BtnProps {
  href?: string;
  onClick?: () => void;
  variant: "primary" | "ghost";
  children: React.ReactNode;
  style?: CSSProps;
  type?: "button" | "submit";
  disabled?: boolean;
}
function Btn({ href, onClick, variant, children, style, type, disabled }: BtnProps) {
  const base: CSSProps = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "13px 28px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
    textDecoration: "none", cursor: disabled ? "not-allowed" : "pointer",
    border: "none", opacity: disabled ? 0.6 : 1,
    transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
    fontFamily: FONT,
    ...style,
  };
  const vars: Record<string, CSSProps> = {
    primary: { background: C.grad, color: "#fff", boxShadow: "0 8px 32px rgba(124,85,255,0.28)" },
    ghost:   { background: "transparent", color: C.violet, border: "1.5px solid rgba(124,85,255,0.45)" },
  };
  const merged = { ...base, ...vars[variant] };
  const hover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      (e.currentTarget as HTMLElement).style.opacity = "0.88";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      (e.currentTarget as HTMLElement).style.opacity = "1";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    },
  };
  if (href) return <a href={href} style={merged} {...hover}>{children}</a>;
  return <button style={merged} onClick={onClick} type={type} disabled={disabled} {...hover}>{children}</button>;
}

// ─────────────────────────────────────────────
// FORM ATOMS
// ─────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontSize: 13, fontWeight: 600, color: C.inkDim2,
        fontFamily: FONT,
      }}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput({
  type = "text",
  placeholder,
  required,
  name,
}: {
  type?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      name={name}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px",
        borderRadius: 10, boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        background: focused ? "#fff" : C.bgSub,
        fontSize: 14, color: C.ink, fontFamily: FONT,
        outline: "none",
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
      }}
    />
  );
}

function StyledTextarea({
  placeholder,
  required,
  name,
  rows = 5,
}: {
  placeholder?: string;
  required?: boolean;
  name?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder}
      required={required}
      name={name}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px",
        borderRadius: 10, boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        background: focused ? "#fff" : C.bgSub,
        fontSize: 14, color: C.ink, fontFamily: FONT,
        outline: "none", resize: "vertical", minHeight: 130,
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
      }}
    />
  );
}

function StyledSelect({
  name,
  required,
  options,
}: {
  name?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px",
        borderRadius: 10, boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        backgroundColor: focused ? "#fff" : C.bgSub,         // ← FIX: was background
        fontSize: 14, color: C.ink, fontFamily: FONT,
        outline: "none", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(10,6,18,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        paddingRight: 36,
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background-color 0.18s", // ← FIX: was background
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creators",    href: "/creators"    },
  { label: "About Us",    href: "/about"       },
  { label: "Growth",      href: "/progress"    },
];

function Header() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cb = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", cb, { passive: true });
    return () => window.removeEventListener("scroll", cb);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      background: scrolled ? "rgba(255,255,255,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(124,85,255,0.12)" : "1px solid transparent",
      boxShadow: scrolled ? "0 2px 20px rgba(124,85,255,0.08)" : "none",
    }}>
      <div style={{
        maxWidth: SITE_MAX_W, margin: "0 auto",
        padding: isMobile ? "16px 20px" : w < 900 ? "18px 32px" : "18px 48px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/Nex.webp" alt="Nexfluence"
            width={isMobile ? 34 : 40} height={isMobile ? 34 : 40}
            style={{ borderRadius: 10 }} />
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, marginLeft: 36 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{
                fontSize: 14, fontWeight: 500, color: C.inkDim,
                textDecoration: "none", letterSpacing: "0.01em",
                transition: "color 0.18s", fontFamily: FONT,
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.inkDim)}
              >{l.label}</a>
            ))}
          </nav>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {!isMobile && (
            <Btn href="/contact" variant="primary" style={{ padding: "10px 20px", fontSize: 13 }}>
              Contact Us
            </Btn>
          )}
          {isMobile && (
            <>
              <Btn href="/contact" variant="primary" style={{ padding: "9px 14px", fontSize: 12 }}>
                Contact Us
              </Btn>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 4, color: C.ink, fontSize: 20,
              }}>{menuOpen ? "✕" : "☰"}</button>
            </>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div style={{
          background: "rgba(255,255,255,0.98)",
          borderTop: "1px solid rgba(124,85,255,0.12)",
          padding: 20, display: "flex", flexDirection: "column", gap: 20,
        }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 16, fontWeight: 500, color: C.inkDim2,
              textDecoration: "none", fontFamily: FONT,
            }}>{l.label}</a>
          ))}
          <a href="/contact" onClick={() => setMenuOpen(false)} style={{
            fontSize: 15, fontWeight: 600, color: C.pink,
            textDecoration: "none", fontFamily: FONT,
          }}>Contact Us </a>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// 2. CONTACT HERO
// ─────────────────────────────────────────────
function ContactHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "auto" : "60vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", overflow: "hidden", background: C.bg,
    }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,85,255,0.09) 0%, rgba(255,51,188,0.04) 40%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(124,85,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
          background: "linear-gradient(to top, #ffffff, transparent)",
        }} />
      </div>

      <div style={{
        maxWidth: SITE_MAX_W, width: "100%", margin: "0 auto",
        paddingTop: isMobile ? 110 : 140,
        paddingBottom: isMobile ? 48 : 72,
        paddingLeft: hPad, paddingRight: hPad,
        boxSizing: "border-box",
        position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        <PillLabel>Contact Us</PillLabel>
        <h1 style={{
          fontSize: isMobile ? 32 : isTablet ? 46 : 56,
          fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1.05, color: C.ink,
          margin: 0, marginBottom: 20, fontFamily: FONT,
        }}>
          Let&rsquo;s Start a{" "}
          <GradientText>Conversation</GradientText>
        </h1>
        <p style={{
          fontSize: isMobile ? 15 : 18, color: C.inkDim2,
          lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px",
          fontFamily: FONT,
        }}>
          Whether you're a brand ready to launch your next campaign or a
          creator wanting to join our network — we'd love to hear from you.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn href="#contact-form" variant="primary">Send a Message</Btn>
          <Btn href="mailto:harshul@nexfluence.eu" variant="ghost">
            harshul@nexfluence.eu
          </Btn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. CONTACT FORM + INFO CARDS
// ─────────────────────────────────────────────
function ContactFormSection() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const body = {
      name:    data.get("name")    as string,
      email:   data.get("email")   as string,
      type:    data.get("type")    as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
    };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      formRef.current?.reset();
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact-form" style={siteOuter(w, 0)}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.15fr 0.85fr",
        gap: isMobile ? 20 : 24,
        alignItems: "start",
      }}>

        {/* ── Form card ── */}
        <div style={{
          borderRadius: 24,
          padding: isMobile ? 24 : 40,
          background: C.cardBg,
          border: C.border,
          boxShadow: C.shadowSm,
        }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: isMobile ? "32px 0" : "48px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.violet}18, ${C.pink}10)`,
                border: C.border, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 20px",
              }}>
                <Icon name="approve" size={28} />
              </div>
              <h3 style={{
                fontSize: 22, fontWeight: 800, color: C.ink,
                marginBottom: 10, fontFamily: FONT, letterSpacing: "-0.02em",
              }}>Message Sent!</h3>
              <p style={{ fontSize: 15, color: C.inkDim, fontFamily: FONT, lineHeight: 1.7 }}>
                We'll get back to you within 24 hours.
              </p>
              <button onClick={() => setSubmitted(false)} style={{
                marginTop: 24, fontSize: 13, fontWeight: 600,
                color: C.violet, background: "none", border: "none",
                cursor: "pointer", fontFamily: FONT, textDecoration: "underline",
              }}>Send another message</button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div style={{ marginBottom: 4 }}>
                <h3 style={{
                  fontSize: isMobile ? 19 : 22, fontWeight: 800, color: C.ink,
                  letterSpacing: "-0.02em", margin: "0 0 6px", fontFamily: FONT,
                }}>Send us a Message</h3>
                <p style={{
                  fontSize: 13, color: C.inkDim, fontFamily: FONT, margin: 0,
                }}>We respond to every inquiry within 24 hours.</p>
              </div>

              {/* Name + Email row — stacks on mobile */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 14,
              }}>
                <Field label="Name">
                  <StyledInput name="name" placeholder="Your name" required />
                </Field>
                <Field label="Email">
                  <StyledInput type="email" name="email" placeholder="you@company.com" required />
                </Field>
              </div>

              {/* I am a … */}
              <Field label="I am a…">
                <StyledSelect
                  name="type"
                  required
                  options={[
                    { value: "", label: "Select one" },
                    { value: "brand", label: "Brand / Business" },
                    { value: "creator", label: "Creator / Influencer" },
                    { value: "partner", label: "Agency / Partner" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </Field>

              <Field label="Subject">
                <StyledInput name="subject" placeholder="How can we help ?" required />
              </Field>

              <Field label="Message">
                <StyledTextarea
                  name="message"
                  placeholder="Tell us more about your vision…"
                  required
                  rows={5}
                />
              </Field>

              {/* ── Error banner ── */}
              {error && (
                <div style={{
                  padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,51,188,0.07)",
                  border: "1px solid rgba(255,51,188,0.25)",
                  fontSize: 13, color: "#c0005a", fontFamily: FONT,
                }}>
                  {error}
                </div>
              )}

              <Btn
                type="submit"
                variant="primary"
                disabled={sending}
                style={{ width: "100%", marginTop: 4 }}
              >
                {sending ? "Sending…" : "Send Message "}
              </Btn>
            </form>
          )}
        </div>

        {/* ── Info cards column ── */}
        <div style={{
          display: "grid",
          // Tablet: 3 cards side by side; mobile: single column; desktop: stacked
          gridTemplateColumns: isTablet ? "repeat(3, 1fr)" : "1fr",
          gap: isMobile ? 12 : 14,
        }}>
          <InfoCard
            iconName="email"
            title="Email Us"
            lines={[
              "harshul@nexfluence.eu",
            ]}
            accent={C.violet}
          />
          {/* <InfoCard
            iconName="location"
            title="Visit Us"
            lines={[
              "Startup House Riga",
              "Lastādijas iela 12-k-3, Latgales priekšpilsēta", "Rīga, LV-1050, Latvia",
            ]}
            accent={C.pink}
          /> */}
          <InfoCard
            iconName="notify"
            title="Office Hours"
            lines={[
              "Monday – Friday",
              "10 Am – 06 Pm",
              "Saturday – Sunday : Weekends But We Still Check Messages ! ",
            ]}
            accent={C.indigo}
          />
        </div>

      </div>
    </section>
  );
}

function InfoCard({
  iconName, title, lines, accent,
}: {
  iconName: string; title: string; lines: string[]; accent: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, padding: 24,
        background: hovered ? `${accent}0a` : C.cardBg,
        border: hovered ? `1px solid ${accent}44` : C.border,
        boxShadow: hovered ? C.shadowMd : C.shadowSm,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.22s ease",
        display: "flex", flexDirection: "column", gap: 12,
        position: "relative", overflow: "hidden",
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
        }} />
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}12`, border: `1px solid ${accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={20} />
      </div>
      <h4 style={{
        fontSize: 16, fontWeight: 700, color: C.ink,
        letterSpacing: "-0.02em", margin: 0, fontFamily: FONT,
      }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {lines.map((line) => (
          <p key={line} style={{
            fontSize: 13, color: C.inkDim, margin: 0,
            lineHeight: 1.6, fontFamily: FONT,
          }}>{line}</p>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. VISIT US
// ─────────────────────────────────────────────
function VisitUs() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <PillLabel>Our Office</PillLabel>
        <h2 style={{
          fontSize: isMobile ? 26 : 38, fontWeight: 900,
          letterSpacing: "-0.035em", lineHeight: 1.1,
          color: C.ink, fontFamily: FONT,
        }}>
          Located in the Heart of <GradientText>Riga</GradientText>
        </h2>
      </div>

      <div style={{
        borderRadius: 24, overflow: "hidden",
        border: C.border, boxShadow: C.shadowMd,
        position: "relative", height: isMobile ? 240 : 400,
        background: C.bgSub,
      }}>
        {/* ── Google Maps embed ── */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2176.434082432957!2d24.114799576653905!3d56.94136387354728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eed10031e70b31%3A0x598c7b336df605c6!2sStartup%20House%20Riga!5e0!3m2!1sen!2sin!4v1780384893473!5m2!1sen!2sin"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            border: 0,
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Overlay gradient for legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,6,18,0.18) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        {/* Location badge */}
        <div style={{
          position: "absolute",
          bottom: isMobile ? 14 : 24,
          left: isMobile ? 14 : 24,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 14, padding: isMobile ? "12px 16px" : "14px 20px",
          border: "1px solid rgba(124,85,255,0.16)",
          boxShadow: C.shadowSm,
          maxWidth: isMobile ? 220 : 280,
          zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Icon name="location" size={13} />
            <p style={{
              fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.ink,
              margin: 0, fontFamily: FONT,
            }}>Nexfluence HQ</p>
          </div>
          <p style={{
            fontSize: isMobile ? 12 : 13, color: C.inkDim,
            margin: 0, fontFamily: FONT,
          }}>Brīvības iela 123, Riga, Latvia</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ ...siteOuter(w, 96), marginBottom: 0 }}>
      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        padding: isMobile ? "48px 24px" : "68px 72px",
        background: `linear-gradient(135deg, ${C.violet}0e, ${C.pink}08)`,
        border: C.borderS, textAlign: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,85,255,0.11) 0%, rgba(255,51,188,0.05) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(124,85,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.055) 1px, transparent 1px)",
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <PillLabel>Let's Collaborate</PillLabel>
          <h2 style={{
            fontSize: isMobile ? 26 : 42, fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.1,
            color: C.ink, marginBottom: 14, fontFamily: FONT,
          }}>
            Ready to Create
            <br />
            <GradientText>Something Impactful?</GradientText>
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, color: C.inkDim,
            maxWidth: 460, margin: "0 auto 36px",
            lineHeight: 1.75, fontFamily: FONT,
          }}>
            Brands grow. Creators earn. Both win. Let's make it happen.
          </p>
          <Btn href="mailto:hello@nexfluence.eu" variant="primary">Start Now </Btn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. FOOTER
// ─────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: ["Creator Discovery", "Campaign Management", "Analytics", "Affiliate Programs"],
  Company:  ["About Us", "Blog", "Careers", "Press"],
  Contact:  ["brands@nexfluence.eu", "creators@nexfluence.eu", "Instagram", "LinkedIn"],
};

function Footer() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <footer style={{
      borderTop: "1px solid rgba(124,85,255,0.12)",
      maxWidth: SITE_MAX_W,
      margin: "96px auto 0",
      padding: isMobile ? "48px 20px 32px" : w < 900 ? "56px 32px 36px" : "60px 48px 36px",
      background: C.bg,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
        gap: isMobile ? "32px 20px" : 36, marginBottom: 48,
      }}>
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Image src="/Nex.webp" alt="Nexfluence" width={38} height={38} style={{ borderRadius: 9 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: 0, fontFamily: FONT }}>Nexfluence</p>
              <p style={{ fontSize: 10, color: C.pink, letterSpacing: "0.08em", margin: 0, fontFamily: FONT }}>CREATOR NEXUS</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, maxWidth: 230, fontFamily: FONT }}>
            Latvia's first performance‑based influencer marketing platform
            connecting brands with authentic Baltic creators.
          </p>
          <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
            {["IG", "LI", "TT"].map((s) => (
              <a key={s} href="#" style={{
                width: 32, height: 32, borderRadius: 7,
                background: C.bgSub, border: C.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: C.inkDim,
                textDecoration: "none", transition: "color 0.18s, border-color 0.18s",
                fontFamily: FONT,
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.ink; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,51,188,0.38)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.inkDim; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(124,85,255,0.18)"; }}
              >{s}</a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(10,6,18,0.35)",
              marginBottom: 14, fontFamily: FONT,
            }}>{col}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {links.map((link) => (
                <a key={link} href="#" style={{
                  fontSize: 13, color: C.inkDim, textDecoration: "none",
                  transition: "color 0.18s", fontFamily: FONT,
                }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.inkDim)}
                >{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(124,85,255,0.08)", paddingTop: 22,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <p style={{ fontSize: 12, color: "rgba(10,6,18,0.28)", margin: 0, fontFamily: FONT }}>
          © {new Date().getFullYear()} Nexfluence. Registered in Europe. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a key={l} href="#" style={{
              fontSize: 12, color: "rgba(10,6,18,0.30)",
              textDecoration: "none", fontFamily: FONT,
            }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      <Header />
      <ContactHero />
      <ContactFormSection />
      <VisitUs />
      <FinalCTA />
      <Footer />
    </div>
  );
}