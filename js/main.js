(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    setTimeout(function () { loader.classList.add("is-hidden"); }, 500);
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var lastScrollCheck = false;
  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (scrolled !== lastScrollCheck) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrollCheck = scrolled;
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mainNav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-line");
  var gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach(function (item, i) {
    item.style.setProperty("--stagger", i % 12);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) { observer.observe(el); });

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var grid = document.getElementById("grid");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      gridItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentIndex = -1;
  var lastFocused = null;

  function visibleItems() {
    return Array.prototype.filter.call(gridItems, function (item) {
      return !item.classList.contains("is-hidden");
    });
  }

  function openLightbox(index) {
    var items = visibleItems();
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    var btn = items[index].querySelector(".grid-item-btn");
    var full = btn.getAttribute("data-full");
    var alt = btn.querySelector("img").getAttribute("alt");

    lightboxImg.classList.remove("is-loaded");
    var loader = new Image();
    loader.onload = function () { lightboxImg.classList.add("is-loaded"); };
    loader.src = full;
    lightboxImg.src = full;
    lightboxImg.alt = alt;

    lastFocused = document.activeElement;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentIndex = -1;
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    var items = visibleItems();
    if (!items.length) return;
    var next = (currentIndex + delta + items.length) % items.length;
    openLightbox(next);
  }

  gridItems.forEach(function (item) {
    var btn = item.querySelector(".grid-item-btn");
    btn.addEventListener("click", function () {
      var items = visibleItems();
      openLightbox(items.indexOf(item));
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function () { step(-1); });
  lightboxNext.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
