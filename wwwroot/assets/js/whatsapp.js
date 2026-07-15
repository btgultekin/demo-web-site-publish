/**
 * WhatsApp floating widget — CTA bubble, pulse animation, dismiss state.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "beautysalon.whatsapp-cta-dismissed-until";
  const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 saat
  const SHOW_INTERVAL_MS = 9000;
  const BUBBLE_VISIBLE_MS = 5000;
  const INITIAL_DELAY_MS = 2500;

  const MESSAGES = [
    "Bir sorunuz mu var?",
    "Merhaba! Nasıl yardımcı olabiliriz?",
    "Rezervasyon ve bilgi için hemen yazın!"
  ];

  const widget = document.getElementById("whatsapp-widget");
  const bubble = document.getElementById("whatsapp-bubble");
  const bubbleText = document.getElementById("whatsapp-bubble-text");
  const closeBtn = document.getElementById("whatsapp-bubble-close");

  if (!widget || !bubble || !bubbleText || !closeBtn) return;

  let messageIndex = 0;
  let showTimer = null;
  let hideTimer = null;
  let cycleTimer = null;
  let isBubbleVisible = false;

  /** Kullanıcı balonu kapattıysa süre dolana kadar tekrar gösterme. */
  function isDismissed() {
    const dismissedUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
    return Date.now() < dismissedUntil;
  }

  function setDismissed() {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_DURATION_MS));
    hideBubble(true);
    stopCycle();
  }

  function stopCycle() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    clearInterval(cycleTimer);
    showTimer = null;
    hideTimer = null;
    cycleTimer = null;
  }

  function showBubble() {
    if (isDismissed() || isBubbleVisible) return;

    bubbleText.textContent = MESSAGES[messageIndex];
    messageIndex = (messageIndex + 1) % MESSAGES.length;

    bubble.setAttribute("aria-hidden", "false");
    bubble.classList.remove("is-hiding");
    bubble.classList.add("is-visible");
    isBubbleVisible = true;

    hideTimer = window.setTimeout(() => hideBubble(false), BUBBLE_VISIBLE_MS);
  }

  function hideBubble(immediate) {
    if (!isBubbleVisible) return;

    clearTimeout(hideTimer);
    bubble.classList.remove("is-visible");
    bubble.classList.add("is-hiding");

    const delay = immediate ? 0 : 320;
    window.setTimeout(() => {
      bubble.classList.remove("is-hiding");
      bubble.setAttribute("aria-hidden", "true");
      isBubbleVisible = false;
    }, delay);
  }

  function startCycle() {
    if (isDismissed()) return;

    showTimer = window.setTimeout(() => {
      showBubble();
      cycleTimer = window.setInterval(showBubble, SHOW_INTERVAL_MS);
    }, INITIAL_DELAY_MS);
  }

  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDismissed();
  });

  // Sayfa görünür değilken zamanlayıcıları durdur (performans).
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCycle();
      hideBubble(true);
    } else if (!isDismissed()) {
      startCycle();
    }
  });

  startCycle();
})();
