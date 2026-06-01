"use client";

/**
 * app/progress/page.tsx
 * Nexfluence — Progress Timeline Page
 *
 * Shows month-by-month milestones from incorporation (Dec 2025)
 * through today (“This Month”). Each entry contains a highlighted
 * sub‑heading, a bento‑grid of 1–3 images with captions, and a
 * short description paragraph beneath the grid.
 *
 * Design language matches the Nexfluence homepage,
 * on a **light background**, with the standard site header.
 *
 * Replace image paths inside /public/progress/ with your own.
 */

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

/* ── Responsive hook ────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const cb = () => setW(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return w;
}

/* ── Design tokens (same as homepage) ────────────────── */
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

/* ── Layout constants (same as homepage) ─────────────── */
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

/* ── Atomic components (from homepage) ───────────────── */
function Btn({
  href,
  onClick,
  variant,
  children,
  style,
  type,
}: {
  href?: string;
  onClick?: () => void;
  variant: "primary" | "ghost";
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit";
}) {
  const base: React.CSSProperties = {
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
  const vars: Record<string, React.CSSProperties> = {
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

/* ── Header (exact copy from homepage) ────────────────── */
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
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.pink,
              textDecoration: "none",
            }}
          >
            Contact Us →
          </a>
        </div>
      )}
    </header>
  );
}

/* ── Photo caption overlay ─────────────────────────────── */
function PhotoCaption({ text }: { text: string }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: "120%",
          height: 120,
          background:
            "radial-gradient(ellipse at 25% 80%, rgba(20,10,40,0.55) 0%, rgba(20,10,40,0.25) 42%, transparent 72%)",
          filter: "blur(14px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          fontFamily: "'Rubik', var(--font-rubik), sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "0.05em",
          textShadow:
            "0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)",
        }}
      >
        {text}
      </div>
    </>
  );
}

/* ── Single image cell ────────────────────────────────── */
const photoCell: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  background: "rgba(128,97,255,0.07)",
  border: "1px solid rgba(128,97,255,0.25)",
};

/* ── Bento grid for 1–3 images ────────────────────────── */
function ImageGrid({
  images,
}: {
  images: { src: string; caption: string }[];
}) {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const count = images.length;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div style={{ ...photoCell, width: "100%", height: isMobile ? 180 : 260 }}>
        <img
          src={images[0].src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <PhotoCaption text={images[0].caption} />
      </div>
    );
  }

  const gridCols = count === 2 ? "1fr 1fr" : "1fr 1fr 1fr";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : gridCols,
        gap: isMobile ? 7 : 10,
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            ...photoCell,
            height: isMobile ? 138 : 180,
          }}
        >
          <img
            src={img.src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <PhotoCaption text={img.caption} />
        </div>
      ))}
    </div>
  );
}

/* ── Description paragraph ─────────────────────────────── */
function Description({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "'Rubik', var(--font-rubik), sans-serif",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.75,
        color: C.inkDim,
        marginTop: 12,
        marginBottom: 0,
      }}
    >
      {text}
    </p>
  );
}

/* ── Sub‑heading card (with description) ──────────────── */
function TimelineEntry({
  title,
  images,
  description,
}: {
  title: React.ReactNode;
  images: { src: string; caption: string }[];
  description: string;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* sub‑heading */}
      <div
        style={{
          fontFamily: "'Rubik', var(--font-rubik), sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          paddingLeft: 14,
          borderLeft: `3px solid ${C.pink}`,
        }}
      >
        {title}
      </div>
      {/* image grid */}
      <ImageGrid images={images} />
      {/* description paragraph */}
      <Description text={description} />
    </div>
  );
}

/* ── Month section ─────────────────────────────────────── */
function MonthBlock({
  month,
  entries,
}: {
  month: string;
  entries: {
    title: React.ReactNode;
    images: { src: string; caption: string }[];
    description: string;
  }[];
}) {
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ marginBottom: 64 }}>
      <h2
        style={{
          fontFamily: "'Rubik', var(--font-rubik), sans-serif",
          fontSize: isMobile ? 28 : 40,
          fontWeight: 900,
          letterSpacing: "-0.035em",
          lineHeight: 1.1,
          color: C.ink,
          marginBottom: 24,
          background: `linear-gradient(135deg, ${C.pink}, ${C.violet})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {month}
      </h2>
      {entries.map((entry, i) => (
        <TimelineEntry
          key={i}
          title={entry.title}
          images={entry.images}
          description={entry.description}
        />
      ))}
    </section>
  );
}

/* ── Timeline data ──────────────────────────────────────── */
const TIMELINE = [
  {
    month: "December 2025",
    entries: [
      {
        title: "Company Incorporated",
        images: [
          {
            src: "/progress/dec-incorporation.webp",
            caption: "Official registration documents",
          },
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
          {
            src: "/progress/jan-event1.webp",
            caption: "Packed venue on opening night",
          },
          {
            src: "/progress/jan-event2.webp",
            caption: "Creators & brands networking",
          },
          {
            src: "/progress/jan-event3.webp",
            caption: "Keynote session",
          },
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
          {
            src: "/progress/jan-redbull.webp",
            caption: "Red Bull activation at the event",
          },
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
          {
            src: "/progress/feb-creators.webp",
            caption: "New creator headshots",
          },
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
          {
            src: "/progress/mar-affiliate.webp",
            caption: "Dashboard screenshot",
          },
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
          {
            src: "/progress/apr-lima.webp",
            caption: "Signed MOU with LIMA",
          },
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
            <span style={{ color: C.pink }}>Creator Nexus 2.0</span>{" "}
            Preparation
          </>
        ),
        images: [
          {
            src: "/progress/may-prep1.webp",
            caption: "Venue walk‑through",
          },
          {
            src: "/progress/may-prep2.webp",
            caption: "Speaker lineup planning",
          },
        ],
        description:
          "We’re gearing up for our biggest event yet — a full‑day summit with international speakers, brand matchmaking sessions, and live content creation.",
      },
    ],
  },
];

export default function ProgressPage() {
  const w = useWindowWidth();

  return (
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <Header />

      {/* Main content with padding to clear the fixed header */}
      <div style={siteOuter(w, 140)}>
        <h1
          style={{
            fontFamily: "'Rubik', var(--font-rubik), sans-serif",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: C.ink,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          The Nexfluence Journey
        </h1>
        <p
          style={{
            fontFamily: "'Rubik', var(--font-rubik), sans-serif",
            fontSize: 16,
            fontWeight: 400,
            color: C.inkDim,
            textAlign: "center",
            marginBottom: 48,
            lineHeight: 1.6,
          }}
        >
          From incorporation to building the Baltic’s most trusted creator
          network — here’s how far we’ve come.
        </p>

        {TIMELINE.map((section) => (
          <MonthBlock
            key={section.month}
            month={section.month}
            entries={section.entries}
          />
        ))}
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "32px 0",
          fontFamily: "'Rubik', var(--font-rubik), sans-serif",
          fontSize: 13,
          color: C.inkDim,
          borderTop: C.border,
          marginTop: 80,
        }}
      >
        © {new Date().getFullYear()} Nexfluence. All rights reserved.
      </footer>
    </div>
  );
}