"use client";

/**
 * app/about/page.tsx
 * Nexfluence — About Page
 *
 * Follows the exact same design language, colours, alignment and
 * layout constraints as the company homepage (zone/page.tsx).
 *
 * Sections:
 *  1. Founder hero
 *  2. Our Story (bento grid)
 *  3. Team
 *  4. Events & Community
 *  5. Sponsors
 *  6. Final CTA
 *  7. Footer
 *
 * CSS REQUIRED IN globals.css (same as homepage):
 *   .dot-live { … }
 *   .marquee-track { … }
 *   @keyframes dot-pulse, marquee-left { … }
 */

import Image from "next/image";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK (shared utility)
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
// LAYOUT CONSTANTS (identical to homepage)
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
// ATOMIC COMPONENTS (identical to homepage)
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
}
function Btn({ href, onClick, variant, children, style }: BtnProps) {
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
    <button style={merged} onClick={onClick} {...hover}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// HEADER (identical to homepage)
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creators",    href: "/creators"    },
  { label: "About Us", href: "/about" },
  { label: "Growth",      href: "/progress"      },
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
        boxShadow: scrolled
          ? "0 2px 20px rgba(124,85,255,0.08)"
          : "none",
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
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    C.ink)
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
            <>
              <Btn
                href="#how-it-works"
                variant="ghost"
                style={{ padding: "10px 20px", fontSize: 13 }}
              >
                For Creators
              </Btn>
              <Btn
                href="#contact"
                variant="primary"
                style={{ padding: "10px 20px", fontSize: 13 }}
              >
                For Brands
              </Btn>
            </>
          )}
          {isMobile && (
            <>
              <Btn
                href="#contact"
                variant="primary"
                style={{ padding: "9px 14px", fontSize: 12 }}
              >
                For Brands
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
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.pink,
              textDecoration: "none",
            }}
          >
            For Creators →
          </a>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// 1. FOUNDER HERO SECTION
// ─────────────────────────────────────────────
function FounderHero() {
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
      {/* Background decorations */}
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

      {/* Content */}
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
          display: "grid",
          gridTemplateColumns:
            !isMobile && !isTablet ? "1fr 1fr" : "1fr",
          gap: 48,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left — founder info */}
        <div>
          <PillLabel>Our Founder</PillLabel>
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
            Building the{" "}
            <GradientText>Future of Creator</GradientText>
            <br />
            Economy in the Baltics
          </h1>
          <p
            style={{
              fontSize: isMobile ? 16 : 18,
              color: C.inkDim2,
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: 28,
            }}
          >
            “I started Nexfluence to solve a problem I lived every day —
            the disconnect between brands and authentic Baltic creators.
            We’ve grown into the region’s first performance‑based influencer
            platform because we never forgot why we began: real people,
            real stories, real results.”
          </p>
          <p
            style={{
              fontSize: 14,
              color: C.inkDim,
              marginBottom: 36,
            }}
          >
            <strong style={{ color: C.ink, fontWeight: 700 }}>
              Name Surname
            </strong>{" "}
            · Founder & CEO, Nexfluence
          </p>
          <Btn href="#story" variant="primary">
            Our Story ↓
          </Btn>
        </div>

        {/* Right — founder portrait (desktop only) */}
        {!isMobile && !isTablet && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 500,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(124,85,255,0.18)",
              boxShadow: "0 24px 64px rgba(124,85,255,0.16)",
            }}
          >
            <Image
              src="/founder.webp" /* ← replace with actual founder image */
              alt="Founder"
              fill
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(124,85,255,0.15) 0%, rgba(255,51,188,0.08) 50%, transparent 70%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Tablet / Mobile — portrait below text */}
      {(isMobile || isTablet) && (
        <div
          style={{
            maxWidth: SITE_MAX_W,
            width: "100%",
            margin: "0 auto",
            paddingLeft: hPad,
            paddingRight: hPad,
            paddingBottom: 80,
            boxSizing: "border-box",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? 320 : 420,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(124,85,255,0.18)",
              boxShadow: "0 16px 48px rgba(124,85,255,0.14)",
            }}
          >
            <Image
              src="/founder.webp"
              alt="Founder"
              fill
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. OUR STORY — BENTO GRID
// ─────────────────────────────────────────────
function BentoCard({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: CSSProps;
  accent?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24,
        padding: 28,
        background: hovered
          ? accent
            ? `${accent}0a`
            : C.cardBgM
          : C.cardBg,
        border: hovered
          ? `1px solid ${accent ?? C.violet}44`
          : C.border,
        boxShadow: hovered
          ? `0 20px 56px ${accent ?? C.violet}12`
          : C.shadowSm,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.22s ease",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${
              accent ?? C.violet
            }55, transparent)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

function OurStory() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  return (
    <section id="story" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Our Story</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? 28 : 38,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: C.ink,
            marginBottom: 14,
          }}
        >
          From a Baltic Problem to a{" "}
          <GradientText>Baltic Solution</GradientText>
        </h2>
        <p
          style={{
            fontSize: isMobile ? 14 : 16,
            color: C.inkDim,
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          Nexfluence was born in Riga, Latvia — out of frustration with how
          influencer marketing worked (or didn’t). We set out to build
          something transparent, performance‑driven, and proudly Baltic.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <StoryMission />
          <StoryVision />
          <StoryOrigin />
        </div>
      ) : isTablet ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <StoryMission style={{ gridColumn: "1 / -1" }} />
          <StoryVision />
          <StoryOrigin />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 14,
          }}
        >
          <StoryMission style={{ gridColumn: "1 / 7" }} />
          <StoryVision style={{ gridColumn: "7 / 13" }} />
          <StoryOrigin style={{ gridColumn: "1 / 13" }} />
        </div>
      )}
    </section>
  );
}

