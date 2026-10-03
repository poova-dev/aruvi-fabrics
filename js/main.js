/**
 * ARUVI FABRICS — MAIN APPLICATION INITIALIZATION
 * Global helpers, hero carousel mechanics, copyright auto-sync,
 * and WhatsApp concierge links.
 */

const App = {
  init() {
    this.setupHeroCarousel();
    this.setupNewsletter();
    this.setupWhatsAppFloatingAction();
    this.renderServiceBar();
    this.syncCurrentYear();
  },

  setupHeroCarousel() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.getElementById("heroPrevBtn");
    const nextBtn = document.getElementById("heroNextBtn");

    if (slides.length <= 1) return;

    let current = 0;
    let timer = null;

    const showSlide = (index) => {
      slides.forEach((s, idx) => {
        if (idx === index) {
          s.classList.remove("opacity-0", "pointer-events-none");
          s.classList.add("opacity-100", "pointer-events-auto");
        } else {
          s.classList.add("opacity-0", "pointer-events-none");
          s.classList.remove("opacity-100", "pointer-events-auto");
        }
      });

      dots.forEach((d, idx) => {
        if (idx === index) {
          d.classList.add("w-8", "bg-[#4A1521]");
          d.classList.remove("w-2", "bg-[#D8CEBE]");
        } else {
          d.classList.remove("w-8", "bg-[#4A1521]");
          d.classList.add("w-2", "bg-[#D8CEBE]");
        }
      });
      current = index;
    };

    const nextSlide = () => {
      const next = (current + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (current - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    const startTimer = () => {
      timer = setInterval(nextSlide, 6500);
    };

    const stopTimer = () => {
      if (timer) clearInterval(timer);
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        stopTimer();
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        stopTimer();
        prevSlide();
        startTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        stopTimer();
        showSlide(idx);
        startTimer();
      });
    });

    startTimer();
  },

  setupNewsletter() {
    const forms = document.querySelectorAll(".newsletter-form");
    forms.forEach(f => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = f.querySelector("input[type='email']");
        if (input && input.value) {
          Cart.showToast("Thank you for subscribing to Aruvi Fabrics updates!");
          input.value = "";
        }
      });
    });
  },

  setupWhatsAppFloatingAction() {
    // Configures any whatsapp button without hardcoded text
    document.querySelectorAll("[data-wa-direct]").forEach(btn => {
      btn.setAttribute("href", ARUVI_CONFIG.whatsappUrl);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    });
  },

  renderServiceBar() {
    const container = document.getElementById("trustServiceBar");
    if (!container) return;

    const icons = [
      // Secure Payment
      `<svg class="w-6 h-6 text-[#4A1521]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
      // 30 Days Return
      `<svg class="w-6 h-6 text-[#4A1521]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
      // Mon-Sat 9am-6pm
      `<svg class="w-6 h-6 text-[#4A1521]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      // Free Delivery
      `<svg class="w-6 h-6 text-[#4A1521]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`
    ];

    container.innerHTML = ARUVI_CONFIG.servicePromises.map((item, idx) => `
      <div class="flex items-center gap-4 p-4 rounded bg-white/70 border border-[#E5DDD3]/80">
        <div class="w-12 h-12 rounded-full bg-[#F3ECE2] flex items-center justify-center flex-shrink-0">
          ${icons[idx] || icons[0]}
        </div>
        <div>
          <h4 class="font-heading text-lg font-semibold text-[#2B2625] leading-snug">${item.title}</h4>
          <p class="text-xs text-[#6E6462] mt-0.5">${item.description}</p>
        </div>
      </div>
    `).join("");
  },

  syncCurrentYear() {
    document.querySelectorAll(".current-year").forEach(el => {
      el.textContent = "2026";
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
