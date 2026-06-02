"use client";

/**
 * app/marketplace/page.tsx
 * Nexfluence — Marketplace Launching Soon
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header (shared)
 *  2. Launching Soon hero
 *  3. CEO Message
 *  4. Feature Preview (bento)
 *  5. Interest Registration Form
 *  — no footer —
 */

import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent } from "react";

const FONT = "'Rubik', sans-serif";

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

const SITE_MAX_W = 1200;

function sitePad(w: number): string {
  if (w < 640) return "0 20px";
  if (w < 900) return "0 32px";
  return "0 48px";
}

function siteOuter(w: number, mt = 96): React.CSSProperties {
  return { maxWidth: SITE_MAX_W, margin: `${mt}px auto 0`, padding: sitePad(w) };
}

type CSSProps = React.CSSProperties;

// ─────────────────────────────────────────────
// ICON HELPER
// Renders an SVG from /public/icons/
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

// ── Atoms ────────────────────────────────────────────────────────────────────

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
      background: C.grad, WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent", backgroundClip: "text",
      display: "inline", fontFamily: FONT, ...style,
    }}>{children}</span>
  );
}

function Btn({ href, onClick, variant, children, style, type, disabled }: {
  href?: string; onClick?: () => void; variant: "primary" | "ghost";
  children: React.ReactNode; style?: CSSProps;
  type?: "button" | "submit"; disabled?: boolean;
}) {
  const base: CSSProps = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "13px 28px", borderRadius: 8, fontSize: 14,
    fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    opacity: disabled ? 0.6 : 1,
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

// ── Form atoms ───────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.inkDim2, fontFamily: FONT }}>{label}</label>
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
        width: "100%", padding: "13px 16px", borderRadius: 10, boxSizing: "border-box",
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
  name?: string; required?: boolean; options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "13px 16px", borderRadius: 10, boxSizing: "border-box",
        border: focused ? `1px solid ${C.violet}` : C.border,
        background: focused ? "#fff" : C.bgSub,
        fontSize: 14, color: C.ink, fontFamily: FONT, outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(10,6,18,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
        boxShadow: focused ? `0 0 0 3px rgba(124,85,255,0.10)` : "none",
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
        cursor: "pointer",
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── 1. Header ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  // { label: "Creators",    href: "/creators"    },
  { label: "About Us",    href: "/about"       },
  { label: "Growth",      href: "/progress"    },
];

function Header() {
  const w = useWindowWidth();
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
          <Image src="/Nex.webp" alt="Nexfluence" width={isMobile ? 34 : 40} height={isMobile ? 34 : 40} style={{ borderRadius: 10 }} />
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
            <Btn href="/contact" variant="primary" style={{ padding: "10px 20px", fontSize: 13 }}>Contact Us</Btn>
          )}
          {isMobile && (
            <>
              <Btn href="/contact" variant="primary" style={{ padding: "9px 14px", fontSize: 12 }}>Contact Us</Btn>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 4, color: C.ink, fontSize: 20,
              }}>{menuOpen ? "✕" : "☰"}</button>
            </>
          )}
        </div>
      </div>
      {isMobile && menuOpen && (
        <div style={{
          background: "rgba(255,255,255,0.98)", borderTop: "1px solid rgba(124,85,255,0.12)",
          padding: 20, display: "flex", flexDirection: "column", gap: 20,
        }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 16, fontWeight: 500, color: C.inkDim2, textDecoration: "none", fontFamily: FONT,
            }}>{l.label}</a>
          ))}
          <a href="/contact" onClick={() => setMenuOpen(false)} style={{
            fontSize: 15, fontWeight: 600, color: C.pink, textDecoration: "none", fontFamily: FONT,
          }}>Contact Us </a>
        </div>
      )}
    </header>
  );
}

// ── 2. Launching Soon Hero ───────────────────────────────────────────────────

function LaunchingHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "auto" : "80vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", overflow: "hidden", background: C.bg,
    }}>
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
        paddingTop: isMobile ? 120 : 160,
        paddingBottom: isMobile ? 64 : 100,
        paddingLeft: hPad, paddingRight: hPad,
        boxSizing: "border-box",
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <PillLabel>Launching Soon</PillLabel>

        <h1 style={{
          fontSize: isMobile ? 36 : isTablet ? 52 : 64,
          fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1.0, color: C.ink,
          margin: 0, marginBottom: 24, fontFamily: FONT,
        }}>
          Europe's Most Active
          <br />
          <GradientText>Creator Economy Marketplace</GradientText>
        </h1>

        <p style={{
          fontSize: isMobile ? 15 : 18, color: C.inkDim2,
          lineHeight: 1.75, maxWidth: 560, margin: "0 auto 36px",
          fontFamily: FONT,
        }}>
          A fully transparent, performance-based platform where Baltic brands
          and creators connect, collaborate, and grow together.
        </p>

        <Btn href="#register" variant="primary" style={{ padding: "14px 36px", fontSize: 15 }}>
          Register Interest 
        </Btn>
      </div>
    </section>
  );
}

// ── 3. CEO Message ───────────────────────────────────────────────────────────

function CEOMessage() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={siteOuter(w, 0)}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 64,
        alignItems: "center",
      }}>
        {/* Photo */}
        <div style={{
          borderRadius: 24, overflow: "hidden",
          border: C.border, boxShadow: C.shadowMd,
          height: isMobile ? 300 : isTablet ? 400 : 500,
          position: "relative",
          order: isMobile ? 2 : 1,
        }}>
          <Image
            src="/images/Harshul.webp"
            alt="Harshul Gupta, Founder & CEO"
            fill
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
            priority
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(124,85,255,0.12) 0%, rgba(255,51,188,0.06) 50%, transparent 70%)",
          }} />
        </div>

        {/* Quote */}
        <div style={{ order: isMobile ? 1 : 2 }}>
          <PillLabel>A Message from Our Founder</PillLabel>

          <p style={{
            fontSize: 80, lineHeight: 0.7, fontWeight: 900,
            background: C.grad, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            margin: "0 0 20px", fontFamily: FONT,
          }}>"</p>

          <p style={{
            fontSize: isMobile ? 15 : 16, color: C.inkDim2,
            lineHeight: 1.5, marginBottom: 32, fontFamily: FONT, textAlign: "justify",

          }}>
            The Nexus Marketplace isn't mere another platform — it's
            the result of hundreds of conversations with creators and brands
            across the Baltics. We listened to what works, what doesn't, and
            what the creator economy truly needs.
            <br /><br />
            Great things take time. But we are almost there.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0, fontFamily: FONT }}>Harshul Gupta</p>
              <p style={{ fontSize: 13, color: C.pink, margin: "3px 0 0", fontFamily: FONT }}>Founder & CEO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4. Feature Preview Bento ─────────────────────────────────────────────────

const FEATURES = [
  { iconName: "search",    title: "Smart Creator Discovery",    desc: "Filter 500+ verified creators by niche, audience demographics, engagement rate, and Baltic location — not just follower count.", accent: C.violet },
  { iconName: "analytics", title: "Live Performance Tracking",  desc: "Real-time dashboards for every campaign — clicks, conversions, and revenue tracked to the cent.",                               accent: C.pink   },
  { iconName: "Collab",    title: "Managed Contracts",          desc: "Digital contracts, content briefs, approval workflows, and payments — all in one place.",                                     accent: C.indigo },
  { iconName: "spark",     title: "100% Performance-Based",     desc: "You only pay when real results are delivered. No upfront costs, no guessing.",                                                 accent: C.violet },
  { iconName: "globe",     title: "Baltic-Native",              desc: "Built for Latvia, Lithuania, and Estonia — the creators, the culture, the consumers.",                                        accent: C.pink   },
  { iconName: "cycle",     title: "Long-Term Affiliate Engine", desc: "Promo codes, tracked links, and tiered commissions that keep working long after a campaign ends.",                             accent: C.indigo },
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
        flexShrink: 0,
      }}>
        <Icon name={feature.iconName} size={22} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", margin: 0, fontFamily: FONT }}>{feature.title}</h3>
      <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, margin: 0, fontFamily: FONT }}>{feature.desc}</p>
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
          The marketplace brings every tool a brand or creator needs into a single, beautifully simple workspace.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
      ) : isTablet ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
      )}
    </section>
  );
}

