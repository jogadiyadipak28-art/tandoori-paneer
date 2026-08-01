(function () {
  "use strict";

  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const form = document.querySelector(".visit__form");
  const formMessage = document.getElementById("form-message");
  const sections = document.querySelectorAll("section[id]");

  const MAX_SKEWER_PIECES = 10;
  const INGREDIENT_EMOJI = {
    paneer: "🧀",
    pepper: "🫑",
    onion: "🧅",
    spice: "🌶️",
  };

  let skewerItems = [];
  let isGrilled = false;

  /* ── Mobile navigation ── */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        navToggle.focus();
      }
    });
  }

  /* ── Active nav link on scroll ── */
  function setActiveNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("nav__link--active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("nav__link--active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  setActiveNavLink();

  /* ── Scroll reveal ── */
  const revealElements = document.querySelectorAll(
    ".card, .story__text, .story__visual, .play-panel, .recipe__intro, .recipe__steps, .visit__content, .visit__form, .section__header, .mini-plate"
  );

  revealElements.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* ── Hero sizzle effect ── */
  const sizzleBtn = document.getElementById("sizzle-btn");
  const heroFigure = document.getElementById("hero-figure");
  const heroSparks = document.getElementById("hero-sparks");

  function createSparks() {
    if (!heroSparks || !heroFigure) return;

    heroFigure.classList.add("is-sizzling");

    for (let i = 0; i < 16; i++) {
      const spark = document.createElement("span");
      spark.className = "hero__spark";
      const x = 20 + Math.random() * 60;
      const y = 30 + Math.random() * 40;
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
      spark.style.setProperty("--sx", `${(Math.random() - 0.5) * 80}px`);
      spark.style.setProperty("--sy", `${-30 - Math.random() * 60}px`);
      heroSparks.appendChild(spark);

      setTimeout(() => spark.remove(), 800);
    }

    setTimeout(() => heroFigure.classList.remove("is-sizzling"), 600);
  }

  if (sizzleBtn) {
    sizzleBtn.addEventListener("click", createSparks);
  }

  /* ── Interactive ingredient cards → mini plate ── */
  const interactiveCards = document.querySelectorAll(".card--interactive");
  const miniPlateItems = document.getElementById("mini-plate-items");
  const plateLabel = document.getElementById("plate-label");
  const plateItems = [];

  function addToPlate(ingredient, card) {
    interactiveCards.forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");

    if (plateItems.length >= 6) {
      plateItems.shift();
      if (miniPlateItems.firstChild) miniPlateItems.removeChild(miniPlateItems.firstChild);
    }

    plateItems.push(ingredient);

    const item = document.createElement("span");
    item.className = "plate-item";
    item.textContent = INGREDIENT_EMOJI[ingredient] || "🍽️";
    item.setAttribute("aria-hidden", "true");
    miniPlateItems.appendChild(item);
    miniPlateItems.classList.add("has-items");

    const names = { paneer: "Paneer", pepper: "Bell Pepper", onion: "Red Onion", spice: "Spice Marinade" };
    if (plateLabel) {
      plateLabel.textContent = `${names[ingredient]} added to your plate! (${plateItems.length} items)`;
    }
  }

  interactiveCards.forEach((card) => {
    const ingredient = card.dataset.ingredient;

    card.addEventListener("click", () => addToPlate(ingredient, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addToPlate(ingredient, card);
      }
    });
  });

  /* ── Skewer builder ── */
  const skewerPieces = document.getElementById("skewer-pieces");
  const skewerStatus = document.getElementById("skewer-status");
  const clearSkewerBtn = document.getElementById("clear-skewer");
  const grillSkewerBtn = document.getElementById("grill-skewer");
  const skewerEl = document.querySelector(".skewer");
  const ingredientBtns = document.querySelectorAll(".ingredient-btn");

  function renderSkewer() {
    if (!skewerPieces) return;
    skewerPieces.innerHTML = "";

    skewerItems.forEach((type) => {
      const piece = document.createElement("div");
      piece.className = `skewer-piece skewer-piece--${type}`;
      if (isGrilled) piece.classList.add("is-grilled");
      skewerPieces.appendChild(piece);
    });

    updateSkewerStatus();
  }

  function updateSkewerStatus() {
    if (!skewerStatus) return;
    const count = skewerItems.length;

    if (isGrilled) {
      skewerStatus.textContent = "🔥 Perfectly charred and ready to serve!";
    } else if (count === 0) {
      skewerStatus.textContent = "Add at least 3 pieces to grill";
    } else if (count < 3) {
      skewerStatus.textContent = `${count} piece${count > 1 ? "s" : ""} — add ${3 - count} more to grill`;
    } else {
      skewerStatus.textContent = `${count} pieces stacked — ready to grill!`;
    }
  }

  function addSkewerPiece(type) {
    if (skewerItems.length >= MAX_SKEWER_PIECES) {
      if (skewerStatus) skewerStatus.textContent = "Skewer is full! Grill or clear to start over.";
      return;
    }
    isGrilled = false;
    skewerItems.push(type);
    renderSkewer();
  }

  ingredientBtns.forEach((btn) => {
    btn.addEventListener("click", () => addSkewerPiece(btn.dataset.piece));
  });

  if (clearSkewerBtn) {
    clearSkewerBtn.addEventListener("click", () => {
      skewerItems = [];
      isGrilled = false;
      renderSkewer();
      if (skewerEl) skewerEl.classList.remove("is-grilling");
    });
  }

  if (grillSkewerBtn) {
    grillSkewerBtn.addEventListener("click", () => {
      if (skewerItems.length < 3) {
        if (skewerStatus) skewerStatus.textContent = "Need at least 3 pieces before grilling!";
        return;
      }

      if (skewerEl) {
        skewerEl.classList.add("is-grilling");
        setTimeout(() => skewerEl.classList.remove("is-grilling"), 1800);
      }

      setTimeout(() => {
        isGrilled = true;
        renderSkewer();
      }, 900);
    });
  }

  /* ── Spice slider ── */
  const spiceRange = document.getElementById("spice-range");
  const spiceCube = document.getElementById("spice-cube");
  const spiceLabel = document.getElementById("spice-label");
  const spiceSmoke = document.getElementById("spice-smoke");

  const SPICE_LEVELS = [
    { max: 20, label: "Mild & Creamy", from: "#f5deb3", to: "#f0c987" },
    { max: 40, label: "Comfort Spice", from: "#f0c987", to: "#e8a855" },
    { max: 60, label: "Medium Heat", from: "#e8a855", to: "#e67e22" },
    { max: 80, label: "Bold & Smoky", from: "#e67e22", to: "#d35400" },
    { max: 100, label: "Fiery Tandoori!", from: "#d35400", to: "#c0392b" },
  ];

  function updateSpice(value) {
    const level = SPICE_LEVELS.find((l) => value <= l.max) || SPICE_LEVELS[SPICE_LEVELS.length - 1];
    const t = (value % 20) / 20 || (value === 100 ? 1 : 0.5);

    if (spiceCube) {
      spiceCube.style.background = `linear-gradient(135deg, ${level.from}, ${level.to})`;
      spiceCube.style.boxShadow = `0 4px 16px rgba(0,0,0,0.3), 0 0 ${value * 0.3}px rgba(230, 126, 34, ${value / 200})`;
    }

    if (spiceLabel) spiceLabel.textContent = level.label;
    if (spiceRange) spiceRange.setAttribute("aria-valuenow", String(value));

    if (spiceSmoke) {
      spiceSmoke.style.opacity = value > 50 ? String((value - 50) / 50) : "0";
    }
  }

  if (spiceRange) {
    spiceRange.addEventListener("input", (e) => updateSpice(Number(e.target.value)));
    updateSpice(Number(spiceRange.value));
  }

  /* ── Tandoor roast ── */
  const tandoorBtn = document.getElementById("tandoor-btn");
  const tandoorStatus = document.getElementById("tandoor-status");

  if (tandoorBtn) {
    tandoorBtn.addEventListener("click", () => {
      if (skewerItems.length < 3) {
        if (tandoorStatus) tandoorStatus.textContent = "Build a skewer with 3+ pieces first!";
        return;
      }

      if (tandoorBtn.classList.contains("is-roasting")) return;

      tandoorBtn.classList.add("is-roasting");
      if (tandoorStatus) tandoorStatus.textContent = "Roasting in the tandoor… 🔥";

      setTimeout(() => {
        isGrilled = true;
        renderSkewer();
        if (tandoorStatus) tandoorStatus.textContent = "✨ Roasted to perfection! Your tikka is ready.";
        tandoorBtn.classList.remove("is-roasting");
      }, 2000);
    });
  }

  /* ── Recipe step checklist ── */
  const recipeSteps = document.querySelectorAll(".recipe-step");
  const progressBar = document.getElementById("recipe-progress-bar");
  const progressText = document.getElementById("recipe-progress-text");
  let completedSteps = 0;

  function updateRecipeProgress() {
    completedSteps = document.querySelectorAll(".recipe-step.is-done").length;
    const total = recipeSteps.length;
    const pct = (completedSteps / total) * 100;

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) {
      progressText.textContent =
        completedSteps === total
          ? "🎉 All steps complete — time to eat!"
          : `${completedSteps} of ${total} steps complete`;
    }
  }

  recipeSteps.forEach((step) => {
    const check = step.querySelector(".recipe-step__check");
    if (!check) return;

    check.addEventListener("click", () => {
      step.classList.toggle("is-done");
      updateRecipeProgress();
    });
  });

  /* ── Reservation form ── */
  if (form && formMessage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const guests = form.querySelector("#guests").value;

      formMessage.className = "form-message";

      if (!name || !email || !guests) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.classList.add("form-message--error");
        return;
      }

      formMessage.textContent = `Thank you, ${name}! We'll confirm your table for ${guests} guests soon.`;
      formMessage.classList.add("form-message--success");
      form.reset();
    });
  }
})();
