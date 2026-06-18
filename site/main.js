/* НЕЙРОДОКС — interactions */
(function () {
  'use strict';

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  function formatNum(n, sep) {
    if (!sep) return String(n);
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var sep = el.hasAttribute('data-sep');
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = formatNum(val, sep) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(target, sep) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- scroll progress ---------- */
  var bar = document.getElementById('progressBar');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (bar) bar.style.width = (p * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- active nav via section observer ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  var sections = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute('data-sec');
    var sec = document.getElementById(id);
    if (sec) sections[id] = a;
  });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.id;
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          if (sections[id]) sections[id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(sections).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) sio.observe(sec);
    });
  }

  /* ---------- mobile sidebar ---------- */
  var sidebar = document.getElementById('sidebar');
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('scrim');
  function openMenu() { sidebar.classList.add('open'); scrim.classList.add('show'); }
  function closeMenu() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }
  if (burger) burger.addEventListener('click', openMenu);
  if (scrim) scrim.addEventListener('click', closeMenu);
  document.querySelectorAll('#nav a, .sidebar__brand').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var acc = btn.closest('.acc');
      var panel = acc.querySelector('.acc__a');
      var isOpen = acc.classList.contains('open');
      // close others
      document.querySelectorAll('.acc.open').forEach(function (o) {
        if (o !== acc) { o.classList.remove('open'); o.querySelector('.acc__a').style.maxHeight = null; }
      });
      if (isOpen) {
        acc.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        acc.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
  // keep open panels sized correctly on resize
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc.open .acc__a').forEach(function (p) {
      p.style.maxHeight = p.scrollHeight + 'px';
    });
  });

  /* ---------- lead form (demo, no backend) ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var body = document.getElementById('formBody');
      var ok = document.getElementById('formOk');
      if (body) body.style.display = 'none';
      if (ok) ok.classList.add('show');
    });
  }

  /* ---------- smooth anchor offset for reduced jank ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });
})();
