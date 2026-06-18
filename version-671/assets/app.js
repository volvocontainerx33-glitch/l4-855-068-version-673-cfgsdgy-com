(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });
    show(0);
    start();
  }

  function initCardFilter() {
    var input = document.querySelector("[data-card-search]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));
    var empty = document.querySelector("[data-no-results]");
    if (!cards.length) {
      return;
    }
    var active = "all";
    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var shown = 0;
      cards.forEach(function (card) {
        var hay = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-region"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var type = (card.getAttribute("data-type") || "").toLowerCase();
        var okText = !q || hay.indexOf(q) !== -1;
        var okType = active === "all" || type.indexOf(active.toLowerCase()) !== -1 || hay.indexOf(active.toLowerCase()) !== -1;
        var visible = okText && okType;
        card.style.display = visible ? "" : "none";
        if (visible) {
          shown += 1;
        }
      });
      if (empty) {
        empty.style.display = shown ? "none" : "block";
      }
    }
    if (input) {
      input.addEventListener("input", apply);
    }
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        active = button.getAttribute("data-filter-value") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        apply();
      });
    });
    apply();
  }

  function initSearchPage() {
    var mount = document.querySelector("[data-search-results]");
    var input = document.querySelector("[data-global-search]");
    var label = document.querySelector("[data-search-label]");
    if (!mount || !input || !Array.isArray(window.SEARCH_INDEX)) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    function card(item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + item.url + '">',
        '    <span class="poster-frame">',
        '      <img src="' + item.cover + '" alt="' + item.title + '" loading="lazy">',
        '      <span class="poster-shade"></span>',
        '      <span class="duration-badge">' + item.duration + '</span>',
        '      <span class="play-hover">▶</span>',
        '    </span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <div class="movie-meta-row">',
        '      <a class="pill" href="' + item.categoryUrl + '">' + item.category + '</a>',
        '      <span>' + item.year + '</span>',
        '      <span>' + item.region + '</span>',
        '    </div>',
        '    <h3><a href="' + item.url + '">' + item.title + '</a></h3>',
        '    <p>' + item.desc + '</p>',
        '    <div class="stat-row">',
        '      <span>★ ' + item.rating + '</span>',
        '      <span>' + item.heat + ' 热度</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join("\n");
    }
    function render() {
      var q = input.value.trim().toLowerCase();
      var rows = window.SEARCH_INDEX.filter(function (item) {
        var hay = [item.title, item.category, item.genre, item.region, item.year, item.type, item.tags, item.desc].join(" ").toLowerCase();
        return !q || hay.indexOf(q) !== -1;
      }).slice(0, 120);
      mount.innerHTML = rows.map(card).join("\n");
      if (label) {
        label.textContent = rows.length ? "为你找到相关内容" : "暂无匹配内容";
      }
    }
    input.addEventListener("input", render);
    render();
  }

  ready(function () {
    initMenu();
    initHero();
    initCardFilter();
    initSearchPage();
  });
})();

function initMoviePlayer(videoId, streamUrl) {
  var video = document.getElementById(videoId);
  if (!video) {
    return;
  }
  var container = video.closest(".player-card");
  var overlay = container ? container.querySelector("[data-player-overlay]") : null;
  var attached = false;
  function attach() {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }
  function play() {
    attach();
    if (overlay) {
      overlay.classList.add("hidden");
    }
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }
  if (overlay) {
    overlay.addEventListener("click", play);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