// ── 5. Interest Form ─────────────────────────────────────────────────────────

function InterestForm() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      formRef.current?.reset();
    }, 1200);
  };

  return (
    <section id="register" style={{ ...siteOuter(w), paddingBottom: 96 }}>
      <div style={{
        borderRadius: 24, padding: isMobile ? 24 : 48,
        background: `linear-gradient(135deg, ${C.violet}0e, ${C.pink}08)`,
        border: C.borderS, boxShadow: C.shadowMd,
        maxWidth: 680, margin: "0 auto",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(124,85,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
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
              <h3 style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginBottom: 10, fontFamily: FONT, letterSpacing: "-0.02em" }}>
                You're on the list!
              </h3>
              <p style={{ fontSize: 15, color: C.inkDim, fontFamily: FONT, lineHeight: 1.7 }}>
                We'll reach out as soon as the marketplace goes live. Expect early access perks.
              </p>
              <button onClick={() => setSubmitted(false)} style={{
                marginTop: 20, fontSize: 13, fontWeight: 600,
                color: C.violet, background: "none", border: "none",
                cursor: "pointer", fontFamily: FONT, textDecoration: "underline",
              }}>Register another person</button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <PillLabel>Get Early Access</PillLabel>
                <h3 style={{
                  fontSize: isMobile ? 22 : 28, fontWeight: 800, color: C.ink,
                  letterSpacing: "-0.03em", margin: "0 0 8px", fontFamily: FONT,
                }}>Register Your Interest</h3>
                <p style={{ fontSize: 14, color: C.inkDim, margin: 0, fontFamily: FONT }}>
                  Be first in line. We'll reach out with early access details.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <Field label="Full Name">
                  <StyledInput name="name" placeholder="Your name" required />
                </Field>
                <Field label="Email">
                  <StyledInput type="email" name="email" placeholder="you@company.com" required />
                </Field>
              </div>

              <Field label="Where are you based?">
                <StyledInput name="location" placeholder="City, Country" required />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <Field label="I am a…">
                  <StyledSelect name="role" required options={[
                    { value: "",        label: "Select role"          },
                    { value: "brand",   label: "Brand / Business"     },
                    { value: "creator", label: "Creator / Influencer" },
                    { value: "agency",  label: "Agency / Partner"     },
                    { value: "other",   label: "Other"                },
                  ]} />
                </Field>
                <Field label="Industry">
                  <StyledSelect name="industry" required options={[
                    { value: "",        label: "Select industry"    },
                    { value: "beauty",  label: "Beauty & Cosmetics" },
                    { value: "fashion", label: "Fashion"            },
                    { value: "fitness", label: "Fitness & Wellness" },
                    { value: "food",    label: "Food & Beverage"    },
                    { value: "tech",    label: "Tech & Startups"    },
                    { value: "travel",  label: "Travel & Lifestyle" },
                    { value: "other",   label: "Other"              },
                  ]} />
                </Field>
              </div>

              <Btn type="submit" variant="primary" disabled={sending} style={{ width: "100%", marginTop: 4 }}>
                {sending ? "Registering…" : "Keep Me Posted "}
              </Btn>

              <p style={{ fontSize: 12, color: C.inkDim, textAlign: "center", margin: 0, fontFamily: FONT }}>
                No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Page Root ─────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      <Header />
      <LaunchingHero />
      <CEOMessage />
      <FeaturePreview />
      <InterestForm />
    </div>
  );
}