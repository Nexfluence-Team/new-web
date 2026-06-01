"use client";

/**
 * app/zone/about/page.tsx
 * Nexfluence — About Page
 *
 * Sections:
 *  1. Page Hero
 *  2. Origin Story
 *  3. Mission Statement
 *  4. Core Values
 *  5. The Team
 *  6. What We're Building  (platform vision)
 *  7. Company Timeline
 *  8. Join the Journey  (CTA)
 *  9. Footer
 *
 * Shares the same design tokens as homepage.
 * Globals needed: .dot-live, .marquee-track, @keyframes (same as homepage).
 */

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
// DESIGN TOKENS  (mirrors homepage)
// ─────────────────────────────────────────────
const C = {
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  white:   "#ffffff",
  dim:     "rgba(255,255,255,0.55)",
  dim2:    "rgba(255,255,255,0.72)",
  grad:    "linear-gradient(90deg, #ff33bc, #8061ff)",
  border:  "1px solid rgba(128,97,255,0.35)",
  borderH: "1px solid rgba(255,122,195,0.55)",
  cardBg:  "rgba(128,97,255,0.06)",
} as const;

type CSSProps = React.CSSProperties;

// ─────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────
function pad(w: number): string {
  if (w < 640) return "0 20px";
  if (w < 900) return "0 32px";
  return "0 48px";
}
function outer(w: number, mt = 96): CSSProps {
  return { maxWidth: "1200px", margin: `${mt}px auto 0`, padding: pad(w) };
}

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.pink,
        marginBottom: "16px",
      }}
    >
      <span style={{ display: "block", width: "20px", height: "1px", background: C.pink, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: C.grad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

interface BtnProps {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
  style?: CSSProps;
}
function Btn({ href, variant, children, style }: BtnProps) {
  const base: CSSProps = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textDecoration: "none",
    transition: "opacity 0.2s, transform 0.2s",
    ...style,
  };
  const vs: Record<string, CSSProps> = {
    primary: { background: C.grad, color: "#fff", boxShadow: "0 8px 32px rgba(128,97,255,0.35)" },
    ghost:   { background: "transparent", color: C.violet, border: "1.5px solid rgba(128,97,255,0.6)" },
  };
  return (
    <a
      href={href}
      style={{ ...base, ...vs[variant] }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────
// 1. HEADER  (lightweight — links back to home)
// ─────────────────────────────────────────────
function Header() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const cb = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", cb, { passive: true });
    return () => window.removeEventListener("scroll", cb);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(10,6,18,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(128,97,255,0.2)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px 20px" : "18px 48px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <a href="/zone" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={isMobile ? 36 : 44} height={isMobile ? 36 : 44} style={{ borderRadius: "10px" }} />
          <div>
            <p style={{ fontSize: isMobile ? "14px" : "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Nexfluence
            </p>
            <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em", marginTop: "2px" }}>CREATOR NEXUS</p>
          </div>
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: "28px", marginLeft: "40px" }}>
            {[
              { label: "Home",     href: "/zone"              },
              { label: "Services", href: "/zone#services"     },
              { label: "Creators", href: "/zone#creators"     },
              { label: "About",    href: "/zone/about", active: true },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: l.active ? "#fff" : "rgba(255,255,255,0.55)",
                  textDecoration: l.active ? "none" : "none",
                  letterSpacing: "0.01em",
                  borderBottom: l.active ? `1px solid ${C.pink}` : "none",
                  paddingBottom: l.active ? "2px" : "0",
                  transition: "color 0.18s",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div style={{ marginLeft: "auto" }}>
          <Btn href="/zone#contact" variant="primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
            Work With Us
          </Btn>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// 2. PAGE HERO
// ─────────────────────────────────────────────
function PageHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section
      style={{
        position: "relative",
        paddingTop: isMobile ? "120px" : "140px",
        paddingBottom: isMobile ? "72px" : "96px",
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "500px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(128,97,255,0.22) 0%, rgba(255,51,188,0.1) 40%, transparent 70%)",
          }}
        />
        {/* Decorative horizontal rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(128,97,255,0.4), rgba(255,51,188,0.4), transparent)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: pad(w),
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "100px",
            background: C.cardBg,
            border: C.border,
            marginBottom: "28px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🇱🇻</span>
          <span style={{ fontSize: "12px", color: C.dim, letterSpacing: "0.04em" }}>
            Founded in Riga, Latvia · 2024
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: isMobile ? "38px" : w < 900 ? "54px" : "72px",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "#fff",
            marginBottom: "24px",
          }}
        >
          We're Building the
          <br />
          <GradientText>Baltic Creator Economy</GradientText>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: isMobile ? "15px" : "18px",
            color: C.dim2,
            lineHeight: 1.75,
            maxWidth: "600px",
            margin: "0 auto 40px",
          }}
        >
          Nexfluence exists because the Baltics deserved better than copy-pasted
          global influencer playbooks. We built something made for here, by people who
          live here.
        </p>

        {/* Quick stats row */}
        <div
          style={{
            display: "inline-flex",
            gap: isMobile ? "24px" : "48px",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px 32px",
            borderRadius: "16px",
            background: C.cardBg,
            border: C.border,
          }}
        >
          {[
            { val: "2024", label: "Founded"          },
            { val: "3",    label: "Countries"         },
            { val: "500+", label: "Creator Network"   },
            { val: "25+",  label: "Brand Partners"    },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: isMobile ? "22px" : "28px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  background: C.grad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {s.val}
              </p>
              <p style={{ fontSize: "11px", color: C.dim, fontWeight: 500, letterSpacing: "0.04em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. ORIGIN STORY
// ─────────────────────────────────────────────
function OriginStory() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={outer(w, 0)}>
      {/* Full-width image strip */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "220px" : "360px",
          borderRadius: "24px",
          overflow: "hidden",
          marginBottom: isMobile ? "48px" : "72px",
        }}
      >
        <Image
          src="/Skyline.webp"
          alt="Riga — Where Nexfluence was born"
          fill
          style={{ objectFit: "cover", objectPosition: "center 60%" }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(128,97,255,0.55) 0%, rgba(255,51,188,0.3) 40%, rgba(10,6,18,0.3) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, rgba(10,6,18,0.85), transparent)",
          }}
        />

        {/* Overlaid text */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "32px",
            right: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "18px" : "26px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              textShadow: "0 2px 20px rgba(10,6,18,0.8)",
            }}
          >
            Riga, Latvia
            <br />
            <span style={{ fontSize: isMobile ? "12px" : "16px", fontWeight: 400, color: "rgba(255,255,255,0.7)", letterSpacing: "0" }}>
              Where the idea became a company
            </span>
          </p>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: "8px",
              background: "rgba(10,6,18,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Est. 2024
          </span>
        </div>
      </div>

      {/* Story text — two column on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: isMobile ? "32px" : "80px",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <PillLabel>Our Story</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "38px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            The Baltics Had
            <br />
            <GradientText>No Home for Creators</GradientText>
          </h2>
          <p style={{ fontSize: "15px", color: C.dim2, lineHeight: 1.85, marginBottom: "20px" }}>
            When our founder Artūrs looked at the influencer marketing landscape in Latvia,
            he saw the same thing playing out everywhere: brands were throwing budgets at
            follower counts with no way to measure real results, and creators were being
            undercut, ghosted, or locked into agencies that didn't understand their audience.
          </p>
          <p style={{ fontSize: "15px", color: C.dim2, lineHeight: 1.85 }}>
            The global platforms — built for New York and London — treated the Baltics as
            an afterthought. Local creators had no professional infrastructure. Local brands
            had no trusted pipeline. So we built one.
          </p>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ fontSize: "15px", color: C.dim2, lineHeight: 1.85 }}>
            Nexfluence started in 2024 as a simple idea: what if influencer marketing in
            the Baltics was built on performance rather than promises? What if brands paid
            only for results they could actually measure — and creators earned based on the
            real impact they drove?
          </p>
          <p style={{ fontSize: "15px", color: C.dim2, lineHeight: 1.85 }}>
            That question became a product. A verified creator network. A platform. And now
            — a growing community of Latvia's, Lithuania's, and Estonia's most authentic
            content creators working alongside brands that share their values.
          </p>

          {/* Pull quote */}
          <div
            style={{
              padding: "24px 28px",
              borderRadius: "16px",
              background: "rgba(128,97,255,0.08)",
              border: "1px solid rgba(128,97,255,0.3)",
              borderLeft: `3px solid ${C.magenta}`,
              marginTop: "8px",
            }}
          >
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
                fontStyle: "italic",
              }}
            >
              "The Baltic creator economy doesn't need to follow anyone else's template.
              It needs to build its own."
            </p>
            <p style={{ fontSize: "12px", color: C.pink, marginTop: "12px", fontWeight: 600 }}>
              — Artūrs, Founder & CEO, Nexfluence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. MISSION STATEMENT  (full-width editorial block)
// ─────────────────────────────────────────────
function MissionBlock() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section
      style={{
        marginTop: "96px",
        position: "relative",
        overflow: "hidden",
        padding: isMobile ? "64px 20px" : "96px 48px",
        background: "rgba(128,97,255,0.05)",
        borderTop: "1px solid rgba(128,97,255,0.15)",
        borderBottom: "1px solid rgba(128,97,255,0.15)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(128,97,255,0.15) 0%, rgba(255,51,188,0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Large decorative quote mark */}
      <p
        style={{
          position: "absolute",
          top: "-20px",
          left: isMobile ? "16px" : "80px",
          fontSize: "200px",
          fontWeight: 900,
          lineHeight: 1,
          background: C.grad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: 0.08,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        "
      </p>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <PillLabel>Our Mission</PillLabel>

        <p
          style={{
            fontSize: isMobile ? "22px" : w < 900 ? "30px" : "38px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            color: "#fff",
            marginBottom: "32px",
          }}
        >
          To make influencer marketing in the Baltics{" "}
          <GradientText>transparent, measurable, and worth it</GradientText>{" "}
          — for both brands and the creators who power them.
        </p>

        {/* Mission pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "16px",
            marginTop: "48px",
            textAlign: "left",
          }}
        >
          {[
            {
              icon: "🔍",
              title: "Transparency",
              desc: "Every campaign result is tracked and reported in full. No black boxes, no inflated numbers.",
            },
            {
              icon: "📏",
              title: "Measurability",
              desc: "ROI is not optional. Every brief includes clear KPIs and every payout is tied to real outcomes.",
            },
            {
              icon: "⚖️",
              title: "Fairness",
              desc: "Creators are paid what they deserve. Brands pay for what they get. That's the only model we run.",
            },
          ].map((p) => (
            <div
              key={p.title}
              style={{
                padding: "22px",
                borderRadius: "16px",
                background: C.cardBg,
                border: C.border,
              }}
            >
              <p style={{ fontSize: "24px", marginBottom: "10px" }}>{p.icon}</p>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.01em" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. CORE VALUES
// ─────────────────────────────────────────────
interface Value {
  number: string;
  title: string;
  desc: string;
  accent: string;
}

const VALUES: Value[] = [
  {
    number: "01",
    title: "Authenticity Above Reach",
    desc: "We believe a creator with 10K deeply engaged followers in Riga is worth more to a local brand than a global influencer with 1M passive scrollers. Genuine connection beats inflated numbers every time.",
    accent: C.violet,
  },
  {
    number: "02",
    title: "Results-Only Compensation",
    desc: "The days of paying for 'exposure' are over. Our entire business model is built on the principle that value should be paid for after it's been created, not promised in a pitch deck.",
    accent: C.magenta,
  },
  {
    number: "03",
    title: "Creators Are Partners, Not Vendors",
    desc: "We don't treat creators as ad inventory. They're creative professionals whose audience trust is sacred. We protect that trust by matching them only with brands that genuinely fit their world.",
    accent: C.pink,
  },
  {
    number: "04",
    title: "Local Depth Over Global Width",
    desc: "The Baltic market has its own culture, consumer behaviour, and language nuances. We go deep on these three countries rather than spreading thin across dozens. That depth is our edge.",
    accent: C.indigo,
  },
];

function CoreValues() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={outer(w)}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <PillLabel>What We Stand For</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "38px",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#fff",
          }}
        >
          Four Values That
          <br />
          <GradientText>Drive Every Decision</GradientText>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {VALUES.map((v, i) => (
          <ValueRow key={v.number} value={v} index={i} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function ValueRow({ value, index, isMobile }: { value: Value; index: number; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "120px 1fr auto",
        gap: isMobile ? "12px" : "40px",
        alignItems: "center",
        padding: isMobile ? "28px 0" : "36px 32px",
        borderRadius: "16px",
        background: hovered ? "rgba(128,97,255,0.07)" : "transparent",
        borderBottom: index < VALUES.length - 1 ? "1px solid rgba(128,97,255,0.15)" : "none",
        transition: "background 0.2s",
        cursor: "default",
      }}
    >
      {/* Number */}
      <p
        style={{
          fontSize: isMobile ? "36px" : "48px",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          background: hovered
            ? C.grad
            : "linear-gradient(90deg, rgba(128,97,255,0.4), rgba(255,51,188,0.2))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          transition: "all 0.2s",
        }}
      >
        {value.number}
      </p>

      {/* Content */}
      <div>
        <h3
          style={{
            fontSize: isMobile ? "18px" : "22px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}
        >
          {value.title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: hovered ? C.dim2 : C.dim,
            lineHeight: 1.8,
            maxWidth: "600px",
            transition: "color 0.2s",
          }}
        >
          {value.desc}
        </p>
      </div>

      {/* Accent dot — desktop */}
      {!isMobile && (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: hovered ? value.accent : "rgba(128,97,255,0.25)",
            boxShadow: hovered ? `0 0 16px ${value.accent}` : "none",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. THE TEAM
// ─────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  ig?: string;
  emoji: string;
  tags: string[];
}

const TEAM: TeamMember[] = [
  {
    name: "Artūrs",
    role: "Founder & CEO",
    bio: "Artūrs spotted the gap in the Baltic influencer market and built Nexfluence from scratch. With a background spanning business development and digital strategy, he leads product vision, brand partnerships, and the long-term direction of the platform.",
    photo: "/Speaker 2.webp",
    ig: "https://www.instagram.com/nexfluence.eu",
    emoji: "🧠",
    tags: ["Strategy", "Product", "Partnerships"],
  },
  {
    name: "Aleksandrs Silonovs",
    role: "Sales Executive",
    bio: "Aleksandrs is the face of Nexfluence in the market — building relationships with brands, scouting new partners, and driving the commercial pipeline. He leads our influencer workshop initiatives and brand outreach strategy.",
    photo: "/Speaker 1.webp",
    ig: "https://www.instagram.com/nexfluence.eu",
    emoji: "🚀",
    tags: ["Sales", "Brand Outreach", "Events"],
  },
  {
    name: "You?",
    role: "Open Roles",
    bio: "We're growing and always looking for people who are obsessed with creator culture, performance marketing, and the Baltic digital space. If that's you — reach out.",
    photo: "/Event Place.webp",
    emoji: "✨",
    tags: ["Content", "Tech", "Marketing"],
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        border: hovered ? C.borderH : C.border,
        background: C.cardBg,
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 24px 64px rgba(128,97,255,0.2)" : "none",
        transition: "all 0.22s ease",
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: "280px" }}>
        <Image
          src={member.photo}
          alt={member.name}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,6,18,0.95) 0%, rgba(10,6,18,0.2) 55%, transparent 75%)",
          }}
        />
        {/* Role badge */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            padding: "5px 12px",
            borderRadius: "8px",
            background: "rgba(10,6,18,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.pink, letterSpacing: "0.04em" }}>
            {member.emoji} {member.role}
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "24px 26px 28px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}
        >
          {member.name}
        </h3>
        <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.75, marginBottom: "18px" }}>
          {member.bio}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: member.ig ? "18px" : "0" }}>
          {member.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "11px",
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: "6px",
                background: "rgba(128,97,255,0.15)",
                color: C.violet,
                letterSpacing: "0.02em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA for open role */}
        {!member.ig && (
          <a
            href="mailto:careers@nexfluence.eu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              color: C.pink,
              textDecoration: "none",
              marginTop: "4px",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            Get in touch →
          </a>
        )}
      </div>
    </div>
  );
}

function TheTeam() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={outer(w)}>
      <div style={{ marginBottom: "48px" }}>
        <PillLabel>The Team</PillLabel>
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "38px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            Small Team,
            <br />
            <GradientText>Big Ambitions</GradientText>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: C.dim,
              maxWidth: "320px",
              lineHeight: 1.7,
              textAlign: isMobile ? "left" : "right",
            }}
          >
            We're a lean team that moves fast and operates with the conviction that
            the Baltic creator economy is only just getting started.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {TEAM.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. WHAT WE'RE BUILDING  (platform vision)
// ─────────────────────────────────────────────
interface Roadmapitem {
  phase: string;
  title: string;
  desc: string;
  status: "live" | "building" | "next";
  items: string[];
}

const ROADMAP: Roadmapitem[] = [
  {
    phase: "Phase 1",
    title: "Creator Network",
    status: "live",
    desc: "Building and verifying the Baltic's largest curated creator database — across Instagram, TikTok, and YouTube.",
    items: ["500+ vetted creators", "3 countries covered", "Brand campaign matching", "Manual outreach tooling"],
  },
  {
    phase: "Phase 2",
    title: "Platform Launch",
    status: "building",
    desc: "A full-stack SaaS platform where brands manage campaigns and creators manage their income — all in one place.",
    items: ["Brand campaign dashboard", "Creator profile portal", "Campaign brief builder", "Content approval flow"],
  },
  {
    phase: "Phase 3",
    title: "Performance Engine",
    status: "next",
    desc: "Real-time analytics, affiliate tracking, automated payouts, and AI-assisted creator matching.",
    items: ["Live conversion tracking", "Promo code system", "Automated payouts", "Audience insights API"],
  },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  live:     { color: "#34d399", bg: "rgba(52,211,153,0.12)", label: "Live"     },
  building: { color: C.violet, bg: "rgba(128,97,255,0.15)", label: "Building" },
  next:     { color: C.dim,    bg: "rgba(255,255,255,0.06)", label: "Up Next"  },
};

function WhatWereBuilding() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section
      style={{
        marginTop: "96px",
        background: "rgba(128,97,255,0.04)",
        borderTop: "1px solid rgba(128,97,255,0.15)",
        borderBottom: "1px solid rgba(128,97,255,0.15)",
        padding: isMobile ? "64px 20px" : "80px 48px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <PillLabel>What We're Building</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "38px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            A Platform Built for the{" "}
            <GradientText>Long Game</GradientText>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: C.dim,
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            We started with a vision and a spreadsheet. We're building toward a full creator
            economy infrastructure for the Baltic market.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {ROADMAP.map((item) => {
            const s = STATUS_STYLES[item.status];
            return (
              <div
                key={item.phase}
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  background: item.status === "live" ? "rgba(52,211,153,0.05)" : C.cardBg,
                  border: item.status === "live"
                    ? "1px solid rgba(52,211,153,0.3)"
                    : item.status === "building"
                    ? "1px solid rgba(128,97,255,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Phase + status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {item.phase}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: s.bg,
                      color: s.color,
                    }}
                  >
                    {item.status === "live" && <span className="dot-live" style={{ width: "5px", height: "5px", background: "#34d399", boxShadow: "0 0 0 0 rgba(52,211,153,0.5)" }} />}
                    {s.label}
                  </span>
                </div>

                {/* Title + desc */}
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7 }}>{item.desc}</p>
                </div>

                {/* Item list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {item.items.map((it) => (
                    <div key={it} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: s.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "13px", color: C.dim2 }}>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 8. COMPANY TIMELINE
// ─────────────────────────────────────────────
interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  accent: string;
}

const TIMELINE: TimelineEvent[] = [
  {
    date: "Early 2024",
    title: "The Idea",
    desc: "Artūrs identifies the gap in the Baltic influencer marketing space. Research begins into what a performance-based platform would look like.",
    accent: C.indigo,
  },
  {
    date: "Mid 2024",
    title: "First Partnerships",
    desc: "First 5 brand partners onboarded. Creator outreach begins. The model is tested manually before any platform is built.",
    accent: C.violet,
  },
  {
    date: "Late 2024",
    title: "Team Builds Out",
    desc: "Aleksandrs joins as Sales Executive. Creator network grows to 50+ verified profiles across Latvia and Lithuania.",
    accent: C.magenta,
  },
  {
    date: "Q1 2025",
    title: "Creator Nexus Event",
    desc: "First major influencer industry event in Riga — bringing together 100+ creators, brands, and marketers under one roof.",
    accent: C.pink,
  },
  {
    date: "2025 →",
    title: "Platform Launch",
    desc: "Full SaaS platform enters development. Goal: a complete end-to-end creator campaign management tool for the Baltic market.",
    accent: C.violet,
  },
];

function CompanyTimeline() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={outer(w)}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <PillLabel>Our Journey</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "38px",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#fff",
          }}
        >
          From Idea to{" "}
          <GradientText>Industry Infrastructure</GradientText>
        </h2>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? "20px" : "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "linear-gradient(180deg, rgba(128,97,255,0.6), rgba(255,51,188,0.4), rgba(128,97,255,0.1))",
            transform: isMobile ? "none" : "translateX(-50%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {TIMELINE.map((ev, i) => {
            const isRight = !isMobile && i % 2 === 1;
            return (
              <div
                key={ev.date}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "48px 1fr" : "1fr 48px 1fr",
                  gap: isMobile ? "0 16px" : "0",
                  marginBottom: "0",
                  paddingBottom: i < TIMELINE.length - 1 ? "40px" : "0",
                }}
              >
                {/* Left content (desktop even items) */}
                {!isMobile && (
                  <div
                    style={{
                      padding: "0 40px 0 0",
                      textAlign: "right",
                      opacity: isRight ? 0 : 1,
                      pointerEvents: isRight ? "none" : "auto",
                    }}
                  >
                    {!isRight && <TimelineCard ev={ev} align="right" />}
                  </div>
                )}

                {/* Center dot */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: isMobile ? "4px" : "4px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: ev.accent,
                      border: `3px solid #0a0612`,
                      boxShadow: `0 0 0 1px ${ev.accent}, 0 0 16px ${ev.accent}66`,
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Right content (mobile always, desktop odd items) */}
                <div
                  style={{
                    padding: isMobile ? "0" : "0 0 0 40px",
                    opacity: !isMobile && !isRight ? 0 : 1,
                    pointerEvents: !isMobile && !isRight ? "none" : "auto",
                  }}
                >
                  {(isMobile || isRight) && <TimelineCard ev={ev} align="left" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ ev, align }: { ev: TimelineEvent; align: "left" | "right" }) {
  return (
    <div style={{ textAlign: align }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: ev.accent,
          marginBottom: "6px",
        }}
      >
        {ev.date}
      </p>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
          lineHeight: 1.2,
        }}
      >
        {ev.title}
      </h3>
      <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7, maxWidth: "300px", marginLeft: align === "right" ? "auto" : "0" }}>
        {ev.desc}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. JOIN THE JOURNEY  (CTA)
