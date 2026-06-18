(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === activeSlide);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeSlide);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          showSlide(activeSlide + 1);
        }, 5200);
      });
    });

    timer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '');
  }

  function applySearch(input) {
    var selector = input.getAttribute('data-card-search');
    var scope = selector ? document.querySelector(selector) : document;
    if (!scope) {
      scope = document;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .small-card, .ranking-row'));
    var q = normalize(input.value);

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.textContent
      ].join(' '));

      card.classList.toggle('hidden-card', q && text.indexOf(q) === -1);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-card-search]')).forEach(function (input) {
    input.addEventListener('input', function () {
      applySearch(input);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(function (row) {
    var scope = document.querySelector(row.getAttribute('data-filter-scope'));
    if (!scope) {
      return;
    }

    var buttons = Array.prototype.slice.call(row.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter');

        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });

        cards.forEach(function (card) {
          var region = card.getAttribute('data-region') || '';
          card.classList.toggle('hidden-card', value !== 'all' && region !== value);
        });
      });
    });
  });
})();
