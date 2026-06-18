/* НЕЙРОДОКС — interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- animated counters ---- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-to'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1100, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (to * eased).toFixed(decimals);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = to.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('.count');
  if (reduce) {
    counters.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = parseFloat(el.getAttribute('data-to')).toFixed(d) + (el.getAttribute('data-suffix') || '');
    });
  } else if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { animateCount(el); });
  }

  /* ---- scroll progress ---- */
  var bar = document.getElementById('progressBar');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (bar) bar.style.width = (p * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- active nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = '#' + e.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---- mobile sidebar ---- */
  var sidebar = document.getElementById('sidebar');
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('scrim');
  function toggleNav(open) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('show', open);
  }
  if (burger) burger.addEventListener('click', function () { toggleNav(!sidebar.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { toggleNav(false); });
  navLinks.forEach(function (a) { a.addEventListener('click', function () { toggleNav(false); }); });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var panel = q.nextElementSibling;
      var isOpen = acc.classList.contains('open');
      document.querySelectorAll('.acc.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc__a').style.maxHeight = null;
      });
      if (!isOpen) {
        acc.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---- form ---- */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('formOk');
      Array.prototype.slice.call(form.children).forEach(function (c) {
        if (c.id !== 'formOk') c.style.display = 'none';
      });
      if (ok) ok.classList.add('show');
    });
  }
})();
