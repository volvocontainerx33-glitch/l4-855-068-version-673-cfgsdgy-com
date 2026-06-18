(function () {
  var players = document.querySelectorAll('[data-player]');

  function activatePlayer(player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      return;
    }

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;

    if (!video.getAttribute('src') && !player.hlsAttached) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.setAttribute('src', stream);
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
        player.hlsAttached = true;
        player.hlsInstance = hls;
      } else {
        video.setAttribute('src', stream);
      }
    }

    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  players.forEach(function (player) {
    var cover = player.querySelector('.player-cover');
    var startButton = player.querySelector('.player-start');
    var video = player.querySelector('video');

    if (cover) {
      cover.addEventListener('click', function () {
        activatePlayer(player);
      });
    }

    if (startButton) {
      startButton.addEventListener('click', function (event) {
        event.stopPropagation();
        activatePlayer(player);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!video.getAttribute('src') && !player.hlsAttached) {
          activatePlayer(player);
        } else if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }
  });
})();
