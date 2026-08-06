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

    const bgVideo = document.querySelector(".hero__bg-video video");
    if (bgVideo) {
      bgVideo.classList.add("is-sizzling");
      setTimeout(() => bgVideo.classList.remove("is-sizzling"), 600);
    }

    for (let i = 0; i < 16; i++) {
      const spark = document.createElement("span");
      spark.className = "hero__spark";
      const x = 20 + Math.random() * 60;
      const y = 30 + Math.random() * 40;
      spark.style.left = `${x}%`;
      spark.style.top  = `${y}%`;
      spark.style.setProperty("--sx", `${(Math.random() - 0.5) * 80}px`);
      spark.style.setProperty("--sy", `${-30 - Math.random() * 60}px`);
      heroSparks.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    }
  }

  if (sizzleBtn) {
    sizzleBtn.addEventListener("click", createSparks);
  }

  /* ── Story sizzle effect ── */
  const storySizzleBtn = document.getElementById("story-sizzle-btn");
  const storyFigure = document.getElementById("story-figure");
  const storySparks = document.getElementById("story-sparks");

  function createStorySparks() {
    if (!storySparks || !storyFigure) return;

    storyFigure.classList.add("is-sizzling");

    for (let i = 0; i < 16; i++) {
      const spark = document.createElement("span");
      spark.className = "hero__spark";
      const x = 20 + Math.random() * 60;
      const y = 30 + Math.random() * 40;
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
      spark.style.setProperty("--sx", `${(Math.random() - 0.5) * 80}px`);
      spark.style.setProperty("--sy", `${-30 - Math.random() * 60}px`);
      storySparks.appendChild(spark);

      setTimeout(() => spark.remove(), 800);
    }

    setTimeout(() => storyFigure.classList.remove("is-sizzling"), 600);
  }

  if (storySizzleBtn) {
    storySizzleBtn.addEventListener("click", createStorySparks);
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

      // Apply live spice color to paneer pieces (unless grilled)
      if (type === "paneer" && !isGrilled && spiceRange) {
        const val = Number(spiceRange.value);
        const level = SPICE_LEVELS.find((l) => val <= l.max) || SPICE_LEVELS[SPICE_LEVELS.length - 1];
        piece.style.background = `linear-gradient(135deg, ${level.from} 20%, ${level.to} 80%)`;
      }

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

    if (spiceCube) {
      spiceCube.style.background = `linear-gradient(135deg, ${level.from}, ${level.to})`;
      spiceCube.style.boxShadow = `0 4px 16px rgba(0,0,0,0.3), 0 0 ${value * 0.3}px rgba(230, 126, 34, ${value / 200})`;
    }

    if (spiceLabel) spiceLabel.textContent = level.label;
    if (spiceRange) spiceRange.setAttribute("aria-valuenow", String(value));

    if (spiceSmoke) {
      spiceSmoke.style.opacity = value > 50 ? String((value - 50) / 50) : "0";
    }

    // Sync paneer skewer pieces to the current spice color
    document.querySelectorAll(".skewer-piece--paneer:not(.is-grilled)").forEach((piece) => {
      piece.style.background = `linear-gradient(135deg, ${level.from} 20%, ${level.to} 80%)`;
    });
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

  /* ── Spinning Tray ── */
  (function () {
    const widget = document.getElementById("tray-widget");
    if (!widget) return;

    const ring     = document.getElementById("tray-ring");
    const tabs     = Array.from(ring.querySelectorAll('[role="tab"]'));
    const panels   = tabs.map(t => document.getElementById(t.getAttribute("aria-controls")));
    const labelEl  = document.getElementById("tray-label-name");
    const STEP     = 360 / tabs.length;
    const EASE     = "cubic-bezier(0.34,0.02,0.2,1)";

    let turns   = 0;
    let current = 0;

    const names = { paneer: "Paneer", pepper: "Bell Peppers", onion: "Red Onion", spice: "Spice Marinade" };

    function getIngredient(tab) {
      return tab.id.replace("tray-tab-", "");
    }

    function paint(next) {
      tabs.forEach((t, i) => {
        const on = i === next;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
      const ing = getIngredient(tabs[next]);
      if (labelEl) labelEl.textContent = names[ing] || ing;
      current = next;
    }

    function rotateTo(t) {
      widget.style.setProperty("--tray-rot", (-t * STEP) + "deg");
      // counter-rotate each dish inner
      tabs.forEach(dish => {
        const inner = dish.querySelector(".tray__dish-inner");
        if (inner) inner.style.rotate = (t * STEP) + "deg";
      });
    }

    function select(next, focus) {
      if (next === current) return;
      let delta = next - current;
      if (delta > tabs.length / 2) delta -= tabs.length;
      if (delta < -tabs.length / 2) delta += tabs.length;
      turns += delta;
      rotateTo(turns);
      paint(next);
      if (focus) tabs[next].focus();
    }

    function settle(rawTurns) {
      turns = Math.round(rawTurns);
      rotateTo(turns);
      const n = tabs.length;
      paint(((turns % n) + n) % n);
    }

    function shift(dir) {
      select((current + dir + tabs.length) % tabs.length, false);
    }

    // Click each dish tab
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i, false));
    });

    // Spin buttons
    document.querySelectorAll("[data-tray-spin]").forEach(btn => {
      btn.addEventListener("click", () => shift(parseInt(btn.dataset.traySpin, 10)));
    });

    // Keyboard on tablist
    ring.addEventListener("keydown", e => {
      const last = tabs.length - 1;
      let next = null;
      if      (e.key === "ArrowRight" || e.key === "ArrowDown")  next = current === last ? 0 : current + 1;
      else if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    next = current === 0 ? last : current - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End")  next = last;
      else return;
      e.preventDefault();
      select(next, true);
    });

    // Drag to spin
    let dragging = false, moved = false;
    let startAngle = 0, startTurns = 0;
    let lastAngle = 0, lastTime = 0, velocity = 0;
    const DEAD = 6;

    function angleAt(e) {
      const r = widget.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    }
    function wrap(d) {
      while (d >  180) d -= 360;
      while (d < -180) d += 360;
      return d;
    }
    function shownTurns() {
      const val = widget.style.getPropertyValue("--tray-rot") || "0deg";
      return -parseFloat(val) / STEP;
    }

    widget.addEventListener("pointerdown", e => {
      if (e.button && e.button !== 0) return;
      dragging = true; moved = false;
      startAngle = lastAngle = angleAt(e);
      startTurns = shownTurns();
      lastTime = e.timeStamp; velocity = 0;
    });

    widget.addEventListener("pointermove", e => {
      if (!dragging) return;
      const a = angleAt(e);
      const d = wrap(a - startAngle);
      if (!moved && Math.abs(d * Math.PI / 180) * (widget.offsetWidth / 2) < DEAD) return;
      if (!moved) {
        moved = true;
        widget.classList.add("is-dragging");
        rotateTo(startTurns);
        widget.setPointerCapture(e.pointerId);
      }
      const dt = Math.max(1, e.timeStamp - lastTime);
      velocity = wrap(a - lastAngle) / dt;
      lastAngle = a; lastTime = e.timeStamp;
      rotateTo(startTurns - d / STEP);
      e.preventDefault();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      if (widget.hasPointerCapture && widget.hasPointerCapture(e.pointerId)) widget.releasePointerCapture(e.pointerId);
      if (!moved) return;
      widget.classList.remove("is-dragging");
      const live = startTurns - wrap(lastAngle - startAngle) / STEP;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const glide  = reduce ? 0 : Math.max(-1.5, Math.min(1.5, velocity * 80 / STEP));
      settle(live - glide);
      const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); };
      widget.addEventListener("click", swallow, true);
      setTimeout(() => widget.removeEventListener("click", swallow, true), 0);
    }

    widget.addEventListener("pointerup", endDrag);
    widget.addEventListener("pointercancel", endDrag);

    // Add to plate via panel CTA buttons
    document.querySelectorAll("[data-tray-ingredient]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ing = btn.dataset.trayIngredient;

        // reuse existing addToPlate if available
        if (typeof addToPlate === "function") {
          const fakeCard = document.querySelector(`[data-ingredient="${ing}"]`);
          if (fakeCard) addToPlate(ing, fakeCard);
        } else {
          // fallback: directly update mini plate
          const mp = document.getElementById("mini-plate-items");
          const pl = document.getElementById("plate-label");
          const emoji = { paneer: "🧀", pepper: "🫑", onion: "🧅", spice: "🌶️" };
          const nm    = { paneer: "Paneer", pepper: "Bell Pepper", onion: "Red Onion", spice: "Spice Marinade" };
          if (mp) {
            const span = document.createElement("span");
            span.className = "plate-item";
            span.textContent = emoji[ing] || "🍽️";
            span.setAttribute("aria-hidden", "true");
            mp.appendChild(span);
            mp.classList.add("has-items");
          }
          if (pl) pl.textContent = `${nm[ing]} added to your plate!`;
        }

        btn.classList.add("is-added");
        btn.textContent = "✓ Added!";
        setTimeout(() => {
          btn.classList.remove("is-added");
          btn.textContent = "🍽️ Add to plate";
        }, 1400);
      });
    });

    // Initial paint
    paint(0);
    rotateTo(0);
  })();

  /* ── Diya lamp toggle ── */
  const diyas = document.querySelectorAll(".diya");

  diyas.forEach((diya) => {
    diya.addEventListener("click", () => {
      const isLit = diya.dataset.lit === "true";
      diya.dataset.lit = isLit ? "false" : "true";
      diya.setAttribute("aria-label", isLit ? "Light this diya" : "Extinguish this diya");
    });
  });

})();
