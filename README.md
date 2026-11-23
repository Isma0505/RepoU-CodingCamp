# ShopKiro — Simple Online Store

A lightweight online store built with HTML5, Tailwind CSS, and vanilla JavaScript. No build tools, no frameworks — open `index.html` in a browser and it works.

---

## Preview

![ShopKiro Store](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80)

---

## Features

- **Product grid** — 12 products across 6 categories with images, badges, and descriptions
- **Category filters** — filter products by category with one click
- **Live search** — real-time filtering by product name, category, or description
- **Shopping cart** — slide-out drawer with quantity controls and item removal
- **Cart persistence** — cart is saved to `localStorage` and survives page reloads
- **Checkout flow** — order confirmation modal with item count and total
- **Toast notifications** — brief feedback messages when items are added or cart is cleared
- **Responsive layout** — mobile-first design, grid scales from 2 to 4 columns

---

## Project Structure

```
RefoU-CodingCamp/
├── index.html   # Page structure, layout, and Tailwind CDN link
├── app.js       # All JavaScript: data, cart logic, search, filters, UI
└── README.md    # This file
```

---

## Getting Started

No installation required.

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

```bash
# Optional: open directly from terminal
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

> **Note:** Tailwind CSS is loaded from the CDN, so an internet connection is needed on first load.

---

## Technologies

| Technology | Usage |
|---|---|
| HTML5 | Page structure and semantics |
| [Tailwind CSS](https://tailwindcss.com) v3 (CDN) | All styling and responsive layout |
| Vanilla JavaScript (ES6+) | Product rendering, cart logic, search, filters |
| `localStorage` | Cart persistence across sessions |

---

## Customising Products

Products are defined as an array in `app.js`. Each product has this shape:

```js
{
  id: 1,
  name: "Wireless Headphones",
  price: 79.99,
  category: "Electronics",
  badge: "Best Seller",   // "New" | "Sale" | "Best Seller" | null
  img: "https://...",     // any image URL
  desc: "Short description shown on the card."
}
```

Add, remove, or edit entries in the `PRODUCTS` array and the UI updates automatically — filters and search include the new data with no other changes needed.

---

## License

MIT — free to use and modify.
