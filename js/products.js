/**
 * ARUVI FABRICS — PRODUCT RENDERING & FILTERING ENGINE
 * Generates editorial luxury product cards with strict adherence to verified data.
 */

const Products = {
  renderCard(product) {
    const isSale = product.badge === "Sale" && product.hasPrice && product.salePrice;
    
    // Price display logic
    let priceHtml = "";
    if (product.hasPrice) {
      if (isSale) {
        priceHtml = `
          <div class="flex items-baseline gap-2">
            <span class="text-base font-semibold text-[#4A1521]">₹${product.salePrice.toLocaleString('en-IN')}</span>
            <span class="text-xs text-[#9B918E] line-through">₹${product.regularPrice.toLocaleString('en-IN')}</span>
          </div>
        `;
      } else {
        priceHtml = `<span class="text-base font-semibold text-[#4A1521]">₹${product.regularPrice.toLocaleString('en-IN')}</span>`;
      }
    } else {
      priceHtml = `<span class="text-xs italic text-[#6E6462] font-normal tracking-normal">Price available in store</span>`;
    }

    // Badge display logic
    let badgeHtml = "";
    if (product.badge) {
      const isRed = product.badge === "Sale";
      badgeHtml = `
        <span class="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${
          isRed ? 'bg-[#4A1521] text-white' : 'bg-[#FFFDFC]/95 text-[#4A1521] border border-[#E5DDD3]'
        }">
          ${product.badge}
        </span>
      `;
    }

    // Quick size chips
    const sizesHtml = product.sizes && product.sizes.length > 0 
      ? `<div class="text-[11px] text-[#9B918E] tracking-tight mt-1.5 truncate">Sizes: ${product.sizes.join(" · ")}</div>` 
      : "";

    return `
      <div class="group flex flex-col h-full bg-white rounded border border-[#E5DDD3]/70 hover:border-[#CFC5B8] transition-all duration-300 hover:shadow-md overflow-hidden" data-product-id="${product.id}">
        <!-- Image Area -->
        <a href="product.html?id=${product.id}" class="img-zoom-container relative aspect-[3/4] bg-[#F3ECE2] block w-full">
          ${badgeHtml}
          <img 
            src="${product.image}" 
            alt="${product.name} - Aruvi Fabrics" 
            loading="lazy" 
            class="w-full h-full object-cover object-top"
          />
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <button 
            onclick="event.preventDefault(); Cart.addItem('${product.id}', '${product.sizes[0] || 'M'}')"
            class="absolute bottom-3 left-3 right-3 py-2.5 bg-[#FFFDFC]/95 backdrop-blur-sm text-[#4A1521] text-[11px] font-semibold uppercase tracking-wider border border-[#E5DDD3] rounded opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#4A1521] hover:text-white"
            aria-label="Quick add ${product.name} to bag"
          >
            Quick Add
          </button>
        </a>

        <!-- Content Area -->
        <div class="p-4 flex flex-col flex-1 justify-between bg-white">
          <div>
            <div class="text-[11px] uppercase tracking-wider text-[#9B918E] font-medium mb-1">${product.fabric}</div>
            <h3 class="font-heading text-lg font-medium text-[#2B2625] group-hover:text-[#4A1521] transition-colors leading-snug">
              <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>
            ${sizesHtml}
          </div>
          <div class="mt-3 pt-3 border-t border-[#F3ECE2] flex items-center justify-between">
            ${priceHtml}
            <a href="product.html?id=${product.id}" class="text-xs text-[#4A1521] font-medium hover:underline flex items-center gap-1" aria-label="View details for ${product.name}">
              View
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  },

  renderGrid(containerId, productsList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!productsList || productsList.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <p class="font-heading text-2xl text-[#2B2625] mb-2">No Products Available</p>
          <p class="text-xs text-[#6E6462]">Check back soon for new arrivals or contact us on WhatsApp.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = productsList.map(p => this.renderCard(p)).join("");
  },

  initShopPage() {
    const gridId = "shopProductGrid";
    const sortSelect = document.getElementById("shopSort");
    const countEl = document.getElementById("shopProductCount");
    const fabricFilters = document.querySelectorAll("[data-filter-fabric]");
    const priceFilters = document.querySelectorAll("[data-filter-price]");

    let currentProducts = [...ARUVI_PRODUCTS];

    const applyFiltersAndSort = () => {
      let filtered = [...ARUVI_PRODUCTS];

      // Selected fabrics
      const selectedFabrics = Array.from(fabricFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      if (selectedFabrics.length > 0) {
        filtered = filtered.filter(p => selectedFabrics.includes(p.fabric));
      }

      // Selected price ranges
      const selectedPrices = Array.from(priceFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      if (selectedPrices.length > 0) {
        filtered = filtered.filter(p => {
          if (!p.hasPrice) return selectedPrices.includes("unpriced");
          const effPrice = p.salePrice || p.regularPrice;
          return selectedPrices.some(range => {
            if (range === "under-500") return effPrice < 500;
            if (range === "500-1500") return effPrice >= 500 && effPrice <= 1500;
            if (range === "over-1500") return effPrice > 1500;
            return false;
          });
        });
      }

      // Sorting
      const sortVal = sortSelect ? sortSelect.value : "default";
      if (sortVal === "price-low") {
        filtered.sort((a, b) => {
          const pA = a.hasPrice ? (a.salePrice || a.regularPrice) : Infinity;
          const pB = b.hasPrice ? (b.salePrice || b.regularPrice) : Infinity;
          return pA - pB;
        });
      } else if (sortVal === "price-high") {
        filtered.sort((a, b) => {
          const pA = a.hasPrice ? (a.salePrice || a.regularPrice) : -Infinity;
          const pB = b.hasPrice ? (b.salePrice || b.regularPrice) : -Infinity;
          return pB - pA;
        });
      } else if (sortVal === "name-az") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (countEl) {
        countEl.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
      }

      this.renderGrid(gridId, filtered);
    };

    if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndSort);
    fabricFilters.forEach(cb => cb.addEventListener("change", applyFiltersAndSort));
    priceFilters.forEach(cb => cb.addEventListener("change", applyFiltersAndSort));

    applyFiltersAndSort();
  }
};
