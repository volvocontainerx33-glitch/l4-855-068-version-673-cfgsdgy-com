document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", panel.classList.contains("is-open"));
    });
  }

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        play();
      });
    });

    show(0);
    play();
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    var target = document.querySelector(form.getAttribute("data-filter-target"));
    if (!target) {
      return;
    }
    var cards = Array.prototype.slice.call(target.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get("q");
    var keywordInput = form.querySelector("[name='keyword']");

    if (keywordInput && initialKeyword) {
      keywordInput.value = initialKeyword;
    }

    function read(name) {
      var field = form.querySelector("[name='" + name + "']");
      return field ? field.value.trim().toLowerCase() : "";
    }

    function applyFilter() {
      var keyword = read("keyword");
      var year = read("year");
      var region = read("region");
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.textContent
        ].join(" ").toLowerCase();
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && String(card.getAttribute("data-year")).toLowerCase() !== year) {
          matched = false;
        }
        if (region && String(card.getAttribute("data-region")).toLowerCase() !== region) {
          matched = false;
        }

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilter();
    });
    form.addEventListener("input", applyFilter);
    form.addEventListener("change", applyFilter);
    applyFilter();
  });
});

function initMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var playButton = document.getElementById("play-button");
  var ready = false;
  var hls = null;

  if (!video || !playButton || !source) {
    return;
  }

  function bindSource() {
    if (ready) {
      return;
    }
    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
      video.src = source;
      return;
    }

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function start() {
    bindSource();
    playButton.classList.add("is-hidden");
    video.controls = true;
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {});
    }
  }

  playButton.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", function () {
    playButton.classList.add("is-hidden");
  });
  window.addEventListener("pagehide", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
}
