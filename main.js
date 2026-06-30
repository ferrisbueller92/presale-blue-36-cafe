// Blue 36 Cafe — interactions
(function(){
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');

  // nav: solid after hero
  var onScroll = function(){
    if (window.scrollY > window.innerHeight * 0.7){ nav.classList.add('scrolled'); nav.classList.remove('light'); }
    else { nav.classList.remove('scrolled'); nav.classList.add('light'); }
  };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // mobile menu
  navToggle && navToggle.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
  navLinks && navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  // accordion (one open at a time, keeps it tidy)
  document.querySelectorAll('.acc-item').forEach(function(item){
    item.querySelector('.acc-head').addEventListener('click', function(){
      var open = item.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.acc-item').forEach(function(i){ i.setAttribute('aria-expanded','false'); });
      item.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  // scroll reveal
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.16, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }
})();


/* Hero video — force muted autoplay. Safari (macOS + iOS) ignores the `autoplay` attribute
   and shows a paused frame + play button. WebKit blocks play() during page load but allows
   it once the load event fires, so we kick it off then and retry; a first-interaction
   fallback covers iOS Low Power Mode / "Auto-Play: Never". */
(function () {
  var v = document.querySelector('.hero-media video, .hero video, video[autoplay], video');
  if (!v) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
  v.playsInline = true; v.setAttribute('playsinline', '');
  var play = function () { try { var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} };
  var tries = 0;
  var pump = function () { play(); if (v.paused && ++tries < 10) setTimeout(pump, 300); };
  if (document.readyState === 'complete') pump();
  else window.addEventListener('load', pump, { once: true });
  ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, play, { passive: true, once: true });
  });
})();