function StoryMission({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: `${C.violet}12`,
            border: `1px solid ${C.violet}24`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🎯
        </div>
        <div>
          <h3
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            Our Mission
          </h3>
          <p
            style={{
              fontSize: 14,
              color: C.inkDim,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            To make influencer marketing in the Baltic region simple,
            measurable, and fair — for brands that want real ROI and
            creators who deserve to be paid for real influence.
          </p>
        </div>
      </div>
    </BentoCard>
  );
}

function StoryVision({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.pink} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: `${C.pink}12`,
            border: `1px solid ${C.pink}24`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🌍
        </div>
        <div>
          <h3
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            Our Vision
          </h3>
          <p
            style={{
              fontSize: 14,
              color: C.inkDim,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Become the infrastructure powering the creator economy across
            Northern Europe — starting with Latvia, Lithuania, and Estonia.
          </p>
        </div>
      </div>
    </BentoCard>
  );
}

function StoryOrigin({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.indigo} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: `${C.indigo}12`,
            border: `1px solid ${C.indigo}24`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          ⏳
        </div>
        <div>
          <h3
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            How It Started
          </h3>
          <p
            style={{
              fontSize: 14,
              color: C.inkDim,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Founded in 2024 in Riga, Nexfluence started as a small
            WhatsApp group connecting local brands with trusted creators.
            Today we’re a platform with 500+ vetted influencers and
            25+ active brand partners across all three Baltic states.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 8,
        }}
      >
        {["🇱🇻 Latvia", "🇱🇹 Lithuania", "🇪🇪 Estonia"].map((c) => (
          <span
            key={c}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 11px",
              borderRadius: 8,
              background: `${C.indigo}0e`,
              color: C.ink,
              border: `1px solid ${C.indigo}1c`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────
// 3. TEAM SECTION
// ─────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Anna Liepa",
    role: "Head of Creator Relations",
    photo: "/team/member1.webp",
  },
  {
    name: "Jānis Bērziņš",
    role: "Campaign Manager",
    photo: "/team/member2.webp",
  },
  {
    name: "Līva Ozoliņa",
    role: "Data & Analytics",
    photo: "/team/member3.webp",
  },
  {
    name: "Mārtiņš Kalniņš",
    role: "Partnerships Lead",
    photo: "/team/member4.webp",
  },
  {
    name: "Elīna Siliņa",
    role: "Content Strategist",
    photo: "/team/member5.webp",
  },
  {
    name: "Kārlis Vītols",
    role: "Engineering Lead",
    photo: "/team/member6.webp",
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        border: hovered ? C.borderH : C.border,
        boxShadow: hovered ? C.shadowMd : C.shadowSm,
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.2s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid rgba(124,85,255,0.14)",
          marginBottom: 16,
        }}
      >
        <Image
          src={member.photo}
          alt={member.name}
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: "-0.01em",
          margin: "0 0 4px",
        }}
      >
        {member.name}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: C.pink,
          fontWeight: 500,
          margin: "0 0 8px",
        }}
      >
        {member.role}
      </p>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 12,
            color: C.violet,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          LinkedIn →
        </a>
      )}
    </div>
  );
}

