document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initFaqAccordion();
  initFaqFilter();
  initGalleryFilter();
  initServiceFilter();
});

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
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
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

function initGalleryFilter() {
  if (document.getElementById("gallery-page")?.hasAttribute("data-gallery-infinite")) {
    return;
  }

  window.BeautySalonFilters?.initAnimatedCategoryFilter({
    containerId: "gallery-filters",
    buttonClass: "gallery-filter",
    itemsSelector: ".gallery-item",
    categoryDataset: "category"
  });
}

function initServiceFilter() {
  window.BeautySalonFilters?.initAnimatedCategoryFilter({
    containerId: "service-filters",
    buttonClass: "service-filter",
    itemsSelector: ".service-grid-item",
    categoryDataset: "category"
  });
}

function initFaqFilter() {
  window.BeautySalonFilters?.initAnimatedCategoryFilter({
    containerId: "faq-filters",
    buttonClass: "faq-filter",
    itemsSelector: ".faq-item",
    categoryDataset: "faqCategory"
  });
}

function initContactForm() {
  // Contact form posts to the server; no client-side mock submit.
}
