"use client";

/**
 * app/marketplace/page.tsx
 * Nexfluence — Marketplace Coming Soon Page
 *
 * Claims "Europe's Most Active Creator Economy Marketplace" and collects
 * interest registrations via a simple form. Features a statement from the
 * founder/CEO with their photo.
 *
 * Design language, header, and tokens identical to the rest of the site.
 */

import Image from "next/image";
import { useState, useEffect, type FormEvent } from "react";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK (shared)
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
// DESIGN TOKENS (identical to homepage)
// ─────────────────────────────────────────────
const C = {
  bg: "#ffffff",
  bgSub: "#f7f6ff",
  bgCard: "#f2f0ff",
  ink: "#0a0612",
  inkDim: "rgba(10,6,18,0.50)",
  inkDim2: "rgba(10,6,18,0.72)",
  pink: "#ff33bc",
  violet: "#7c55ff",
  indigo: "#6a66ff",
  grad: "linear-gradient(90deg, #ff33bc, #7c55ff)",
  gradD: "linear-gradient(135deg, #ff33bc, #7c55ff)",
  border: "1px solid rgba(124,85,255,0.18)",
  borderH: "1px solid rgba(255,51,188,0.45)",
  borderS: "1px solid rgba(124,85,255,0.28)",
  cardBg: "rgba(124,85,255,0.05)",
  cardBgM: "rgba(124,85,255,0.09)",
  shadowSm: "0 2px 12px rgba(124,85,255,0.10)",
  shadowMd: "0 8px 32px rgba(124,85,255,0.14)",
  shadowLg: "0 20px 60px rgba(124,85,255,0.18)",
} as const;

// ─────────────────────────────────────────────
// LAYOUT CONSTANTS
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
// ATOMIC COMPONENTS
// ─────────────────────────────────────────────
function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.pink,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          display: "block",
          width: 20,
          height: 1,
          background: C.pink,
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}

