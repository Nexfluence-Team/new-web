"use client";

/**
 * app/zone/contact/page.tsx
 * Nexfluence — Contact Page
 *
 * Sections:
 *  1. Header
 *  2. Page Hero  (two audience path cards)
 *  3. Contact Split  (form left · info + social right)
 *  4. FAQ Accordion
 *  5. Footer
 *
 * Form is fully client-side with validation + success state.
 * Wire submission to your API route / Resend / Formspree as needed.
 */

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

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
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  dim:     "rgba(255,255,255,0.55)",
  dim2:    "rgba(255,255,255,0.72)",
  grad:    "linear-gradient(90deg, #ff33bc, #8061ff)",
  border:  "1px solid rgba(128,97,255,0.35)",
  borderH: "1px solid rgba(255,122,195,0.55)",
  cardBg:  "rgba(128,97,255,0.06)",
  error:   "#ff6b6b",
  success: "#34d399",
} as const;

type CSSProps = React.CSSProperties;
type Mode = "brand" | "creator";

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
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant: "primary" | "ghost";
  children: React.ReactNode;
  style?: CSSProps;
  disabled?: boolean;
}
function Btn({ href, onClick, type = "button", variant, children, style, disabled }: BtnProps) {
  const base: CSSProps = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "opacity 0.2s, transform 0.2s",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };
  const vs: Record<string, CSSProps> = {
    primary: { background: C.grad, color: "#fff", boxShadow: "0 8px 32px rgba(128,97,255,0.35)" },
    ghost:   { background: "transparent", color: C.violet, border: "1.5px solid rgba(128,97,255,0.6)" },
  };
  const merged = { ...base, ...vs[variant] };

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    (e.currentTarget as HTMLElement).style.opacity = "0.88";
    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    (e.currentTarget as HTMLElement).style.opacity = "1";
    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
  };

  if (href) return <a href={href} style={merged} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</a>;
  return <button type={type} style={merged} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} disabled={disabled}>{children}</button>;
}

