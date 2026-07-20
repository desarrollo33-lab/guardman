/* YouTube Lite — Click-to-load embed (lite-youtube style).
   Solo se activa el iframe real cuando el usuario hace clic. */
(function () {
  function activate(el) {
    if (!el || el.querySelector('iframe')) return;
    var id = el.getAttribute('data-yt');
    if (!id) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:2';
    iframe.allow = 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';
    iframe.allowFullscreen = true;
    iframe.title = 'YouTube video';
    el.appendChild(iframe);
    el.style.cursor = 'default';
    var imgs = el.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) imgs[i].style.opacity = '0';
    var divs = el.querySelectorAll(':scope > div');
    for (var i = 0; i < divs.length; i++) divs[i].style.display = 'none';
    var spans = el.querySelectorAll(':scope > span');
    for (var i = 0; i < spans.length; i++) spans[i].style.display = 'none';
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('.yt-lite');
    if (el) activate(el);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest && e.target.closest('.yt-lite');
    if (el && document.activeElement === el) {
      e.preventDefault();
      activate(el);
    }
  });
})();