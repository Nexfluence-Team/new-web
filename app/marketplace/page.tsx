"use client";

/**
 * app/marketplace/page.tsx
 * Nexfluence — Marketplace Coming Soon Page
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header (shared)
 *  2. Marketplace Hero (coming soon + countdown)
 *  3. Feature Preview (what's coming bento)
 *  4. Interest Registration Form
 *  5. Founder Statement
 *  6. Footer (shared, full)
 */

import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent } from "react";

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

function Btn({ href, onClick, variant, children, style, type, disabled }: {
  href?: string; onClick?: () => void;
  variant: "primary" | "ghost";
  children: React.ReactNode; style?: CSSProps;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base: CSSProps = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "13px 28px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
    textDecoration: "none", cursor: disabled ? "not-allowed" : "pointer",
    border: "none", opacity: disabled ? 0.6 : 1,
    transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
    fontFamily: FONT, ...style,
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
// FORM ATOMS (with focus state, same as contact)
// ─────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.inkDim2, fontFamily: FONT }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ type = "text", placeholder, required, name }: {
  type?: string; placeholder?: string; required?: boolean; name?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder} required={required} name={name}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px", borderRadius: 10,
        boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        background: focused ? "#fff" : C.bgSub,
        fontSize: 14, color: C.ink, fontFamily: FONT, outline: "none",
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
      }}
    />
  );
}

