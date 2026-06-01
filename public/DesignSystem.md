# Nexfluence — Creator Nexus Landing Page
## Design & Technical Specification — v2
> Revised to include the Tailwind v4 global stylesheet. Changes from v1 are marked **[UPDATED]** or **[NEW]**.

---

## CHANGELOG v1 → v2

| Area | Change |
|---|---|
| Theme | **Light → Dark.** Background flipped from `#f7f5ff` to `#0a0612` |
| Body text | Now **white** `#ffffff` on dark background (was dark `#1a0a2e` on light) |
| Color token `ink` | `#f7f5ff` → `#0a0612` |
| New color token | `indigo: #6a66ff` added to palette |
| Marquee edge fade | Color updated from `#f7f5ff` to `#0a0612` to match dark background |
| Styling engine | Inline CSS + JS strings → **Tailwind v4** with `@theme` tokens |
| Section label | Redesigned: pill-label class with line-dash prefix, uppercase, pink |
| CTA button | Gradient angle `135deg` → `90deg`; border-radius `14px` → `8px`; hover behaviour simplified |
| New utilities | `.border-gradient-pm`, `.border-dashed-accent`, `.pill-label`, `.dot-live`, `.btn-apply` |
| Font rendering | `antialiased` smoothing added to `<body>` |
| Scroll behaviour | `scroll-behavior: smooth` on `<html>` |

---

## 1. BRAND IDENTITY

| Property | Value |
|---|---|
| **Brand Name** | Creator Nexus by Nexfluence |
| **Tagline** | Bringing Impactful Creators Across the Baltics Under One Roof |
| **Logo file** | `/Nex.webp` |
| **Logo size (desktop)** | 64 × 64 px |
| **Logo size (mobile)** | 44 × 44 px |

---

## 2. COLOR PALETTE **[UPDATED]**

> ⚠️ The site is now a **dark-theme** product. The `ink` token is the near-black page background. All text defaults to white.

### Design Tokens (`@theme` in Tailwind v4)

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `ink` | `--color-ink` | `#0a0612` | **Page background** (dark purple-black) **[UPDATED]** |
| `pink` | `--color-pink` | `#ff7ac3` | Borders, accents, section label lines, tagline |
| `magenta` | `--color-magenta` | `#ff33bc` | CTA gradient, dot-live pulse, icons |
| `violet` | `--color-violet` | `#8061ff` | CTA gradient end, card accents, community UI |
| `indigo` | `--color-indigo` | `#6a66ff` | **[NEW]** — secondary accent; alt to violet |

Tailwind v4 auto-generates `bg-ink`, `text-pink`, `border-violet`, etc. from these tokens.

### Base Text Colors

| Role | Value | Notes |
|---|---|---|
| Primary text | `#ffffff` | All headings, body on dark background **[UPDATED]** |
| Dim / subtext | `rgba(255,255,255,0.55)` | Secondary copy, captions on dark bg **[UPDATED]** |
| Accent inline text | `#8061ff` (violet) | Key highlighted phrases |
| Label / badge text | `#ff7ac3` (pink) | Section labels, pill-label |

### Gradient Reference **[UPDATED]**

| Name | Value | Change |
|---|---|---|
| Primary CTA gradient | `linear-gradient(90deg, #ff33bc, #8061ff)` | Angle changed: 135deg → **90deg** |
| Gradient border ring | `linear-gradient(135deg, #ff7ac3, #ff33bc, #8061ff)` | **[NEW]** — 3-stop gradient for card borders |
| Card glow overlay | `radial-gradient(ellipse at 50% 50%, rgba(128,97,255,.65) 0%, rgba(255,51,188,.42) 28%, transparent 60%)` | Unchanged |
| Marquee ambient glow | `radial-gradient(ellipse at 50% 50%, rgba(128,97,255,0.3) 0%, rgba(255,51,188,0.18) 35%, transparent 65%)` | Unchanged |
| Photo bottom fade | `radial-gradient(ellipse at 25% 80%, rgba(20,10,40,0.55) 0%, rgba(20,10,40,0.25) 42%, transparent 72%)` | Unchanged |
| Hero image overlay (mobile) | `linear-gradient(to top, rgba(16,6,36,0.82) 0%, rgba(16,6,36,0.28) 55%, transparent 100%)` | Unchanged |
| Hero image overlay (desktop) | `linear-gradient(to right, rgba(16,6,36,0.78) 0%, rgba(16,6,36,0.38) 42%, transparent 62%)` | Unchanged |
| Marquee edge fade | `linear-gradient(90deg, #0a0612 0%, transparent 10%, transparent 90%, #0a0612 100%)` | **[UPDATED]** — matches dark bg |

