# 🎙️ listen360 — Psychological Safety & Employee Wellbeing Companion

> *"Every Voice Matters. Every Concern Deserves to Be Heard."*

**listen360** is an enterprise-grade, confidential AI-powered psychological safety and employee wellbeing platform. It enables employees to report workplace concerns anonymously or named, access mental health resources, track case updates, and interact with an AI triage assistant, while providing investigators with an analytics portal for case management.

---

## 📐 Design Philosophy & Aesthetic Guidelines

listen360 follows a **high-density enterprise SaaS design system** inspired by Microsoft Fluent, Linear, Notion, and Azure Portal. To maintain absolute visual and architectural consistency during development, adhere strictly to the following principles:

1. **Compact Scale & 8px Grid Sizing**: High information density with refined padding, strict `8px` spacing increments, and crisp `52px` header height.
2. **Glassmorphism & Layering**: Floating gradient background accents with backdrop blur (`backdrop-filter: blur(12px)`), multi-layered depth, and soft ambient shadows.
3. **Dual Theme Support**: Native Light and Dark mode switching powered by CSS custom properties and `data-theme` attribute toggling on `<html>`.
4. **Accessible Micro-Animations**: Smooth count-up metrics, hover state elevations (`translateY(-2px)`), subtle float animations, and accessible focus indicators (`:focus-visible`).

---

## 🎨 Color Schema & Design Tokens

