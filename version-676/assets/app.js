(function () {
  var activeClass = "is-active";

  function each(list, handler) {
    Array.prototype.forEach.call(list, handler);
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = root.querySelectorAll(".hero-slide");
    var dots = root.querySelectorAll(".hero-dot");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      each(slides, function (slide, i) {
        slide.classList.toggle(activeClass, i === index);
      });
      each(dots, function (dot, i) {
        dot.classList.toggle(activeClass, i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    each(dots, function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    show(0);
    start();
  }

  function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
  }

  function initSearch() {
    var inputs = document.querySelectorAll("[data-search-input]");
    each(inputs, function (input) {
      var scope = document.querySelector(input.getAttribute("data-search-input")) || document;
      var cards = scope.querySelectorAll("[data-card]");
      var empty = scope.querySelector("[data-empty]");
      input.addEventListener("input", function () {
        var keyword = normalize(input.value);
        var visible = 0;
        each(cards, function (card) {
          var text = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-genre"));
          var matched = !keyword || text.indexOf(keyword) !== -1;
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      });
    });
  }

  function initFilters() {
    var filters = document.querySelectorAll("[data-filter]");
    each(filters, function (filter) {
      filter.addEventListener("click", function () {
        var value = filter.getAttribute("data-filter");
        var scope = document.querySelector(filter.getAttribute("data-filter-scope")) || document;
        var cards = scope.querySelectorAll("[data-card]");
        each(filters, function (item) {
          if (item.getAttribute("data-filter-scope") === filter.getAttribute("data-filter-scope")) {
            item.classList.remove(activeClass);
          }
        });
        filter.classList.add(activeClass);
        each(cards, function (card) {
          var type = card.getAttribute("data-type") || "";
          card.style.display = value === "all" || type === value ? "" : "none";
        });
      });
    });
  }

  window.SitePlayer = {
    setup: function (videoId, coverId, source) {
      var video = document.getElementById(videoId);
      var cover = document.getElementById(coverId);
      var hlsInstance = null;
      var ready = false;
      if (!video || !cover || !source) {
        return;
      }

      function bind() {
        if (ready) {
          return;
        }
        ready = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        bind();
        cover.classList.add("is-hidden");
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      cover.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!ready) {
          play();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHero();
    initSearch();
    initFilters();
  });
})();
