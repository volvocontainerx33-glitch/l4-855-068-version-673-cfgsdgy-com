(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (menuButton && panel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startTimer() {
    if (!slides.length) {
      return;
    }

    clearInterval(timer);
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  if (slides.length) {
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var resultsNode = document.getElementById('search-results');
  var summaryNode = document.getElementById('search-summary');

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function createCard(movie) {
    return [
      '<article class="movie-card compact-card">',
      '<a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="play-badge">▶</span>',
      '<span class="score-badge">' + escapeHtml(movie.rating) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h2><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>',
      '<div class="movie-meta">',
      '<span>' + escapeHtml(movie.year) + '</span>',
      '<span>' + escapeHtml(movie.region) + '</span>',
      '<span>' + escapeHtml(movie.type) + '</span>',
      '</div>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '</div>',
      '</article>'
    ].join('');
  }

  function runSearch() {
    if (!resultsNode || !window.MOVIE_SEARCH_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim().toLowerCase();

    if (!query) {
      return;
    }

    var matches = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
      return movie.searchText.indexOf(query) !== -1;
    }).slice(0, 120);

    if (summaryNode) {
      summaryNode.textContent = matches.length ? '找到 ' + matches.length + ' 条相关内容。' : '没有找到匹配内容。';
    }

    resultsNode.innerHTML = matches.length ? matches.map(createCard).join('') : '';

    var searchInputs = document.querySelectorAll('input[name="q"]');
    searchInputs.forEach(function (input) {
      input.value = params.get('q') || '';
    });
  }

  window.runMovieSearch = runSearch;
  runSearch();
  setTimeout(runSearch, 0);
})();
