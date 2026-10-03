# Aruvi Fabrics — Premium Fashion E-Commerce Website

An original, production-quality frontend e-commerce website for **Aruvi Fabrics**, an authentic Indian handloom and ethnic fashion boutique based in **Pattukkottai, Tamil Nadu, India**.

![Aruvi Fabrics Hero](assets/images/hero-banner-1.png)

---

## 🌟 Brand Profile & Core Coordinates

- **Brand Name:** Aruvi Fabrics
- **Location:** Pattukkottai, Tamil Nadu, India
- **Hotline / WhatsApp:** `+91 96775 96136`
- **Instagram:** [@aruvi_fabric](https://www.instagram.com/aruvi_fabric/)
- **Core Specialization:** Handcrafted pure cotton churidars, bespoke short tops, Ikkat weaves, and festive soft silks.
- **Sizing Standard:** Inclusive sizing spanning **XS to 6XL** with custom tailoring support.

---

## 🎨 Visual Identity & Design System

The design system embraces an editorial luxury aesthetic with generous whitespace, subtle micro-interactions, and a curated palette:

- **Primary Background:** `#F9F5F0` (warm ivory / linen)
- **Secondary Background:** `#FFFDFC` (pure warm white)
- **Brand Accent:** Soft blush pink (`#E8C5C8` / `#C88D94`)
- **Primary Dark:** Deep Wine / Maroon (`#4A1521` / `#380F18`)
- **Text Ink:** Warm charcoal (`#2B2625` / `#6E6462`)
- **Borders:** Soft neutral beige (`#E5DDD3`)
- **Typography:**
  - **Headings:** *Cormorant Garamond* (Google Fonts serif for luxury editorial feel)
  - **Body & UI:** *Plus Jakarta Sans* (clean modern legibility)

---

## 📂 Page Architecture (13 Semantic HTML5 Pages)

| Page | File | Description |
| :--- | :--- | :--- |
| **Home** | [`index.html`](index.html) | Announcement ticker, editorial hero carousel, service promises, categories, featured collection, and lookbook. |
| **Shop All** | [`shop.html`](shop.html) | Full catalog with real-time fabric/price filter sidebar, sort dropdown, and responsive grid. |
| **Category — Churidars** | [`category-churidars.html`](category-churidars.html) | Dedicated collection page for verified pure cotton and soft silk styles. |
| **Category — Maxi** | [`category-maxi.html`](category-maxi.html) | Graceful empty state ("New styles are coming soon") with WhatsApp launch alert trigger. |
| **Product Detail** | [`product.html`](product.html) | Multi-angle image gallery switcher, size selector, quantity counter, and WhatsApp order inquiry generator. |
| **Shopping Bag** | [`cart.html`](cart.html) | Interactive bag with quantity adjustments, subtotal calculation, free shipping reassurance, and checkout link. |
| **Checkout** | [`checkout.html`](checkout.html) | Complete order placement interface with address inputs, payment preferences, and WhatsApp dispatch coordination. |
| **About Us** | [`about.html`](about.html) | Brand heritage, Cauvery Delta weaving roots, and artisan philosophy. |
| **Contact** | [`contact.html`](contact.html) | Pattukkottai store coordinates, interactive inquiry form, and WhatsApp concierge. |
| **Size Guide** | [`size-chart.html`](size-chart.html) | Official XS–6XL measurement matrix (inches), how-to-measure guide, and original workshop asset preview. |
| **Reviews** | [`reviews.html`](reviews.html) | Authentic feedback portal with strict anti-fabrication policy and review submission form. |
| **Privacy Policy** | [`privacy.html`](privacy.html) | E-commerce data protection policy covering order details and WhatsApp communications. |
| **Returns & Exchanges** | [`returns.html`](returns.html) | Transparent 30-day exchange and return policy with reverse pickup guidelines. |

---

## 💎 Verified Inventory & Strict Data Integrity

The catalog strictly adheres to verified WooCommerce inventory without fabricated prices:

1. **Soft Silk** — Regular: ₹100 | Sale: ₹10 (`assets/images/product-soft-silk.jpg`)
2. **Cotton Short Top** — Regular: ₹1,200 | Sale: ₹1,000 (`assets/images/product-cotton-short-top-1.jpg`)
3. **Cotton Short Top (Rose Peach)** — Price available in store (`assets/images/product-cotton-short-top-2.jpg`)
4. **Cotton Short Top (Indigo Print)** — Price available in store (`assets/images/product-cotton-short-top-3.jpg`)

---

## 🛠️ Technology Stack

- **Markup:** Semantic HTML5
- **Styling:** Tailwind CSS (via official script with custom theme tokens) + Vanilla CSS (`css/styles.css`)
- **Logic:** Modular Vanilla JavaScript:
  - `js/data.js` — Master product dataset & store configuration
  - `js/cart.js` — Client-side cart manager synced with `localStorage`
  - `js/products.js` — Dynamic product card renderer & filter/sort engine
  - `js/product.js` — Product detail gallery switcher & WhatsApp link builder
  - `js/navigation.js` — Sticky header, mobile drawer menu, and live search modal
  - `js/main.js` — Hero slider rotation, service bar, and newsletter toast
- **Zero Heavy Frameworks:** No React, Vue, jQuery, or bloated external dependencies. Fast load times and 100% static hosting friendly.

---

## 🚀 Running Locally

You can serve the static files with any local HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node / npx
npx serve .
```

Open `http://localhost:8000` in your browser.

---

© 2026 Aruvi Fabrics. All rights reserved.
