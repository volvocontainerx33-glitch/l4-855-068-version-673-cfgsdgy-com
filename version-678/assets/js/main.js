(function () {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobilePanel = document.getElementById("mobilePanel");

  function updateHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      const open = mobilePanel.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.textContent = open ? "×" : "☰";
    });
  }

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const next = document.querySelector("[data-hero-next]");
  const prev = document.querySelector("[data-hero-prev]");
  let active = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === active);
    });
  }

  function restartHero() {
    if (timer) {
      clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = setInterval(function () {
        showSlide(active + 1);
      }, 5000);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const index = Number(dot.getAttribute("data-hero-dot"));
        showSlide(index);
        restartHero();
      });
    });

    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
        restartHero();
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
        restartHero();
      });
    }

    restartHero();
  }

  const filterRoot = document.querySelector("[data-filter-root]");
  const filterList = document.querySelector("[data-filter-list]");

  if (filterRoot && filterList) {
    const input = filterRoot.querySelector("[data-filter-input]");
    const region = filterRoot.querySelector("[data-filter-region]");
    const year = filterRoot.querySelector("[data-filter-year]");
    const type = filterRoot.querySelector("[data-filter-type]");
    const cards = Array.from(filterList.querySelectorAll(".movie-card"));
    const params = new URLSearchParams(window.location.search);

    if (input && params.get("q")) {
      input.value = params.get("q");
    }

    function valueOf(el) {
      return el ? el.value.trim().toLowerCase() : "";
    }

    function applyFilter() {
      const q = valueOf(input);
      const r = valueOf(region);
      const y = valueOf(year);
      const t = valueOf(type);

      cards.forEach(function (card) {
        const text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-category")
        ].join(" ").toLowerCase();
        const okText = !q || text.indexOf(q) !== -1;
        const okRegion = !r || valueOf({ value: card.getAttribute("data-region") || "" }) === r;
        const okYear = !y || valueOf({ value: card.getAttribute("data-year") || "" }) === y;
        const okType = !t || valueOf({ value: card.getAttribute("data-type") || "" }) === t;
        card.classList.toggle("is-hidden-by-filter", !(okText && okRegion && okYear && okType));
      });
    }

    [input, region, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }
})();
