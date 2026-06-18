(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var header = qs('[data-site-header]');
  var mobileToggle = qs('[data-mobile-toggle]');
  var mobilePanel = qs('[data-mobile-panel]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 46) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  qsa('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });

  var hero = qs('[data-hero]');
  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

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

    startTimer();
  }

  var filterList = qs('[data-filter-list]');
  if (filterList) {
    var input = qs('[data-filter-input]');
    var yearFilter = qs('[data-year-filter]');
    var typeFilter = qs('[data-type-filter]');
    var cards = qsa('[data-movie-card]', filterList);

    function applyFilters() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var year = yearFilter ? yearFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type
        ].join(' ').toLowerCase();
        var ok = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }
        if (year && card.dataset.year !== year) {
          ok = false;
        }
        if (type && card.dataset.type !== type) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
      });
    }

    [input, yearFilter, typeFilter].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilters);
        node.addEventListener('change', applyFilters);
      }
    });
  }

  var searchResults = qs('#search-results');
  if (searchResults && window.SITE_SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var pageInput = qs('[data-search-page-input]');
    if (pageInput) {
      pageInput.value = query;
    }

    function renderSearch(value) {
      var keyword = value.trim().toLowerCase();
      if (!keyword) {
        searchResults.innerHTML = '<p class="search-empty">请输入关键词开始检索。</p>';
        return;
      }
      var matches = window.SITE_SEARCH_INDEX.filter(function (item) {
        return item.text.toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 80);
      if (!matches.length) {
        searchResults.innerHTML = '<p class="search-empty">未找到匹配内容。</p>';
        return;
      }
      searchResults.innerHTML = matches.map(function (item) {
        return [
          '<article class="movie-card compact">',
          '<a class="card-poster" href="' + item.url + '">',
          '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">',
          '<span class="poster-play">▶</span>',
          '</a>',
          '<div class="card-body">',
          '<h2 class="card-title"><a href="' + item.url + '">' + item.title + '</a></h2>',
          '<div class="card-meta"><span>' + item.year + '</span><span>' + item.region + '</span><span>' + item.type + '</span></div>',
          '<p class="card-desc">' + item.oneLine + '</p>',
          '</div>',
          '</article>'
        ].join('');
      }).join('');
    }

    renderSearch(query);
  }
})();
