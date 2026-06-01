"use client";

/**
 * app/creators/page.tsx
 * Nexfluence — Creator Dashboard
 *
 * Design system:
 *  - Font: Rubik throughout
 *  - Theme: Light / white
 *  - Breakpoints: <640 mobile · 640–900 tablet · >900 desktop
 *  - Layout: maxWidth 1200px · pad 20/32/48px
 *
 * Sections:
 *  1. Header (shared)
 *  2. Dashboard Hero
 *  3. Category filter tabs
 *  4. Featured card + creator list grid (per category)
 *  5. Footer (shared, full)
 *
 * NOTE: Data is static for now. The listing will be made dynamic
 * (weekly rotation, verified engagement scoring) in a later sprint.
 */

import Image from "next/image";
import { useState, useEffect } from "react";

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

function Btn({ href, onClick, variant, children, style }: {
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
// CREATOR DATA TYPES
// ─────────────────────────────────────────────
interface Creator {
  name: string;
  handle: string;
  followers: string;
  photo: string;
  platforms: string[];
  niche: string;
  location?: string;
  profileUrl?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  IG: "#ff33bc",
  TT: "#7c55ff",
  YT: "#e03030",
  LI: "#6a66ff",
};

// ─────────────────────────────────────────────
// CREATOR DATA (static — to be made dynamic)
// ─────────────────────────────────────────────
const BEAUTY_CREATORS: Creator[] = [
  { name: "Ieva Zelča",    handle: "@ievazelca",      followers: "112K", photo: "/Speaker 1.webp", platforms: ["IG","TT"], niche: "Beauty & Skincare",  location: "Riga, LV"    },
  { name: "Anna Belle",    handle: "@annabelle_lv",   followers: "94K",  photo: "/Speaker 2.webp", platforms: ["IG","YT"], niche: "Beauty & Makeup",    location: "Riga, LV"    },
  { name: "Laura Beauty",  handle: "@laurabeauty",    followers: "78K",  photo: "/Food.webp",      platforms: ["IG"],      niche: "Beauty & Cosmetics", location: "Vilnius, LT" },
  { name: "Marta Tīna",   handle: "@martatina",      followers: "65K",  photo: "/Space.webp",     platforms: ["TT"],      niche: "Beauty Tutorials",   location: "Tallinn, EE" },
  { name: "Sofia Kalna",   handle: "@sofiakalna",     followers: "58K",  photo: "/Speaker 1.webp", platforms: ["IG"],      niche: "Skincare & Wellness",location: "Riga, LV"    },
  { name: "Dace Vītola",  handle: "@dacevitola",     followers: "51K",  photo: "/Speaker 2.webp", platforms: ["IG","TT"], niche: "Makeup Artist",      location: "Jūrmala, LV" },
  { name: "Kristīne O.",  handle: "@kristineoa",     followers: "44K",  photo: "/Food.webp",      platforms: ["YT"],      niche: "Skincare Reviews",   location: "Tartu, EE"   },
  { name: "Elza Bērce",   handle: "@elzaberce",      followers: "38K",  photo: "/Space.webp",     platforms: ["TT","IG"], niche: "Nail & Beauty",      location: "Kaunas, LT"  },
  { name: "Inese Kalniņa",handle: "@inesekalnina",   followers: "31K",  photo: "/Speaker 1.webp", platforms: ["IG"],      niche: "Natural Beauty",     location: "Riga, LV"    },
  { name: "Zane Lapiņa",  handle: "@zanelap",        followers: "26K",  photo: "/Speaker 2.webp", platforms: ["TT"],      niche: "Budget Beauty",      location: "Liepāja, LV" },
];

const FITNESS_CREATORS: Creator[] = [
  { name: "Armands Simsons", handle: "@armandssimsons", followers: "61K", photo: "/Speaker 2.webp", platforms: ["IG","LI"], niche: "Fitness & Lifestyle", location: "Riga, LV"    },
  { name: "Kate Fit",        handle: "@kate_fit",        followers: "88K", photo: "/Speaker 1.webp", platforms: ["IG","TT"], niche: "Fitness & Nutrition", location: "Riga, LV"    },
  { name: "Māris Strength",  handle: "@marisstrength",   followers: "74K", photo: "/Food.webp",      platforms: ["YT","IG"], niche: "Strength Training",   location: "Vilnius, LT" },
  { name: "Liga Wellness",   handle: "@ligawellness",    followers: "66K", photo: "/Space.webp",     platforms: ["IG"],      niche: "Yoga & Wellness",     location: "Tallinn, EE" },
  { name: "Rūdolfs Power",  handle: "@rudolfspower",    followers: "59K", photo: "/Speaker 2.webp", platforms: ["TT","IG"], niche: "CrossFit",            location: "Riga, LV"    },
  { name: "Ilze Runs",       handle: "@ilzeruns",        followers: "47K", photo: "/Speaker 1.webp", platforms: ["IG"],      niche: "Running & Endurance", location: "Jūrmala, LV" },
  { name: "Toms Athletic",   handle: "@tomsathletic",    followers: "39K", photo: "/Food.webp",      platforms: ["YT"],      niche: "Athletic Performance",location: "Kaunas, LT"  },
  { name: "Sandra Pilates",  handle: "@sandrapilates",   followers: "34K", photo: "/Space.webp",     platforms: ["IG","TT"], niche: "Pilates & Mobility",  location: "Tartu, EE"   },
  { name: "Edgars Fit",      handle: "@edgarsfit",       followers: "28K", photo: "/Speaker 2.webp", platforms: ["TT"],      niche: "Home Workouts",       location: "Riga, LV"    },
  { name: "Lauma Yoga",      handle: "@laumayoga",       followers: "22K", photo: "/Speaker 1.webp", platforms: ["IG"],      niche: "Yoga & Mindfulness",  location: "Cēsis, LV"   },
];

const FOOD_CREATORS: Creator[] = [
  { name: "Cindy Bokāne",    handle: "@cindywanderlust", followers: "84K", photo: "/Speaker 1.webp",        platforms: ["IG","YT"], niche: "Travel & Food",       location: "Riga, LV"    },
  { name: "Gardu Muti Chef", handle: "@gardumuti",       followers: "56K", photo: "/Gardu Muti.webp",       platforms: ["IG","TT"], niche: "Food & Hospitality",  location: "Riga, LV"    },
  { name: "Riga Eats",       handle: "@rigaeats",        followers: "71K", photo: "/Food.webp",             platforms: ["IG"],      niche: "Restaurant Reviews",  location: "Riga, LV"    },
  { name: "Baltic Bites",    handle: "@balticbites",     followers: "48K", photo: "/Artisan Street Bakery.webp", platforms: ["TT","IG"], niche: "Street Food",    location: "Tallinn, EE" },
  { name: "Pīrāgs Vibes",   handle: "@piragsvibes",     followers: "42K", photo: "/Speaker 2.webp",        platforms: ["IG"],      niche: "Latvian Cuisine",     location: "Riga, LV"    },
  { name: "Sweet Anda",      handle: "@sweetanda",       followers: "37K", photo: "/Food.webp",             platforms: ["TT","YT"], niche: "Baking & Desserts",   location: "Kaunas, LT"  },
  { name: "Vegan Vilnius",   handle: "@veganvilnius",    followers: "31K", photo: "/Space.webp",            platforms: ["IG"],      niche: "Plant-Based Eating",  location: "Vilnius, LT" },
  { name: "Coffee Kristaps", handle: "@coffeekristaps",  followers: "26K", photo: "/Speaker 1.webp",        platforms: ["IG","TT"], niche: "Coffee & Café Culture",location: "Riga, LV"   },
  { name: "Rīga Cocktails",  handle: "@rigacocktails",   followers: "21K", photo: "/Speaker 2.webp",        platforms: ["IG"],      niche: "Cocktails & Bars",    location: "Riga, LV"    },
  { name: "Smoked Rolands",  handle: "@smokedrolands",   followers: "18K", photo: "/Food.webp",             platforms: ["YT"],      niche: "BBQ & Grilling",      location: "Jēkabpils, LV"},
];

const TRAVEL_CREATORS: Creator[] = [
  { name: "Space Creator",    handle: "@spacecreator",    followers: "47K", photo: "/Space.webp",     platforms: ["IG"],      niche: "Travel & Architecture", location: "Vilnius, LT" },
  { name: "Baltics Unveiled", handle: "@balticsunveiled", followers: "73K", photo: "/Skyline.webp",   platforms: ["IG","TT"], niche: "Travel & Culture",      location: "Tallinn, EE" },
  { name: "Wanderer Ruta",    handle: "@wandererruta",    followers: "61K", photo: "/Speaker 1.webp", platforms: ["IG","YT"], niche: "Solo Travel",           location: "Riga, LV"    },
  { name: "Riga Diaries",     handle: "@rigadiaries",     followers: "55K", photo: "/Speaker 2.webp", platforms: ["IG"],      niche: "City Guides",           location: "Riga, LV"    },
  { name: "Forest Janis",     handle: "@forestjanis",     followers: "44K", photo: "/Food.webp",      platforms: ["TT","IG"], niche: "Nature & Hiking",       location: "Sigulda, LV" },
  { name: "Budget Baltic",    handle: "@budgetbaltic",    followers: "38K", photo: "/Skyline.webp",   platforms: ["YT"],      niche: "Budget Travel",         location: "Kaunas, LT"  },
  { name: "Airbaltic Anete",  handle: "@airbaltican",     followers: "33K", photo: "/Speaker 1.webp", platforms: ["IG"],      niche: "Luxury Travel",         location: "Jūrmala, LV" },
  { name: "Moto Latvija",     handle: "@motolv",          followers: "27K", photo: "/Space.webp",     platforms: ["TT","YT"], niche: "Road Trips",            location: "Riga, LV"    },
  { name: "Sea & Sands EE",   handle: "@seasandsee",      followers: "22K", photo: "/Skyline.webp",   platforms: ["IG"],      niche: "Coastal Travel",        location: "Pärnu, EE"   },
  { name: "Nordic Nomad",     handle: "@nordicnomad",     followers: "18K", photo: "/Speaker 2.webp", platforms: ["IG","TT"], niche: "Remote Destinations",   location: "Vilnius, LT" },
];

const CATEGORIES = [
  { id: "beauty",  label: "Beauty",  emoji: "✨", creators: BEAUTY_CREATORS,  accent: C.pink   },
  { id: "fitness", label: "Fitness", emoji: "💪", creators: FITNESS_CREATORS, accent: C.violet },
  { id: "food",    label: "Food",    emoji: "🍽️", creators: FOOD_CREATORS,    accent: C.indigo },
  { id: "travel",  label: "Travel",  emoji: "🌍", creators: TRAVEL_CREATORS,  accent: C.pink   },
];

// ─────────────────────────────────────────────
// 2. DASHBOARD HERO
// ─────────────────────────────────────────────
function DashboardHero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const hPad     = isMobile ? 20 : w < 900 ? 32 : 48;

  return (
    <section style={{
      position: "relative",
      minHeight: isMobile ? "auto" : "48vh",
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
        paddingBottom: isMobile ? 40 : 64,
        paddingLeft: hPad, paddingRight: hPad,
        boxSizing: "border-box",
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <PillLabel>Creator Network</PillLabel>
        <h1 style={{
          fontSize: isMobile ? 30 : isTablet ? 44 : 52,
          fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1.1, color: C.ink,
          margin: 0, marginBottom: 16, fontFamily: FONT,
        }}>
          Discover the{" "}
          <GradientText>Baltic Top 10</GradientText>
          <br />by Niche
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 17, color: C.inkDim2,
          maxWidth: 520, margin: "0 auto",
          lineHeight: 1.75, fontFamily: FONT,
        }}>
          Hand‑picked top‑performing creators across beauty, fitness, food,
          travel and more. Every profile is verified for genuine engagement.
        </p>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: isMobile ? 16 : 32,
          justifyContent: "center", flexWrap: "wrap",
          marginTop: 28,
        }}>
          {[
            { value: "500+",  label: "Vetted Creators" },
            { value: "4",     label: "Niches"          },
            { value: "3",     label: "Baltic Countries"},
            { value: "100%",  label: "Verified"        },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: isMobile ? 20 : 26, fontWeight: 900,
                letterSpacing: "-0.04em", margin: 0,
                background: C.grad, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", backgroundClip: "text",
                fontFamily: FONT,
              }}>{s.value}</p>
              <p style={{
                fontSize: 11, color: C.inkDim, margin: "3px 0 0",
                fontWeight: 500, fontFamily: FONT,
              }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. CATEGORY FILTER TABS
// ─────────────────────────────────────────────
function CategoryTabs({
  active, onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{
      display: "flex", gap: isMobile ? 8 : 10, flexWrap: "wrap",
      justifyContent: isMobile ? "flex-start" : "center",
      marginBottom: 40,
    }}>
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: isMobile ? "9px 14px" : "10px 20px",
              borderRadius: 100, border: "none", cursor: "pointer",
              fontSize: isMobile ? 13 : 14, fontWeight: 700,
              fontFamily: FONT, letterSpacing: "0.01em",
              transition: "all 0.18s ease",
              background: isActive ? C.grad : C.cardBg,
              color: isActive ? "#fff" : C.inkDim2,
              boxShadow: isActive ? "0 6px 20px rgba(124,85,255,0.28)" : "none",
              transform: isActive ? "translateY(-1px)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.cardBgM;
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.cardBg;
            }}
          >
            <span style={{ fontSize: isMobile ? 14 : 16 }}>{cat.emoji}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// 4a. FEATURED CREATOR CARD (#1 in category)
// ─────────────────────────────────────────────
function FeaturedCreatorCard({ creator, accent }: { creator: Creator; accent: string }) {
  const [hovered, setHovered] = useState(false);
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <a
      href={creator.profileUrl ?? "#"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        borderRadius: 20, overflow: "hidden",
        border: hovered ? C.borderH : C.border,
        boxShadow: hovered ? C.shadowLg : C.shadowSm,
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.22s ease", background: "#fff",
        width: "100%", cursor: "pointer",
      }}
    >
      {/* #1 badge */}
      <div style={{ position: "relative", height: isMobile ? 240 : 300 }}>
        <Image
          src={creator.photo} alt={creator.name}
          fill style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(10,6,18,0.65) 0%, rgba(10,6,18,0.1) 55%, transparent 75%)"
            : "linear-gradient(to top, rgba(10,6,18,0.50) 0%, transparent 60%)",
          transition: "background 0.2s",
        }} />

        {/* #1 badge */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          padding: "4px 10px", borderRadius: 8,
          background: C.grad, color: "#fff",
          fontSize: 11, fontWeight: 800, fontFamily: FONT,
          letterSpacing: "0.08em",
          boxShadow: "0 4px 12px rgba(124,85,255,0.35)",
        }}>
          # 1 THIS WEEK
        </div>

        {/* Location chip */}
        {creator.location && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10, fontWeight: 600, padding: "4px 10px",
            borderRadius: 6, background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)", color: C.inkDim2, fontFamily: FONT,
          }}>{creator.location}</span>
        )}

        {/* Name + meta over photo */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: isMobile ? "14px 16px" : "18px 20px",
        }}>
          <p style={{
            fontSize: isMobile ? 17 : 20, fontWeight: 800,
            margin: 0, lineHeight: 1.2, color: "#fff",
            letterSpacing: "-0.02em", fontFamily: FONT,
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}>{creator.name}</p>
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.85)",
            margin: "4px 0 8px", fontFamily: FONT,
          }}>{creator.handle}</p>
          <div style={{ display: "flex", gap: 4 }}>
            {creator.platforms.map((p) => (
              <span key={p} style={{
                fontSize: 9, fontWeight: 700, padding: "3px 8px",
                borderRadius: 5, letterSpacing: "0.04em",
                background: `${PLATFORM_COLORS[p] ?? C.violet}30`,
                color: PLATFORM_COLORS[p] ?? C.violet,
                fontFamily: FONT,
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Below-image info strip */}
      <div style={{
        padding: isMobile ? "12px 16px" : "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 12, color: C.inkDim, fontFamily: FONT,
          background: C.cardBg, padding: "3px 10px", borderRadius: 6,
        }}>{creator.niche}</span>
        <span style={{
          fontSize: 16, fontWeight: 900, letterSpacing: "-0.03em",
          background: C.grad, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
          fontFamily: FONT,
        }}>{creator.followers}</span>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────
// 4b. LIST CREATOR ITEM (#2–10)
// ─────────────────────────────────────────────
function CreatorListItem({ creator, rank }: { creator: Creator; rank: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={creator.profileUrl ?? "#"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 14,
        textDecoration: "none",
        background: hovered ? C.cardBgM : C.cardBg,
        border: hovered ? `1px solid ${C.violet}44` : C.border,
        boxShadow: hovered ? C.shadowMd : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.18s ease", cursor: "pointer",
      }}
    >
      {/* Rank number */}
      <span style={{
        fontSize: 11, fontWeight: 800, color: C.inkDim,
        minWidth: 20, textAlign: "center", fontFamily: FONT,
        letterSpacing: "0.02em",
      }}>#{rank}</span>

      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        overflow: "hidden", flexShrink: 0,
        border: "2px solid rgba(124,85,255,0.18)",
      }}>
        <Image src={creator.photo} alt={creator.name}
          width={42} height={42} style={{ objectFit: "cover" }} />
      </div>

      {/* Name + handle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: C.ink,
          margin: 0, letterSpacing: "-0.01em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: FONT,
        }}>{creator.name}</p>
        <p style={{
          fontSize: 11, color: C.inkDim, margin: "2px 0 0",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: FONT,
        }}>{creator.handle}</p>
      </div>

      {/* Platform chips */}
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {creator.platforms.map((p) => (
          <span key={p} style={{
            fontSize: 8, fontWeight: 700, padding: "2px 6px",
            borderRadius: 4, letterSpacing: "0.04em",
            background: `${PLATFORM_COLORS[p] ?? C.violet}18`,
            color: PLATFORM_COLORS[p] ?? C.violet,
            fontFamily: FONT,
          }}>{p}</span>
        ))}
      </div>

      {/* Follower count */}
      <span style={{
        fontSize: 12, fontWeight: 700, color: C.ink,
        minWidth: 42, textAlign: "right", flexShrink: 0,
        fontFamily: FONT,
      }}>{creator.followers}</span>
    </a>
  );
}

// ─────────────────────────────────────────────
// 4c. CATEGORY SECTION
// ─────────────────────────────────────────────
function CategorySection({
  creators, accent,
}: {
  creators: Creator[];
  accent: string;
}) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  if (!creators.length) return null;

  const [featured, ...rest] = creators;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
      gap: isMobile ? 20 : 28,
      alignItems: "start",
    }}>
      {/* Featured #1 card */}
      <FeaturedCreatorCard creator={featured} accent={accent} />

      {/* #2–10 list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rest.map((creator, idx) => (
          <CreatorListItem key={idx} creator={creator} rank={idx + 2} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. FULL FOOTER (shared)
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
export default function CreatorsDashboardPage() {
  const w = useWindowWidth();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  const current = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div style={{ background: C.bg, overflowX: "hidden", fontFamily: FONT }}>
      <Header />
      <DashboardHero />

      <main style={siteOuter(w, 0)}>
        {/* Category tabs */}
        <div style={{ paddingTop: 8 }}>
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Section label */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: w < 640 ? 22 : 28, fontWeight: 900,
            letterSpacing: "-0.03em", color: C.ink,
            margin: 0, fontFamily: FONT,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            Top 10{" "}
            <span style={{
              background: current.accent,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {current.label}
            </span>{" "}
            Creators
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 10px",
              borderRadius: 100, background: C.cardBg,
              color: C.inkDim, letterSpacing: "0.06em",
              textTransform: "uppercase", fontFamily: FONT,
              WebkitTextFillColor: C.inkDim,
            }}>This Week</span>
          </h2>
        </div>

        {/* Active category content */}
        <CategorySection creators={current.creators} accent={current.accent} />

        {/* CTA strip */}
        <div style={{
          marginTop: 48, padding: "24px 28px",
          borderRadius: 18, background: C.bgSub, border: C.border,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{
              fontSize: 15, fontWeight: 700, color: C.ink,
              margin: 0, fontFamily: FONT,
            }}>Ready to work with these creators?</p>
            <p style={{
              fontSize: 13, color: C.inkDim, margin: "4px 0 0",
              fontFamily: FONT,
            }}>Launch a performance-based campaign in 48 hours.</p>
          </div>
          <Btn href="/contact" variant="primary" style={{ padding: "11px 22px", fontSize: 13 }}>
            Start a Campaign →
          </Btn>
        </div>
      </main>

      <Footer />
    </div>
  );
}