// ─────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────
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

  const NAV = [
    { label: "Home",     href: "/zone"         },
    { label: "Services", href: "/zone#services" },
    { label: "About",    href: "/zone/about"    },
    { label: "Contact",  href: "/zone/contact", active: true },
  ];

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
            <p style={{ fontSize: isMobile ? "14px" : "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>Nexfluence</p>
            <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em", marginTop: "2px" }}>CREATOR NEXUS</p>
          </div>
        </a>

        {!isMobile && (
          <nav style={{ display: "flex", gap: "28px", marginLeft: "40px" }}>
            {NAV.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: l.active ? "#fff" : "rgba(255,255,255,0.55)",
                  textDecoration: "none",
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

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
          {!isMobile && (
            <Btn href="/zone#creators" variant="ghost" style={{ padding: "10px 20px", fontSize: "13px" }}>
              For Creators
            </Btn>
          )}
          <Btn href="#form" variant="primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
            Get In Touch
          </Btn>
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#fff", fontSize: "20px" }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            background: "rgba(10,6,18,0.97)",
            borderTop: "1px solid rgba(128,97,255,0.2)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {NAV.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "16px", fontWeight: 500, color: l.active ? "#fff" : "rgba(255,255,255,0.7)", textDecoration: "none" }}
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
// 2. PAGE HERO  — two audience path cards
// ─────────────────────────────────────────────
interface HeroProps {
  activeMode: Mode;
  setMode: (m: Mode) => void;
}

function PageHero({ activeMode, setMode }: HeroProps) {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section
      style={{
        paddingTop: isMobile ? "110px" : "130px",
        paddingBottom: isMobile ? "60px" : "72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(128,97,255,0.2) 0%, rgba(255,51,188,0.09) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(128,97,255,0.35), rgba(255,51,188,0.35), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: pad(w),
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <PillLabel>Get In Touch</PillLabel>

        <h1
          style={{
            fontSize: isMobile ? "36px" : w < 900 ? "52px" : "64px",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Let's Build Something
          <br />
          <GradientText>Worth Talking About</GradientText>
        </h1>

        <p
          style={{
            fontSize: isMobile ? "15px" : "17px",
            color: C.dim2,
            lineHeight: 1.75,
            maxWidth: "540px",
            margin: "0 auto 48px",
          }}
        >
          Whether you're a brand ready to reach Baltic audiences or a creator
          ready to monetize your work — we respond within 24 hours.
        </p>

        {/* Audience path selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "16px",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {(["brand", "creator"] as Mode[]).map((mode) => {
            const active = activeMode === mode;
            const meta = {
              brand:   { emoji: "🏢", title: "I'm a Brand",   sub: "Launch a campaign, explore partnerships, or get a custom quote.", color: C.violet  },
              creator: { emoji: "✨", title: "I'm a Creator",  sub: "Apply to join the network, pitch a collab, or ask about rates.",   color: C.magenta },
            }[mode];
            return (
              <button
                key={mode}
                onClick={() => {
                  setMode(mode);
                  const el = document.getElementById("form");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  padding: "24px 28px",
                  borderRadius: "20px",
                  background: active
                    ? `linear-gradient(135deg, ${meta.color}22, ${meta.color}0a)`
                    : C.cardBg,
                  border: active
                    ? `1.5px solid ${meta.color}88`
                    : C.border,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  transform: active ? "translateY(-3px)" : "none",
                  boxShadow: active ? `0 16px 48px ${meta.color}22` : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Active glow */}
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: "80px",
                      height: "80px",
                      background: `radial-gradient(circle, ${meta.color}30, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <p style={{ fontSize: "28px", marginBottom: "10px" }}>{meta.emoji}</p>
                <p
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: active ? "#fff" : "rgba(255,255,255,0.75)",
                    letterSpacing: "-0.02em",
                    marginBottom: "6px",
                    transition: "color 0.2s",
                  }}
                >
                  {meta.title}
                </p>
                <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.6 }}>{meta.sub}</p>
                {active && (
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: meta.color,
                      marginTop: "12px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Selected — scroll down ↓
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────
interface BrandFormData {
  name: string;
  company: string;
  email: string;
  website: string;
  budget: string;
  goal: string;
  timeline: string;
  message: string;
}

interface CreatorFormData {
  name: string;
  handle: string;
  email: string;
  platforms: string[];
  followers: string;
  niche: string;
  message: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

function validate<T extends object>(data: T, rules: Partial<Record<keyof T, (v: string) => string | null>>): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const key in rules) {
    const rule = rules[key as keyof T];
    const val  = String((data as Record<string, unknown>)[key] ?? "");
    if (rule) {
      const msg = rule(val);
      if (msg) errors[key as keyof T] = msg;
    }
  }
  return errors;
}

// ─────────────────────────────────────────────
// FORM INPUT COMPONENTS
// ─────────────────────────────────────────────
interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

function FormInput({ label, value, onChange, placeholder, type = "text", error, required, hint }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: error ? C.error : focused ? "#fff" : "rgba(255,255,255,0.65)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "color 0.18s",
        }}
      >
        {label}
        {required && <span style={{ color: C.magenta, marginLeft: "4px" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          background: focused ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.05)",
          border: error
            ? `1.5px solid ${C.error}88`
            : focused
            ? "1.5px solid rgba(128,97,255,0.7)"
            : C.border,
          color: "#fff",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.18s, background 0.18s",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ fontSize: "11px", color: C.error, marginTop: "2px" }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{hint}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends Omit<InputProps, "type"> {
  rows?: number;
}

function FormTextArea({ label, value, onChange, placeholder, error, required, hint, rows = 5 }: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: error ? C.error : focused ? "#fff" : "rgba(255,255,255,0.65)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "color 0.18s",
        }}
      >
        {label}
        {required && <span style={{ color: C.magenta, marginLeft: "4px" }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          background: focused ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.05)",
          border: error
            ? `1.5px solid ${C.error}88`
            : focused
            ? "1.5px solid rgba(128,97,255,0.7)"
            : C.border,
          color: "#fff",
          fontSize: "14px",
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.18s, background 0.18s",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "inherit",
          lineHeight: 1.6,
        }}
      />
      {error && <p style={{ fontSize: "11px", color: C.error, marginTop: "2px" }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{hint}</p>}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

function FormSelect({ label, value, onChange, options, error, required }: SelectProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: error ? C.error : focused ? "#fff" : "rgba(255,255,255,0.65)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "color 0.18s",
        }}
      >
        {label}
        {required && <span style={{ color: C.magenta, marginLeft: "4px" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          background: focused ? "rgba(128,97,255,0.12)" : "rgba(128,97,255,0.05)",
          border: error
            ? `1.5px solid ${C.error}88`
            : focused
            ? "1.5px solid rgba(128,97,255,0.7)"
            : C.border,
          color: value ? "#fff" : "rgba(255,255,255,0.4)",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.18s, background 0.18s",
          width: "100%",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: "40px",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#1a0a2e", color: "#fff" }}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p style={{ fontSize: "11px", color: C.error, marginTop: "2px" }}>{error}</p>}
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
}

function CheckboxGroup({ label, options, selected, onChange, error }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
        <span style={{ color: C.magenta, marginLeft: "4px" }}>*</span>
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: checked ? "rgba(128,97,255,0.2)" : "rgba(128,97,255,0.05)",
                border: checked ? "1.5px solid rgba(128,97,255,0.7)" : C.border,
                color: checked ? "#fff" : C.dim,
                fontSize: "13px",
                fontWeight: checked ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {checked ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {error && <p style={{ fontSize: "11px", color: C.error, marginTop: "2px" }}>{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────
function SuccessState({ mode, onReset }: { mode: Mode; onReset: () => void }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Animated checkmark ring */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(52,211,153,0.12)",
          border: "2px solid rgba(52,211,153,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          marginBottom: "8px",
          animation: "pulse-success 2s ease infinite",
        }}
      >
        ✓
      </div>

      <h3
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        Message Sent!
      </h3>
      <p style={{ fontSize: "15px", color: C.dim, lineHeight: 1.7, maxWidth: "320px" }}>
        {mode === "brand"
          ? "We'll review your brief and get back to you within 24 hours with creator recommendations and a proposal."
          : "Your application is in. We'll review your profile and reach out within 48 hours if there's a good campaign fit."}
      </p>

      <div
        style={{
          padding: "16px 24px",
          borderRadius: "12px",
          background: "rgba(52,211,153,0.06)",
          border: "1px solid rgba(52,211,153,0.2)",
          marginTop: "8px",
        }}
      >
        <p style={{ fontSize: "13px", color: "rgba(52,211,153,0.9)", fontWeight: 600 }}>
          📬 Expect a reply at the email you provided
        </p>
      </div>

      <button
        onClick={onReset}
        style={{
          marginTop: "12px",
          fontSize: "13px",
          color: C.dim,
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          transition: "color 0.18s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.dim)}
      >
        Send another message
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3a. BRAND FORM
// ─────────────────────────────────────────────
const BUDGET_OPTIONS = [
  { value: "",        label: "Select a range..." },
  { value: "<500",    label: "Under €500" },
  { value: "500-2k",  label: "€500 – €2,000" },
  { value: "2k-5k",   label: "€2,000 – €5,000" },
  { value: "5k-15k",  label: "€5,000 – €15,000" },
  { value: "15k+",    label: "€15,000+" },
  { value: "discuss", label: "Let's discuss" },
];

const GOAL_OPTIONS = [
  { value: "",              label: "Select a goal..." },
  { value: "brand-awareness", label: "Brand Awareness" },
  { value: "product-launch",  label: "Product Launch" },
  { value: "sales-affiliate", label: "Sales / Affiliate" },
  { value: "content-ugc",     label: "UGC Content Creation" },
  { value: "event-promo",     label: "Event Promotion" },
  { value: "other",           label: "Other / Not sure" },
];

const TIMELINE_OPTIONS = [
  { value: "",         label: "When do you need to launch?" },
  { value: "asap",     label: "ASAP — within 2 weeks" },
  { value: "1month",   label: "Within 1 month" },
  { value: "q",        label: "This quarter" },
  { value: "flexible", label: "Flexible / exploratory" },
];

function BrandForm({ onSuccess }: { onSuccess: () => void }) {
  const [data, setData] = useState<BrandFormData>({
    name: "", company: "", email: "", website: "",
    budget: "", goal: "", timeline: "", message: "",
  });
  const [errors, setErrors]     = useState<FieldErrors<BrandFormData>>({});
  const [loading, setLoading]   = useState(false);

  const set = (key: keyof BrandFormData) => (v: string) => setData((d) => ({ ...d, [key]: v }));

  const handleSubmit = useCallback(async () => {
    const errs = validate<BrandFormData>(data, {
      name:    (v) => v.trim().length < 2 ? "Please enter your name" : null,
      company: (v) => v.trim().length < 1 ? "Company name is required" : null,
      email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email address",
      goal:    (v) => v ? null : "Please select a campaign goal",
      message: (v) => v.trim().length < 20 ? "Tell us a bit more (at least 20 characters)" : null,
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simulated network call — replace with fetch('/api/contact', { method: 'POST', body: JSON.stringify({ ...data, type: 'brand' }) })
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onSuccess();
  }, [data, onSuccess]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Row: name + company */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormInput label="Your Name"    value={data.name}    onChange={set("name")}    placeholder="e.g. Jānis Bērziņš"   required error={errors.name} />
        <FormInput label="Company"      value={data.company} onChange={set("company")} placeholder="e.g. Riga Coffee Co." required error={errors.company} />
      </div>

      {/* Row: email + website */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormInput label="Work Email" value={data.email}   onChange={set("email")}   placeholder="you@company.com" type="email" required error={errors.email} />
        <FormInput label="Website"    value={data.website} onChange={set("website")} placeholder="https://yoursite.com" hint="Optional" />
      </div>

      {/* Row: goal + budget */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormSelect label="Campaign Goal"   value={data.goal}     onChange={set("goal")}     options={GOAL_OPTIONS}     required error={errors.goal} />
        <FormSelect label="Monthly Budget"  value={data.budget}   onChange={set("budget")}   options={BUDGET_OPTIONS} />
      </div>

      {/* Timeline */}
      <FormSelect label="Launch Timeline" value={data.timeline} onChange={set("timeline")} options={TIMELINE_OPTIONS} />

      {/* Message */}
      <FormTextArea
        label="Tell Us About Your Brand"
        value={data.message}
        onChange={set("message")}
        placeholder="What do you sell, who's your target audience, and what does a successful campaign look like for you?"
        rows={5}
        required
        error={errors.message}
      />

      {/* Submit */}
      <Btn
        type="button"
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "15px", fontSize: "15px" }}
      >
        {loading ? "Sending…" : "Send Brand Enquiry →"}
      </Btn>

      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
        We respond within 24 hours on business days · No commitment required
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3b. CREATOR FORM
// ─────────────────────────────────────────────
const PLATFORMS_OPTIONS = ["Instagram", "TikTok", "YouTube", "LinkedIn", "X / Twitter", "Threads"];

const FOLLOWER_OPTIONS = [
  { value: "",       label: "Total following across platforms..." },
  { value: "<5k",    label: "Under 5K" },
  { value: "5k-10k", label: "5K – 10K" },
  { value: "10k-50k",label: "10K – 50K" },
  { value: "50k-100k", label: "50K – 100K" },
  { value: "100k+",  label: "100K+" },
];

const NICHE_OPTIONS = [
  { value: "",           label: "Select your primary niche..." },
  { value: "lifestyle",  label: "Lifestyle & Daily Life" },
  { value: "travel",     label: "Travel & Adventure" },
  { value: "food",       label: "Food & Hospitality" },
  { value: "fitness",    label: "Fitness & Wellness" },
  { value: "fashion",    label: "Fashion & Beauty" },
  { value: "business",   label: "Business & Finance" },
  { value: "tech",       label: "Tech & Gaming" },
  { value: "family",     label: "Family & Parenting" },
  { value: "art",        label: "Art & Design" },
  { value: "other",      label: "Other" },
];

function CreatorForm({ onSuccess }: { onSuccess: () => void }) {
  const [data, setData] = useState<CreatorFormData>({
    name: "", handle: "", email: "",
    platforms: [], followers: "", niche: "", message: "",
  });
  const [errors, setErrors]   = useState<FieldErrors<CreatorFormData>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof CreatorFormData) => (v: string) => setData((d) => ({ ...d, [key]: v }));

  const handleSubmit = useCallback(async () => {
    const errs = validate<CreatorFormData>(data, {
      name:    (v) => v.trim().length < 2 ? "Please enter your name" : null,
      handle:  (v) => v.trim().length < 2 ? "Add your main social handle" : null,
      email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email address",
      niche:   (v) => v ? null : "Select your primary content niche",
    });
    if (data.platforms.length === 0) {
      (errs as any).platforms = "Select at least one platform";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simulated — replace with fetch('/api/contact', { method: 'POST', body: JSON.stringify({ ...data, type: 'creator' }) })
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onSuccess();
  }, [data, onSuccess]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Row: name + handle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormInput label="Full Name"       value={data.name}   onChange={set("name")}   placeholder="Marta Kalniņa"      required error={errors.name} />
        <FormInput label="Main Handle"     value={data.handle} onChange={set("handle")} placeholder="@yourusername"     required error={errors.handle} hint="Your most active platform" />
      </div>

      {/* Email */}
      <FormInput label="Email Address" value={data.email} onChange={set("email")} placeholder="you@email.com" type="email" required error={errors.email} />

      {/* Platforms */}
      <CheckboxGroup
        label="Your Platforms"
        options={PLATFORMS_OPTIONS}
        selected={data.platforms}
        onChange={(v) => setData((d) => ({ ...d, platforms: v }))}
        error={(errors as any).platforms}
      />

      {/* Row: followers + niche */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormSelect label="Total Following" value={data.followers} onChange={set("followers")} options={FOLLOWER_OPTIONS} />
        <FormSelect label="Content Niche"   value={data.niche}     onChange={set("niche")}     options={NICHE_OPTIONS}     required error={errors.niche} />
      </div>

      {/* Message */}
      <FormTextArea
        label="Tell Us About Yourself"
        value={data.message}
        onChange={set("message")}
        placeholder="What kind of brands do you want to work with? Any previous campaign experience? What makes your audience special?"
        rows={5}
        hint="Optional but helps us match you faster"
      />

      {/* Submit */}
      <Btn
        type="button"
        variant="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "15px", fontSize: "15px", background: "linear-gradient(90deg, #8061ff, #ff33bc)" }}
      >
        {loading ? "Submitting…" : "Apply to Join the Network →"}
      </Btn>

      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
        We review every application · Response within 48 hours
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. CONTACT SPLIT  (form left · info right)
// ─────────────────────────────────────────────
interface ContactSplitProps {
  mode: Mode;
  setMode: (m: Mode) => void;
}

function ContactSplit({ mode, setMode }: ContactSplitProps) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const [submitted, setSubmitted] = useState<Mode | null>(null);

  // Reset success state when mode changes
  useEffect(() => { setSubmitted(null); }, [mode]);

  const DIRECT = [
    { icon: "📬", label: "Brands",   val: "brands@nexfluence.eu",   href: "mailto:brands@nexfluence.eu"   },
    { icon: "✨", label: "Creators", val: "creators@nexfluence.eu", href: "mailto:creators@nexfluence.eu" },
    { icon: "📍", label: "Location", val: "Riga, Latvia",            href: "#"                             },
  ];

  const SOCIAL = [
    { icon: "📸", label: "Instagram",         href: "https://www.instagram.com/nexfluence.eu", handle: "@nexfluence.eu"   },
    { icon: "🌐", label: "Creator Community",  href: "https://ig.me/j/AbanIlYdHEhj6sI1",       handle: "Join the group"   },
  ];

  return (
    <section id="form" style={outer(w, 0)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 420px",
          gap: isMobile ? "48px" : "64px",
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Form ── */}
        <div>
          {/* Mode toggle */}
          <div
            style={{
              display: "inline-flex",
              borderRadius: "12px",
              background: "rgba(128,97,255,0.1)",
              border: C.border,
              padding: "4px",
              marginBottom: "32px",
            }}
          >
            {(["brand", "creator"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "10px 28px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                  background: mode === m ? C.grad : "transparent",
                  color: mode === m ? "#fff" : C.dim,
                }}
              >
                {m === "brand" ? "🏢 Brand" : "✨ Creator"}
              </button>
            ))}
          </div>

          {/* Form heading */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: isMobile ? "24px" : "30px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              {mode === "brand" ? "Start a Campaign" : "Join the Network"}
            </h2>
            <p style={{ fontSize: "14px", color: C.dim, lineHeight: 1.6 }}>
              {mode === "brand"
                ? "Fill in your brief and we'll come back with creator recommendations and a proposal."
                : "Tell us about yourself and we'll reach out when a fitting campaign comes in."}
            </p>
          </div>

          {/* Form card */}
          <div
            style={{
              borderRadius: "24px",
              border: C.border,
              background: C.cardBg,
              padding: isMobile ? "24px" : "36px",
              backdropFilter: "blur(8px)",
            }}
          >
            {submitted === mode ? (
              <SuccessState mode={mode} onReset={() => setSubmitted(null)} />
            ) : mode === "brand" ? (
              <BrandForm onSuccess={() => setSubmitted("brand")} />
            ) : (
              <CreatorForm onSuccess={() => setSubmitted("creator")} />
            )}
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div
          style={{
            position: isMobile || isTablet ? "static" : "sticky",
            top: "100px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Response time card */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: "rgba(128,97,255,0.08)",
              border: C.border,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span className="dot-live" />
              <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Response Times
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { who: "Brand enquiries",    time: "Within 24h",     accent: C.violet  },
                { who: "Creator applications", time: "Within 48h",   accent: C.magenta },
                { who: "General questions",  time: "Within 72h",     accent: C.pink    },
              ].map((r) => (
                <div key={r.who} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "13px", color: C.dim }}>{r.who}</p>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: `${r.accent}20`,
                      color: r.accent,
                    }}
                  >
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct contact */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: C.cardBg,
              border: C.border,
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
              Direct Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {DIRECT.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textDecoration: "none",
                    transition: "opacity 0.18s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
                >
                  <span
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(128,97,255,0.12)",
                      border: C.border,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {d.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "1px" }}>
                      {d.label}
                    </p>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{d.val}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              background: C.cardBg,
              border: C.border,
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
              Follow Along
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: "rgba(128,97,255,0.06)",
                    border: C.border,
                    textDecoration: "none",
                    transition: "border-color 0.18s, background 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,122,195,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(128,97,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(128,97,255,0.35)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(128,97,255,0.06)";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{s.icon}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{s.label}</p>
                    <p style={{ fontSize: "11px", color: C.pink }}>{s.handle}</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Location visual */}
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: C.border,
              position: "relative",
              height: "160px",
            }}
          >
            <Image src="/Skyline.webp" alt="Riga, Latvia" fill style={{ objectFit: "cover", opacity: 0.7 }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(128,97,255,0.5) 0%, rgba(10,6,18,0.6) 100%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "16px", left: "18px" }}>
              <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                📍 Riga, Latvia
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                Baltic HQ · Remote-friendly team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. FAQ ACCORDION
// ─────────────────────────────────────────────
interface FaqItem {
  q: string;
  a: string;
  audience: "both" | "brand" | "creator";
}

const FAQS: FaqItem[] = [
  {
    q: "How does the performance-based pricing model work?",
    a: "Brands define a KPI upfront — it could be a sale, a sign-up, a promo code use, or a link click. We track these through UTM links and unique promo codes. You only pay when those agreed outcomes are delivered. There are no retainer fees for running a campaign.",
    audience: "brand",
  },
  {
    q: "What markets do you operate in?",
    a: "We're active across Latvia, Lithuania, and Estonia. Our creator network is concentrated in Latvia (primarily Riga), but we have strong reach in Vilnius and Tallinn too. For campaigns targeting the broader Baltic region, we can coordinate creators across all three countries.",
    audience: "both",
  },
  {
    q: "How are creators verified and vetted?",
    a: "We manually review every creator application. We look at content quality, engagement authenticity (checking for bot followers or fake engagement), audience demographics, and niche relevance. We also check for brand safety — creators with a history of controversial content are not admitted. We reject approximately 70% of applicants.",
    audience: "both",
  },
  {
    q: "What does the campaign process look like from start to finish?",
    a: "After your initial enquiry, we'll schedule a brief call to align on goals, audience, and budget. We then propose a creator lineup within 5 business days. Once approved, we prepare the creative brief, handle contracts, manage content review, coordinate publishing, and deliver a post-campaign performance report.",
    audience: "brand",
  },
  {
    q: "Do I need a large following to join as a creator?",
    a: "Not necessarily. We care more about engagement quality and audience trust than raw follower counts. A creator with 8,000 highly engaged followers in a specific niche can outperform a 100K creator with passive scrollers. We accept creators from 3K+ followers if the fit is right.",
    audience: "creator",
  },
  {
    q: "How do creators get paid?",
    a: "Creators are paid based on campaign performance — sales generated, codes used, or clicks driven, depending on the campaign structure. Payouts are processed within 30 days of the campaign end date. For longer-term affiliate relationships, payouts can be set up on a monthly rolling basis.",
    audience: "creator",
  },
  {
    q: "Can I work with Nexfluence if I'm not based in Latvia?",
    a: "Yes. If you're based in Lithuania or Estonia and create content relevant to the Baltic market, we'd love to hear from you. Our main focus is the Baltic audience, so creators outside the region whose audience is primarily Baltic are also welcome to apply.",
    audience: "creator",
  },
  {
    q: "Is there a minimum campaign budget?",
    a: "We work with brands from a variety of sizes. There's no strict minimum, but campaigns under €500 typically don't have enough budget to engage creators in a meaningful, performance-based way. We're happy to advise what's realistic for your goals during the initial call.",
    audience: "brand",
  },
];

function FAQSection({ mode }: { mode: Mode }) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const [open, setOpen] = useState<number | null>(null);

  const filtered = FAQS.filter((f) => f.audience === "both" || f.audience === mode);

  return (
    <section style={outer(w, 96)}>
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <PillLabel>FAQ</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? "26px" : "36px",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          Frequently Asked
          <br />
          <GradientText>
            {mode === "brand" ? "by Brands" : "by Creators"}
          </GradientText>
        </h2>
      </div>

      {/* Audience toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
        <div
          style={{
            display: "inline-flex",
            borderRadius: "12px",
            background: "rgba(128,97,255,0.1)",
            border: C.border,
            padding: "4px",
          }}
        >
          {(["brand", "creator"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setOpen(null); }}
              style={{
                padding: "9px 24px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                transition: "all 0.2s ease",
                background: mode === m ? C.grad : "transparent",
                color: mode === m ? "#fff" : C.dim,
              }}
            >
              {m === "brand" ? "For Brands" : "For Creators"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {filtered.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: "14px",
                border: isOpen ? "1px solid rgba(128,97,255,0.4)" : "1px solid rgba(128,97,255,0.15)",
                background: isOpen ? "rgba(128,97,255,0.07)" : "transparent",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
                marginBottom: "8px",
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    fontWeight: 600,
                    color: isOpen ? "#fff" : C.dim2,
                    lineHeight: 1.4,
                    transition: "color 0.2s",
                  }}
                >
                  {faq.q}
                </p>
                <span
                  style={{
                    fontSize: "18px",
                    color: isOpen ? C.pink : "rgba(255,255,255,0.3)",
                    transition: "transform 0.25s ease, color 0.2s",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>

              {/* Answer — animated height */}
              <div
                style={{
                  maxHeight: isOpen ? "400px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.35s ease",
                }}
              >
                <p
                  style={{
                    padding: "0 24px 20px",
                    fontSize: "14px",
                    color: C.dim,
                    lineHeight: 1.8,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div
        style={{
          maxWidth: "760px",
          margin: "32px auto 0",
          padding: "24px 28px",
          borderRadius: "16px",
          background: C.cardBg,
          border: C.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
            Still have a question?
          </p>
          <p style={{ fontSize: "13px", color: C.dim }}>
            Drop us a line and we'll get back to you within 24 hours.
          </p>
        </div>
        <Btn href="mailto:hello@nexfluence.eu" variant="ghost" style={{ padding: "10px 20px", fontSize: "13px", flexShrink: 0 }}>
          Email Us →
        </Btn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. FOOTER  (identical to other pages)
// ─────────────────────────────────────────────
const FOOTER_COLS = {
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
          marginBottom: "48px",
        }}
      >
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <Image src="/Nex.webp" alt="Nexfluence" width={40} height={40} style={{ borderRadius: "10px" }} />
            <div>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Nexfluence</p>
              <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em" }}>CREATOR NEXUS</p>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.75, maxWidth: "240px" }}>
            Latvia's first performance-based influencer marketing platform for the Baltic region.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            {["IG", "LI", "TT"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: "34px", height: "34px",
                  borderRadius: "8px",
                  background: C.cardBg,
                  border: C.border,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700,
                  color: C.dim, textDecoration: "none",
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

        {Object.entries(FOOTER_COLS).map(([col, links]) => (
          <div key={col}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
              {col}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {links.map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{ fontSize: "13px", color: C.dim, textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

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
// PAGE ROOT  — shared mode state threads through
// ─────────────────────────────────────────────
export default function ContactPage() {
  const [mode, setMode] = useState<Mode>("brand");

  return (
    <div style={{ background: "#0a0612", overflowX: "hidden" }}>
      <style>{`
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.35); }
          50%       { box-shadow: 0 0 0 12px rgba(52,211,153,0);  }
        }
        input::placeholder,
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        select option          { background: #12081e; color: #fff; }
      `}</style>

      <Header />
      <PageHero activeMode={mode} setMode={setMode} />
      <ContactSplit mode={mode} setMode={setMode} />
      <FAQSection mode={mode} />
      <Footer />
      <div style={{ height: "80px" }} />
    </div>
  );
}