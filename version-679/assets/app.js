(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");
    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("active", idx === current);
      });
    }

    function startCarousel() {
      if (timer) {
        window.clearInterval(timer);
      }
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          setSlide(current + 1);
        }, 5200);
      }
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        setSlide(idx);
        startCarousel();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        setSlide(current - 1);
        startCarousel();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        setSlide(current + 1);
        startCarousel();
      });
    }

    setSlide(0);
    startCarousel();

    var filterBars = Array.prototype.slice.call(document.querySelectorAll(".filter-bar"));
    filterBars.forEach(function (bar) {
      var scope = document.querySelector(".filter-scope");
      var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll(".movie-card")) : [];
      var input = bar.querySelector(".filter-input");
      var year = bar.querySelector(".filter-year");
      var type = bar.querySelector(".filter-type");
      var empty = document.querySelector(".empty-state");

      function applyFilters() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        var t = type ? type.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-tags") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || ""
          ].join(" ").toLowerCase();
          var okQuery = !q || text.indexOf(q) !== -1;
          var okYear = !y || (card.getAttribute("data-year") || "") === y;
          var okType = !t || (card.getAttribute("data-type") || "").indexOf(t) !== -1;
          var show = okQuery && okYear && okType;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });
    });
  });
})();
