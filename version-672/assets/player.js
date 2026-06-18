(function () {
  var video = document.querySelector('[data-player-video]');
  var mask = document.querySelector('[data-player-mask]');
  var stream = window.siteStreamUrl;
  var ready = false;
  var hls = null;

  function attachStream() {
    if (!video || !stream || ready) {
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      ready = true;
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      ready = true;
    }
  }

  function startPlay() {
    if (!video) {
      return;
    }
    attachStream();
    if (mask) {
      mask.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (mask) {
    mask.addEventListener('click', startPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlay();
      }
    });
    video.addEventListener('play', function () {
      if (mask) {
        mask.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
