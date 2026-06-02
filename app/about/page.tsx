"use client";

/**
 * app/about/page.tsx
 * Nexfluence — About Page
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header
 *  2. Hero Banner (full-width image)
 *  3. Our Story (bento grid)
 *  4. Team  (founder compact card + team grid)
 *  5. Events & Community
 *  6. Sponsors Marquee
 *  7. Final CTA
 *  8. Footer
 */

import Image from "next/image";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// FONT
// ─────────────────────────────────────────────
const FONT = "'Rubik', sans-serif";

// ─────────────────────────────────────────────
// INLINE CSS — keyframes + marquee animation
// injected via <style> tag so it actually runs
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes marquee-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-left 28s linear infinite;
    will-change: transform;
    align-items: center;
    height: 100%;
    position: relative;
    z-index: 3;
  }
  .marquee-track:hover { animation-play-state: paused; }
`;

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
}
function Btn({ href, onClick, variant, children, style }: BtnProps) {
  const base: CSSProps = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "13px 28px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
    textDecoration: "none", cursor: "pointer", border: "none",
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
      (e.currentTarget as HTMLElement).style.opacity = "0.88";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.opacity = "1";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    },
  };
  if (href) return <a href={href} style={merged} {...hover}>{children}</a>;
  return <button style={merged} onClick={onClick} {...hover}>{children}</button>;
}

// ─────────────────────────────────────────────
// BENTO CARD
// ─────────────────────────────────────────────
function BentoCard({ children, style, accent }: {
  children: React.ReactNode; style?: CSSProps; accent?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24, padding: 28,
        background: hovered ? (accent ? `${accent}0a` : C.cardBgM) : C.cardBg,
        border: hovered ? `1px solid ${accent ?? C.violet}44` : C.border,
        boxShadow: hovered ? `0 20px 56px ${accent ?? C.violet}12` : C.shadowSm,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.22s ease",
        display: "flex", flexDirection: "column", gap: 16,
        position: "relative", overflow: "hidden",
        ...style,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
          background: `linear-gradient(90deg, transparent, ${accent ?? C.violet}55, transparent)`,
        }} />
      )}
      {children}
    </div>
  );
}

function IconBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 50, height: 50, borderRadius: 14,
      background: `${color}12`, border: `1px solid ${color}24`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  // { label: "Creators",    href: "/creators"    },
  { label: "About Us",    href: "/about"       },
  { label: "Growth",      href: "/progress"    },
];

function Header() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

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
          }}>Contact Us</a>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// 2. HERO BANNER
// Full-width image constrained to site maxWidth.
// No founder portrait here — that moves above team.
// ─────────────────────────────────────────────
function HeroBanner() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;
  const bannerH  = isMobile ? 220 : w < 900 ? 340 : 480;

  return (
    <section style={{
      paddingTop: isMobile ? 72 : 80,  // clear fixed header
      background: C.bg,
    }}>
      <div style={{
        maxWidth: SITE_MAX_W,
        margin: "0 auto",
        paddingLeft: hPad,
        paddingRight: hPad,
        boxSizing: "border-box",
      }}>
        {/* Banner image */}
        <div style={{
          position: "relative",
          width: "100%",
          height: bannerH,
          borderRadius: isMobile ? 16 : 24,
          overflow: "hidden",
          border: "1px solid rgba(124,85,255,0.18)",
          boxShadow: "0 16px 56px rgba(124,85,255,0.14)",
        }}>
          <Image
            src="/images/Lecture.webp"
            alt="Nexfluence event — creators gathered"
            fill
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
            priority
          />
          {/* Dark overlay for legibility */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(10,6,18,0.62) 0%, rgba(10,6,18,0.18) 55%, transparent 100%)",
          }} />
          {/* Violet tint */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(124,85,255,0.18) 0%, rgba(255,51,188,0.08) 50%, transparent 70%)",
          }} />
          {/* Text overlay */}
          <div style={{
            position: "absolute",
            bottom: isMobile ? 20 : 32,
            left: isMobile ? 20 : 36,
            zIndex: 2,
          }}>
            {/* <p style={{
              fontFamily: FONT,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              color: C.pink,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}>
              Our Story
            </p> */}
            <h1 style={{
              fontFamily: FONT,
              fontSize: isMobile ? 24 : w < 900 ? 34 : 46,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              maxWidth: isMobile ? 280 : 560,
            }}>
              Building the Future of Creator Economy in the Baltics
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. OUR STORY — BENTO GRID
// ─────────────────────────────────────────────
function OurStory() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  return (
    <section id="story" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Our Story</PillLabel>
        <h2 style={{
          fontSize: isMobile ? 26 : 38, fontWeight: 900,
          letterSpacing: "-0.035em", lineHeight: 1.1,
          color: C.ink, marginBottom: 14, fontFamily: FONT,
        }}>
          From a Baltic Problem to a{" "}
          <GradientText>Baltic Solution</GradientText>
        </h2>
        <p style={{
          fontSize: isMobile ? 14 : 16, color: C.inkDim,
          maxWidth: 520, margin: "0 auto", lineHeight: 1.75, fontFamily: FONT,
        }}>
          Nexfluence was born in Riga, Latvia — out of frustration with how
          influencer marketing worked (or didn't). We set out to build
          something transparent, performance‑driven, and proudly Baltic.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <StoryMission />
          <StoryVision />
          <StoryOrigin />
        </div>
      ) : isTablet ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <StoryMission style={{ gridColumn: "1 / -1" }} />
          <StoryVision />
          <StoryOrigin />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
          <StoryMission style={{ gridColumn: "1 / 7" }} />
          <StoryVision  style={{ gridColumn: "7 / 13" }} />
          <StoryOrigin  style={{ gridColumn: "1 / 13" }} />
        </div>
      )}
    </section>
  );
}

function StoryMission({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <IconBox color={C.violet}>
          <Icon name="target" size={22} />
        </IconBox>
        <div>
          <h3 style={{
            fontSize: 19, fontWeight: 700, color: C.ink,
            letterSpacing: "-0.02em", margin: "0 0 10px", fontFamily: FONT,
          }}>Our Mission</h3>
          <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, margin: 0, fontFamily: FONT }}>
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
        <IconBox color={C.pink}>
          <Icon name="globe" size={22} />
        </IconBox>
        <div>
          <h3 style={{
            fontSize: 19, fontWeight: 700, color: C.ink,
            letterSpacing: "-0.02em", margin: "0 0 10px", fontFamily: FONT,
          }}>Our Vision</h3>
          <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, margin: 0, fontFamily: FONT }}>
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
        <IconBox color={C.indigo}>
          <Icon name="archive" size={22} />
        </IconBox>
        <div>
          <h3 style={{
            fontSize: 19, fontWeight: 700, color: C.ink,
            letterSpacing: "-0.02em", margin: "0 0 10px", fontFamily: FONT,
          }}>How It Started</h3>
          <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, margin: 0, fontFamily: FONT }}>
            Founded in 2024 in Riga, Nexfluence started as a small
            WhatsApp group connecting local brands with trusted creators.
            Today we're a platform with 500+ vetted influencers and
            25+ active brand partners across all three Baltic states.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        {["Latvia", "Lithuania", "Estonia"].map((c) => (
          <span key={c} style={{
            fontSize: 12, fontWeight: 600, padding: "5px 11px",
            borderRadius: 8, background: `${C.indigo}0e`,
            color: C.ink, border: `1px solid ${C.indigo}1c`, fontFamily: FONT,
          }}>{c}</span>
        ))}
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────
// 4. TEAM
// Founder compact card sits full-width above the team grid.
// Card is half the previous height — horizontal layout, photo left.
// ─────────────────────────────────────────────
interface TeamMember { name: string; role: string; photo: string; linkedin?: string; }

const TEAM: TeamMember[] = [
  { name: "Anna Liepa",       role: "Head of Creator Relations", photo: "/team/member1.webp" },
  { name: "Jānis Bērziņš",   role: "Campaign Manager",          photo: "/team/member2.webp" },
  { name: "Līva Ozoliņa",    role: "Data & Analytics",          photo: "/team/member3.webp" },
  { name: "Mārtiņš Kalniņš", role: "Partnerships Lead",         photo: "/team/member4.webp" },
  { name: "Elīna Siliņa",    role: "Content Strategist",        photo: "/team/member5.webp" },
  { name: "Kārlis Vītols",   role: "Engineering Lead",          photo: "/team/member6.webp" },
];

// Compact founder card — photo left, bio right, ~240px tall
function FounderCard() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "100px 1fr" : "180px 1fr",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid rgba(124,85,255,0.20)",
      boxShadow: "0 8px 32px rgba(124,85,255,0.12)",
      background: "#fff",
      marginBottom: isMobile ? 12 : 14,
    }}>
      {/* Photo */}
      <div style={{
        position: "relative",
        minHeight: isMobile ? 140 : 200,
      }}>
        <Image
          src="/images/Harshul.webp"
          alt="Harshul Gupta, Founder & CEO"
          fill
          style={{ objectFit: "cover", objectPosition: "center 20%",     transform: "scaleX(-1)",
 }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(124,85,255,0.10) 0%, rgba(255,51,188,0.05) 50%, transparent 70%)",
        }} />
      </div>

      {/* Bio */}
      <div style={{
        padding: isMobile ? "16px 18px" : "22px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
        background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 style={{
            fontFamily: FONT,
            fontSize: isMobile ? 16 : 20,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: C.ink,
            margin: 0,
          }}>
            Harshul Gupta
          </h3>
          {/* Gradient badge */}
          {/* <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: C.grad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: FONT,
          }}>
            Founder & CEO
          </span> */}
        </div>
        {/* Gradient divider */}
        <div style={{ width: 32, height: 2, borderRadius: 2, background: C.grad }} />
        <p style={{
          fontFamily: FONT,
          fontSize: isMobile ? 12 : 13,
          color: C.inkDim,
          lineHeight: 1.7,
          margin: 0,
          maxWidth: 560,
        }}>
          "I started Nexfluence to solve a problem I lived every day —
          the disconnect between brands and authentic Baltic creators.
          Real people, real stories, real results."
        </p>
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: "hidden",
        background: "#fff",
        border: hovered ? C.borderH : C.border,
        boxShadow: hovered ? C.shadowMd : C.shadowSm,
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.2s ease", cursor: "default",
        display: "flex", flexDirection: "column",
        alignItems: "center", padding: "20px 16px 18px",
        textAlign: "center",
      }}
    >
      <div style={{
        width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
        border: "3px solid rgba(124,85,255,0.14)", marginBottom: 14,
        flexShrink: 0,
      }}>
        <Image
          src={member.photo} alt={member.name}
          width={80} height={80}
          style={{ objectFit: "cover" }}
        />
      </div>
      <h3 style={{
        fontSize: 14, fontWeight: 700, color: C.ink,
        letterSpacing: "-0.01em", margin: "0 0 4px", fontFamily: FONT,
      }}>{member.name}</h3>
      <p style={{
        fontSize: 12, color: C.pink, fontWeight: 500,
        margin: "0 0 8px", fontFamily: FONT,
      }}>{member.role}</p>
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noreferrer" style={{
          fontSize: 12, color: C.violet, textDecoration: "none",
          fontWeight: 600, fontFamily: FONT,
        }}>LinkedIn </a>
      )}
    </div>
  );
}

function Team() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section id="team" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Our Team</PillLabel>
        <h2 style={{
          fontSize: isMobile ? 26 : 38, fontWeight: 900,
          letterSpacing: "-0.035em", lineHeight: 1.1,
          color: C.ink, fontFamily: FONT,
        }}>
          The People Behind{" "}<GradientText>the Platform</GradientText>
        </h2>
      </div>

      {/* Founder compact card — full width above team grid */}
      <FounderCard />

      {/* Team grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr 1fr"
          : isTablet
          ? "repeat(3, 1fr)"
          : "repeat(6, 1fr)",
        gap: isMobile ? 12 : 14,
      }}>
        {TEAM.map((m) => <TeamCard key={m.name} member={m} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. EVENTS & COMMUNITY
// ─────────────────────────────────────────────
const EVENT_PHOTOS = [
  { src: "/images/Last Event.webp", alt: "Influencer meetup in Riga",      span: false },
  { src: "/images/Header.webp", alt: "Brands & creators networking",   span: false },
  { src: "/images/Lecture.webp", alt: "Creator Nexus 2026 Stage",  span: true  },
  { src: "/images/Talking.webp", alt: "Creator masterclass",            span: false },
  { src: "/images/Ice Cream.webp", alt: "Pop‑up brand activation",        span: false },
  // { src: "/events/influencer6.webp", alt: "After‑party celebration",        span: false },
];

function Events() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const rowH     = isMobile ? 130 : isTablet ? 180 : 220;

  return (
    <section style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Community & Events</PillLabel>
        <h2 style={{
          fontSize: isMobile ? 26 : 38, fontWeight: 900,
          letterSpacing: "-0.035em", lineHeight: 1.1,
          color: C.ink, fontFamily: FONT,
        }}>
          Where <GradientText>Creators & Brands</GradientText> Meet
        </h2>
      </div>

      {(isMobile || isTablet) ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: isMobile ? 10 : 12,
        }}>
          {EVENT_PHOTOS.map((photo, i) => (
            <div key={i} style={{
              position: "relative", borderRadius: 14, overflow: "hidden",
              height: rowH, border: "1px solid rgba(124,85,255,0.14)",
              boxShadow: C.shadowSm, transition: "transform 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: "cover" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "8px 10px",
                background: "linear-gradient(transparent, rgba(10,6,18,0.5))",
                color: "#fff", fontSize: 10, fontWeight: 500, fontFamily: FONT,
              }}>{photo.alt}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: `${rowH}px ${rowH}px`,
          gap: 12,
        }}>
          {EVENT_PHOTOS.map((photo, i) => (
            <div key={i} style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              gridColumn: photo.span ? "1 / 3" : undefined,
              border: "1px solid rgba(124,85,255,0.14)",
              boxShadow: C.shadowSm, transition: "transform 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: "cover" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "10px 12px",
                background: "linear-gradient(transparent, rgba(10,6,18,0.48))",
                color: "#fff", fontSize: 11, fontWeight: 500, fontFamily: FONT,
              }}>{photo.alt}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. SPONSORS MARQUEE — full-bleed, edge-to-edge
// Animation injected via GLOBAL_CSS <style> tag
// ─────────────────────────────────────────────
const SPONSORS = [
  { name: "Artisan Street Bakery", img: "/Artisan Street Bakery.webp" },
  { name: "Molberts",              img: "/Molberts.webp"              },
  { name: "Gardu Muti",            img: "/Gardu Muti.webp"            },
  { name: "Street Pizza",          img: "/Street Pizza.webp"          },
  { name: "Street Burgers",        img: "/Street Burgers.webp"        },
  { name: "Skrīveru",             img: "/Skriveru.webp"              },
  { name: "Hedonya",               img: "/Hedonya.webp"               },
];

function SponsorsMarquee() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  const imgH   = isMobile ? 78  : isTablet ? 108 : 140;
  const radius = isMobile ? 8   : 14;
  const margin = isMobile ? "0 8px" : isTablet ? "0 11px" : "0 15px";
  const trackH = isMobile ? 110 : isTablet ? 140 : 180;

  const items = [...SPONSORS, ...SPONSORS];

  return (
    <section style={{ marginTop: 96 }}>
      <p style={{
        textAlign: "center", fontSize: 12, fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "rgba(10,6,18,0.28)", marginBottom: 28, fontFamily: FONT,
      }}>
        Trusted Partners & Event Sponsors
      </p>

      <div style={{
        position: "relative",
        overflow: "hidden",
        height: trackH,
        borderTop:    "1px solid rgba(124,85,255,0.22)",
        borderBottom: "1px solid rgba(124,85,255,0.22)",
        background:   "rgba(124,85,255,0.03)",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(124,85,255,0.18) 0%, rgba(255,51,188,0.10) 35%, transparent 65%)",
          filter: "blur(22px)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Edge fade */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, ${C.bg} 0%, transparent 6%, transparent 94%, ${C.bg} 100%)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Scrolling tape — animated via .marquee-track class in GLOBAL_CSS */}
        <div className="marquee-track">
          {items.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              style={{
                flexShrink: 0,
                margin: margin,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: imgH,
              }}
            >
              <img
                src={s.img}
                alt={s.name}
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "cover",
                  borderRadius: radius,
                  opacity: 0.96,
                  filter: "drop-shadow(0 0 18px rgba(124,85,255,0.18)) drop-shadow(0 0 28px rgba(255,51,188,0.12))",
                  transition: "transform 0.25s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ ...siteOuter(w, 96), marginBottom: 0 }}>
      <div id="contact" style={{
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
          <PillLabel>Get in Touch</PillLabel>
          <h2 style={{
            fontSize: isMobile ? 26 : 42, fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.1,
            color: C.ink, marginBottom: 14, fontFamily: FONT,
          }}>
            Want to Work with Us?
            <br />
            <GradientText>Let's Build Something Great</GradientText>
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 16, color: C.inkDim,
            maxWidth: 460, margin: "0 auto 36px",
            lineHeight: 1.75, fontFamily: FONT,
          }}>
            Whether you're a brand, creator, or potential partner — we'd love to hear from you.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn href="mailto:brands@nexfluence.eu" variant="primary">I'm a Brand</Btn>
            <Btn href="mailto:creators@nexfluence.eu" variant="ghost">I'm a Creator</Btn>
          </div>
          <p style={{
            fontSize: 12, color: "rgba(10,6,18,0.3)",
            marginTop: 18, fontFamily: FONT,
          }}>
            No commitment required · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 8. FOOTER
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
        gap: isMobile ? "32px 20px" : 36,
        marginBottom: 48,
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
        borderTop: "1px solid rgba(124,85,255,0.08)",
        paddingTop: 22, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <p style={{ fontSize: 12, color: "rgba(10,6,18,0.28)", margin: 0, fontFamily: FONT }}>
          © 2026 Nexfluence SIA. Registered in Latvia. All rights reserved.
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
export default function AboutPage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      {/* Inject marquee keyframes — this is what makes the strip actually move */}
      <style>{GLOBAL_CSS}</style>
      <Header />
      <HeroBanner />
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
 * IMAGE FILES NEEDED
 * ─────────────────────────────────────────────────────────────────
 *  /Lecture.webp              the wide banner photo (uploaded)
 *  /founder.webp              founder portrait for compact card
 *  /team/member1–6.webp       team member photos
 *  /events/influencer1–6.webp event gallery photos
 * ═══════════════════════════════════════════════════════════════════
 */