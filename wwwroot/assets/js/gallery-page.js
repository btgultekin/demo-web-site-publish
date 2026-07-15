/**
 * Gallery page — Pinterest-style infinite scroll with server-side category filtering.
 */
(function () {
  "use strict";

  const section = document.getElementById("gallery-page");
  if (!section || !section.hasAttribute("data-gallery-infinite")) return;

  const masonry = document.getElementById("gallery-masonry");
  const filters = document.getElementById("gallery-filters");
  const sentinel = document.getElementById("gallery-infinite-sentinel");
  const loader = document.getElementById("gallery-infinite-loader");
  const statusWrap = document.getElementById("gallery-infinite-status");
  const endMessage = document.getElementById("gallery-infinite-end");
  const loadUrl = section.dataset.loadUrl;
  const pageSize = Number.parseInt(section.dataset.pageSize || "12", 10);

  let currentPage = 1;
  let currentCategory = "all";
  let hasMore = section.dataset.hasMore === "true";
  let isLoading = false;
  let observer = null;

  function setLoaderVisible(visible) {
    if (!loader) return;
    loader.classList.toggle("hidden", !visible);
    loader.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function setHasMore(value) {
    hasMore = value;
    section.dataset.hasMore = value ? "true" : "false";

    if (statusWrap) {
      statusWrap.classList.toggle("hidden", !value);
    }

    if (endMessage) {
      endMessage.classList.toggle("hidden", value);
    }

    if (!value && observer && sentinel) {
      observer.unobserve(sentinel);
    } else if (value && observer && sentinel) {
      observer.observe(sentinel);
    }
  }

  function setActiveFilterButton(activeButton) {
    if (!filters) return;

    filters.querySelectorAll(".gallery-filter").forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("category-filter--active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  function animateItemsIn(items) {
    items.forEach((item, index) => {
      item.classList.add("filter-item");
      item.style.setProperty("--filter-stagger", `${Math.min(index, 12) * 65}ms`);
      item.classList.add("filter-item--enter-prep");
      void item.offsetWidth;
      item.classList.remove("filter-item--enter-prep");
      item.classList.add("filter-item--enter");

      item.addEventListener(
        "animationend",
        () => item.classList.remove("filter-item--enter"),
        { once: true }
      );
    });
  }

  function buildLoadUrl(page, category) {
    const url = new URL(loadUrl, window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));

    if (category && category !== "all") {
      url.searchParams.set("category", category);
    }

    return url.toString();
  }

  async function fetchPage(page, category, replace) {
    if (isLoading) return;
    isLoading = true;
    setLoaderVisible(true);

    try {
      const response = await fetch(buildLoadUrl(page, category), {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });

      if (!response.ok) {
        throw new Error("Galeri yüklenemedi.");
      }

      const html = await response.text();
      const responseHasMore = response.headers.get("X-Has-More") === "true";

      if (replace) {
        masonry.innerHTML = html;
      } else if (html.trim()) {
        masonry.insertAdjacentHTML("beforeend", html);
      }

      const newItems = replace
        ? Array.from(masonry.querySelectorAll(".gallery-item"))
        : Array.from(
            (() => {
              const template = document.createElement("template");
              template.innerHTML = html.trim();
              return template.content.querySelectorAll(".gallery-item");
            })()
          );

      animateItemsIn(newItems);

      currentPage = page;
      setHasMore(responseHasMore && (html.trim().length > 0 || page === 1));
    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      isLoading = false;
      setLoaderVisible(false);
    }
  }

  async function resetAndLoadCategory(category) {
    currentCategory = category;
    currentPage = 1;
    setHasMore(true);

    if (endMessage) {
      endMessage.classList.add("hidden");
    }

    await fetchPage(1, category, true);

    if (masonry.querySelectorAll(".gallery-item").length === 0) {
      setHasMore(false);
      if (endMessage) {
        endMessage.textContent = "Bu kategoride görsel bulunamadı.";
        endMessage.classList.remove("hidden");
      }
    } else if (endMessage) {
      endMessage.textContent = "Tüm görseller yüklendi.";
    }
  }

  function initFilters() {
    if (!filters) return;

    filters.querySelectorAll(".gallery-filter").forEach((button) => {
      button.addEventListener("click", async () => {
        if (button.getAttribute("aria-selected") === "true" || isLoading) return;

        const category = button.dataset.filter || "all";
        setActiveFilterButton(button);
        await resetAndLoadCategory(category);
      });
    });
  }

  function initInfiniteScroll() {
    if (!sentinel || !hasMore) {
      setHasMore(hasMore);
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || !hasMore || isLoading) return;

        fetchPage(currentPage + 1, currentCategory, false);
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 }
    );

    observer.observe(sentinel);
  }

  masonry?.querySelectorAll(".gallery-item").forEach((item) => item.classList.add("filter-item"));

  initFilters();
  initInfiniteScroll();
})();