function GradientText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProps;
}) {
  return (
    <span
      style={{
        background: C.grad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline",
        ...style,
      }}
    >
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
}
function Btn({ href, onClick, variant, children, style, type }: BtnProps) {
  const base: CSSProps = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "13px 28px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
    ...style,
  };
  const vars: Record<string, CSSProps> = {
    primary: {
      background: C.grad,
      color: "#fff",
      boxShadow: "0 8px 32px rgba(124,85,255,0.28)",
    },
    ghost: {
      background: "transparent",
      color: C.violet,
      border: "1.5px solid rgba(124,85,255,0.45)",
    },
  };
  const merged = { ...base, ...vars[variant] };
  const hover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.opacity = "0.88";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.opacity = "1";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    },
  };
  if (href)
    return (
      <a href={href} style={merged} {...hover}>
        {children}
      </a>
    );
  return (
    <button style={merged} onClick={onClick} type={type} {...hover}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// HEADER (same as everywhere)
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creators", href: "/creators" },
  { label: "About Us", href: "/about" },
  { label: "Growth", href: "/progress" },
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
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        background: scrolled ? "rgba(255,255,255,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(124,85,255,0.12)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(124,85,255,0.08)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: SITE_MAX_W,
          margin: "0 auto",
          padding: isMobile
            ? "16px 20px"
            : w < 900
            ? "18px 32px"
            : "18px 48px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/Nex.webp"
            alt="Nexfluence"
            width={isMobile ? 34 : 40}
            height={isMobile ? 34 : 40}
            style={{ borderRadius: 10 }}
          />
        </a>
        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, marginLeft: 36 }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.inkDim,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "color 0.18s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    C.inkDim)
                }
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {!isMobile && (
            <Btn
              href="/contact"
              variant="primary"
              style={{ padding: "10px 20px", fontSize: 13 }}
            >
              Contact Us
            </Btn>
          )}
          {isMobile && (
            <>
              <Btn
                href="/contact"
                variant="primary"
                style={{ padding: "9px 14px", fontSize: 12 }}
              >
                Contact Us
              </Btn>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: C.ink,
                  fontSize: 20,
                }}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </>
          )}
        </div>
      </div>
      {isMobile && menuOpen && (
        <div
          style={{
            background: "rgba(255,255,255,0.98)",
            borderTop: "1px solid rgba(124,85,255,0.12)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: C.inkDim2,
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// MARKETPLACE HERO
// ─────────────────────────────────────────────
function MarketplaceHero() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,85,255,0.09) 0%, rgba(255,51,188,0.04) 40%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,85,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.055) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            background: "linear-gradient(to top, #ffffff, transparent)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: SITE_MAX_W,
          width: "100%",
          margin: "0 auto",
          paddingTop: isMobile ? 130 : 150,
          paddingBottom: isMobile ? 60 : 100,
          paddingLeft: hPad,
          paddingRight: hPad,
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <PillLabel>Coming May 2026</PillLabel>
        <h1
          style={{
            fontSize: isMobile ? 36 : isTablet ? 46 : 56,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: C.ink,
            margin: 0,
            marginBottom: 24,
          }}
        >
          Europe’s Most Active
          <br />
          <GradientText>Creator Economy Marketplace</GradientText>
        </h1>
        <p
          style={{
            fontSize: isMobile ? 16 : 18,
            color: C.inkDim2,
            lineHeight: 1.75,
            maxWidth: 600,
            margin: "0 auto 36px",
          }}
        >
          A fully transparent, performance-based platform where brands and
          creators connect, collaborate, and grow — built with creator input
          at every step. Be the first to know when we launch.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// INTEREST REGISTRATION FORM
// ─────────────────────────────────────────────
function InterestForm() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with actual API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const inputStyle: CSSProps = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: C.border,
    background: C.bgSub,
    fontSize: 14,
    color: C.ink,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle: CSSProps = {
    fontSize: 13,
    fontWeight: 600,
    color: C.inkDim2,
    display: "block",
    marginBottom: 6,
  };

  return (
    <section style={siteOuter(w, 0)}>
      <div
        style={{
          borderRadius: 24,
          padding: isMobile ? 28 : 48,
          background: C.cardBg,
          border: C.border,
          boxShadow: C.shadowSm,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 24, marginBottom: 16 }}>✅</p>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: C.ink,
                marginBottom: 8,
              }}
            >
              You’re on the list!
            </h3>
            <p style={{ fontSize: 14, color: C.inkDim }}>
              We’ll notify you as soon as the marketplace goes live.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: C.ink,
                letterSpacing: "-0.02em",
                margin: "0 0 4px",
              }}
            >
              Register Your Interest
            </h3>
            <p
              style={{
                fontSize: 14,
                color: C.inkDim,
                marginTop: -8,
                marginBottom: 4,
              }}
            >
              Be the first to access the marketplace. We’ll keep you updated.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Where are you from?</label>
              <input
                type="text"
                placeholder="City, Country"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>I am a…</label>
                <select required style={inputStyle}>
                  <option value="" disabled selected>Select role</option>
                  <option value="brand">Brand</option>
                  <option value="creator">Creator</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Industry</label>
                <select required style={inputStyle}>
                  <option value="" disabled selected>Select industry</option>
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="fashion">Fashion</option>
                  <option value="fitness">Fitness & Wellness</option>
                  <option value="food">Food & Beverage</option>
                  <option value="tech">Tech & Startups</option>
                  <option value="travel">Travel & Lifestyle</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Btn type="submit" variant="primary" style={{ width: "100%", marginTop: 8 }}>
              Keep Me Posted →
            </Btn>
          </form>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOUNDER STATEMENT
// ─────────────────────────────────────────────
function FounderStatement() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={siteOuter(w, 80)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "1fr 1fr"
            : "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Photo */}
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            border: C.border,
            boxShadow: C.shadowMd,
            height: isMobile ? 320 : 420,
            position: "relative",
          }}
        >
          <Image
            src="/founder.webp" // Replace with actual CEO image
            alt="Founder & CEO"
            fill
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
        </div>

        {/* Statement */}
        <div>
          <PillLabel>A Message from Our Founder</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: C.ink,
              marginBottom: 20,
            }}
          >
            We’re building something <GradientText>mind‑boggling</GradientText>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: C.inkDim2,
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            “The Nexfluence Marketplace isn’t just another platform — it’s the
            result of hundreds of conversations with creators and brands across
            the Baltics. We listened to what works, what doesn’t, and what the
            creator economy truly needs. Great things take time, but we are
            almost there. Launching <strong>May 2026</strong>.”
          </p>
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: C.ink,
                margin: 0,
              }}
            >
              Name Surname
            </p>
            <p style={{ fontSize: 13, color: C.pink, marginTop: 2 }}>
              Founder & CEO, Nexfluence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER (simplified)
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "32px 0",
        fontSize: 13,
        color: C.inkDim,
        borderTop: C.border,
        maxWidth: SITE_MAX_W,
        margin: "0 auto",
        marginTop: 80,
      }}
    >
      © {new Date().getFullYear()} Nexfluence SIA. All rights reserved.
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function MarketplacePage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <Header />
      <MarketplaceHero />
      <InterestForm />
      <FounderStatement />
      <Footer />
    </div>
  );
}