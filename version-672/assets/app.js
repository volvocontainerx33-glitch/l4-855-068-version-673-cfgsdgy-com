(function () {
  var header = document.querySelector('[data-site-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var searchInput = document.querySelector('[data-search-input]');
  var searchSelect = document.querySelector('[data-search-select]');
  var searchableCards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));

  function onScroll() {
    if (!header) {
      return;
    }
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function toggleMenu() {
    if (mobileNav) {
      mobileNav.classList.toggle('is-open');
    }
  }

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function filterCards() {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var selected = searchSelect ? searchSelect.value : '';
    searchableCards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var genre = card.getAttribute('data-genre') || '';
      var year = card.getAttribute('data-year') || '';
      var region = card.getAttribute('data-region') || '';
      var matchKeyword = !keyword || title.indexOf(keyword) !== -1 || genre.toLowerCase().indexOf(keyword) !== -1 || region.toLowerCase().indexOf(keyword) !== -1;
      var matchSelected = !selected || genre.indexOf(selected) !== -1 || year === selected || region === selected;
      card.classList.toggle('hidden-card', !(matchKeyword && matchSelected));
    });
  }

  var currentSlide = 0;
  var timer = null;

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide((currentSlide + 1) % slides.length);
      }, 5200);
    });
  });

  if (slides.length > 1) {
    timer = setInterval(function () {
      showSlide((currentSlide + 1) % slides.length);
    }, 5200);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (searchSelect) {
    searchSelect.addEventListener('change', filterCards);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
