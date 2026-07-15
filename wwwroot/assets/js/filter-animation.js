/**
 * Animated category filter — shared by gallery, services and FAQ pages.
 */
(function () {
  "use strict";

  const EXIT_DURATION_MS = 300;
  const ENTER_DURATION_MS = 550;
  const STAGGER_MS = 65;
  const MAX_STAGGER_ITEMS = 12;

  function setActiveButton(buttons, activeButton) {
    buttons.forEach((btn) => {
      const isActive = btn === activeButton;
      btn.classList.toggle("category-filter--active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
  }

  function getCategoryValue(item, categoryDataset) {
    return item.dataset[categoryDataset] ?? "";
  }

  function isItemVisible(item) {
    return !item.classList.contains("filter-item--hidden");
  }

  function hideItem(item) {
    return new Promise((resolve) => {
      if (!isItemVisible(item)) {
        resolve();
        return;
      }

      item.classList.remove("filter-item--enter", "filter-item--enter-prep");

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        item.classList.remove("filter-item--exit");
        item.classList.add("filter-item--hidden");
        item.setAttribute("hidden", "");
        item.setAttribute("aria-hidden", "true");
        resolve();
      };

      item.classList.add("filter-item--exit");
      item.addEventListener("animationend", finish, { once: true });
      window.setTimeout(finish, EXIT_DURATION_MS + 40);
    });
  }

  function animateItemIn(item, staggerIndex) {
    item.classList.remove("filter-item--hidden", "filter-item--exit");
    item.removeAttribute("hidden");
    item.removeAttribute("aria-hidden");
    item.style.setProperty(
      "--filter-stagger",
      `${Math.min(staggerIndex, MAX_STAGGER_ITEMS) * STAGGER_MS}ms`
    );

    item.classList.remove("filter-item--enter");
    item.classList.add("filter-item--enter-prep");
    void item.offsetWidth;
    item.classList.remove("filter-item--enter-prep");
    item.classList.add("filter-item--enter");

    item.addEventListener(
      "animationend",
      () => item.classList.remove("filter-item--enter"),
      { once: true }
    );
  }

  async function applyFilter(items, category, categoryDataset) {
    const matching = [];
    const toHide = [];

    items.forEach((item) => {
      const match = category === "all" || getCategoryValue(item, categoryDataset) === category;
      if (match) {
        matching.push(item);
      } else if (isItemVisible(item)) {
        toHide.push(item);
      }
    });

    await Promise.all(toHide.map((item) => hideItem(item)));
    matching.forEach((item, index) => animateItemIn(item, index));

    const staggerDelay = Math.min(Math.max(matching.length - 1, 0), MAX_STAGGER_ITEMS) * STAGGER_MS;
    await new Promise((resolve) => window.setTimeout(resolve, ENTER_DURATION_MS + staggerDelay));
  }

  function initAnimatedCategoryFilter(options) {
    const {
      containerId,
      buttonClass,
      itemsSelector,
      categoryDataset = "category"
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = Array.from(container.querySelectorAll(`.${buttonClass}`));
    const items = Array.from(document.querySelectorAll(itemsSelector));
    if (!buttons.length || !items.length) return;

    items.forEach((item) => item.classList.add("filter-item"));

    const defaultButton =
      buttons.find((btn) => btn.getAttribute("aria-selected") === "true") ??
      buttons.find((btn) => btn.dataset.filter === "all") ??
      buttons[0];

    setActiveButton(buttons, defaultButton);

    let isAnimating = false;

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        if (isAnimating || button.getAttribute("aria-selected") === "true") return;

        isAnimating = true;
        setActiveButton(buttons, button);

        const category = button.dataset.filter ?? "all";
        await applyFilter(items, category, categoryDataset);

        isAnimating = false;
      });
    });
  }

  window.BeautySalonFilters = {
    initAnimatedCategoryFilter
  };
})();
