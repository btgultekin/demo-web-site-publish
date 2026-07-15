document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScroll();
  highlightActiveNav();
});

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("nav-close");
  const menu = document.getElementById("nav-menu");
  const overlay = document.getElementById("nav-overlay");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.add("translate-x-full");
    menu.classList.remove("translate-x-0");
    menu.setAttribute("aria-hidden", "true");
    overlay?.classList.add("opacity-0", "pointer-events-none");
    overlay?.classList.remove("opacity-100");
    overlay?.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden", "mobile-nav-open");
  };

  const openMenu = () => {
    menu.classList.remove("translate-x-full");
    menu.classList.add("translate-x-0");
    menu.setAttribute("aria-hidden", "false");
    overlay?.classList.remove("opacity-0", "pointer-events-none");
    overlay?.classList.add("opacity-100");
    overlay?.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden", "mobile-nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}

function initHeaderScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    if (document.body.classList.contains("mobile-nav-open")) return;

    if (window.scrollY > 20) {
      header.classList.add("shadow-soft", "bg-white/95");
      header.classList.remove("bg-cream-50/80", "bg-cream-50/95");
    } else {
      header.classList.remove("shadow-soft", "bg-white/95");
      header.classList.add(window.innerWidth < 1024 ? "bg-cream-50/95" : "bg-cream-50/80");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href")?.toLowerCase() ?? "";
    if (href && (currentPath === href || (href !== "/" && currentPath.startsWith(href)))) {
      link.classList.add("active");
    }
  });
}