function Team() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section id="team" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Our Team</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? 28 : 38,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: C.ink,
          }}
        >
          The People Behind{" "}
          <GradientText>the Platform</GradientText>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : isTablet
            ? "repeat(3, 1fr)"
            : "repeat(6, 1fr)",
          gap: 14,
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
// 4. EVENTS & COMMUNITY
// ─────────────────────────────────────────────
const EVENT_PHOTOS = [
  { src: "/events/influencer1.webp", alt: "Influencer meetup in Riga" },
  { src: "/events/influencer2.webp", alt: "Brands & creators networking" },
  {
    src: "/events/influencer3.webp",
    alt: "Nexfluence Connect 2025 stage",
  },
  { src: "/events/influencer4.webp", alt: "Creator masterclass" },
  { src: "/events/influencer5.webp", alt: "Pop‑up brand activation" },
  { src: "/events/influencer6.webp", alt: "After‑party celebration" },
];

function Events() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Community & Events</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? 28 : 38,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: C.ink,
          }}
        >
          Where <GradientText>Creators & Brands</GradientText> Meet
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : isTablet
            ? "repeat(3, 1fr)"
            : "repeat(4, 1fr)",
          gap: 12,
          gridAutoRows: isMobile ? "140px" : "220px",
        }}
      >
        {EVENT_PHOTOS.map((photo, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(124,85,255,0.14)",
              boxShadow: C.shadowSm,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "12px",
                background:
                  "linear-gradient(transparent, rgba(10,6,18,0.45))",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {photo.alt}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. SPONSORS MARQUEE
// ─────────────────────────────────────────────
const SPONSORS = [
  { name: "Sponsor 1", img: "/sponsors/sponsor1.webp" },
  { name: "Sponsor 2", img: "/sponsors/sponsor2.webp" },
  { name: "Sponsor 3", img: "/sponsors/sponsor3.webp" },
  { name: "Sponsor 4", img: "/sponsors/sponsor4.webp" },
  { name: "Sponsor 5", img: "/sponsors/sponsor5.webp" },
];

function SponsorsMarquee() {
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ marginTop: 96 }}>
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(10,6,18,0.28)",
          marginBottom: 28,
        }}
      >
        Trusted Partners & Event Sponsors
      </p>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: isMobile ? 80 : 120,
          borderTop: "1px solid rgba(124,85,255,0.10)",
          borderBottom: "1px solid rgba(124,85,255,0.10)",
          background: C.bgSub,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${C.bg} 0%, transparent 12%, transparent 88%, ${C.bg} 100%)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        <div
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <div
            className="marquee-track"
            style={{ alignItems: "center" }}
          >
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                style={{
                  flexShrink: 0,
                  margin: isMobile ? "0 18px" : "0 28px",
                  display: "flex",
                  alignItems: "center",
                  height: isMobile ? 48 : 72,
                }}
              >
                <Image
                  src={s.img}
                  alt={s.name}
                  width={isMobile ? 80 : 120}
                  height={isMobile ? 48 : 72}
                  style={{
                    objectFit: "contain",
                    opacity: 0.45,
                    filter: "grayscale(1)",
                    transition:
                      "opacity 0.2s, filter 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.opacity = "1";
                    el.style.filter = "none";
                    el.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.opacity = "0.45";
                    el.style.filter = "grayscale(1)";
                    el.style.transform = "scale(1)";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. FINAL CTA (identical to homepage)
// ─────────────────────────────────────────────
function FinalCTA() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <section style={{ ...siteOuter(w, 96), marginBottom: 0 }}>
      <div
        id="contact"
        style={{
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          padding: isMobile ? "48px 28px" : "68px 72px",
          background: `linear-gradient(135deg, ${C.violet}0e, ${C.pink}08)`,
          border: C.borderS,
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,85,255,0.11) 0%, rgba(255,51,188,0.05) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,85,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.055) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <PillLabel>Get in Touch</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? 28 : 42,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: C.ink,
              marginBottom: 14,
            }}
          >
            Want to Work with Us?
            <br />
            <GradientText>Let’s Build Something Great</GradientText>
          </h2>
          <p
            style={{
              fontSize: isMobile ? 14 : 16,
              color: C.inkDim,
              maxWidth: 460,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            Whether you’re a brand, creator, or potential partner — we’d
            love to hear from you.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Btn href="mailto:brands@nexfluence.eu" variant="primary">
              I’m a Brand →
            </Btn>
            <Btn href="mailto:creators@nexfluence.eu" variant="ghost">
              I’m a Creator →
            </Btn>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(10,6,18,0.3)",
              marginTop: 18,
            }}
          >
            No commitment required · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. FOOTER (identical to homepage)