---

## 3. TYPOGRAPHY

| Property | Value |
|---|---|
| **Font family** | `var(--font-rubik), sans-serif` |
| **CSS variable** | `--font-rubik` (set by Next.js font loader) |
| **Font rendering** | `-webkit-font-smoothing: antialiased` on `<body>` **[NEW]** |
| **Google Font** | Rubik — load all weights needed (400, 500, 700, 800, 900) |

### Type Scale

| Element | Mobile | Tablet | Desktop | Weight | Letter-spacing |
|---|---|---|---|---|---|
| Hero H1 | 28px | — | 40px | 900 | -0.035em |
| Section H2 | 22px | 25px | 28px | 900 | -0.03em |
| Logo name | 15px | 19px | 22px | 650 | -0.03em |
| Body copy | 14px | — | 16px | 400 | — |
| Speaker name (card) | 13px | — | 16px | 700 | -0.01em |
| Section label (pill-label) | 11px | 11px | 11px | 500 | **0.18em** **[UPDATED]** |
| Captions / badges | 9–11px | — | 11px | 500 | 0.05em |
| Subtext / date | 11–13px | — | 15px | 400 | 0.01em |
| CTA button | 15px | — | 15px | 700 | **0.04em** **[UPDATED]** |
| Fine print | 12px | — | 12px | 400 | 0.01em |

### Line Heights

| Context | Value |
|---|---|
| Headings | 1.1 |
| Body paragraphs | 1.85 |
| Captions / meta | 1.45–1.6 |

---

## 4. LAYOUT & SPACING

### Content Width System

The layout uses fluid max-widths, not fixed breakpoints alone.

```css
/* Full-bleed header/section wrapper */
max-width: calc(380px + 50vw);
margin: 0 auto;
padding: 28px 32px;  /* desktop */
padding: 14px 16px;  /* mobile  */
padding: 22px 24px;  /* tablet  */
```

### Breakpoints

| Name | Range |
|---|---|
| Mobile | `< 640px` |
| Tablet | `640px – 900px` |
| Desktop | `> 900px` |

### Section Spacing

| Element | Margin-top |
|---|---|
| Between major sections | 56–64px |
| Hero CTA below mosaic | 32px |
| In-section sub-elements | 10–24px |
| Footer spacer | 80px |

---

## 5. BORDER RADIUS SYSTEM **[UPDATED]**

| Component | Radius | Notes |
|---|---|---|
| Primary CTA button (`.btn-apply`) | **8px** | Updated from 14px |
| Gradient border cards | `inherit` | Radius set on parent, pseudo inherits |
| Section cards / mosaic panels | 16–20px | Unchanged |
| Mobile mosaic | 16px | Unchanged |
| Speaker cards | 16px | Unchanged |
| Speaker modal | 20px | Unchanged |
| Recap / sponsor image block | 16px | Unchanged |
| Brand marquee container | 14px | Unchanged |
| Marquee item images | 14px (mobile: 8px) | Unchanged |
| Pill badges / social buttons | 10px | Unchanged |
| Value pills | 100px (full pill) | Unchanged |
| Mute button / icon buttons | 50% (circle) | Unchanged |
| Luma embed container | 8px | Unchanged |
| Dashed accent border | **12px** | **[NEW]** |
| Dot-live indicator | **9999px** | **[NEW]** — full circle |

