function initMoviePlayer(url) {
  const video = document.getElementById("movie-player");
  const cover = document.querySelector(".player-cover");
  let hls = null;
  let ready = false;

  if (!video || !url) {
    return;
  }

  function bindVideo() {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    video.controls = true;
    ready = true;
  }

  function play() {
    bindVideo();
    if (cover) {
      cover.classList.add("is-hidden");
    }
    const result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (!ready) {
      play();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
