(function () {
  window.setupPlayer = function (config) {
    var video = document.querySelector(config.video);
    var button = document.querySelector(config.button);
    var source = config.source;
    var loaded = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function hideButton() {
      button.classList.add('is-hidden');
    }

    function loadVideo() {
      if (!loaded) {
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      hideButton();
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    button.addEventListener('click', loadVideo);
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        loadVideo();
      }
    });
    video.addEventListener('play', hideButton);
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
