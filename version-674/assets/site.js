(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0';
    });
  });

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      carousel.classList.add('ready');
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    showSlide(0);

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var searchGrid = document.querySelector('[data-search-grid]');

  if (searchGrid) {
    var input = document.querySelector('[data-search-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(searchGrid.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';

    if (input && q) {
      input.value = q;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function filterCards() {
      var keyword = normalize(input && input.value);
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region')
        ].join(' '));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var matchType = !type || normalize(card.getAttribute('data-genre')).indexOf(normalize(type)) !== -1 || normalize(card.getAttribute('data-tags')).indexOf(normalize(type)) !== -1;
        var show = matchKeyword && matchYear && matchType;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, yearSelect, typeSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', filterCards);
        element.addEventListener('change', filterCards);
      }
    });

    filterCards();
  }

  var video = document.querySelector('[data-stream]');

  if (video) {
    var playButton = document.querySelector('[data-play-overlay]');
    var stream = video.getAttribute('data-stream');
    var attached = false;
    var player = null;

    function attachStream() {
      if (attached || !stream) {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        player = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        player.loadSource(stream);
        player.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    }

    function playVideo() {
      attachStream();
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
      if (playButton) {
        playButton.classList.add('hidden');
      }
    }

    if (playButton) {
      playButton.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (playButton) {
        playButton.classList.add('hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (playButton && video.currentTime === 0) {
        playButton.classList.remove('hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (player) {
        player.destroy();
      }
    });
  }
})();
