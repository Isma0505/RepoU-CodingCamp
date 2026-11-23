/* ─────────────────────────────────────────────────────────────────
   ShopKiro — app.js
   Vanilla JS: products data, cart logic, search & filter
───────────────────────────────────────────────────────────────── */

// ── PRODUCT DATA ────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "Wireless Headphones",
    price: 79.99, category: "Electronics",
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    desc: "Premium sound, 30-hr battery, foldable design."
  },
  {
    id: 2, name: "Running Sneakers",
    price: 59.99, category: "Footwear",
    badge: "Sale",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    desc: "Lightweight mesh upper with responsive cushioning."
  },
  {
    id: 3, name: "Smart Watch",
    price: 129.99, category: "Electronics",
    badge: "New",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    desc: "Health tracking, notifications, 5-day battery life."
  },
  {
    id: 4, name: "Canvas Backpack",
    price: 44.99, category: "Bags",
    badge: null,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    desc: "15L capacity, padded laptop sleeve, water-resistant."
  },
  {
    id: 5, name: "Ceramic Coffee Mug",
    price: 18.99, category: "Home",
    badge: "Sale",
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
    desc: "Hand-thrown, 12 oz, dishwasher safe."
  },
  {
    id: 6, name: "Sunglasses",
    price: 34.99, category: "Accessories",
    badge: null,
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    desc: "UV400 polarised lenses, lightweight frame."
  },
  {
    id: 7, name: "Yoga Mat",
    price: 29.99, category: "Sports",
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1601925228270-13db3a2e4494?w=400&q=80",
    desc: "6mm non-slip surface, includes carry strap."
  },
  {
    id: 8, name: "Desk Lamp",
    price: 39.99, category: "Home",
    badge: "New",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    desc: "LED, 3 colour temps, touch-dimmer, USB-C port."
  },
  {
    id: 9, name: "Leather Wallet",
    price: 24.99, category: "Accessories",
    badge: null,
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
    desc: "Full-grain leather, 6-card slots, RFID blocking."
  },
  {
    id: 10, name: "Portable Speaker",
    price: 49.99, category: "Electronics",
    badge: "Sale",
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    desc: "360° sound, IPX5 waterproof, 12-hr playtime."
  },
  {
    id: 11, name: "Linen Tote Bag",
    price: 19.99, category: "Bags",
    badge: null,
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    desc: "Eco-friendly, 100% natural linen, 20L capacity."
  },
  {
    id: 12, name: "Resistance Bands Set",
    price: 22.99, category: "Sports",
    badge: "New",
    img: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80",
    desc: "5 resistance levels, anti-snap latex, carry bag included."
  },
];

// ── STATE ────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("kiro_cart") || "[]");
let activeCategory = "All";
let searchQuery = "";

// ── DOM REFS ─────────────────────────────────────────────────────
const productGrid   = document.getElementById("product-grid");
const filterBar     = document.getElementById("filter-bar");
const noResults     = document.getElementById("no-results");
const cartDrawer    = document.getElementById("cart-drawer");
const cartOverlay   = document.getElementById("cart-overlay");
const cartItemsEl   = document.getElementById("cart-items");
const cartEmpty     = document.getElementById("cart-empty");
const cartCount     = document.getElementById("cart-count");
const cartTotal     = document.getElementById("cart-total");
const checkoutBtn   = document.getElementById("checkout-btn");
const clearCartBtn  = document.getElementById("clear-cart-btn");
const checkoutModal = document.getElementById("checkout-modal");
const modalSummary  = document.getElementById("modal-summary");
const modalClose    = document.getElementById("modal-close");
const modalBackdrop = document.getElementById("modal-backdrop");
const toastEl       = document.getElementById("toast");
const searchDesktop = document.getElementById("search-input");
const searchMobile  = document.getElementById("search-input-mobile");

// ── CATEGORIES ───────────────────────────────────────────────────
function buildFilterBar() {
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  filterBar.innerHTML = categories.map(cat => `
    <button
      data-cat="${cat}"
      class="filter-btn px-4 py-1.5 rounded-full text-sm font-medium border transition
             ${cat === activeCategory
               ? "bg-brand-600 text-white border-brand-600"
               : "bg-white text-gray-600 border-gray-200 hover:border-brand-500 hover:text-brand-600"
             }">
      ${cat}
    </button>
  `).join("");

  filterBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      buildFilterBar();
      renderProducts();
    });
  });
}

