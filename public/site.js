/* 头大的D — site interactions (Moonshot style: static bg, reactive UI) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. scroll reveal ---------- */
  function setupReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll(
      '.now-card, .project-card, .media-item, .media-cover-card, ' +
      '.collection-category-card, .post-list-item, .page-header, .now-heading'
    );
    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. hero title typewriter ---------- */
  function typewriter(el) {
    var html = el.dataset.html;
    if (!html) {
      html = el.innerHTML;
      el.dataset.html = html;
    }
    if (reduceMotion) { el.innerHTML = html; return; }
    // split into lines so the <br> structure is preserved
    var lines = html.split(/<br\s*\/?>/i).map(function (line) {
      var tmp = document.createElement('div');
      tmp.innerHTML = line;
      return tmp.textContent.replace(/^\s+|\s+$/g, '');
    });
    el.textContent = '';
    el.classList.add('typing');
    var cursor = document.createElement('span');
    cursor.className = 'hero-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    var li = 0, ci = 0;
    var lineSpan = null;
    function nextLine() {
      lineSpan = document.createElement('span');
      el.appendChild(lineSpan);
      el.appendChild(cursor);
    }
    nextLine();
    (function tick() {
      if (li >= lines.length) {
        el.classList.remove('typing');
        return; // cursor stays blinking at the end
      }
      var text = lines[li];
      if (ci < text.length) {
        lineSpan.appendChild(document.createTextNode(text[ci]));
        el.appendChild(cursor); // keep cursor at the end
        ci++;
        setTimeout(tick, 130);
      } else {
        li++; ci = 0;
        if (li < lines.length) {
          el.appendChild(document.createElement('br'));
          nextLine();
        }
        setTimeout(tick, 320); // pause between lines
      }
    })();
  }
  function setupHero() {
    var title = document.querySelector('.hero-title');
    if (!title) return;
    typewriter(title);
    title.addEventListener('click', function () {
      if (!title.classList.contains('typing')) typewriter(title);
    });
  }

  /* ---------- 3. card tilt (now-card / category cards) ---------- */
  function setupTilt() {
    if (!finePointer || reduceMotion) return;
    var cards = document.querySelectorAll('.now-card, .collection-category-card, .project-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 4. reading progress + back to top ---------- */
  function setupScrollUI() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.appendChild(bar);

    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.textContent = '↑ TOP';
    btn.setAttribute('aria-label', 'back to top');
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
      btn.classList.toggle('show', h.scrollTop > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. custom cursor (difference blend) ---------- */
  function setupCursor() {
    if (!finePointer || reduceMotion) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      var half = ring.classList.contains('hovering') ? 20 : 13;
      ring.style.transform = 'translate(' + (rx - half) + 'px,' + (ry - half) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('a, button, .now-card, .project-card, .media-item, .collection-category-card');
      ring.classList.toggle('hovering', !!t);
    });
  }

  /* ---------- boot ---------- */
  function init() {
    setupReveal();
    setupHero();
    setupTilt();
    setupScrollUI();
    setupCursor();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