---

## 6. COMPONENT SPECIFICATIONS

### 6.1 Header / LogoMark

- Logo image + name + tagline, inline flex, 12px gap
- Tagline color: `#ff7ac3` (pink), 13px (mobile) / 15px (desktop)
- No background; transparent header over dark page

---

### 6.2 Hero Mosaic

**Desktop:**
- Single full-width panel with skyline image, `480px` tall, `border-radius: 20px`
- Right-side 2×2 grid overlay (44% width) with 3 photo cards + caption badges
- Left overlay: text gradient (dark left → transparent right)
- Location text: white, 15px, 700 weight, glowing text-shadow

**Tablet:**
- Same layout, height `360px`, right grid 50% width, radius 16px

**Mobile:**
- Stacked: full-width skyline (`230px`) + 3-column photo row (`112px` each), `7px` gap
- Photo row: `border: 1.5px solid rgba(255,122,195,0.45)`
- Box shadow: `0 4px 20px rgba(128,97,255,0.18)`

**Caption Badge:**
- Position: absolute, `bottom: 11px`, `left: 11px`
- Font: 11px, 500 weight, `rgba(255,255,255,0.92)`
- Text shadow: `0 1px 10px rgba(128,97,255,0.9), 0 0 18px rgba(255,51,188,0.45)`
- Background: blurred radial gradient underneath — not a chip

---

### 6.3 Hero CTA Section

- Centered text, `margin-top: 32px`
- H1: white `#ffffff` on dark background **[UPDATED from dark text on light]**
- Date/venue: dim white (`rgba(255,255,255,0.55)`), 13–15px
- Value prop paragraph: max-width 340px (mobile) / 1040px (desktop)
- Key phrase: violet `#8061ff`, 700 weight, inline

**Primary CTA Button** (uses `.btn-apply`):
- Full-width block, `padding: 14px 24px`
- Gradient: `linear-gradient(90deg, #ff33bc, #8061ff)` **[UPDATED — 90deg]**
- Border-radius: `8px` **[UPDATED from 14px]**
- Font: 15px, 700, `0.04em` tracking
- Hover: `opacity: 0.9` + `translateY(-1px)` **[UPDATED — no scale, no shadow change]**
- Transition: `opacity 0.2s ease, transform 0.2s ease`

---

### 6.4 Section Label — `.pill-label` **[UPDATED]**

The old centered violet text label is replaced with this class:

```css
.pill-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff7ac3;         /* pink */
}
.pill-label::before {
  content: "";
  display: block;
  width: 20px;
  height: 1px;
  background: #ff7ac3;   /* pink rule */
}
```

- Color: `#ff7ac3` (pink) — was violet
- Size: 11px — was 13px
- Weight: 500 — was 700
- Tracking: 0.18em — was none
- Case: UPPERCASE — was sentence case
- Left decoration: 20×1px pink horizontal rule (via `::before`)

---

### 6.5 Gradient Border Card — `.border-gradient-pm` **[NEW]**

Use on any card that needs a 1px gradient ring:

```css
.border-gradient-pm {
  border: 1px solid transparent;
  background-clip: padding-box;
  position: relative;
}
.border-gradient-pm::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;        /* inherits from card */
  padding: 1px;
  background: linear-gradient(135deg, #ff7ac3, #ff33bc, #8061ff);
  /* mask technique renders only the 1px border area */
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}
```

**Critical:** Parent card must have `position: relative` and an explicit `border-radius`. The `::before` pseudo inherits the radius via `border-radius: inherit`.

---

### 6.6 Dashed Accent Border — `.border-dashed-accent` **[NEW]**

```css
.border-dashed-accent {
  border: 2px dashed rgba(255, 122, 195, 0.5);
  border-radius: 12px;
}
```

Use for imagery placeholders, draft sections, or any "coming soon" content block.

---

### 6.7 Live Indicator Dot — `.dot-live` **[NEW]**

