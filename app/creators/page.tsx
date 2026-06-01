"use client";

/**
 * app/creators/page.tsx
 * Nexfluence — Creator Dashboard
 *
 * Displays top 10 influencers across multiple categories.
 * The first influencer in each category is shown as a featured card,
 * the remaining 9 are listed in a scrollable grid.
 *
 * Clicking any creator navigates to their individual profile page
 * (link placeholder, to be wired later).
 *
 * Design language, colours and responsive behaviour match
 * the existing Nexfluence homepage exactly.
 */

import Image from "next/image";
import { useState, useEffect } from "react";

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
// 1. HEADER (exactly from homepage)
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
            <>
              {/* For a dashboard, we can keep the Contact button */}
              <Btn
                href="/contact"
                variant="primary"
                style={{ padding: "10px 20px", fontSize: 13 }}
              >
                Contact Us
              </Btn>
            </>
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

// ─────────────────────────────────────────────
// CREATOR DATA (replace with actual profiles)
// ─────────────────────────────────────────────

interface Creator {
  name: string;
  handle: string;
  followers: string;
  photo: string;
  platforms: string[];
  niche: string;
  location?: string;
  profileUrl?: string; // to be filled later
}

const PLATFORM_COLORS: Record<string, string> = {
  IG: "#ff33bc",
  TT: "#7c55ff",
  YT: "#e03030",
  LI: "#6a66ff",
};

// Dummy data for multiple categories
const BEAUTY_CREATORS: Creator[] = [
  {
    name: "Ieva Zelča",
    handle: "@ievazelca",
    followers: "112K",
    photo: "/Speaker 1.webp",
    platforms: ["IG", "TT"],
    niche: "Beauty & Skincare",
    location: "Riga, LV",
  },
  // ... add 9 more beauty creators (recycling photos)
  {
    name: "Anna Belle",
    handle: "@annabelle_lv",
    followers: "94K",
    photo: "/Speaker 2.webp",
    platforms: ["IG", "YT"],
    niche: "Beauty & Makeup",
    location: "Riga, LV",
  },
  {
    name: "Laura Beauty",
    handle: "@laurabeauty",
    followers: "78K",
    photo: "/Food.webp", // placeholder
    platforms: ["IG"],
    niche: "Beauty & Cosmetics",
    location: "Vilnius, LT",
  },
  {
    name: "Marta Tīna",
    handle: "@martatina",
    followers: "65K",
    photo: "/Space.webp",
    platforms: ["TT"],
    niche: "Beauty Tutorials",
    location: "Tallinn, EE",
  },
  // ... more if needed; we'll use 10 items for the list,
  // but here only 4 for brevity – the code will handle any length.
  // For real use, expand to 10.
];

const FITNESS_CREATORS: Creator[] = [
  {
    name: "Armands Simsons",
    handle: "@armandssimsons",
    followers: "61K",
    photo: "/Speaker 2.webp",
    platforms: ["IG", "LI"],
    niche: "Fitness & Lifestyle",
    location: "Riga, LV",
  },
  {
    name: "Kate Fit",
    handle: "@kate_fit",
    followers: "88K",
    photo: "/Speaker 1.webp",
    platforms: ["IG", "TT"],
    niche: "Fitness & Nutrition",
    location: "Riga, LV",
  },
  // ... etc.
];

const FOOD_CREATORS: Creator[] = [
  {
    name: "Cindy Bokāne",
    handle: "@cindywanderlust",
    followers: "84K",
    photo: "/Speaker 1.webp",
    platforms: ["IG", "YT"],
    niche: "Travel & Food",
    location: "Riga, LV",
  },
  {
    name: "Gardu Muti Chef",
    handle: "@gardumuti",
    followers: "56K",
    photo: "/Gardu Muti.webp",
    platforms: ["IG", "TT"],
    niche: "Food & Hospitality",
  },
  // ...
];

const TRAVEL_CREATORS: Creator[] = [
  {
    name: "Space Creator",
    handle: "@spacecreator",
    followers: "47K",
    photo: "/Space.webp",
    platforms: ["IG"],
    niche: "Travel & Architecture",
    location: "Vilnius, LT",
  },
  {
    name: "Baltics Unveiled",
    handle: "@balticsunveiled",
    followers: "73K",
    photo: "/Skyline.webp",
    platforms: ["IG", "TT"],
    niche: "Travel & Culture",
    location: "Tallinn, EE",
  },
  // ...
];

const CATEGORIES = [
  { title: "Beauty", creators: BEAUTY_CREATORS, accent: C.pink },
  { title: "Fitness", creators: FITNESS_CREATORS, accent: C.violet },
  { title: "Food", creators: FOOD_CREATORS, accent: C.indigo },
  { title: "Travel", creators: TRAVEL_CREATORS, accent: C.pink },
];

