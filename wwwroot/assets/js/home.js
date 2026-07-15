document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
  initBeforeAfter();
  initTestimonials();
  initGalleryFilter();
  initFaqAccordion();
  initScrollReveal();
});

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");

  if (!slides.length) return;

  let current = 0;
  let autoplayTimer;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === current;
      slide.classList.toggle("opacity-100", isActive);
      slide.classList.toggle("z-10", isActive);
      slide.classList.toggle("opacity-0", !isActive);
      slide.classList.toggle("z-0", !isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle("w-8", isActive);
      dot.classList.toggle("bg-rose-salon-400", isActive);
      dot.classList.toggle("w-2.5", !isActive);
      dot.classList.toggle("bg-white/50", !isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 6000);
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.slideTo));
      startAutoplay();
    });
  });

  prevBtn?.addEventListener("click", () => { prev(); startAutoplay(); });
  nextBtn?.addEventListener("click", () => { next(); startAutoplay(); });

  const slider = document.getElementById("hero-slider");
  slider?.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  slider?.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

function initBeforeAfter() {
  document.querySelectorAll("[data-before-after]").forEach((card) => {
    const container = card.querySelector("[data-ba-container]");
    const afterLayer = card.querySelector(".ba-after");
    const beforeImg = card.querySelector(".ba-before");
    const handle = card.querySelector(".ba-handle");

    if (!container || !afterLayer || !beforeImg || !handle) return;

    const syncBeforeWidth = () => {
      beforeImg.style.width = `${container.offsetWidth}px`;
    };

    syncBeforeWidth();
    window.addEventListener("resize", syncBeforeWidth);

    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));
      afterLayer.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const stopDrag = () => { isDragging = false; };

    handle.addEventListener("mousedown", () => { isDragging = true; });
    handle.addEventListener("touchstart", () => { isDragging = true; }, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
  });
}

function initTestimonials() {
  const track = document.getElementById("testimonial-track");
  const viewport = track?.parentElement;
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");

  if (!track || !viewport || !slides.length) return;

  let current = 0;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    const offset = current * viewport.offsetWidth;
    track.style.transform = `translateX(-${offset}px)`;

    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle("w-8", isActive);
      dot.classList.toggle("bg-rose-salon-400", isActive);
      dot.classList.toggle("w-2.5", !isActive);
      dot.classList.toggle("bg-beige-300", !isActive);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.testimonialTo)));
  });

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  window.addEventListener("resize", () => goTo(current), { passive: true });

  setInterval(() => goTo(current + 1), 8000);
}

function initGalleryFilter() {
  window.BeautySalonFilters?.initAnimatedCategoryFilter({
    containerId: "gallery-filters",
    buttonClass: "gallery-filter",
    itemsSelector: ".gallery-item",
    categoryDataset: "category"
  });
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      if (item?.classList.contains("filter-item--hidden")) return;
      const panel = item?.querySelector(".faq-panel");
      const icon = item?.querySelector(".faq-icon");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-item").forEach((other) => {
        if (other === item || other.classList.contains("filter-item--hidden")) return;
        other.classList.remove("border-rose-salon-200", "bg-white", "shadow-soft");
        other.querySelector(".faq-trigger")?.setAttribute("aria-expanded", "false");
        other.querySelector(".faq-panel")?.classList.remove("grid-rows-[1fr]", "opacity-100");
        other.querySelector(".faq-panel")?.classList.add("grid-rows-[0fr]", "opacity-0");
        other.querySelector(".faq-icon")?.classList.remove("rotate-45");
      });

      if (!isOpen) {
        item?.classList.add("border-rose-salon-200", "bg-white", "shadow-soft");
        trigger.setAttribute("aria-expanded", "true");
        panel?.classList.add("grid-rows-[1fr]", "opacity-100");
        panel?.classList.remove("grid-rows-[0fr]", "opacity-0");
        icon?.classList.add("rotate-45");
      } else {
        item?.classList.remove("border-rose-salon-200", "bg-white", "shadow-soft");
        trigger.setAttribute("aria-expanded", "false");
        panel?.classList.remove("grid-rows-[1fr]", "opacity-100");
        panel?.classList.add("grid-rows-[0fr]", "opacity-0");
        icon?.classList.remove("rotate-45");
      }
    });
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}
