/**
 * ARUVI FABRICS — SHOPPING CART & DRAWER LOGIC
 * Manages cart state in localStorage, calculates totals, updates badge counters,
 * and handles the interactive slide-out cart drawer.
 */

const Cart = {
  STORAGE_KEY: "aruvi_cart_v1",

  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Cart read error", e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.updateBadges();
      this.renderDrawer();
      window.dispatchEvent(new CustomEvent("aruvi:cartUpdated", { detail: { items } }));
    } catch (e) {
      console.error("Cart save error", e);
    }
  },

  addItem(productId, size = "M", quantity = 1) {
    const product = ARUVI_PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.hasPrice ? (product.salePrice || product.regularPrice) : null,
        hasPrice: product.hasPrice,
        image: product.image,
        category: product.category,
        size: size,
        quantity: quantity
      });
    }

    this.saveItems(items);
    this.showToast(`Added "${product.name}" (${size}) to your bag`);
    this.openDrawer();
    return true;
  },

  removeItem(productId, size) {
    let items = this.getItems();
    items = items.filter(item => !(item.id === productId && item.size === size));
    this.saveItems(items);
  },

  updateQuantity(productId, size, delta) {
    const items = this.getItems();
    const target = items.find(item => item.id === productId && item.size === size);
    if (!target) return;

    target.quantity += delta;
    if (target.quantity <= 0) {
      this.removeItem(productId, size);
    } else {
      this.saveItems(items);
    }
  },

  getCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotals() {
    const items = this.getItems();
    let subtotal = 0;
    let pricedItemsCount = 0;

    items.forEach(item => {
      if (item.hasPrice && item.price !== null) {
        subtotal += item.price * item.quantity;
        pricedItemsCount += item.quantity;
      }
    });

    return {
      subtotal,
      shipping: 0, // Free Delivery
      total: subtotal,
      pricedItemsCount,
      totalCount: this.getCount()
    };
  },

  updateBadges() {
    const count = this.getCount();
    document.querySelectorAll(".cart-count-badge").forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove("hidden");
        el.setAttribute("aria-label", `${count} items in bag`);
      } else {
        el.textContent = "0";
      }
    });
  },

  openDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (drawer && overlay) {
      this.renderDrawer();
      drawer.classList.remove("translate-x-full");
      overlay.classList.remove("hidden", "opacity-0");
      overlay.classList.add("opacity-100");
      document.body.classList.add("overflow-hidden");
    }
  },

  closeDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (drawer && overlay) {
      drawer.classList.add("translate-x-full");
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
      setTimeout(() => {
        overlay.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 300);
    }
  },

  renderDrawer() {
    const container = document.getElementById("cartDrawerItems");
    const footerContainer = document.getElementById("cartDrawerFooter");
    if (!container) return;

    const items = this.getItems();
    const totals = this.getTotals();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center px-4">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#4A1521]">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h4 class="font-heading text-2xl text-[#2B2625] mb-2">Your Bag is Empty</h4>
          <p class="text-xs text-[#6E6462] mb-6 max-w-xs mx-auto">Explore our authentic handloom collections and bespoke pure cotton styles.</p>
          <a href="shop.html" onclick="Cart.closeDrawer()" class="btn-primary inline-flex text-xs py-3 px-6">Explore Shop</a>
        </div>
      `;
      if (footerContainer) footerContainer.classList.add("hidden");
      return;
    }

    if (footerContainer) footerContainer.classList.remove("hidden");

    container.innerHTML = items.map(item => `
      <div class="flex gap-4 py-4 border-b border-[#E5DDD3] items-start">
        <a href="product.html?id=${item.id}" class="w-20 h-24 bg-[#F3ECE2] flex-shrink-0 overflow-hidden rounded">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300">
        </a>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <a href="product.html?id=${item.id}" class="font-heading text-base font-semibold text-[#2B2625] hover:text-[#4A1521] truncate block">${item.name}</a>
            <button onclick="Cart.removeItem('${item.id}', '${item.size}')" class="text-[#9B918E] hover:text-[#4A1521] p-1 ml-2 transition-colors" aria-label="Remove item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="text-[11px] text-[#6E6462] mt-0.5">Size: <span class="font-medium text-[#2B2625] uppercase">${item.size}</span></div>
          <div class="mt-2 text-xs font-semibold text-[#4A1521]">
            ${item.hasPrice ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : `<span class="text-[11px] font-normal text-[#6E6462] italic">Price available in store</span>`}
          </div>
          <div class="flex items-center gap-3 mt-2.5">
            <div class="inline-flex items-center border border-[#E5DDD3] rounded bg-white">
              <button onclick="Cart.updateQuantity('${item.id}', '${item.size}', -1)" class="w-6 h-6 flex items-center justify-center text-xs text-[#2B2625] hover:bg-[#F3ECE2] transition-colors" aria-label="Decrease quantity">−</button>
              <span class="w-7 text-center text-xs font-medium text-[#2B2625]">${item.quantity}</span>
              <button onclick="Cart.updateQuantity('${item.id}', '${item.size}', 1)" class="w-6 h-6 flex items-center justify-center text-xs text-[#2B2625] hover:bg-[#F3ECE2] transition-colors" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    const subtotalEl = document.getElementById("cartDrawerSubtotal");
    if (subtotalEl) {
      subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    }
  },

  showToast(message) {
    let toast = document.getElementById("aruviToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "aruviToast";
      toast.className = "fixed bottom-6 right-6 z-50 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-none";
      toast.innerHTML = `
        <div class="glass-panel-dark text-white px-5 py-3.5 rounded shadow-xl flex items-center gap-3 border border-[#E8C5C8]/30 max-w-sm">
          <svg class="w-5 h-5 text-[#E8C5C8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span id="aruviToastText" class="text-xs font-medium tracking-wide"></span>
        </div>
      `;
      document.body.appendChild(toast);
    }

    const textEl = document.getElementById("aruviToastText");
    if (textEl) textEl.textContent = message;

    toast.classList.remove("translate-y-10", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.add("translate-y-10", "opacity-0");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 3200);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Cart.updateBadges();

  const cartButtons = document.querySelectorAll("[data-cart-trigger]");
  cartButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Cart.openDrawer();
    });
  });

  const closeBtn = document.getElementById("closeCartDrawer");
  if (closeBtn) closeBtn.addEventListener("click", () => Cart.closeDrawer());

  const overlay = document.getElementById("cartOverlay");
  if (overlay) overlay.addEventListener("click", () => Cart.closeDrawer());
});
