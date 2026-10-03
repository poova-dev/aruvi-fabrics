/**
 * ARUVI FABRICS — NAVIGATION & GLOBAL INTERACTIVITY
 * Manages sticky header, mobile drawer menu, search modal, active states,
 * and quick modal triggers.
 */

const Navigation = {
  init() {
    this.setupStickyHeader();
    this.setupMobileMenu();
    this.setupSearch();
    this.setupActiveLinks();
    this.setupModals();
  },

  setupStickyHeader() {
    const header = document.getElementById("mainHeader");
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("shadow-sm", "border-[#E5DDD3]", "bg-[#FFFDFC]/95", "backdrop-blur-md");
        header.classList.remove("border-transparent", "bg-[#FFFDFC]");
      } else {
        header.classList.remove("shadow-sm", "border-[#E5DDD3]", "bg-[#FFFDFC]/95", "backdrop-blur-md");
        header.classList.add("border-transparent", "bg-[#FFFDFC]");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  },

  setupMobileMenu() {
    const trigger = document.getElementById("mobileMenuBtn");
    const drawer = document.getElementById("mobileMenuDrawer");
    const overlay = document.getElementById("mobileMenuOverlay");
    const closeBtn = document.getElementById("closeMobileMenuBtn");

    if (!trigger || !drawer) return;

    const openMenu = () => {
      drawer.classList.remove("-translate-x-full");
      if (overlay) {
        overlay.classList.remove("hidden", "opacity-0");
        overlay.classList.add("opacity-100");
      }
      document.body.classList.add("overflow-hidden");
      trigger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      drawer.classList.add("-translate-x-full");
      if (overlay) {
        overlay.classList.remove("opacity-100");
        overlay.classList.add("opacity-0");
        setTimeout(() => overlay.classList.add("hidden"), 300);
      }
      document.body.classList.remove("overflow-hidden");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
  },

  setupSearch() {
    const triggers = document.querySelectorAll("[data-search-trigger]");
    const modal = document.getElementById("searchModal");
    const overlay = document.getElementById("searchOverlay");
    const closeBtn = document.getElementById("closeSearchBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (!modal) return;

    const openSearch = (e) => {
      if (e) e.preventDefault();
      modal.classList.remove("hidden");
      setTimeout(() => {
        modal.classList.remove("opacity-0", "scale-95");
        modal.classList.add("opacity-100", "scale-100");
        if (searchInput) searchInput.focus();
      }, 10);
      document.body.classList.add("overflow-hidden");
    };

    const closeSearch = () => {
      modal.classList.remove("opacity-100", "scale-100");
      modal.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        if (searchInput) searchInput.value = "";
        if (searchResults) searchResults.innerHTML = "";
      }, 250);
    };

    triggers.forEach(t => t.addEventListener("click", openSearch));
    if (closeBtn) closeBtn.addEventListener("click", closeSearch);
    if (overlay) overlay.addEventListener("click", closeSearch);

    // Escape key listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeSearch();
      }
    });

    // Real-time filtering against verified catalog
    if (searchInput && searchResults) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
          searchResults.innerHTML = `
            <div class="py-8 text-center text-xs text-[#6E6462]">
              Type product name or fabric (e.g. "Soft Silk", "Cotton") to search.
            </div>
          `;
          return;
        }

        const matches = ARUVI_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          searchResults.innerHTML = `
            <div class="py-10 text-center">
              <p class="font-heading text-xl text-[#2B2625] mb-1">No products found</p>
              <p class="text-xs text-[#6E6462]">We could not find anything matching "${query}".</p>
            </div>
          `;
          return;
        }

        searchResults.innerHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
            ${matches.map(p => `
              <a href="product.html?id=${p.id}" class="flex items-center gap-3 p-2.5 rounded hover:bg-[#F3ECE2] transition-colors border border-transparent hover:border-[#E5DDD3]">
                <img src="${p.image}" alt="${p.name}" class="w-14 h-16 object-cover rounded bg-[#F3ECE2]">
                <div class="min-w-0 flex-1">
                  <h5 class="font-heading text-base font-semibold text-[#2B2625] truncate">${p.name}</h5>
                  <div class="text-[11px] text-[#6E6462]">${p.fabric} · ${p.category}</div>
                  <div class="text-xs font-semibold text-[#4A1521] mt-0.5">
                    ${p.hasPrice ? `₹${p.salePrice || p.regularPrice}` : `<span class="italic text-[11px] font-normal text-[#6E6462]">Price available in store</span>`}
                  </div>
                </div>
              </a>
            `).join("")}
          </div>
        `;
      });
    }
  },

  setupActiveLinks() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link-reveal").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active", "text-[#4A1521]", "font-semibold");
      }
    });
  },

  setupModals() {
    // Global size chart modal listeners
    const chartTriggers = document.querySelectorAll("[data-size-chart-trigger]");
    const modal = document.getElementById("sizeChartModal");
    const closeBtn = document.getElementById("closeSizeChartBtn");
    const overlay = document.getElementById("sizeChartOverlay");

    if (!modal) return;

    const openChart = (e) => {
      if (e) e.preventDefault();
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    };

    const closeChart = () => {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    };

    chartTriggers.forEach(t => t.addEventListener("click", openChart));
    if (closeBtn) closeBtn.addEventListener("click", closeChart);
    if (overlay) overlay.addEventListener("click", closeChart);
  }
};

document.addEventListener("DOMContentLoaded", () => Navigation.init());