```css
.dot-live {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #ff33bc;
  box-shadow: 0 0 0 0 rgba(255, 51, 188, 0.5);
  animation: dot-pulse 1.8s ease-out infinite;
}

@keyframes dot-pulse {
  0%   { box-shadow: 0 0 0 0   rgba(255, 51, 188, 0.5); }
  70%  { box-shadow: 0 0 0 9px rgba(255, 51, 188, 0);   }
  100% { box-shadow: 0 0 0 0   rgba(255, 51, 188, 0);   }
}
```

Use to indicate: live events, active status, real-time content. Do not use decoratively.

---

### 6.8 Photo Gallery (Last Happenings)

**Desktop (3-col grid):**
- Row 1: 3 equal columns, `200px` tall
- Row 2: video spans col 3 both rows; wide photo spans cols 1–2, gap `12px`

**Mobile:**
- Video: centered, 60% width, `aspect-ratio: 9/16` (portrait)
- Two photos: 2-col grid, `138px` each; wide photo: full-width, `148px`

**Video card:**
- Autoplay, muted, loop, playsInline
- Mute/unmute toggle: top-right circle `32×32px`
- `border: 1px solid rgba(255,255,255,0.3)`, `background: rgba(10,6,18,0.52)`, `backdrop-filter: blur(6px)` **[UPDATED bg to dark ink]**

---

### 6.9 Brand Marquee

Container: `height: 180px` (desktop) / `110px` (mobile), `border: 1px solid rgba(128,97,255,0.4)`

```css
animation: marquee-left 22s linear infinite;
/* translateX(0) → translateX(-50%) */
```

- Hover pauses: `animation-play-state: paused`
- Edge fade: `linear-gradient(90deg, #0a0612 0%, transparent 10%, transparent 90%, #0a0612 100%)` **[UPDATED]**

**Brand image specs:**
- `height: 140px` (desktop) / `78px` (mobile), `margin: 0 15px` / `0 8px`
- `filter: drop-shadow(0 0 18px rgba(128,97,255,.18)) drop-shadow(0 0 28px rgba(255,51,188,.12))`
- Hover: `transform: scale(1.04)`

---

### 6.10 Speaker Cards

- Size: `260×300px` (desktop) / `1fr×225px` (mobile), gap `48px` / `12px`
- Background: `rgba(128,97,255,0.08)`, Border: `1px solid rgba(128,97,255,0.4)`
- Photo: `object-position: top`
- Hover (desktop): `translateY(-4px) scale(1.015)` + shadow; eye icon fades in
- Name glow: `text-shadow: 0 1px 12px rgba(128,97,255,0.9), 0 0 28px rgba(255,51,188,0.55)`

**Decorative SVG lines (desktop only):**
- 3 curved paths: violet, magenta, pink — 1.4px stroke with Gaussian blur
- `z-index: 0`, positioned behind the card grid, 100vw wide

---

### 6.11 Speaker Modal

- `max-width: 400px`, backdrop blur `8px`, backdrop color `rgba(10,6,18,0.72)` **[UPDATED to dark]**
- Border: `1px solid rgba(128,97,255,0.4)`, shadow: `0 24px 64px rgba(128,97,255,0.3)`
- Photo: `280px` tall, `object-position: top`
- Bio: 13px, 1.8 line-height, dim white
- Dismiss: `Escape` key or backdrop click

---

### 6.12 Luma Embed (Sign-Up)

- `iframe` src: `https://lu.ma/embed/event/evt-guA9zHzcVg5vgdw/simple`
- Container: `height: 600px`, `overflow-y: auto`, scrollbar hidden
- Outer: `border-radius: 8px`, `border: 1px solid rgba(128,97,255,0.25)`

---

### 6.13 Social Connect Cards