// ─────────────────────────────────────────────
function JoinThJourney() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ ...outer(w, 96), marginBottom: "0" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          padding: isMobile ? "52px 28px" : "80px 80px",
          textAlign: "center",
        }}
      >
        {/* Background layers */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/Skyline.webp" alt="" fill style={{ objectFit: "cover", opacity: 0.12 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(128,97,255,0.3) 0%, rgba(255,51,188,0.15) 40%, rgba(10,6,18,0.9) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: C.border,
              borderRadius: "28px",
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <PillLabel>Join the Journey</PillLabel>

          <h2
            style={{
              fontSize: isMobile ? "30px" : "46px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            The Baltic Creator Economy
            <br />
            <GradientText>Is Just Getting Started</GradientText>
          </h2>

          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: C.dim,
              maxWidth: "500px",
              margin: "0 auto 40px",
              lineHeight: 1.75,
            }}
          >
            Whether you're a brand ready to reach authentic Baltic audiences, or
            a creator ready to build a real income from your work — your place is
            in this network.
          </p>

          {/* Dual CTA */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <Btn href="mailto:brands@nexfluence.eu" variant="primary">
              I'm a Brand →
            </Btn>
            <Btn href="mailto:creators@nexfluence.eu" variant="ghost">
              I'm a Creator →
            </Btn>
          </div>

          {/* Social links */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Follow along:</p>
            <a
              href="https://www.instagram.com/nexfluence.eu"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: C.pink,
                textDecoration: "none",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              @nexfluence.eu
            </a>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>·</span>
            <a
              href="https://ig.me/j/AbanIlYdHEhj6sI1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: C.violet,
                textDecoration: "none",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              Creator Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 10. FOOTER  (same as homepage)
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
    <footer
      style={{
        maxWidth: "1200px",
        margin: "96px auto 0",
        borderTop: "1px solid rgba(128,97,255,0.15)",
        padding: isMobile ? "48px 20px 32px" : "64px 48px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? "36px 24px" : "40px",
          marginBottom: "56px",
        }}
      >
        {/* Brand */}
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Image src="/Nex.webp" alt="Nexfluence" width={40} height={40} style={{ borderRadius: "10px" }} />
            <div>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Nexfluence</p>
              <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em" }}>CREATOR NEXUS</p>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.75, maxWidth: "240px" }}>
            Latvia's first performance-based influencer marketing platform connecting brands with
            authentic Baltic creators.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {["IG", "LI", "TT"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: C.cardBg,
                  border: C.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.dim,
                  textDecoration: "none",
                  transition: "color 0.18s, border-color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,122,195,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = C.dim;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(128,97,255,0.35)";
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "16px",
              }}
            >
              {col}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ fontSize: "13px", color: C.dim, textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(128,97,255,0.1)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          © 2026 Nexfluence SIA. Registered in Latvia. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a key={l} href="#" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ background: "#0a0612", overflowX: "hidden" }}>
      <Header />
      <PageHero />
      <OriginStory />
      <MissionBlock />
      <CoreValues />
      <TheTeam />
      <WhatWereBuilding />
      <CompanyTimeline />
      <JoinThJourney />
      <Footer />
      <div style={{ height: "80px" }} />
    </div>
  );
}