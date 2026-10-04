/**
 * ARUVI FABRICS — PRODUCT DETAIL PAGE CONTROLLER
 * Dynamic image gallery, size selector, quantity adjuster,
 * WhatsApp inquiry pre-fills, and related product recommendations.
 */

const ProductDetail = {
  selectedSize: null,
  quantity: 1,
  currentProduct: null,

  init() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "3723";
    this.currentProduct = ARUVI_PRODUCTS.find(p => String(p.id) === String(productId) || p.legacyId === productId) || ARUVI_PRODUCTS[0];

    if (!this.currentProduct) return;

    this.selectedSize = this.currentProduct.sizes[0] || "M";
    this.render();
    this.renderRelated();
  },

  render() {
    const p = this.currentProduct;

    // Document Title & Meta
    document.title = `${p.name} | Aruvi Fabrics — Handloom & Pure Cotton`;

    // Breadcrumb
    const breadcrumbName = document.getElementById("pdpBreadcrumbName");
    if (breadcrumbName) breadcrumbName.textContent = p.name;

    // Title & Fabric Category
    const titleEl = document.getElementById("pdpTitle");
    if (titleEl) titleEl.textContent = p.name;

    const fabricEl = document.getElementById("pdpFabric");
    if (fabricEl) fabricEl.textContent = `${p.fabric} · Handcrafted in ${ARUVI_CONFIG.location}`;

    // Price
    const priceContainer = document.getElementById("pdpPriceContainer");
    if (priceContainer) {
      if (p.hasPrice) {
        const isSale = p.badge === "Sale" && p.salePrice;
        if (isSale) {
          priceContainer.innerHTML = `
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-heading font-semibold text-[#4A1521]">₹${p.salePrice.toLocaleString('en-IN')}</span>
              <span class="text-base text-[#9B918E] line-through">₹${p.regularPrice.toLocaleString('en-IN')}</span>
              <span class="badge-sale ml-2">Sale</span>
            </div>
            <p class="text-[11px] text-[#6E6462] mt-1">Inclusive of all taxes · Free standard delivery across India</p>
          `;
        } else {
          priceContainer.innerHTML = `
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-heading font-semibold text-[#4A1521]">₹${p.regularPrice.toLocaleString('en-IN')}</span>
            </div>
            <p class="text-[11px] text-[#6E6462] mt-1">Inclusive of all taxes · Free standard delivery across India</p>
          `;
        }
      } else {
        priceContainer.innerHTML = `
          <div class="p-3 bg-[#F3ECE2]/80 border border-[#E5DDD3] rounded">
            <span class="text-base font-medium text-[#4A1521] italic">Price available in store</span>
            <p class="text-xs text-[#6E6462] mt-0.5">Contact our Pattukkottai store or chat with our team on WhatsApp for pricing and bespoke tailoring.</p>
          </div>
        `;
      }
    }

    // Short & Full Description
    const shortDescEl = document.getElementById("pdpShortDesc");
    if (shortDescEl) shortDescEl.textContent = p.shortDescription;

    const fullDescEl = document.getElementById("pdpFullDesc");
    if (fullDescEl) fullDescEl.textContent = p.fullDescription;

    // Details List
    const detailsContainer = document.getElementById("pdpDetailsList");
    if (detailsContainer && p.details) {
      detailsContainer.innerHTML = p.details.map(d => `
        <li class="flex items-center gap-2 text-xs text-[#4A4240]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#4A1521]"></span>
          <span>${d}</span>
        </li>
      `).join("");
    }

    // Gallery Render
    this.renderGallery(p.gallery || [p.image]);

    // Size Selector
    this.renderSizes(p.sizes || ["Free Size"]);

    // Quantity Handlers
    this.setupQuantityControls();

    // CTA Handlers
    this.setupActionButtons(p);
  },

  renderGallery(images) {
    const mainImg = document.getElementById("pdpMainImage");
    const thumbContainer = document.getElementById("pdpThumbnails");

    if (mainImg) {
      mainImg.src = images[0];
      mainImg.alt = this.currentProduct.name;
    }

    if (thumbContainer) {
      thumbContainer.innerHTML = images.map((img, idx) => `
        <button 
          onclick="ProductDetail.switchImage('${img}', this)"
          class="aspect-[3/4] w-16 sm:w-20 rounded border-2 overflow-hidden bg-[#F3ECE2] transition-all flex-shrink-0 ${idx === 0 ? 'border-[#4A1521]' : 'border-transparent hover:border-[#CFC5B8]'}"
          aria-label="View photo ${idx + 1}"
        >
          <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover">
        </button>
      `).join("");
    }
  },

  switchImage(src, btn) {
    const mainImg = document.getElementById("pdpMainImage");
    if (mainImg) {
      mainImg.style.opacity = "0.7";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
      }, 150);
    }
    const allThumbs = document.querySelectorAll("#pdpThumbnails button");
    allThumbs.forEach(t => t.classList.remove("border-[#4A1521]"));
    allThumbs.forEach(t => t.classList.add("border-transparent"));
    if (btn) {
      btn.classList.add("border-[#4A1521]");
      btn.classList.remove("border-transparent");
    }
  },

  renderSizes(sizes) {
    const container = document.getElementById("pdpSizesContainer");
    if (!container) return;

    container.innerHTML = sizes.map(size => `
      <button 
        onclick="ProductDetail.selectSize('${size}', this)"
        class="size-pill min-w-[42px] h-10 px-3.5 flex items-center justify-center text-xs uppercase tracking-wider font-semibold rounded border transition-all duration-200 ${
          size === this.selectedSize 
            ? 'bg-[#4A1521] text-white border-[#4A1521] shadow-sm' 
            : 'bg-white text-[#2B2625] border-[#E5DDD3] hover:border-[#4A1521]'
        }"
        aria-label="Select size ${size}"
      >
        ${size}
      </button>
    `).join("");
  },

  selectSize(size, btn) {
    this.selectedSize = size;
    const allPills = document.querySelectorAll(".size-pill");
    allPills.forEach(p => {
      p.className = "size-pill min-w-[42px] h-10 px-3.5 flex items-center justify-center text-xs uppercase tracking-wider font-semibold rounded border transition-all duration-200 bg-white text-[#2B2625] border-[#E5DDD3] hover:border-[#4A1521]";
    });
    if (btn) {
      btn.className = "size-pill min-w-[42px] h-10 px-3.5 flex items-center justify-center text-xs uppercase tracking-wider font-semibold rounded border transition-all duration-200 bg-[#4A1521] text-white border-[#4A1521] shadow-sm";
    }
    this.updateWhatsAppLink();
  },

  setupQuantityControls() {
    const decBtn = document.getElementById("pdpQtyDec");
    const incBtn = document.getElementById("pdpQtyInc");
    const qtyVal = document.getElementById("pdpQtyVal");

    if (decBtn && incBtn && qtyVal) {
      decBtn.onclick = () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyVal.textContent = this.quantity;
          this.updateWhatsAppLink();
        }
      };
      incBtn.onclick = () => {
        if (this.quantity < 10) {
          this.quantity++;
          qtyVal.textContent = this.quantity;
          this.updateWhatsAppLink();
        }
      };
    }
  },

  setupActionButtons(p) {
    const addBtn = document.getElementById("pdpAddToCartBtn");
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.preventDefault();
        Cart.addItem(p.id, this.selectedSize, this.quantity);
      };
    }

    this.updateWhatsAppLink();
  },

  updateWhatsAppLink() {
    const waBtn = document.getElementById("pdpWhatsAppBtn");
    if (!waBtn || !this.currentProduct) return;

    const p = this.currentProduct;
    const message = encodeURIComponent(
      `Hello Aruvi Fabrics, I am interested in purchasing:\n\n*${p.name}*\nSize: ${this.selectedSize}\nQuantity: ${this.quantity}\n${p.hasPrice ? `Price: ₹${p.salePrice || p.regularPrice}` : 'Please let me know the price and availability.'}\nLink: ${window.location.href}`
    );

    waBtn.href = `https://wa.me/${ARUVI_CONFIG.whatsappNumber}?text=${message}`;
  },

  renderRelated() {
    const relatedContainer = document.getElementById("pdpRelatedGrid");
    if (!relatedContainer) return;

    const others = ARUVI_PRODUCTS.filter(p => p.id !== this.currentProduct.id);
    relatedContainer.innerHTML = others.slice(0, 3).map(p => Products.renderCard(p)).join("");
  }
};

document.addEventListener("DOMContentLoaded", () => ProductDetail.init());