- Two cards side-by-side (desktop) / stacked (mobile)
- Outer: `border-radius: 18px`, `border: 1px solid rgba(128,97,255,0.38)`, `background: rgba(128,97,255,0.06)`
- Hover: `translateY(-3px)`, border brightens to `rgba(255,122,195,0.55)`
- **Follow button:** `linear-gradient(90deg, #ff33bc, #8061ff)` **[UPDATED angle]**, white text
- **Community button:** transparent, `1.5px solid rgba(128,97,255,0.7)`, violet text

---

### 6.14 Value Pills

- `border-radius: 100px`, `border: 1px solid rgba(128,97,255,0.35)`, `background: rgba(128,97,255,0.07)`
- 12px, 500 weight, `padding: 8px 16px`, `gap: 7px`
- Flex wrap row, centered, `gap: 10px`

---

## 7. INTERACTIVE STATES & ANIMATIONS **[UPDATED]**

| Element | Behaviour | Notes |
|---|---|---|
| Speaker card | `translateY(-4px) scale(1.015)` + shadow | Unchanged |
| Eye icon on speaker | `opacity: 0 → 1` | Unchanged |
| CTA button (`.btn-apply`) hover | `opacity: 0.9` + `translateY(-1px)` | **[UPDATED]** — no scale |
| CTA button active | (no explicit active state defined) | **[REMOVED]** |
| Social cards | `translateY(-3px)` + border brightens | Unchanged |
| Social buttons | `opacity: 0.85` + `scale(1.03)` | Unchanged |
| Photo glow overlay | `opacity: 0.15 → 1` | Unchanged |
| Brand marquee images | `scale(1.04)` | Unchanged |
| Brand marquee track | `animation-play-state: paused` | Unchanged |
| Dot-live | Pulse glow ring, `1.8s ease-out infinite` | **[NEW]** |

**Transition durations:**
- `.btn-apply`: `opacity 0.2s ease, transform 0.2s ease` **[UPDATED — explicit properties]**
- All other elements: `0.18–0.22s ease`
- Marquee: `22s linear infinite`

---

## 8. SHADOW & GLOW SYSTEM

| Context | Value |
|---|---|
| CTA button default | `0 8px 36px rgba(128,97,255,0.38), 0 2px 0 rgba(255,122,195,0.2)` |
| CTA button hover | `0 16px 48px rgba(128,97,255,0.45), 0 2px 0 rgba(255,122,195,0.25)` |
| Speaker card hover | `0 12px 40px rgba(128,97,255,.35), 0 0 0 1.5px rgba(255,122,195,.55)` |
| Speaker modal | `0 24px 64px rgba(128,97,255,0.3), 0 0 0 1px rgba(255,122,195,0.15)` |
| Social card hover | `0 12px 40px rgba(128,97,255,0.22), 0 0 0 1px rgba(255,122,195,0.18)` |
| Photo card | `0 4px 20px rgba(128,97,255,0.2)` |
| Caption glow text | `0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)` |
| Brand image drop-shadow | `drop-shadow(0 0 18px rgba(128,97,255,.18)) drop-shadow(0 0 28px rgba(255,51,188,.12))` |
| Dot-live pulse max | `0 0 0 9px rgba(255,51,188,0)` **[NEW]** |

---

## 9. ASSETS & MEDIA

| File | Used in |
|---|---|
| `/Nex.webp` | Logo |
| `/Skyline.webp` | Hero mosaic — main background |
| `/Event Place.webp` | Hero mosaic — top-right card |
| `/Food.webp` | Hero mosaic — bottom-left card |
| `/Space.webp` | Hero mosaic — bottom-right card |
| `/Recap.mp4` | Gallery — autoplay recap video |
| `/Scene 1.webp` | Gallery — "Opening night" |
| `/Scene 2.webp` | Gallery — "Casting tables" |
| `/Scene 3.webp` | Gallery — "The roster reveal" |
| `/RedBull Image.webp` | Sponsors — full-width image |
| `/Artisan Street Bakery.webp` | Brand marquee |
| `/Molberts.webp` | Brand marquee |
| `/Gardu Muti.webp` | Brand marquee |
| `/Street Pizza.webp` | Brand marquee |
| `/Street Burgers.webp` | Brand marquee |
| `/Skriveru.webp` | Brand marquee |
| `/Hedonya.webp` | Brand marquee |
| `/Speaker 1.webp` | Cindy Bokāne speaker card |
| `/Speaker 2.webp` | Armands Simsons speaker card |

