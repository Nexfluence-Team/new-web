"use client";

/**
 * app/zone/page.tsx
 * Creator Nexus by Nexfluence — Company Homepage v4
 */

import Image from "next/image";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// INLINE CSS — keyframes injected via <style> tag
// so the marquee actually animates (not just commented in globals.css)
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
  @keyframes dot-pulse {
    0%   { box-shadow: 0 0 0 0   rgba(255,51,188,0.5); }
    70%  { box-shadow: 0 0 0 9px rgba(255,51,188,0);   }
    100% { box-shadow: 0 0 0 0   rgba(255,51,188,0);   }
  }
  .dot-live {
    display: inline-block;
    width: 7px; height: 7px; border-radius: 9999px;
    background: #ff33bc;
    box-shadow: 0 0 0 0 rgba(255,51,188,0.5);
    animation: dot-pulse 1.8s ease-out infinite;
    flex-shrink: 0;
  }
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
  bg:      "#ffffff",
  bgSub:   "#f7f6ff",
  bgCard:  "#f2f0ff",
  ink:     "#0a0612",
  inkDim:  "rgba(10,6,18,0.50)",
  inkDim2: "rgba(10,6,18,0.72)",
  pink:    "#ff33bc",
  violet:  "#7c55ff",
  indigo:  "#6a66ff",
  grad:    "linear-gradient(90deg, #ff33bc, #7c55ff)",
  gradD:   "linear-gradient(135deg, #ff33bc, #7c55ff)",
  border:  "1px solid rgba(124,85,255,0.18)",
  borderH: "1px solid rgba(255,51,188,0.45)",
  borderS: "1px solid rgba(124,85,255,0.28)",
  cardBg:  "rgba(124,85,255,0.05)",
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
      textTransform: "uppercase", color: C.pink, marginBottom: 16,
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
// 1. HEADER
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creators",    href: "/creators"    },
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
        maxWidth: SITE_MAX_W,
        margin: "0 auto",
        padding: isMobile ? "16px 20px" : w < 900 ? "18px 32px" : "18px 48px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        {/* Logo image only — no company name text */}
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={isMobile ? 34 : 40} height={isMobile ? 34 : 40} style={{ borderRadius: 10 }} />
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: 28, marginLeft: 36 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{
                fontSize: 14, fontWeight: 500, color: C.inkDim,
                textDecoration: "none", letterSpacing: "0.01em", transition: "color 0.18s",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.inkDim)}
              >{l.label}</a>
            ))}
          </nav>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {!isMobile && (
            <>
              <Btn href="/contact" variant="primary" style={{ padding: "10px 20px", fontSize: 13 }}>Contact Us</Btn>
            </>
          )}
          {isMobile && (
            <>
              <Btn href="/contact" variant="primary" style={{ padding: "9px 14px", fontSize: 12 }}>Contact Us</Btn>
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
              fontSize: 16, fontWeight: 500, color: C.inkDim2, textDecoration: "none",
            }}>{l.label}</a>
          ))}
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} style={{
            fontSize: 15, fontWeight: 600, color: C.pink, textDecoration: "none",
          }}>For Creators</a>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// 2. HERO