function StyledSelect({ name, required, options }: {
  name?: string; required?: boolean;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px", borderRadius: 10,
        boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        background: focused ? "#fff" : C.bgSub,
        fontSize: 14, color: C.ink, fontFamily: FONT, outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(10,6,18,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        paddingRight: 36,
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
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
// 1. HEADER (unified)
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
          }}>Contact Us →</a>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// COUNTDOWN HOOK — counts down to launch date
// ─────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-07-01T00:00:00");

function useCountdown() {
  const calc = () => {
    const diff = LAUNCH_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─────────────────────────────────────────────
// 2. MARKETPLACE HERO
// ─────────────────────────────────────────────
function MarketplaceHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "auto" : "100vh",
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
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          background: "linear-gradient(to top, #ffffff, transparent)",
        }} />
      </div>

      <div style={{
        maxWidth: SITE_MAX_W, width: "100%", margin: "0 auto",
        paddingTop: isMobile ? 120 : 150,
        paddingBottom: isMobile ? 56 : 100,
        paddingLeft: hPad, paddingRight: hPad,
        boxSizing: "border-box",
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <PillLabel>Coming Soon — July 2026</PillLabel>
        <h1 style={{
          fontSize: isMobile ? 32 : isTablet ? 46 : 58,
          fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1.05, color: C.ink,
          margin: 0, marginBottom: 20, fontFamily: FONT,
        }}>
          Europe's Most Active
          <br />
          <GradientText>Creator Economy Marketplace</GradientText>
        </h1>
        <p style={{
          fontSize: isMobile ? 15 : 18, color: C.inkDim2,
          lineHeight: 1.75, maxWidth: 580, margin: "0 auto 40px",
          fontFamily: FONT,
        }}>
          A fully transparent, performance-based platform where brands and
          creators connect, collaborate, and grow — built with creator input
          at every step.
        </p>

        {/* Countdown */}
        <div style={{
          display: "inline-flex", gap: isMobile ? 12 : 20,
          background: C.bgSub, border: C.border,
          borderRadius: 20, padding: isMobile ? "16px 20px" : "20px 36px",
          boxShadow: C.shadowSm, marginBottom: 36,
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { value: days,    label: "Days"    },
            { value: hours,   label: "Hours"   },
            { value: minutes, label: "Minutes" },
            { value: seconds, label: "Seconds" },
          ].map((unit, i) => (
            <div key={unit.label} style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20 }}>
              <div style={{ textAlign: "center", minWidth: isMobile ? 44 : 56 }}>
                <p style={{
                  fontSize: isMobile ? 28 : 40, fontWeight: 900,
                  letterSpacing: "-0.05em", margin: 0, lineHeight: 1,
                  background: C.grad, WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", backgroundClip: "text",
                  fontFamily: FONT,
                }}>{String(unit.value).padStart(2, "0")}</p>
                <p style={{
                  fontSize: 10, fontWeight: 600, color: C.inkDim,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  margin: "4px 0 0", fontFamily: FONT,
                }}>{unit.label}</p>
              </div>
              {i < 3 && (
                <span style={{
                  fontSize: isMobile ? 20 : 28, fontWeight: 300,
                  color: "rgba(124,85,255,0.25)", lineHeight: 1,
                }}>:</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn href="#register" variant="primary">Register Interest →</Btn>
          <Btn href="/contact" variant="ghost">Talk to Us</Btn>
        </div>

        {/* Social proof */}
        <p style={{
          fontSize: 12, color: C.inkDim, marginTop: 20, fontFamily: FONT,
        }}>
          <span style={{ color: C.ink, fontWeight: 700 }}>500+ creators</span>
          {" "}and{" "}
          <span style={{ color: C.ink, fontWeight: 700 }}>25+ brands</span>
          {" "}already waiting for launch
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. FEATURE PREVIEW BENTO
// ─────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🔍",
    title: "Smart Creator Discovery",
    desc: "Filter 500+ verified creators by niche, audience demographics, engagement rate, and Baltic location — not just follower count.",
    accent: C.violet,
    wide: true,
  },
  {
    icon: "📊",
    title: "Live Performance Tracking",
    desc: "Real-time dashboards for every campaign — clicks, conversions, and revenue tracked to the cent.",
    accent: C.pink,
    wide: false,
  },
  {
    icon: "🤝",
    title: "Managed Contracts",
    desc: "Digital contracts, content briefs, approval workflows, and payments all in one place.",
    accent: C.indigo,
    wide: false,
  },
  {
    icon: "⚡",
    title: "100% Performance-Based",
    desc: "You only pay when real results are delivered. No upfront costs, no guessing.",
    accent: C.violet,
    wide: false,
  },
  {
    icon: "🌍",
    title: "Baltic-Native",
    desc: "Built for Latvia, Lithuania, and Estonia — the creators, the culture, the consumers.",
    accent: C.pink,
    wide: false,
  },
];

function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 22, padding: 26,
        background: hovered ? `${feature.accent}0a` : C.cardBg,
        border: hovered ? `1px solid ${feature.accent}44` : C.border,
        boxShadow: hovered ? `0 20px 56px ${feature.accent}12` : C.shadowSm,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.22s ease",
        display: "flex", flexDirection: "column", gap: 14,
        position: "relative", overflow: "hidden",
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
          background: `linear-gradient(90deg, transparent, ${feature.accent}55, transparent)`,
        }} />
      )}
      <div style={{
        width: 48, height: 48, borderRadius: 13,
        background: `${feature.accent}12`, border: `1px solid ${feature.accent}24`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{feature.icon}</div>
      <h3 style={{
        fontSize: 16, fontWeight: 700, color: C.ink,
        letterSpacing: "-0.02em", margin: 0, fontFamily: FONT,
      }}>{feature.title}</h3>
      <p style={{
        fontSize: 13, color: C.inkDim, lineHeight: 1.75,
        margin: 0, fontFamily: FONT,
      }}>{feature.desc}</p>
    </div>
  );
}

