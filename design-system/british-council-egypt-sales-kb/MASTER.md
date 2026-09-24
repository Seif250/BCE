# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** British Council Egypt Sales KB
**Generated:** 2026-09-24 11:36:57
**Category:** General

---

## Global Rules

### Color Palette (British Council Egypt Official Brand)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#00205B` | `--color-primary` (BC Deep Navy 800) |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#00A3B5` | `--color-secondary` (BC Cyan / Teal 500) |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#00A3B5` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#F7F9FC` | `--color-background` |
| Foreground | `#0F172A` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0F172A` | `--color-card-foreground` |
| Muted | `#F1F5F9` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#E6EAF0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#00A3B5` | `--color-ring` |

**Color Notes:** British Council Official Deep Navy (`#00205B`) with Cyan/Teal (`#00A3B5`) on soft slate clean background (`#F7F9FC`). High contrast ratio (>= 7:1 for headers, >= 4.5:1 for body).

### Typography

- **English Primary:** Inter
- **Arabic Primary:** IBM Plex Sans Arabic / Cairo
- **Monospace (Numbers/Prices):** JetBrains Mono / Tabular numbers font
- **Mood:** Professional, authoritative, highly legible under live call pressure
- **Google Fonts:** [Inter + IBM Plex Sans Arabic + Cairo](https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap)

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-md` | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.06)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.08)` | Featured callouts |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #EA580C;
  border: 2px solid #EA580C;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #1C1917;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #EA580C;
  outline: none;
  box-shadow: 0 0 0 3px #EA580C20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **Conversion Strategy:** Deep CTA placement. For CTA label text, verify at least 4.5:1 against the button fill; use 7:1 only when the product explicitly targets AAA normal-text contrast. Keep focus and component boundaries independently visible. Disable hero parallax under reduced motion and render its static final state.
- **CTA Placement:** Hero (sticky) + Bottom
- **Section Order:** Hero with headline/image > Value prop > Key features (3-5) > CTA section > Footer

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