All colors, typography, borders, and shadows are centralized as CSS custom properties in [`css/style.css`](file:///c:/Users/Samaxj51/Downloads/Antigravity_Hack%20v1/css/style.css). **Do not hardcode hex/RGB values in inline styles or JS.**

### 🌟 Brand Palette

| Token Name | Light Hex / Value | Dark Hex / Value | Usage Description |
| :--- | :--- | :--- | :--- |
| `--primary-teal` | `#1F7A8C` | `#1F7A8C` | Primary brand accent, user chat bubbles, active states, key CTAs |
| `--primary-teal-dark` | `#155461` | `#155461` | Dark teal gradient stop, hover focus accents |
| `--secondary-sage` | `#A8D5BA` | `#A8D5BA` | Sage accent, background blobs, subtle highlights |
| `--secondary-sage-light` | `#E8F5E9` | `#1A2B3C` | Soft green tint for cards and success states |
| `--accent-skyblue` | `#8ECDF0` | `#8ECDF0` | Sky blue gradient accents, secondary tags, badge highlights |
| `--accent-skyblue-light`| `#E0F2FE` | `#162432` | Soft blue highlights |

### 🚦 Status & State Colors

| Status | Text / Border Token | Background Token | Usage |
| :--- | :--- | :--- | :--- |
| **Success** | `--color-success` (`#2D6A4F`) | `--color-success-bg` (`#E8F5E9`) | Resolved cases, low risk score, completed modules |
| **Warning** | `--color-warning` (`#D97706`) | `--color-warning-bg` (`#FEF3C7`) | Medium risk triage, pending review |
| **Critical** | `--color-critical` (`#E63946`) | `--color-critical-bg` (`#FEE2E2`) | Immediate safety alerts, high risk score, urgent triage |

### 🌓 Surface & Neutral Tokens

| Token | Light Theme | Dark Theme (`[data-theme="dark"]`) |
| :--- | :--- | :--- |
| `--bg-main` | `#F4F6F8` | `#0B131A` |
| `--bg-panel-left` | `#FAFCFB` | `#0F1923` |
| `--bg-panel-right` | `#FFFFFF` | `#131E2A` |
| `--bg-card` | `#FFFFFF` | `#162432` |
| `--bg-card-hover` | `#F1F5F7` | `#1C2D3E` |
| `--bg-header` | `rgba(255, 255, 255, 0.94)` | `rgba(15, 25, 35, 0.92)` |
| `--text-main` | `#111827` | `#F3F4F6` |
| `--text-muted` | `#4B5563` | `#9CA3AF` |
| `--text-dim` | `#6B7280` | `#6B7280` |
| `--border-color` | `rgba(31, 122, 140, 0.14)` | `rgba(255, 255, 255, 0.08)` |

### 📏 Radius Tokens

- `--radius-sm`: `6px` (Buttons, inputs, badges)
- `--radius-md`: `10px` (Cards, chat bubbles, policy boxes)
- `--radius-lg`: `14px` (Main panel containers, modals)
- `--radius-pill`: `9999px` (Role switchers, status pills, user badges)

---

## 🎨 Typography

- **Font Family**: Google Font [`Plus Jakarta Sans`](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (`400`, `500`, `600`, `700`, `800`)
- **Brand Emphasis (`.highlight-ten`)**: Highlights the letters `ten` in **lis<span class="highlight-ten">ten</span>360** with sky blue tint (`#0284C7`), rounded background, and teal underline.

---

## 🛠️ Icon Factory & UI Symbol Strategy

listen360 uses a lightweight **Dual Icon Strategy**:

1. **Brand SVG Vector Factory**:
   - The main logo (`.brand-logo-svg`) is rendered as an inline SVG with linear gradients (`tealGrad`, `sageGrad`), dynamic arc dashes, and dual speech bubbles representing active dialogue.
   - SVG icons should be used for brand identity, complex diagrams, and vector charts.
2. **Accessible Unicode Emoji Icons**:
   - UI navigation items, module cards, status badges, and quick actions use accessible Unicode emojis (e.g., 🏠 Home, 📜 Policy Corner, 🤝 Support, 🔎 Track Report, 🌙/☀️ Theme Toggle, 👤 Employee, 🛡️ Investigator).
   - Emojis are wrapped in aria-hidden badges or aria-labeled containers to guarantee screen-reader accessibility.

---

## 🛠️ Tech Stack & Dependencies

| Component | Technology | Details |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure (`<header>`, `<main>`, `<section>`, `<nav>`, ARIA roles) |
| **Styling** | Vanilla CSS3 | Modular CSS custom properties, flexbox/grid layouts, keyframe animations |
| **Logic & State** | Vanilla JS (ES6+) | Global modular namespaces (`App`, `ChatEngine`, `DashboardModule`, `WellbeingModule`, `AIIntelligence`) |
| **Data Viz** | Chart.js | Loaded via CDN for investigator dashboard trend charts & sentiment distribution |
| **Fonts** | Google Fonts | `Plus Jakarta Sans` |
| **Build Tooling** | None (Zero-Config) | Native browser execution; no bundlers required |

---

## 📁 Architecture & File Structure

```
Antigravity_Hack v1/
│
├── index.html              # Main Single Page Application (SPA) entry point
├── css/
│   └── style.css           # Complete Design System, Tokens, Components & Responsive Rules
│
└── js/
    ├── app.js              # Application Controller (Init, Theme Toggle, Role Switcher, Modals)
    ├── ai-intelligence.js  # Risk Scoring, Keyword Extraction & Sentiment Analysis Engine
    ├── chat.js             # Conversational AI Assistant & Interactive Reporting Triage
    ├── dashboard.js        # Investigator Analytics Portal, Case Management & Chart Rendering
    ├── data.js             # Centralized Mock Database (Policies, Learning, MHFA, Incidents)
    └── wellbeing.js        # Wellbeing Resources, MHFA Connect & Policy Modal Handler
```

---

## 🚀 Architectural Guidelines for Future Feature Development

To maintain code quality and UI consistency when adding new capabilities:

1. **Use Global Namespace Modules**:
   - Keep new logic inside distinct JavaScript objects (e.g., `NewFeatureModule`).
   - Register event listeners inside the module's `init()` function and bind lifecycle calls to `App.init()`.
2. **Respect the 50/50 Dual Panel Layout**:
   - The Employee View split consists of `.left-dashboard-panel` (50% width) for self-service & insights, and `.right-chat-panel` (50% width) for AI reporting.
   - The Investigator View toggles seamlessly via `App.switchRole('investigator')`.
3. **Modal & Dialog Pattern**:
   - Always reuse `#generalModal` and `#modalInnerContent` for overlays to preserve backdrop animations and escape key / close button behaviors.
4. **Data Centralization**:
   - Add new structured data items to `js/data.js` to decouple configuration from UI rendering logic.

---

## ❓ Developer Questions & Feedback Checklist

When extending or deploying this codebase, consider the following key questions:

- [ ] **AI Integration**: Would you like to connect the client-side `AIIntelligence` engine to a backend LLM API (e.g., OpenAI / Gemini API) via a proxy server?
- [ ] **Backend Database**: Do you plan to replace `js/data.js` with a live REST/GraphQL API or Firebase/Supabase backend for persistent incident tracking?
- [ ] **Authentication & Access Control**: Should role switching (`Employee` vs. `Investigator`) be protected with SAML / OAuth / SSO login authentication?
- [ ] **Notification System**: Would you like automated email / Slack notifications triggered when a high-risk case is submitted?

---

*Copyright © 2026 listen360 Team. Built with safety, empathy, and confidentiality.*
