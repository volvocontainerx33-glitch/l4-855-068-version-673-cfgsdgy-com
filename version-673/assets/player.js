(function () {
  function setupPlayer(frame) {
    var video = frame.querySelector('video');
    var cover = frame.querySelector('.player-cover');
    var url = frame.getAttribute('data-hls');
    var ready = false;
    var hls = null;

    if (!video || !cover || !url) {
      return;
    }

    function attach() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        return;
      }

      video.src = url;
    }

    function playVideo() {
      attach();
      frame.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    cover.addEventListener('click', playVideo);

    video.addEventListener('play', function () {
      frame.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0) {
        frame.classList.remove('is-playing');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-frame')).forEach(setupPlayer);
})();