// ─────────────────────────────────────────────
function Hero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", overflow: "hidden", background: C.bg,
    }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(124,85,255,0.09) 0%, rgba(255,51,188,0.04) 40%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(124,85,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,85,255,0.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black 40%, transparent 80%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          background: "linear-gradient(to top, #ffffff, transparent)",
        }} />
      </div>

      <div style={{
        maxWidth: SITE_MAX_W, width: "100%", margin: "0 auto",
        paddingTop: isMobile ? 120 : 130,
        paddingBottom: isMobile ? 40 : isTablet ? 40 : 100,
        paddingLeft: hPad, paddingRight: hPad,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: !isMobile && !isTablet ? "1fr 1fr" : "1fr",
        gap: 48, alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <div>
          {/* Plain text eyebrow — no capsule, no NEW badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontSize: isMobile ? 10 : 11, fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: C.pink, marginBottom: 24,
          }}>
            <span style={{ display: "block", width: 20, height: 1, background: C.pink, flexShrink: 0 }} />
            Europe's Fastest Growing Creator Economy Platform
          </div>

          <h1 style={{
            fontSize: isMobile ? 36 : isTablet ? 46 : 56,
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.05, color: C.ink, margin: 0, marginBottom: 24,
          }}>
            Where Brands
            <br />
            Meet{" "}
            <GradientText>Baltic</GradientText>
            <br />
            Creators
          </h1>

          <p style={{
            fontSize: isMobile ? 15 : 17, color: C.inkDim2,
            lineHeight: 1.75, maxWidth: 480, marginBottom: 36,
          }}>
            Nexfluence connects ambitious brands with authentic creators across
            Latvia, Lithuania, and Estonia — on a{" "}
            <span style={{ color: C.ink, fontWeight: 700 }}>100% performance-based model.</span>{" "}
            You only pay when results are delivered.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn href="/contact" variant="primary">Start a Campaign</Btn>
            <Btn href="/contact" variant="ghost">Join as Creator</Btn>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["/images/Armandez.webp", "/images/Seraphena.webp", "/images/Cindy.webp"].map((src, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                  border: "2px solid #fff", marginLeft: i === 0 ? 0 : -10,
                  position: "relative", boxShadow: "0 2px 8px rgba(124,85,255,0.18)",
                }}>
                  <Image src={src} alt="Creator" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: C.inkDim }}>
              <span style={{ color: C.ink, fontWeight: 700 }}>500+</span> creators already in the network
            </p>
          </div>
        </div>

        {!isMobile && !isTablet && <HeroVisual />}
      </div>

      {isTablet && (
        <div style={{
          maxWidth: SITE_MAX_W, width: "100%", margin: "0 auto",
          paddingLeft: hPad, paddingRight: hPad, paddingBottom: 100,
          boxSizing: "border-box", position: "relative", zIndex: 1,
        }}>
          <div style={{ position: "relative", height: 400 }}>
            <HeroVisual />
          </div>
        </div>
      )}

      {isMobile && (
        <div style={{
          width: "100%", paddingLeft: 20, paddingRight: 20,
          paddingBottom: 80, position: "relative", zIndex: 1, boxSizing: "border-box",
        }}>
          <HeroVisualMobile />
        </div>
      )}
    </section>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: "relative", width: "100%", height: 460 }}>
      <div style={{
        position: "absolute", top: 24, right: 0,
        width: "72%", height: 340,
        borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,51,188,0.2)",
        boxShadow: "0 24px 64px rgba(124,85,255,0.16)",
      }}>
        <Image src="/images/Header.webp" alt="Riga" fill style={{ objectFit: "cover" }} priority />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(124,85,255,0.25) 0%, rgba(255,51,188,0.12) 50%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: 14, left: 14,
          padding: "5px 11px", borderRadius: 8,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(124,85,255,0.14)",
          boxShadow: "0 2px 10px rgba(124,85,255,0.10)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="location" size={12} />
          <p style={{ fontSize: 11, color: C.ink, fontWeight: 600, margin: 0 }}>Riga, Latvia</p>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 16, left: 0,
        width: 188, borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(124,85,255,0.18)",
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 12px 40px rgba(124,85,255,0.14)",
      }}>
        <div style={{ position: "relative", height: 112 }}>
          <Image src="/images/Cindy.webp" alt="Creator" fill style={{ objectFit: "cover", objectPosition: "top" }} />
        </div>
        <div style={{ padding: "10px 13px 14px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Cindy Bokāne</p>
          <p style={{ fontSize: 11, color: C.pink, marginTop: 2, marginBottom: 8 }}>Travel Creator · 84K</p>
          <div style={{ display: "flex", gap: 5 }}>
            {["IG", "TT"].map((p) => (
              <span key={p} style={{
                fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 4,
                background: "rgba(124,85,255,0.10)", color: C.violet, letterSpacing: "0.05em",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", top: 0, left: 24,
        padding: "11px 15px", borderRadius: 12,
        background: "rgba(255,255,255,0.97)",
        border: "1px solid rgba(124,85,255,0.16)",
        boxShadow: "0 6px 28px rgba(124,85,255,0.12)",
      }}>
        <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>
          <GradientText>3.2×</GradientText>
        </p>
        <p style={{ fontSize: 11, color: C.inkDim, marginTop: 3, margin: 0 }}>avg. campaign ROI</p>
      </div>

      <div style={{
        position: "absolute", bottom: 120, right: 12,
        display: "flex", alignItems: "center", gap: 7,
        padding: "7px 13px", borderRadius: 100,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(255,51,188,0.22)",
        boxShadow: "0 4px 14px rgba(255,51,188,0.10)",
      }}>
        <span className="dot-live" />
        <span style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>25+ Active Campaigns</span>
      </div>
    </div>
  );
}

function HeroVisualMobile() {
  return (
    <div style={{
      position: "relative", height: 220, borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(124,85,255,0.16)",
      boxShadow: "0 8px 28px rgba(124,85,255,0.10)",
    }}>
      <Image src="/Skyline.webp" alt="Riga" fill style={{ objectFit: "cover" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(124,85,255,0.38) 0%, rgba(255,51,188,0.18) 50%, transparent 70%)",
      }} />
      <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8 }}>
        {[{ value: "500+", label: "Creators" }, { value: "25+", label: "Brands" }].map((s) => (
          <div key={s.label} style={{
            padding: "7px 12px", borderRadius: 9,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(124,85,255,0.16)",
          }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              <GradientText>{s.value}</GradientText>
            </p>
            <p style={{ fontSize: 10, color: C.inkDim, margin: 0, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. STATS BAR
// ─────────────────────────────────────────────
const STATS = [
  { value: "500+",  label: "Vetted Creators"     },
  { value: "25+",   label: "Brand Partners"       },
  { value: "3",     label: "Baltic Countries"     },
  { value: "100%",  label: "Performance-Based"    },
  { value: "3.2×",  label: "Average Campaign ROI" },
];

function StatsBar() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <div style={{
      borderTop: "1px solid rgba(124,85,255,0.12)",
      borderBottom: "1px solid rgba(124,85,255,0.12)",
      background: C.bgSub,
      padding: isMobile ? "28px 20px" : "36px 48px",
    }}>
      <div style={{
        maxWidth: SITE_MAX_W, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${STATS.length}, 1fr)`,
        gap: isMobile ? "24px 16px" : 0,
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ textAlign: "center", position: "relative", padding: "0 16px" }}>
            {!isMobile && i < STATS.length - 1 && (
              <span style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                height: 40, width: 1, background: "rgba(124,85,255,0.18)",
              }} />
            )}
            <p style={{
              fontSize: isMobile ? 26 : 32, fontWeight: 900, letterSpacing: "-0.04em",
              background: C.grad, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1, marginBottom: 6, margin: 0,
            }}>{s.value}</p>
            <p style={{ fontSize: 12, color: C.inkDim, fontWeight: 500, letterSpacing: "0.02em", marginTop: 6 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. SERVICES — BENTO GRID
// ─────────────────────────────────────────────
function BentoCard({ children, style, accent }: { children: React.ReactNode; style?: CSSProps; accent?: string }) {
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

function STag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
      background: `${color}12`, color, letterSpacing: "0.02em",
    }}>{label}</span>
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

function Services() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  return (
    <section id="services" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>What We Do</PillLabel>
        <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink, marginBottom: 14 }}>
          Everything You Need to <GradientText>Run Influence</GradientText>
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 16, color: C.inkDim, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
          From creator discovery to post-campaign reporting — the full lifecycle of influencer marketing for Baltic brands.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SvcDiscovery /><SvcCampaign /><SvcAnalytics /><SvcAffiliate />
        </div>
      ) : isTablet ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <SvcDiscovery style={{ gridColumn: "1 / -1" }} />
          <SvcCampaign />
          <SvcAnalytics />
          <SvcAffiliate style={{ gridColumn: "1 / -1" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
          <SvcDiscovery style={{ gridColumn: "1 / 7" }} />
          <SvcCampaign  style={{ gridColumn: "7 / 13" }} />
          <SvcAnalytics style={{ gridColumn: "1 / 5" }} />
          <SvcAffiliate style={{ gridColumn: "5 / 9" }} />
          <SvcHighlight style={{ gridColumn: "9 / 13" }} />
        </div>
      )}
    </section>
  );
}

function SvcDiscovery({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={{ minHeight: 240, ...style }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <IconBox color={C.violet}><Icon name="search" size={22} /></IconBox>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "14px 0 10px" }}>Creator Discovery</h3>
          <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, maxWidth: 380, margin: 0 }}>
            We identify the right creators from our verified network of 500+ Baltic influencers — matched by niche, audience demographics, engagement quality, and brand fit.
          </p>
        </div>
        <div style={{
          width: 100, height: 100, borderRadius: 18, flexShrink: 0,
          background: `linear-gradient(135deg, ${C.violet}16, ${C.pink}0a)`,
          border: C.border, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="globe" size={36} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {["Niche Matching", "Audience Audit", "Engagement Rate", "Brand Safety"].map((t) => <STag key={t} label={t} color={C.violet} />)}
      </div>
    </BentoCard>
  );
}

function SvcCampaign({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.pink} style={{ minHeight: 240, ...style }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <IconBox color={C.pink}><Icon name="rocket" size={22} /></IconBox>
        <div>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 10px" }}>Campaign Management</h3>
          <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, margin: 0 }}>
            End-to-end execution from creative brief to final report. Contracts, briefing, content review, scheduling, and post-campaign analysis — all handled.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
        {["Brief", "Review", "Publish", "Report"].map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              flex: 1, padding: "7px 8px", borderRadius: 8, textAlign: "center",
              background: `${C.pink}${i === 1 ? "16" : "08"}`,
              border: `1px solid ${C.pink}${i === 1 ? "28" : "10"}`,
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: i === 1 ? C.pink : C.inkDim, margin: 0 }}>{step}</p>
            </div>
            {i < 3 && <div style={{ width: 10, height: 1, background: `${C.pink}28`, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {["Brief & Strategy", "Content Review", "Publishing", "Reporting"].map((t) => <STag key={t} label={t} color={C.pink} />)}
      </div>
    </BentoCard>
  );
}

function SvcAnalytics({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.indigo} style={style}>
      <IconBox color={C.indigo}><Icon name="analytics" size={22} /></IconBox>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>Performance Analytics</h3>
      <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, margin: 0 }}>
        Every campaign tracked with real data — impressions, clicks, conversions, and revenue. You pay only for confirmed results.
      </p>
      <div style={{ padding: "12px 14px", borderRadius: 12, background: `${C.indigo}08`, border: `1px solid ${C.indigo}14` }}>
        <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", margin: 0, lineHeight: 1 }}>
          <GradientText>3.2×</GradientText>
        </p>
        <p style={{ fontSize: 11, color: C.inkDim, marginTop: 4, margin: 0 }}>avg. campaign ROI</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {["Real-Time Tracking", "Conversion Data", "ROI Reports"].map((t) => <STag key={t} label={t} color={C.indigo} />)}
      </div>
    </BentoCard>
  );
}

function SvcAffiliate({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <IconBox color={C.violet}><Icon name="Collab" size={22} /></IconBox>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>Affiliate Programs</h3>
      <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, margin: 0 }}>
        Long-term affiliate relationships with your best creators. Promo codes, tracked links, and tiered commissions — all on one platform.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {["Promo Codes", "Tiered Payouts", "Long-Term Deals", "Auto-Tracking"].map((t) => <STag key={t} label={t} color={C.violet} />)}
      </div>
    </BentoCard>
  );
}

function SvcHighlight({ style }: { style?: CSSProps }) {
  return (
    <div style={{
      borderRadius: 24, padding: 28,
      background: `linear-gradient(135deg, ${C.violet}12, ${C.pink}08)`,
      border: `1px solid ${C.violet}20`, boxShadow: C.shadowMd,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", textAlign: "center", gap: 16,
      ...style,
    }}>
      <Icon name="spark" size={44} />
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>
          Performance Only
        </p>
        <p style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
          <GradientText>100%</GradientText>
        </p>
        <p style={{ fontSize: 12, color: C.inkDim, marginTop: 7, lineHeight: 1.6, margin: "7px 0 0" }}>
          You pay only when real results are delivered
        </p>
      </div>
      <Btn href="#contact" variant="primary" style={{ padding: "10px 20px", fontSize: 13, width: "100%" }}>
        Get Started
      </Btn>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. HOW IT WORKS
// ─────────────────────────────────────────────
interface Step { num: string; title: string; desc: string; iconName: string; }

const BRAND_STEPS: Step[] = [
  { num: "01", iconName: "target",  title: "Define Your Goals",      desc: "Tell us your product, target audience, and campaign goals. We build the strategy around what success looks like for you." },
  { num: "02", iconName: "search",  title: "We Source Creators",     desc: "Our team hand-picks creators from our verified network that align with your brand values, niche, and audience demographics." },
  { num: "03", iconName: "pen",     title: "Brief & Approve",        desc: "Review creator profiles and content briefs before anything goes live. Full approval control stays with your team." },
  { num: "04", iconName: "growth",  title: "Track & Pay on Results", desc: "Content goes live, conversions are tracked in real-time. You pay only on confirmed sales, sign-ups, or agreed KPIs." },
];
const CREATOR_STEPS: Step[] = [
  { num: "01", iconName: "book",    title: "Apply & Get Verified",     desc: "Submit your profile. We review content quality, engagement authenticity, and audience composition — not just follower count." },
  { num: "02", iconName: "notify",  title: "Get Matched to Campaigns", desc: "Receive campaign invitations that match your niche and audience. You choose what to accept — no pressure, no lock-ins." },
  { num: "03", iconName: "approve", title: "Create Authentic Content", desc: "Work within a creative brief that protects your voice. We give direction without killing your authenticity." },
  { num: "04", iconName: "Send",    title: "Earn on Performance",      desc: "Get paid for actual results — clicks, codes used, or sales driven. The better you perform, the more you earn." },
];

function HowItWorks() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [tab, setTab] = useState<"brands" | "creators">("brands");
  const steps = tab === "brands" ? BRAND_STEPS : CREATOR_STEPS;

  return (
    <section id="how-it-works" style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <PillLabel>How It Works</PillLabel>
        <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink, marginBottom: 28 }}>
          Simple by Design, <GradientText>Powerful by Outcome</GradientText>
        </h2>
        <div style={{
          display: "inline-flex", borderRadius: 12,
          background: C.bgSub, border: C.border, padding: 4,
        }}>
          {(["brands", "creators"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 32px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", transition: "all 0.2s",
              background: tab === t ? C.grad : "transparent",
              color: tab === t ? "#fff" : C.inkDim,
              textTransform: "capitalize",
            }}>For {t === "brands" ? "Brands" : "Creators"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", position: "relative" }}>
        {!isMobile && (
          <div style={{
            position: "absolute", top: 28,
            left: "calc(12.5% + 24px)", right: "calc(12.5% + 24px)",
            height: 1, background: "linear-gradient(90deg, rgba(124,85,255,0.3), rgba(255,51,188,0.3))",
            zIndex: 0,
          }} />
        )}
        {steps.map((step, i) => (
          <div key={step.num} style={{
            position: "relative", zIndex: 1,
            padding: isMobile ? "0 0 28px" : "0 18px",
            display: "flex", flexDirection: isMobile ? "row" : "column",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 14 : 0, textAlign: isMobile ? "left" : "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: C.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 8px 20px rgba(124,85,255,0.22)",
              marginBottom: isMobile ? 0 : 18,
            }}>
              <Icon name={step.iconName} size={22} style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.violet, letterSpacing: "0.12em", marginBottom: 5 }}>STEP {step.num}</p>
              <h3 style={{ fontSize: isMobile ? 15 : 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em", marginBottom: 6, lineHeight: 1.3 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
            {isMobile && i < steps.length - 1 && (
              <div style={{
                position: "absolute", left: 25, top: 56, width: 1,
                height: "calc(100% - 28px)",
                background: "linear-gradient(180deg, rgba(124,85,255,0.28), rgba(255,51,188,0.18))",
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 52, textAlign: "center" }}>
        <Btn href={tab === "brands" ? "#contact" : "#apply"} variant="primary">
          {tab === "brands" ? "Start a Campaign" : "Apply to Join"}
        </Btn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. FEATURED CREATORS
// ─────────────────────────────────────────────
interface CreatorProfile { name: string; handle: string; niche: string; photo: string; followers: string; platforms: string[]; location: string; }

const CREATORS: CreatorProfile[] = [
  { name: "Cindy Bokāne",    handle: "@cindywanderlust", niche: "Travel & Lifestyle",    photo: "/images/Cindy.webp",     followers: "84K", platforms: ["IG","YT"], location: "Riga, LV"    },
  { name: "Armands Simsons", handle: "@armandssimsons", niche: "Business & Startups",   photo: "/images/Armandez.webp",  followers: "61K", platforms: ["IG","LI"], location: "Riga, LV"    },
  { name: "Event Creator",   handle: "@nexcreator",     niche: "Food & Hospitality",    photo: "/images/Seraphena.webp", followers: "32K", platforms: ["IG","TT"], location: "Tallinn, EE" },
  { name: "Space Creator",   handle: "@spacecreator",   niche: "Design & Architecture", photo: "/images/Aleksejs.webp",  followers: "47K", platforms: ["IG"],      location: "Vilnius, LT" },
];

const PCOLS: Record<string, string> = { IG: "#ff33bc", TT: "#7c55ff", YT: "#e03030", LI: "#6a66ff" };

function CreatorCard({ c }: { c: CreatorProfile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: "hidden",
        border: hovered ? C.borderH : C.border,
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? C.shadowLg : C.shadowSm,
        transition: "all 0.2s ease", background: "#fff", cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: 220 }}>
        <Image src={c.photo} alt={c.name} fill style={{ objectFit: "cover", objectPosition: "top" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(10,6,18,0.55) 0%, rgba(10,6,18,0.08) 60%, transparent 80%)"
            : "linear-gradient(to top, rgba(10,6,18,0.38) 0%, transparent 60%)",
          transition: "background 0.2s",
        }} />
        <span style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 10, fontWeight: 600, padding: "4px 10px",
          borderRadius: 6, background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)", color: C.inkDim2,
        }}>{c.location}</span>
      </div>
      <div style={{ padding: "14px 16px 18px", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 3 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em", margin: 0 }}>{c.name}</p>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{c.followers}</span>
        </div>
        <p style={{ fontSize: 12, color: C.pink, marginBottom: 9, marginTop: 2 }}>{c.handle}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.inkDim, background: C.cardBg, padding: "3px 10px", borderRadius: 6 }}>{c.niche}</span>
          <div style={{ display: "flex", gap: 5 }}>
            {c.platforms.map((p) => (
              <span key={p} style={{
                fontSize: 9, fontWeight: 700, padding: "4px 7px", borderRadius: 5,
                background: `${PCOLS[p] ?? C.violet}12`, color: PCOLS[p] ?? C.violet, letterSpacing: "0.04em",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedCreators() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  return (
    <section id="creators" style={siteOuter(w)}>
      <div style={{
        display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
        justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
        gap: 16, marginBottom: 36,
      }}>
        <div>
          <PillLabel>Creator Network</PillLabel>
          <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink }}>
            Meet the Voices That<br /><GradientText>Move the Baltics</GradientText>
          </h2>
        </div>
        <Btn href="#how-it-works" variant="ghost" style={{ flexShrink: 0 }}>Join the Network</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
        {CREATORS.map((c) => <CreatorCard key={c.handle} c={c} />)}
      </div>

      <div style={{
        marginTop: 20, padding: "18px 24px", borderRadius: 14,
        background: C.bgSub, border: C.border,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {["/images/Armandez.webp", "/images/Seraphena.webp", "/images/Cindy.webp"].map((src, i) => (
              <div key={i} style={{
                width: 34, height: 34, borderRadius: "50%", overflow: "hidden",
                border: "2px solid #fff", marginLeft: i === 0 ? 0 : -9, position: "relative",
                boxShadow: "0 2px 6px rgba(124,85,255,0.14)",
              }}>
                <Image src={src} alt="Creator" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: C.inkDim }}>
            <span style={{ color: C.ink, fontWeight: 600 }}>500+ more creators</span> across food, fashion, tech, fitness, and more
          </p>
        </div>
        <Btn href="#contact" variant="primary" style={{ padding: "10px 20px", fontSize: 13 }}>Browse Full Roster</Btn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. PARTNERS MARQUEE — full-bleed, edge-to-edge
// ─────────────────────────────────────────────
const BRANDS = [
  { name: "Artisan Street Bakery", img: "/Artisan Street Bakery.webp" },
  { name: "Molberts",              img: "/Molberts.webp"              },
  { name: "Gardu Muti",            img: "/Gardu Muti.webp"            },
  { name: "Street Pizza",          img: "/Street Pizza.webp"          },
  { name: "Street Burgers",        img: "/Street Burgers.webp"        },
  { name: "Skriveŗu",             img: "/Skriveru.webp"              },
  { name: "Hedonya",               img: "/Hedonya.webp"               },
];

function PartnersMarquee() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  const imgH   = isMobile ? 78  : isTablet ? 108 : 140;
  const radius = isMobile ? 8   : 14;
  const margin = isMobile ? "0 8px" : isTablet ? "0 11px" : "0 15px";
  const trackH = isMobile ? 110 : isTablet ? 140 : 180;

  const items = [...BRANDS, ...BRANDS];

  return (
    <section style={{ marginTop: 96 }}>
      <p style={{
        textAlign: "center", fontSize: 12, fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "rgba(10,6,18,0.28)", marginBottom: 28,
      }}>
        Trusted by Baltic Brands
      </p>

      <div style={{
        position: "relative",
        overflow: "hidden",
        height: trackH,
        borderTop:    "1px solid rgba(124,85,255,0.22)",
        borderBottom: "1px solid rgba(124,85,255,0.22)",
        background:   "rgba(124,85,255,0.03)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(124,85,255,0.18) 0%, rgba(255,51,188,0.10) 35%, transparent 65%)",
          filter: "blur(22px)",
          pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, ${C.bg} 0%, transparent 6%, transparent 94%, ${C.bg} 100%)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        <div className="marquee-track">
          {items.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
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
                src={b.img}
                alt={b.name}
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
// 8. WHY NEXFLUENCE — BENTO GRID
// ─────────────────────────────────────────────
function WhyNexfluence() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  return (
    <section style={siteOuter(w)}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <PillLabel>Why Nexfluence</PillLabel>
        <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink, marginBottom: 14 }}>
          Influencer Marketing That Actually <GradientText>Converts</GradientText>
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 16, color: C.inkDim, maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
          The industry is broken — brands overpay for reach, creators undercut their value, nobody tracks real ROI. We built Nexfluence to fix that.
        </p>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WhyPerformance /><WhyBaltic /><WhyQuality /><WhyTransparency /><WhyLongTerm /><WhyDataDriven /><WhyTestimonial />
        </div>
      ) : isTablet ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <WhyPerformance style={{ gridColumn: "1 / -1" }} />
          <WhyBaltic /><WhyQuality />
          <WhyTransparency /><WhyLongTerm />
          <WhyDataDriven style={{ gridColumn: "1 / -1" }} />
          <WhyTestimonial style={{ gridColumn: "1 / -1" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "auto", gap: 14 }}>
          <WhyPerformance   style={{ gridColumn: "1 / 5", gridRow: "1 / 3" }} />
          <WhyBaltic        style={{ gridColumn: "5 / 9" }} />
          <WhyQuality       style={{ gridColumn: "9 / 13" }} />
          <WhyTransparency  style={{ gridColumn: "5 / 9" }} />
          <WhyLongTerm      style={{ gridColumn: "9 / 13" }} />
          <WhyDataDriven    style={{ gridColumn: "1 / 7" }} />
          <WhyTestimonial   style={{ gridColumn: "7 / 13" }} />
        </div>
      )}
    </section>
  );
}

function WhyPerformance({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <IconBox color={C.violet}><Icon name="spark" size={22} /></IconBox>
      <h3 style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>Pay Only for Results</h3>
      <p style={{ fontSize: 14, color: C.inkDim, lineHeight: 1.75, margin: 0 }}>
        Our performance-based pricing model means you're never paying for vanity metrics. Every spend is tied to a real business outcome — sales, sign-ups, or agreed KPIs.
      </p>
      <div style={{ padding: 18, borderRadius: 14, background: `${C.violet}07`, border: `1px solid ${C.violet}16`, textAlign: "center", marginTop: "auto" }}>
        <p style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, margin: 0 }}>
          <GradientText>0%</GradientText>
        </p>
        <p style={{ fontSize: 12, color: C.inkDim, marginTop: 5, margin: "5px 0 0" }}>wasted budget on vanity reach</p>
      </div>
    </BentoCard>
  );
}

function WhyBaltic({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.pink} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
        <IconBox color={C.pink}><Icon name="globe" size={22} /></IconBox>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Baltic-Native Expertise</h3>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.7, margin: 0 }}>
            We live here. We know the creators, culture, and consumer behaviour of Latvia, Lithuania, and Estonia intimately.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {["Latvia", "Lithuania", "Estonia"].map((c) => (
          <span key={c} style={{ fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 8, background: `${C.pink}0e`, color: C.ink, border: `1px solid ${C.pink}1c` }}>{c}</span>
        ))}
      </div>
    </BentoCard>
  );
}

function WhyQuality({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.indigo} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
        <IconBox color={C.indigo}><Icon name="quality" size={22} /></IconBox>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Audience Quality Over Quantity</h3>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.7, margin: 0 }}>
            Every creator is verified for genuine engagement. We reject 70% of applicants to protect brand safety.
          </p>
        </div>
      </div>
      <div style={{ padding: "10px 14px", borderRadius: 10, background: `${C.indigo}08`, border: `1px solid ${C.indigo}12` }}>
        <p style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.04em", margin: 0 }}>
          <GradientText>70%</GradientText>
        </p>
        <p style={{ fontSize: 11, color: C.inkDim, margin: 0, marginTop: 2 }}>applicants rejected to protect quality</p>
      </div>
    </BentoCard>
  );
}

function WhyTransparency({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
        <IconBox color={C.violet}><Icon name="link" size={22} /></IconBox>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 8px" }}>One Platform, Full Transparency</h3>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.7, margin: 0 }}>
            Briefs, approvals, content, tracking links, and payouts all in one dashboard. No spreadsheets, no email chains.
          </p>
        </div>
      </div>
    </BentoCard>
  );
}

function WhyLongTerm({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.pink} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
        <IconBox color={C.pink}><Icon name="cycle" size={22} /></IconBox>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Built for Long-Term Value</h3>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.7, margin: 0 }}>
            Ongoing affiliate relationships with your best creators. Recurring partnerships drive compounding returns.
          </p>
        </div>
      </div>
    </BentoCard>
  );
}

function WhyDataDriven({ style }: { style?: CSSProps }) {
  return (
    <BentoCard accent={C.violet} style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
        <IconBox color={C.violet}><Icon name="targeted" size={22} /></IconBox>
        <div style={{ flex: 1, minWidth: 180 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 9px" }}>Data-Driven Matching</h3>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, margin: 0, maxWidth: 380 }}>
            We go beyond follower count — considering engagement rate, audience demographics, past campaign performance, and brand alignment score.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 150 }}>
          {["Engagement Rate", "Audience Demo", "Past Performance", "Brand Alignment"].map((sig) => (
            <div key={sig} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "7px 11px", borderRadius: 9,
              background: `${C.violet}07`, border: `1px solid ${C.violet}14`,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.grad, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.inkDim2, fontWeight: 500 }}>{sig}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

function WhyTestimonial({ style }: { style?: CSSProps }) {
  return (
    <div style={{
      borderRadius: 24, padding: 32,
      background: `linear-gradient(135deg, ${C.violet}0e, ${C.pink}08)`,
      border: `1px solid ${C.violet}1e`, boxShadow: C.shadowMd,
      display: "flex", flexDirection: "column", gap: 18, justifyContent: "center",
      ...style,
    }}>
      <p style={{ fontSize: 56, lineHeight: 0.8, fontWeight: 900, background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0 }}>"</p>
      <p style={{ fontSize: 16, color: C.inkDim2, lineHeight: 1.8, margin: 0 }}>
        Working with Nexfluence was the first time we actually knew where every euro of our influencer budget went — and it came back 3× over.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
  style={{
    width: 38,
    height: 38,
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
  }}
>
  <Image
    src="/images/Kinetics-leader.webp"
    alt="Profile"
    fill
    style={{
      objectFit: "cover",
    }}
  />
</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Brand Partner</p>
          <p style={{ fontSize: 12, color: C.inkDim, margin: 0 }}>Latvia, Beauty & Care</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ fontSize: 13, color: "#f5a623" }}>★</span>)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <section style={{ ...siteOuter(w, 96), marginBottom: 0 }}>
      <div id="contact" style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        padding: isMobile ? "48px 28px" : "68px 72px",
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
          <PillLabel>Get Started</PillLabel>
          <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, color: C.ink, marginBottom: 14 }}>
            Ready to Grow<br /><GradientText>Through Authentic Influence?</GradientText>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: C.inkDim, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Whether you're a brand looking to scale or a creator ready to monetize — there's a place for you in the Nexfluence network.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn href="mailto:brands@nexfluence.eu" variant="primary">I'm a Brand</Btn>
            <Btn href="mailto:creators@nexfluence.eu" variant="ghost">I'm a Creator</Btn>
          </div>
          <p style={{ fontSize: 12, color: "rgba(10,6,18,0.3)", marginTop: 18 }}>
            No commitment required · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 10. FOOTER
// ─────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: ["Creator Discovery", "Campaign Management", "Analytics", "Affiliate Programs"],
  Company:  ["About Us", "Growth", "Careers", "Press"],
  Contact:  ["brands@nexfluence.eu", "creators@nexfluence.eu", "Instagram", "LinkedIn"],
};

function Footer() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <footer style={{
      marginTop: 96, borderTop: "1px solid rgba(124,85,255,0.12)",
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
              <p style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>Nexfluence</p>
              <p style={{ fontSize: 10, color: C.pink, letterSpacing: "0.08em", margin: 0 }}>CREATOR NEXUS</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.75, maxWidth: 230 }}>
            The influencer marketing marketplace for the Baltics, connecting businesses, creators and agencies across Latvia, Lithuania and Estonia, with contracts and payments handled safely in one place.
          </p>
          <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
            {["IG", "LI", "TT"].map((s) => (
              <a key={s} href="#" style={{
                width: 32, height: 32, borderRadius: 7,
                background: C.bgSub, border: C.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: C.inkDim,
                textDecoration: "none", transition: "color 0.18s, border-color 0.18s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.ink; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,51,188,0.38)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.inkDim; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(124,85,255,0.18)"; }}
              >{s}</a>
            ))}
          </div>
        </div>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(10,6,18,0.35)", marginBottom: 14 }}>{col}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {links.map((link) => (
                <a key={link} href="#" style={{ fontSize: 13, color: C.inkDim, textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.inkDim)}
                >{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(124,85,255,0.08)", paddingTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <p style={{ fontSize: 12, color: "rgba(10,6,18,0.28)", margin: 0 }}>
          © {new Date().getFullYear()} Nexfluence. Registered in Europe. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 12, color: "rgba(10,6,18,0.30)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function ZonePage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <Header />
      <Hero />
      <StatsBar />
      <Services />
      <HowItWorks />
      <FeaturedCreators />
      <PartnersMarquee />
      <WhyNexfluence />
      <FinalCTA />
      <Footer />
    </div>
  );
}