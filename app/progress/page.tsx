"use client";

/**
 * app/progress/page.tsx
 * Nexfluence — Growth Timeline Page
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header (shared)
 *  2. Page Hero
 *  3. Timeline (month blocks with image bento + descriptions)
 *  4. Footer (shared, full)
 */

import Image from "next/image";
import { useEffect, useState } from "react";

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

function Btn({
  href, onClick, variant, children, style,
}: {
  href?: string; onClick?: () => void;
  variant: "primary" | "ghost";
  children: React.ReactNode; style?: CSSProps;
}) {
  const base: CSSProps = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "13px 28px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
    textDecoration: "none", cursor: "pointer", border: "none",
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
// 2. PAGE HERO
// ─────────────────────────────────────────────
function ProgressHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "auto" : "52vh",
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
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <PillLabel>Our Journey</PillLabel>
        <h1 style={{
          fontSize: isMobile ? 32 : isTablet ? 46 : 56,
          fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1.05, color: C.ink,
          margin: 0, marginBottom: 20, fontFamily: FONT,
        }}>
          The Nexfluence <GradientText>Journey</GradientText>
        </h1>
        <p style={{
          fontSize: isMobile ? 15 : 17, color: C.inkDim2,
          lineHeight: 1.75, maxWidth: 560, margin: "0 auto",
          fontFamily: FONT,
        }}>
          From incorporation to building the Baltics' most trusted creator
          network — here's how far we've come.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. TIMELINE COMPONENTS
// ─────────────────────────────────────────────

/* Photo caption overlay — kept from original, font unified */
function PhotoCaption({ text, small }: { text: string; small?: boolean }) {
  return (
    <>
      <div style={{
        position: "absolute", bottom: -20, left: -20,
        width: "120%", height: 120,
        background: "radial-gradient(ellipse at 25% 80%, rgba(20,10,40,0.55) 0%, rgba(20,10,40,0.25) 42%, transparent 72%)",
        filter: "blur(14px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: small ? 8 : 12, left: small ? 8 : 12,
        fontFamily: FONT, fontSize: small ? 10 : 11,
        fontWeight: 500, color: "rgba(255,255,255,0.9)",
        letterSpacing: "0.05em",
        textShadow: "0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)",
        zIndex: 2,
      }}>{text}</div>
    </>
  );
}

const photoCell: CSSProps = {
  position: "relative", overflow: "hidden",
  borderRadius: 14, background: C.bgSub,
  border: "1px solid rgba(124,85,255,0.18)",
  transition: "transform 0.2s",
};

/* Image grid — 1, 2, or 3 images */
function ImageGrid({ images }: { images: { src: string; caption: string }[] }) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const count    = images.length;

  if (count === 0) return null;

  const imgStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    width: "100%", height: "100%",
    objectFit: "cover", display: "block",
  };

  if (count === 1) {
    return (
      <div style={{ ...photoCell, width: "100%", height: isMobile ? 200 : 280 }}>
        <img src={images[0].src} alt="" style={imgStyle} />
        <PhotoCaption text={images[0].caption} />
      </div>
    );
  }

  // 2 or 3 images: on mobile always 2-col, on larger screens match count
  const cols = isMobile
    ? "1fr 1fr"
    : count === 2
    ? "1fr 1fr"
    : "1fr 1fr 1fr";

  const cellH = isMobile ? 130 : 190;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols,
      gap: isMobile ? 8 : 10,
    }}>
      {images.map((img, i) => (
        <div
          key={i}
          style={{ ...photoCell, height: cellH }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img src={img.src} alt="" style={imgStyle} />
          <PhotoCaption text={img.caption} small={isMobile} />
        </div>
      ))}
    </div>
  );
}

/* Entry sub-heading + images + description */
function TimelineEntry({
  title, images, description,
}: {
  title: React.ReactNode;
  images: { src: string; caption: string }[];
  description: string;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: FONT, fontSize: 17, fontWeight: 700,
        color: C.ink, letterSpacing: "-0.02em",
        marginBottom: 14, paddingLeft: 14,
        borderLeft: `3px solid ${C.pink}`,
        lineHeight: 1.3,
      }}>
        {title}
      </div>
      <ImageGrid images={images} />
      <p style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 400,
        lineHeight: 1.8, color: C.inkDim,
        marginTop: 14, marginBottom: 0,
      }}>{description}</p>
    </div>
  );
}

