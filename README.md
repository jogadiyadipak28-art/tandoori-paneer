# 🔥 Ember & Spice — Tandoori Paneer Tikka

A polished, interactive landing page for the **DEV Frontend Challenge: Comfort Food Edition** (Perfect Landing prompt), celebrating **Tandoori Paneer Tikka** through the fictional restaurant *Ember & Spice*.

![Tandoori Paneer Tikka](images/tandoori-paneer.png)

---

## ✨ Features

- **Hero section** with animated smoke wisps and a sizzle spark effect
- **Interactive ingredient cards** — click to add items to a mini tasting plate
- **Skewer Builder** — stack paneer, peppers, and onions, then grill them
- **Spice Dial** — a range slider that visually adjusts marinade heat level
- **Tandoor Oven** — CSS-art clay oven that roasts your built skewer
- **Recipe checklist** — tick off cooking steps with a live progress bar
- **Reservation form** with client-side validation
- **Responsive, mobile-first** navigation with a hamburger menu
- **Scroll-reveal animations** and active nav link tracking
- Respects `prefers-reduced-motion` for accessibility
- Semantic, accessible HTML — skip link, ARIA labels, proper heading hierarchy

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, grid, flexbox, keyframe animations) |
| Interactivity | Vanilla JavaScript (ES2015+, IIFE, IntersectionObserver) |
| Fonts | Google Fonts — Cormorant Garamond + Outfit |

No frameworks, no build tools — just clean vanilla web tech.

---

## 📁 Project Structure

```
tandoori-paneer/
├── index.html          # Page structure & content
├── styles.css          # All styling & animations
├── script.js           # Interactive features
└── images/
    └── tandoori-paneer.png   # Hero food photograph
```

---

## 🚀 Run Locally

Open `index.html` directly in your browser, or spin up a local server:

```bash
# Python 3
python -m http.server 8080

# Node.js (via npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## 🎮 Interactive Features Guide

| Feature | How to use |
|---------|-----------|
| Sizzle effect | Click the **Sizzle! 🔥** button on the hero image |
| Smoke on hover | Hover over the hero image |
| Tasting plate | Click any ingredient card in *The Dish* section |
| Skewer Builder | Click Paneer / Pepper / Onion, then hit **Grill It!** |
| Spice Dial | Drag the slider from Mild → Fiery |
| Tandoor Oven | Build a skewer first, then tap the clay oven |
| Recipe checklist | Click the circle buttons to check off cooking steps |
| Reservation form | Fill in name, email, party size and submit |

---

## 🎨 Design Tokens

The color palette is inspired by tandoori spice tones:

| Token | Color |
|-------|-------|
| Primary orange | `#e67e22` |
| Deep orange | `#d35400` |
| Kashmiri red | `#c0392b` |
| Herb green | `#27ae60` |
| Spice purple | `#8e44ad` |

---

## 📝 Submission

Deploy to **GitHub Pages**, CodePen, or Google Cloud Run, then embed in your DEV post with the `#frontendchallenge` tag using the *Perfect Landing* submission template.

---

## 📄 License

Built for the DEV Frontend Challenge. Free to use and adapt for learning purposes.

---

*Made with warmth and spice — © 2026 Ember & Spice*
