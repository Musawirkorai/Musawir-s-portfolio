/* ============================================================
   Musawir Ali — Portfolio
   Theme toggle, nav, scroll reveal, marquee, blog accordion
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- THEME ---------- */

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fb" : "#070a13");

    paintGitHubCards();
  }

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  // Follow the OS only while the visitor hasn't picked a theme themselves
  var mq = window.matchMedia("(prefers-color-scheme: light)");
  var onSchemeChange = function (e) {
    var saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (err) {}
    if (!saved) root.setAttribute("data-theme", e.matches ? "light" : "dark");
    paintGitHubCards();
  };
  if (mq.addEventListener) mq.addEventListener("change", onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ---------- GITHUB STAT CARDS ---------- */
  // The cards are transparent PNGs from an external service, so their colours
  // have to be baked into the URL and re-requested whenever the theme flips.

  function paintGitHubCards() {
    var dark = currentTheme() === "dark";
    var accent = dark ? "818cf8" : "4f46e5";
    var text = dark ? "a9b4cc" : "475569";

    document.querySelectorAll("img[data-gh]").forEach(function (img) {
      var url = img
        .getAttribute("data-gh")
        .replace(/{ACCENT}/g, accent)
        .replace(/{TEXT}/g, text);

      if (img.getAttribute("src") === url) return;

      // These come from third-party services that go down from time to time.
      // Swap in a plain link rather than leaving a broken image behind.
      img.onerror = function () {
        var card = img.closest(".gh-card");
        if (card) card.classList.add("failed");
      };
      img.onload = function () {
        var card = img.closest(".gh-card");
        if (card) card.classList.remove("failed");
      };

      img.setAttribute("src", url);
    });
  }

  paintGitHubCards();

  /* ---------- NAV: scrolled state + mobile menu ---------- */

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- SCROLL: nav background, back-to-top ---------- */

  var toTop = document.getElementById("toTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 12);
    if (toTop) toTop.classList.toggle("show", y > 500);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- ACTIVE NAV LINK ---------- */

  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */

  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = Math.min(i * 70, 280) + "ms";
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(function (el) {
      revealer.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- MARQUEE ---------- */
  // Duplicate the items once so the -50% keyframe loops seamlessly.

  var track = document.getElementById("marqueeTrack");
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- BLOG ACCORDION ---------- */

  document.querySelectorAll(".blog-card__toggle").forEach(function (btn) {
    function toggle() {
      var card = btn.closest(".blog-card");
      var willOpen = !card.classList.contains("active");

      document.querySelectorAll(".blog-card").forEach(function (c) {
        c.classList.remove("active");
        var t = c.querySelector(".blog-card__toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        card.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    }

    btn.addEventListener("click", toggle);
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- FOOTER YEAR ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