/* Month block — month heading + connector line + entries */
function MonthBlock({
  month, entries, isLast,
}: {
  month: string;
  entries: {
    title: React.ReactNode;
    images: { src: string; caption: string }[];
    description: string;
  }[];
  isLast?: boolean;
}) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  // On desktop/tablet: left-rail timeline layout
  // On mobile: flat stacked layout (no rail)
  if (isMobile) {
    return (
      <div style={{ marginBottom: 52 }}>
        {/* Month badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          marginBottom: 20,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: C.grad, flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(124,85,255,0.15)",
          }} />
          <h2 style={{
            fontFamily: FONT, fontSize: 22, fontWeight: 900,
            letterSpacing: "-0.03em", lineHeight: 1,
            margin: 0, background: C.grad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{month}</h2>
        </div>
        {entries.map((entry, i) => (
          <TimelineEntry key={i} {...entry} />
        ))}
      </div>
    );
  }

  // Tablet / Desktop: two-column layout with vertical rail
  const railWidth = 2;
  const dotSize   = 14;
  const leftCol   = isTablet ? 140 : 180; // width of the month label column

  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 56, position: "relative" }}>
      {/* Left — month label */}
      <div style={{ width: leftCol, flexShrink: 0, paddingTop: 4, paddingRight: 24 }}>
        <h2 style={{
          fontFamily: FONT,
          fontSize: isTablet ? 15 : 17,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          margin: 0,
          background: C.grad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "right",
        }}>{month}</h2>
      </div>

      {/* Centre rail */}
      <div style={{ width: railWidth + dotSize + 24, flexShrink: 0, position: "relative" }}>
        {/* Dot */}
        <div style={{
          position: "absolute", top: 6,
          left: (dotSize / 2) + 11,
          transform: "translateX(-50%)",
          width: dotSize, height: dotSize, borderRadius: "50%",
          background: C.grad,
          boxShadow: "0 0 0 4px rgba(124,85,255,0.14)",
          zIndex: 2,
        }} />
        {/* Vertical line */}
        {!isLast && (
          <div style={{
            position: "absolute",
            top: dotSize + 8,
            left: (dotSize / 2) + 11,
            transform: "translateX(-50%)",
            width: railWidth,
            bottom: -56,
            background: "linear-gradient(to bottom, rgba(124,85,255,0.35), rgba(255,51,188,0.15))",
          }} />
        )}
      </div>

      {/* Right — entries */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {entries.map((entry, i) => (
          <TimelineEntry key={i} {...entry} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TIMELINE DATA
// ─────────────────────────────────────────────
const TIMELINE = [
  {
    month: "December 2025",
    entries: [
      {
        title: "Company Incorporated",
        images: [
          { src: "/progress/dec-incorporation.webp", caption: "Official registration documents" },
        ],
        description:
          "Nexfluence was officially registered in Riga, Latvia, marking the beginning of our journey to reshape the Baltic creator economy.",
      },
    ],
  },
  {
    month: "January 2026",
    entries: [
      {
        title: (
          <>
            <span style={{ color: C.pink }}>Riga Creator Nexus</span> Event
          </>
        ),
        images: [
          { src: "/progress/jan-event1.webp",  caption: "Packed venue on opening night"   },
          { src: "/progress/jan-event2.webp",  caption: "Creators & brands networking"    },
          { src: "/progress/jan-event3.webp",  caption: "Keynote session"                 },
        ],
        description:
          "Our first large‑scale event brought together over 150 creators and 20 brands, sparking dozens of new collaborations right on the spot.",
      },
      {
        title: (
          <>
            Campaign with{" "}
            <span style={{ color: C.violet }}>Red Bull</span>
          </>
        ),
        images: [
          { src: "/progress/jan-redbull.webp", caption: "Red Bull activation at the event" },
        ],
        description:
          "Red Bull partnered with us for an exclusive product launch, leveraging our network of trusted Baltic creators for authentic promotion.",
      },
    ],
  },
  {
    month: "February 2026",
    entries: [
      {
        title: "Onboarded 50+ New Creators",
        images: [
          { src: "/progress/feb-creators.webp", caption: "New creator headshots" },
        ],
        description:
          "Our verification team carefully selected top talent, expanding the Nexfluence network to over 150 vetted influencers across the Baltics.",
      },
    ],
  },
  {
    month: "March 2026",
    entries: [
      {
        title: (
          <>
            Launched <span style={{ color: C.pink }}>Affiliate Engine</span>
          </>
        ),
        images: [
          { src: "/progress/mar-affiliate.webp", caption: "Dashboard screenshot" },
        ],
        description:
          "We released the first version of our performance tracking tool, allowing brands to see exactly how each creator impacts their bottom line.",
      },
    ],
  },
  {
    month: "April 2026",
    entries: [
      {
        title: (
          <>
            <span style={{ color: C.violet }}>Partnership</span> with LIMA
          </>
        ),
        images: [
          { src: "/progress/apr-lima.webp", caption: "Signed MOU with LIMA" },
        ],
        description:
          "Nexfluence became the official influencer marketing partner for the Latvian Interactive Marketing Association, a major industry milestone.",
      },
    ],
  },
  {
    month: "This Month",
    entries: [
      {
        title: (
          <>
            <span style={{ color: C.pink }}>Creator Nexus 2.0</span> Preparation
          </>
        ),
        images: [
          { src: "/progress/may-prep1.webp", caption: "Venue walk‑through"       },
          { src: "/progress/may-prep2.webp", caption: "Speaker lineup planning"  },
        ],
        description:
          "We're gearing up for our biggest event yet — a full‑day summit with international speakers, brand matchmaking sessions, and live content creation.",
      },
    ],
  },
];

// ─────────────────────────────────────────────
// 4. FULL FOOTER (shared)
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
        {/* Brand */}
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
export default function ProgressPage() {
  const w = useWindowWidth();

  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      <Header />
      <ProgressHero />

      {/* Timeline content */}
      <div style={siteOuter(w, 0)}>
        <div style={{ paddingTop: 16, paddingBottom: 16 }}>
          {TIMELINE.map((section, i) => (
            <MonthBlock
              key={section.month}
              month={section.month}
              entries={section.entries}
              isLast={i === TIMELINE.length - 1}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}