function FeaturePreview() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  return (
    <section style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <PillLabel>What's Coming</PillLabel>
        <h2 style={{
          fontSize: isMobile ? 26 : 38, fontWeight: 900,
          letterSpacing: "-0.035em", lineHeight: 1.1,
          color: C.ink, marginBottom: 14, fontFamily: FONT,
        }}>
          Everything in One <GradientText>Platform</GradientText>
        </h2>
        <p style={{
          fontSize: isMobile ? 14 : 16, color: C.inkDim,
          maxWidth: 500, margin: "0 auto", lineHeight: 1.75, fontFamily: FONT,
        }}>
          The marketplace brings every tool a brand or creator needs into a
          single, beautifully simple workspace.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
      ) : isTablet ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{ gridColumn: i === 0 ? "1 / -1" : "auto" }}>
              <FeatureCard feature={f} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
          {/* Wide feature spans 6 cols, next two each take 3 */}
          <div style={{ gridColumn: "1 / 7" }}><FeatureCard feature={FEATURES[0]} /></div>
          <div style={{ gridColumn: "7 / 10" }}><FeatureCard feature={FEATURES[1]} /></div>
          <div style={{ gridColumn: "10 / 13" }}><FeatureCard feature={FEATURES[2]} /></div>
          <div style={{ gridColumn: "1 / 5" }}><FeatureCard feature={FEATURES[3]} /></div>
          <div style={{ gridColumn: "5 / 9" }}><FeatureCard feature={FEATURES[4]} /></div>
          {/* Launch date callout — fills remaining 4 cols */}
          <div style={{ gridColumn: "9 / 13" }}>
            <div style={{
              borderRadius: 22, padding: 26, height: "100%", boxSizing: "border-box",
              background: `linear-gradient(135deg, ${C.violet}12, ${C.pink}08)`,
              border: `1px solid ${C.violet}20`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", gap: 12,
            }}>
              <span style={{ fontSize: 36 }}>🚀</span>
              <p style={{
                fontSize: 11, fontWeight: 700, color: C.inkDim,
                letterSpacing: "0.1em", textTransform: "uppercase",
                margin: 0, fontFamily: FONT,
              }}>Launching</p>
              <p style={{
                fontSize: 28, fontWeight: 900, letterSpacing: "-0.04em",
                lineHeight: 1, margin: 0, fontFamily: FONT,
                background: C.grad, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>July 2026</p>
              <Btn href="#register" variant="primary" style={{ padding: "10px 20px", fontSize: 13, width: "100%" }}>
                Get Early Access →
              </Btn>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. INTEREST REGISTRATION FORM
// ─────────────────────────────────────────────
function InterestForm() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Replace with actual API call
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      formRef.current?.reset();
    }, 1200);
  };

  return (
    <section id="register" style={siteOuter(w)}>
      <div style={{
        borderRadius: 24, padding: isMobile ? 24 : 48,
        background: C.cardBg, border: C.border,
        boxShadow: C.shadowSm, maxWidth: 680, margin: "0 auto",
      }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.violet}18, ${C.pink}10)`,
              border: C.border, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 28, margin: "0 auto 20px",
            }}>✅</div>
            <h3 style={{
              fontSize: 22, fontWeight: 800, color: C.ink,
              marginBottom: 10, fontFamily: FONT, letterSpacing: "-0.02em",
            }}>You're on the list!</h3>
            <p style={{
              fontSize: 15, color: C.inkDim, fontFamily: FONT, lineHeight: 1.7,
            }}>
              We'll notify you as soon as the marketplace goes live.
              Expect early access perks.
            </p>
            <button onClick={() => setSubmitted(false)} style={{
              marginTop: 20, fontSize: 13, fontWeight: 600,
              color: C.violet, background: "none", border: "none",
              cursor: "pointer", fontFamily: FONT, textDecoration: "underline",
            }}>Register another person</button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div style={{ marginBottom: 4 }}>
              <h3 style={{
                fontSize: isMobile ? 20 : 24, fontWeight: 800, color: C.ink,
                letterSpacing: "-0.02em", margin: "0 0 8px", fontFamily: FONT,
              }}>Register Your Interest</h3>
              <p style={{ fontSize: 14, color: C.inkDim, margin: 0, fontFamily: FONT }}>
                Be first in line. We'll reach out with early access details.
              </p>
            </div>

            {/* Name + Email */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 14,
            }}>
              <Field label="Full Name">
                <StyledInput name="name" placeholder="Your name" required />
              </Field>
              <Field label="Email">
                <StyledInput type="email" name="email" placeholder="you@company.com" required />
              </Field>
            </div>

            {/* Location */}
            <Field label="Where are you based?">
              <StyledInput name="location" placeholder="City, Country" required />
            </Field>

            {/* Role + Industry */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 14,
            }}>
              <Field label="I am a…">
                <StyledSelect name="role" required options={[
                  { value: "",        label: "Select role"     },
                  { value: "brand",   label: "Brand / Business"},
                  { value: "creator", label: "Creator / Influencer" },
                  { value: "agency",  label: "Agency / Partner"},
                  { value: "other",   label: "Other"           },
                ]} />
              </Field>
              <Field label="Industry">
                <StyledSelect name="industry" required options={[
                  { value: "",       label: "Select industry"   },
                  { value: "beauty", label: "Beauty & Cosmetics"},
                  { value: "fashion",label: "Fashion"           },
                  { value: "fitness",label: "Fitness & Wellness"},
                  { value: "food",   label: "Food & Beverage"   },
                  { value: "tech",   label: "Tech & Startups"   },
                  { value: "travel", label: "Travel & Lifestyle"},
                  { value: "other",  label: "Other"             },
                ]} />
              </Field>
            </div>

            <Btn
              type="submit" variant="primary"
              disabled={sending}
              style={{ width: "100%", marginTop: 4 }}
            >
              {sending ? "Registering…" : "Keep Me Posted →"}
            </Btn>

            <p style={{
              fontSize: 12, color: C.inkDim, textAlign: "center",
              margin: 0, fontFamily: FONT,
            }}>
              No spam, ever. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. FOUNDER STATEMENT
// ─────────────────────────────────────────────
function FounderStatement() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={siteOuter(w, 80)}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 56,
        alignItems: "center",
      }}>
        {/* Photo */}
        <div style={{
          borderRadius: 24, overflow: "hidden",
          border: C.border, boxShadow: C.shadowMd,
          height: isMobile ? 280 : isTablet ? 380 : 440,
          position: "relative",
          order: isMobile ? 2 : 1,
        }}>
          <Image
            src="/founder.webp"
            alt="Artūrs, Founder & CEO"
            fill
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(124,85,255,0.12) 0%, rgba(255,51,188,0.06) 50%, transparent 70%)",
          }} />
        </div>

        {/* Statement */}
        <div style={{ order: isMobile ? 1 : 2 }}>
          <PillLabel>A Message from Our Founder</PillLabel>
          <h2 style={{
            fontSize: isMobile ? 26 : 36, fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 1.1,
            color: C.ink, marginBottom: 20, fontFamily: FONT,
          }}>
            We're building something{" "}
            <GradientText>mind‑boggling</GradientText>
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, color: C.inkDim2,
            lineHeight: 1.85, marginBottom: 24, fontFamily: FONT,
          }}>
            "The Nexfluence Marketplace isn't just another platform — it's the
            result of hundreds of conversations with creators and brands across
            the Baltics. We listened to what works, what doesn't, and what the
            creator economy truly needs. Great things take time, but we are
            almost there."
          </p>

          {/* Launch highlight */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "12px 20px", borderRadius: 12,
            background: `linear-gradient(135deg, ${C.violet}0e, ${C.pink}08)`,
            border: C.borderS, marginBottom: 24,
          }}>
            <span style={{ fontSize: 18 }}>🚀</span>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, color: C.inkDim,
                letterSpacing: "0.1em", textTransform: "uppercase",
                margin: 0, fontFamily: FONT,
              }}>Launch Date</p>
              <p style={{
                fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em",
                margin: "2px 0 0", fontFamily: FONT,
                background: C.grad, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>July 2026</p>
            </div>
          </div>

          <div>
            <p style={{
              fontWeight: 700, fontSize: 15, color: C.ink,
              margin: 0, fontFamily: FONT,
            }}>Artūrs</p>
            <p style={{
              fontSize: 13, color: C.pink, marginTop: 3,
              fontFamily: FONT,
            }}>Founder & CEO, Nexfluence</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. FULL FOOTER (shared)
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
      maxWidth: SITE_MAX_W, margin: "96px auto 0",
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
          © {new Date().getFullYear()} Nexfluence SIA. Registered in Latvia. All rights reserved.
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
export default function MarketplacePage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      <Header />
      <MarketplaceHero />
      <FeaturePreview />
      <InterestForm />
      <FounderStatement />
      <Footer />
    </div>
  );
}