// ─────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: [
    "Creator Discovery",
    "Campaign Management",
    "Analytics",
    "Affiliate Programs",
  ],
  Company: ["About Us", "Blog", "Careers", "Press"],
  Contact: [
    "brands@nexfluence.eu",
    "creators@nexfluence.eu",
    "Instagram",
    "LinkedIn",
  ],
};

function Footer() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <footer
      style={{
        marginTop: 96,
        borderTop: "1px solid rgba(124,85,255,0.12)",
        maxWidth: SITE_MAX_W,
        margin: "96px auto 0",
        padding: isMobile
          ? "48px 20px 32px"
          : w < 900
          ? "56px 32px 36px"
          : "60px 48px 36px",
        background: C.bg,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? "32px 20px" : 36,
          marginBottom: 48,
        }}
      >
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Image
              src="/Nex.webp"
              alt="Nexfluence"
              width={38}
              height={38}
              style={{ borderRadius: 9 }}
            />
            <div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: C.ink,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Nexfluence
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: C.pink,
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                CREATOR NEXUS
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 13,
              color: C.inkDim,
              lineHeight: 1.75,
              maxWidth: 230,
            }}
          >
            Latvia’s first performance‑based influencer marketing platform
            connecting brands with authentic Baltic creators.
          </p>
          <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
            {["IG", "LI", "TT"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  background: C.bgSub,
                  border: C.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.inkDim,
                  textDecoration: "none",
                  transition: "color 0.18s, border-color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = C.ink;
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor = "rgba(255,51,188,0.38)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    C.inkDim;
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor = "rgba(124,85,255,0.18)";
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
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(10,6,18,0.35)",
                marginBottom: 14,
              }}
            >
              {col}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: 13,
                    color: C.inkDim,
                    textDecoration: "none",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      C.ink)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      C.inkDim)
                  }
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(124,85,255,0.08)",
          paddingTop: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "rgba(10,6,18,0.28)",
            margin: 0,
          }}
        >
          © 2026 Nexfluence SIA. Registered in Latvia. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 12,
                color: "rgba(10,6,18,0.30)",
                textDecoration: "none",
              }}
            >
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
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <Header />
      <FounderHero />
      <OurStory />
      <Team />
      <Events />
      <SponsorsMarquee />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * REQUIRED CSS (globals.css) — same as homepage
 * ═══════════════════════════════════════════════════════════════════
 *
 * @layer utilities {
 *   .marquee-track {
 *     display: flex; width: max-content;
 *     animation: marquee-left 28s linear infinite;
 *   }
 *   .marquee-track:hover { animation-play-state: paused; }
 * }
 * @keyframes marquee-left {
 *   from { transform: translateX(0); }
 *   to   { transform: translateX(-50%); }
 * }
 * ═══════════════════════════════════════════════════════════════════
 *
 * IMAGE PLACEHOLDER LEGEND (place your own images)
 * ──────────────────────────────────────────────────
 *  /founder.webp           → high‑res founder portrait
 *  /team/member1.webp      → team member 1
 *  /team/member2.webp      → team member 2
 *  ... up to member6
 *  /events/influencer1.webp→ event photo 1
 *  /events/influencer2.webp→ event photo 2
 *  ... up to influencer6
 *  /sponsors/sponsor1.webp → sponsor logo 1
 *  ... up to sponsor5
 * ═══════════════════════════════════════════════════════════════════
 */