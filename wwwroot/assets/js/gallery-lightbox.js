/**
 * Gallery lightbox — image/video viewer with keyboard and swipe navigation.
 */
(function () {
  "use strict";

  const lightbox = document.getElementById("gallery-lightbox");
  if (!lightbox) return;

  const stage = document.getElementById("gallery-lightbox-stage");
  const imageEl = document.getElementById("gallery-lightbox-image");
  const videoEl = document.getElementById("gallery-lightbox-video");
  const titleEl = document.getElementById("gallery-lightbox-title");
  const categoryEl = document.getElementById("gallery-lightbox-category");
  const counterEl = document.getElementById("gallery-lightbox-counter");

  let currentIndex = 0;
  let activeItems = [];
  let touchStartX = 0;
  let touchDeltaX = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll(".gallery-lightbox-item")).filter(
      (item) => item.style.display !== "none" && !item.hasAttribute("hidden")
    );
  }

  function readItemData(item) {
    return {
      src: item.dataset.lightboxSrc || "",
      type: item.dataset.lightboxType || "image",
      title: item.dataset.lightboxTitle || "",
      category: item.dataset.lightboxCategory || "",
      poster: item.dataset.lightboxPoster || ""
    };
  }

  function renderSlide(index) {
    if (!activeItems.length) return;

    currentIndex = (index + activeItems.length) % activeItems.length;
    const data = readItemData(activeItems[currentIndex]);

    titleEl.textContent = data.title;
    categoryEl.textContent = data.category;
    counterEl.textContent = `${currentIndex + 1} / ${activeItems.length}`;

    if (data.type === "video") {
      imageEl.classList.add("hidden");
      videoEl.classList.remove("hidden");
      videoEl.pause();
      videoEl.src = data.src;
      videoEl.poster = data.poster;
      videoEl.load();
    } else {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.classList.add("hidden");
      imageEl.classList.remove("hidden");
      imageEl.src = data.src;
      imageEl.alt = data.title;
    }
  }

  function openLightbox(index) {
    activeItems = getVisibleItems();
    if (!activeItems.length) return;

    renderSlide(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden", "gallery-lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden", "gallery-lightbox-open");

    videoEl.pause();
    videoEl.removeAttribute("src");
    imageEl.removeAttribute("src");
  }

  function goTo(offset) {
    if (!activeItems.length) return;
    renderSlide(currentIndex + offset);
  }

  document.addEventListener("click", (event) => {
    const item = event.target.closest(".gallery-lightbox-item");
    if (!item) return;

    activeItems = getVisibleItems();
    const index = activeItems.indexOf(item);
    if (index === -1) return;

    openLightbox(index);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const item = event.target.closest(".gallery-lightbox-item");
    if (!item || document.activeElement !== item) return;

    event.preventDefault();
    activeItems = getVisibleItems();
    const index = activeItems.indexOf(item);
    if (index === -1) return;

    openLightbox(index);
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });

  lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => goTo(-1));
  lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", () => goTo(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") goTo(-1);
    if (event.key === "ArrowRight") goTo(1);
  });

  stage?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  stage?.addEventListener(
    "touchmove",
    (event) => {
      const currentX = event.changedTouches[0]?.clientX ?? 0;
      touchDeltaX = currentX - touchStartX;
    },
    { passive: true }
  );

  stage?.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 48) return;
    goTo(touchDeltaX > 0 ? -1 : 1);
  });
})();
