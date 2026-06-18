(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function card(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster" href="' + escapeHtml(item.url) + '">',
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="score">' + escapeHtml(item.rating) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>',
      '<p>' + escapeHtml(item.one) + '</p>',
      '<div class="meta-row">',
      '<span>' + escapeHtml(item.year) + '</span>',
      '<span>' + escapeHtml(item.region) + '</span>',
      '<span>' + escapeHtml(item.type) + '</span>',
      '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function run() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim();
    var input = document.getElementById("searchPageInput");
    var target = document.getElementById("searchResults");
    var empty = document.getElementById("searchEmpty");
    if (input) {
      input.value = q;
    }
    if (!target || !window.SEARCH_INDEX) {
      return;
    }
    var lower = q.toLowerCase();
    var results = window.SEARCH_INDEX.filter(function (item) {
      if (!lower) {
        return true;
      }
      var text = [
        item.title,
        item.year,
        item.region,
        item.type,
        item.genre,
        (item.tags || []).join(" "),
        item.one
      ].join(" ").toLowerCase();
      return text.indexOf(lower) !== -1;
    }).slice(0, 240);

    target.innerHTML = results.map(card).join("");
    if (empty) {
      empty.classList.toggle("show", results.length === 0);
    }
  }

  if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
