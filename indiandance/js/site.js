(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- photos: if one fails to load, leave the patterned frame instead of a broken icon ---- */
  $$('.ph img').forEach(function (img) {
    var drop = function () { img.remove(); };
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) drop();
    img.addEventListener('error', drop);
  });

  /* ---- mobile nav ---- */
  var nav = $('#nav'), toggle = $('.nav-toggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ---- teental ring: 16 bells, four groups of four ---- */
  var NS = 'http://www.w3.org/2000/svg';
  var BOLS = ['धा', 'धिं', 'धिं', 'धा', 'धा', 'धिं', 'धिं', 'धा', 'धा', 'तिं', 'तिं', 'ता', 'ता', 'धिं', 'धिं', 'धा'];
  var KIND = ['dha', 'dhin', 'dhin', 'dha', 'dha', 'dhin', 'dhin', 'dha', 'dha', 'tin', 'tin', 'ta', 'ta', 'dhin', 'dhin', 'dha'];
  var ring = $('#ring'), bells = [], labels = [];
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  if (ring) {
    ring.appendChild(el('circle', { cx: 500, cy: 500, r: 425, 'class': 'ring-line' }));
    for (var i = 0; i < 16; i++) {
      // beat 1 (sam) sits at the top; the cycle runs clockwise
      var a = (-90 + i * 22.5) * Math.PI / 180;
      var x = 500 + 425 * Math.cos(a), y = 500 + 425 * Math.sin(a);
      var lead = i % 4 === 0;
      var b = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: lead ? 19 : 12, 'class': 'bell' + (i === 0 ? ' is-sam' : '') + (i === 8 ? ' is-khali' : '') });
      b.style.setProperty('--i', i);
      ring.appendChild(b); bells.push(b);
      var t = el('text', { x: (500 + 482 * Math.cos(a)).toFixed(1), y: (500 + 482 * Math.sin(a)).toFixed(1), 'class': 'bol', lang: 'hi', 'aria-hidden': 'true' });
      t.textContent = BOLS[i];
      ring.appendChild(t); labels.push(t);
    }
  }
  var spans = $$('#bols span');
  function light(i) {
    bells.forEach(function (b, k) { b.classList.toggle('on', k === i); });
    labels.forEach(function (t, k) { t.classList.toggle('on', k === i); });
    spans.forEach(function (s, k) { s.classList.toggle('on', k === i); });
  }
  light(0);

  /* ---- a small synthesized tabla so the cycle can be heard ---- */
  var ctx = null, timer = null, beat = 0, playing = false;
  var BEAT_MS = 430;
  function tone(freq, t, dur, gain, type, bendTo) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (bendTo) o.frequency.exponentialRampToValueAtTime(bendTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function strike(kind, accent) {
    var t = ctx.currentTime + 0.01, k = accent ? 1.25 : 1;
    var bass = kind === 'dha' || kind === 'dhin';          // left drum (bayan)
    var ring2 = kind === 'dhin' || kind === 'tin';         // sustained right-drum tone
    if (bass) tone(92, t, 0.42, 0.5 * k, 'sine', 62);
    if (ring2) { tone(392, t, 0.36, 0.16 * k, 'sine'); tone(784, t, 0.2, 0.05 * k, 'sine'); }
    else { tone(392, t, 0.11, 0.2 * k, 'triangle'); tone(1176, t, 0.05, 0.05 * k, 'square'); }
  }
  var playBtn = $('#talaPlay'), playLabel = $('#talaLabel'), playIcon = $('#talaIcon');
  function step() {
    light(beat);
    try { strike(KIND[beat], beat === 0); } catch (e) { /* audio unavailable: the lights still run */ }
    beat = (beat + 1) % 16;
  }
  function stop() {
    playing = false; clearInterval(timer); beat = 0; light(0);
    playBtn.setAttribute('aria-pressed', 'false');
    playLabel.textContent = 'השמיעו את המקצב';
    playIcon.setAttribute('d', 'M7 4.5v15l13-7.5z');
  }
  if (playBtn) playBtn.addEventListener('click', function () {
    if (playing) { stop(); return; }
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { ctx = null; }
    playing = true; beat = 0;
    playBtn.setAttribute('aria-pressed', 'true');
    playLabel.textContent = 'עצרו את המקצב';
    playIcon.setAttribute('d', 'M6 5h4.5v14H6zM13.5 5H18v14h-4.5z');
    step(); timer = setInterval(step, BEAT_MS);
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing) stop(); });

  /* ---- show sheets ---- */
  $$('[data-sheet]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = document.getElementById(btn.getAttribute('data-sheet'));
      if (d && d.showModal) d.showModal();
    });
  });
  $$('dialog.sheet').forEach(function (d) {
    $('.sheet-close', d).addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  /* ---- contact: build a ready WhatsApp message ---- */
  var form = $('#waForm'), send = $('#waSend'), about = '';
  function build() {
    var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || '';
    var name = $('#f-name').value.trim(), msg = $('#f-msg').value.trim();
    var lines = ['היי איילה, אשמח לפרטים בקשר ל' + topic + (about ? ' (' + about + ')' : '') + '.'];
    if (name) lines.push('שמי ' + name + '.');
    if (msg) lines.push(msg);
    send.href = 'https://wa.me/972546262931?text=' + encodeURIComponent(lines.join('\n'));
  }
  if (form) {
    form.addEventListener('input', build);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    build();
  }
  // buttons elsewhere on the page can preselect the topic (and name the show)
  $$('a[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = a.closest('dialog'); if (d) d.close();
      var want = a.getAttribute('data-topic');
      $$('input[name="topic"]', form).forEach(function (r) { if (r.value.indexOf(want) === 0) r.checked = true; });
      about = a.getAttribute('data-about') || '';
      build();
    });
  });


  /* =====================================================================
     Motion layer: runs only when <html> has the "anim" class (set in <head>
     when the visitor has not asked for reduced motion).
     ===================================================================== */
  var ANIM = document.documentElement.classList.contains('anim');

  // wrap every word of an element in spans, keeping nested tags such as <em>
  function wrapWords(root, make) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else frag.appendChild(make(part, n++));
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(root);
    return n;
  }

  if (ANIM) {
    $$('[data-split]').forEach(function (h) {
      wrapWords(h, function (word, i) {
        var o = document.createElement('span'), inner = document.createElement('span');
        o.className = 'w'; inner.textContent = word; inner.style.setProperty('--wi', i);
        o.appendChild(inner); return o;
      });
    });
    var lights = $$('[data-light]').map(function (el) {
      wrapWords(el, function (word) {
        var sp = document.createElement('span'); sp.className = 'lw'; sp.textContent = word; return sp;
      });
      return { el: el, words: $$('.lw', el) };
    });

    // one-time reveals when something scrolls into view
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    $$('[data-split], [data-reveal]').forEach(function (el) { io.observe(el); });
    // the hero headline does not wait for a scroll
    var h1 = $('.hero h1'); if (h1) requestAnimationFrame(function () { h1.classList.add('in'); });

    // scroll-linked values, written as CSS custom properties
    var scenes = $$('[data-scene]'), views = $$('[data-view]'), pars = $$('[data-parallax]');
    var bar = $('#progress'), ticking = false;
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function update() {
      ticking = false;
      var vh = window.innerHeight, doc = document.documentElement;
      if (bar) bar.style.setProperty('--sp', clamp(window.scrollY / Math.max(1, doc.scrollHeight - vh)).toFixed(4));
      scenes.forEach(function (el) {          // pinned scene: 0 at pin start, 1 at release
        var r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > 2 * vh) return;
        var p = clamp(-r.top / Math.max(1, r.height - vh));
        el.style.setProperty('--p', p.toFixed(4));
        el.style.setProperty('--z', clamp(p / 0.42).toFixed(4));
      });
      views.forEach(function (el) {           // 0 as it enters from below, 1 as it leaves at the top
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.setProperty('--vp', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
      });
      pars.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        el.style.setProperty('--py', ((clamp((vh - r.top) / (vh + r.height)) - 0.5) * 2).toFixed(3));
      });
      lights.forEach(function (l) {           // words light up between 85% and 40% of the viewport height
        var r = l.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = clamp((vh * 0.85 - r.top) / (vh * 0.45 + r.height));
        var upto = Math.round(p * l.words.length);
        l.words.forEach(function (w, i) { w.classList.toggle('lit', i < upto); });
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', update);
    update();

    // show cards lean toward the pointer
    if (window.matchMedia('(hover: hover)').matches) {
      $$('.show').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          card.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--tx', 0); card.style.setProperty('--ty', 0);
        });
      });
    }
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
