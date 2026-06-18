function bindMoviePlayer(videoId, layerId, source) {
  var video = document.getElementById(videoId);
  var layer = document.getElementById(layerId);
  var loaded = false;
  var hlsInstance = null;

  function loadVideo() {
    if (!video || loaded) {
      return;
    }
    loaded = true;
    video.setAttribute("controls", "controls");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    loadVideo();
    if (layer) {
      layer.classList.add("hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (layer) {
    layer.addEventListener("click", playVideo);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener("ended", function () {
      if (layer) {
        layer.classList.remove("hidden");
      }
    });
  }

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