// ─────────────────────────────────────────────
// FEATURED CREATOR CARD (#1)
// ─────────────────────────────────────────────
function FeaturedCreatorCard({ creator }: { creator: Creator }) {
  const [hovered, setHovered] = useState(false);
  const profileLink = creator.profileUrl || "#";

  return (
    <a
      href={profileLink}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 20,
        overflow: "hidden",
        border: hovered ? C.borderH : C.border,
        boxShadow: hovered ? C.shadowLg : C.shadowSm,
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.22s ease",
        background: "#fff",
        width: "100%",
        maxWidth: 360,
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: 260 }}>
        <Image
          src={creator.photo}
          alt={creator.name}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "linear-gradient(to top, rgba(10,6,18,0.55) 0%, rgba(10,6,18,0.08) 60%, transparent 80%)"
              : "linear-gradient(to top, rgba(10,6,18,0.38) 0%, transparent 60%)",
            transition: "background 0.2s",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 10,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(6px)",
            color: C.inkDim2,
          }}
        >
          {creator.location ?? creator.niche}
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 18px",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            {creator.name}
          </p>
          <p style={{ fontSize: 13, opacity: 0.9, margin: "4px 0 6px" }}>
            {creator.handle}
          </p>
          <div
            style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
          >
            {creator.platforms.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 5,
                  background: `${PLATFORM_COLORS[p] ?? C.violet}22`,
                  color: PLATFORM_COLORS[p] ?? C.violet,
                  letterSpacing: "0.04em",
                }}
              >
                {p}
              </span>
            ))}
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {creator.followers}
          </p>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────
// LIST CREATOR ITEM (for #2–10)
// ─────────────────────────────────────────────
function CreatorListItem({ creator }: { creator: Creator }) {
  const [hovered, setHovered] = useState(false);
  const profileLink = creator.profileUrl || "#";

  return (
    <a
      href={profileLink}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 14,
        textDecoration: "none",
        background: hovered ? C.cardBgM : C.cardBg,
        border: hovered ? `1px solid ${C.violet}44` : C.border,
        boxShadow: hovered ? C.shadowMd : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid rgba(124,85,255,0.2)",
        }}
      >
        <Image
          src={creator.photo}
          alt={creator.name}
          width={48}
          height={48}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.ink,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {creator.name}
        </p>
        <p
          style={{
            fontSize: 12,
            color: C.inkDim,
            margin: "2px 0 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {creator.handle}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: 3,
          flexShrink: 0,
        }}
      >
        {creator.platforms.map((p) => (
          <span
            key={p}
            style={{
              fontSize: 8,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 4,
              background: `${PLATFORM_COLORS[p] ?? C.violet}18`,
              color: PLATFORM_COLORS[p] ?? C.violet,
              letterSpacing: "0.04em",
            }}
          >
            {p}
          </span>
        ))}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.ink,
          minWidth: 50,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {creator.followers}
      </span>
    </a>
  );
}

// ─────────────────────────────────────────────
// CATEGORY SECTION
// ─────────────────────────────────────────────
function CategorySection({
  title,
  creators,
  accent,
}: {
  title: string;
  creators: Creator[];
  accent: string;
}) {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  if (!creators.length) return null;

  // First creator is the featured one, rest go to the list
  const [featured, ...rest] = creators;

  return (
    <section style={{ marginBottom: 56 }}>
      <h2
        style={{
          fontSize: isMobile ? 24 : 30,
          fontWeight: 900,
          letterSpacing: "-0.035em",
          lineHeight: 1.1,
          color: C.ink,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        Top 10{" "}
        <span
          style={{
            background: accent,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </span>{" "}
        Creators
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "1fr 1fr"
            : "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Featured card */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FeaturedCreatorCard creator={featured} />
        </div>

        {/* List of remaining creators */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxHeight: isTablet ? "none" : "none",
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          {rest.map((creator, idx) => (
            <CreatorListItem key={idx} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION FOR DASHBOARD
// ─────────────────────────────────────────────
function DashboardHero() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  return (
    <section
      style={{
        marginTop: isMobile ? 110 : 130,
        marginBottom: 64,
        textAlign: "center",
        maxWidth: SITE_MAX_W,
        margin: "0 auto",
        padding: sitePad(w),
      }}
    >
      <PillLabel>Creator Network</PillLabel>
      <h1
        style={{
          fontSize: isMobile ? 32 : 48,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          color: C.ink,
          marginBottom: 16,
        }}
      >
        Discover the{" "}
        <GradientText>Baltic Top 10</GradientText> by Niche
      </h1>
      <p
        style={{
          fontSize: isMobile ? 15 : 17,
          color: C.inkDim2,
          maxWidth: 560,
          margin: "0 auto",
          lineHeight: 1.75,
        }}
      >
        Explore our hand‑picked top‑performing creators across beauty,
        fitness, food, travel and more. Every profile is verified for
        genuine engagement.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function CreatorsDashboardPage() {
  return (
    <div style={{ background: C.bg, overflowX: "hidden" }}>
      <Header />
      <DashboardHero />
      <main style={siteOuter(useWindowWidth(), 0)}>
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.title}
            title={cat.title}
            creators={cat.creators}
            accent={cat.accent}
          />
        ))}
      </main>
      {/* Minimal footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "40px 0",
          fontSize: 13,
          color: C.inkDim,
          borderTop: C.border,
          marginTop: 40,
        }}
      >
        © {new Date().getFullYear()} Nexfluence SIA
      </footer>
    </div>
  );
}