// ── PRODUCT CARDS ────────────────────────────────────────────────
function renderProducts() {
  const q = searchQuery.toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchCat  = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  productGrid.innerHTML = filtered.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `
    <div class="product-card bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <div class="overflow-hidden relative h-44 bg-gray-100">
        <img src="${p.img}" alt="${p.name}"
          class="card-img w-full h-full object-cover transition duration-300" loading="lazy" />
        ${p.badge ? `<span class="absolute top-2 left-2 bg-brand-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">${p.badge}</span>` : ""}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <span class="text-xs text-brand-500 font-medium uppercase tracking-wide">${p.category}</span>
        <h3 class="font-semibold text-gray-800 mt-0.5 leading-tight">${p.name}</h3>
        <p class="text-gray-400 text-xs mt-1 flex-1">${p.desc}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-brand-700 font-bold text-lg">$${p.price.toFixed(2)}</span>
          <button
            data-id="${p.id}"
            class="add-btn text-sm font-semibold px-3 py-1.5 rounded-lg transition
                   ${inCart ? "bg-green-100 text-green-700" : "bg-brand-600 hover:bg-brand-700 text-white"}">
            ${inCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>`;
  }).join("");

  productGrid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

// ── CART LOGIC ───────────────────────────────────────────────────
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  renderProducts();
  showToast(`${product.name} added to cart`);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  renderProducts();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  renderProducts();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();
}

function saveCart() {
  localStorage.setItem("kiro_cart", JSON.stringify(cart));
}

function updateCartUI() {
  // Count badge
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove("hidden");
    cartCount.classList.add("badge-pop");
    setTimeout(() => cartCount.classList.remove("badge-pop"), 300);
  } else {
    cartCount.classList.add("hidden");
  }

  // Total
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  // Checkout button
  checkoutBtn.disabled = cart.length === 0;

  // Items list
  if (cart.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartItemsEl.querySelectorAll(".cart-item").forEach(el => el.remove());
    return;
  }
  cartEmpty.classList.add("hidden");

  // Re-render items
  cartItemsEl.querySelectorAll(".cart-item").forEach(el => el.remove());
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item flex gap-3 items-start";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}"
        class="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm leading-tight truncate">${item.name}</p>
        <p class="text-brand-600 text-sm font-bold mt-0.5">$${item.price.toFixed(2)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button data-id="${item.id}" data-delta="-1"
            class="qty-btn w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition flex items-center justify-center">−</button>
          <span class="text-sm font-semibold w-4 text-center">${item.qty}</span>
          <button data-id="${item.id}" data-delta="1"
            class="qty-btn w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition flex items-center justify-center">+</button>
        </div>
      </div>
      <button data-id="${item.id}"
        class="remove-btn text-gray-300 hover:text-red-400 transition mt-0.5 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>`;
    cartItemsEl.appendChild(div);
  });

  cartItemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
  });
  cartItemsEl.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });
}

// ── CART DRAWER OPEN / CLOSE ─────────────────────────────────────
function openCart() {
  cartDrawer.classList.remove("translate-x-full");
  cartOverlay.classList.remove("opacity-0", "pointer-events-none");
  document.body.classList.add("overflow-hidden");
}

function closeCart() {
  cartDrawer.classList.add("translate-x-full");
  cartOverlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
}

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ── CHECKOUT ─────────────────────────────────────────────────────
checkoutBtn.addEventListener("click", () => {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  modalSummary.textContent = `${count} item${count > 1 ? "s" : ""} · $${total.toFixed(2)}`;
  closeCart();
  checkoutModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
});

function closeModal() {
  checkoutModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  clearCart();
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

// ── CLEAR CART ───────────────────────────────────────────────────
clearCartBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  clearCart();
  showToast("Cart cleared");
});

// ── SEARCH ───────────────────────────────────────────────────────
function handleSearch(e) {
  searchQuery = e.target.value.trim();
  // Keep both inputs in sync
  searchDesktop.value = searchQuery;
  searchMobile.value  = searchQuery;
  renderProducts();
}

searchDesktop.addEventListener("input", handleSearch);
searchMobile.addEventListener("input", handleSearch);

// ── TOAST ────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove("opacity-0");
  toastEl.classList.add("opacity-100");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("opacity-100");
    toastEl.classList.add("opacity-0");
  }, 2200);
}

// ── INIT ─────────────────────────────────────────────────────────
buildFilterBar();
renderProducts();
updateCartUI();