---

## 10. PAGE STRUCTURE & SECTION ORDER

```
<html>  scroll-behavior: smooth
<body>  background: #0a0612 | color: #ffffff | font: Rubik | antialiased

<header>  LogoMark
<main>
  HeroMosaic         — Full-width photo grid
  HeroCTA            — H1 + date + value prop + .btn-apply
  LastHappenings     — Photo/video gallery
  Sponsors           — Red Bull image + brand marquee
  KeynoteSpeakers    — 2-card speaker grid (with modal)
  LumaForm           — Luma embed (sign-up) [id="apply"]
  SocialConnect      — Follow + Community cards
  AboutNex           — Company description paragraph
  <div 80px spacer>
```

---

## 11. EXTERNAL LINKS & INTEGRATIONS

| Integration | URL / ID |
|---|---|
| Instagram Profile | `https://www.instagram.com/nexfluence.eu` |
| Instagram Community | `https://ig.me/j/AbanIlYdHEhj6sI1` |
| Speaker 1 Instagram | `https://www.instagram.com/cindywanderlust` |
| Speaker 2 Instagram | `https://www.instagram.com/armandssimsons` |
| Luma Embed Event ID | `evt-guA9zHzcVg5vgdw` |
| Luma Embed URL | `https://lu.ma/embed/event/evt-guA9zHzcVg5vgdw/simple` |

---

## 12. ANALYTICS EVENTS (Google Analytics / gtag)

| Event Name | Trigger |
|---|---|
| `hero_cta_clicked` | "Book My Spot" button click |
| `signup_section_viewed` | Luma form scrolled into view (50% threshold) |
| `signup_section_clicked` | Click anywhere in Luma section |

---

## 13. ACCESSIBILITY & UX NOTES

- `scroll-behavior: smooth` on `<html>` — CTA scrolls to `#apply` **[NOW GLOBAL, not JS-only]**
- Mute/unmute button on video: `title` attribute for screen readers
- Speaker modal: dismissible via `Escape` key or backdrop click
- Iframe has `title="Apply to attend Creator Nexus"`
- All images have `alt` attributes
- Scrollbar hidden on Luma embed (`scrollbar-width: none`)

---

## 14. TECH STACK NOTES **[UPDATED]**

| Property | Value |
|---|---|
| **Framework** | Next.js (App Router) — `"use client"` directive |
| **Language** | TypeScript |
| **Styling** | **Tailwind CSS v4** via `@import "tailwindcss"` + `@theme` tokens **[UPDATED]** |
| **Custom CSS** | `@layer utilities` — `.pill-label`, `.btn-apply`, `.border-gradient-pm`, `.border-dashed-accent`, `.dot-live` |
| **Responsive hook** | Custom `useWindowWidth()` — listens to `window.resize` |
| **Font** | Rubik via Next.js font system → `--font-rubik` CSS variable |
| **Video** | Native HTML5 `<video>` — autoplay, muted, loop, playsInline |
| **Analytics** | `window.gtag` (Google Analytics 4) |
| **Embed** | Luma event iframe |

### Tailwind v4 Token Usage

```css
/* Define once in global CSS */
@theme {
  --color-ink:     #0a0612;
  --color-pink:    #ff7ac3;
  --color-magenta: #ff33bc;
  --color-violet:  #8061ff;
  --color-indigo:  #6a66ff;
  --font-rubik:    var(--font-rubik), sans-serif;
}

/* Use in markup as Tailwind utilities */
/* bg-ink | text-pink | border-violet | bg-magenta | text-indigo | font-rubik */
```

---

*Specification v2 — updated from Tailwind v4 global stylesheet. Always reconcile against live source before development.*