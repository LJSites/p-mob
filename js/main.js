/* =====================================================================
   P/MOB — MAIN SCRIPT
   - builds the flying bird flock (SVG)
   - renders the Mini TVs from window.PMOB_VIDEOS
   - auto-loads real YouTube titles (oEmbed) with graceful fallback
   - handles the "Request a Quote" form
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav: solidify after scrolling past the hero edge ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =================================================================
     1. FLOCK — varied birds + a few bats, %-positioned so they stay
     visible on phones. Curated layout (not random) for a clean look.
     ================================================================= */
  // Crow / raven silhouettes in flight (viewBox -26 -18 52 30).
  // Wide swept wings + fingered tips + a fanned tail read as corvids;
  // the #crowRough filter tears the edges for a vintage paper-cut feel.
  var SHAPES = {
    // soaring, wings out shallow
    crow1: "M0 1 C5 -1 9 -3 13 -8 C14 -10 16 -11 18 -14 C17 -10 17 -9 16 -7 C18 -8 20 -8 23 -10 C20 -6 18 -5 15 -4 C11 -2 7 -1 3 0 L4 4 L1 3 L0 7 L-1 3 L-4 4 L-3 0 C-7 -1 -11 -2 -15 -4 C-18 -5 -20 -6 -23 -10 C-20 -8 -18 -8 -16 -7 C-17 -9 -17 -10 -18 -14 C-16 -11 -14 -10 -13 -8 C-9 -3 -5 -1 0 1 Z",
    // mid wing-beat, wings raised
    crow2: "M0 2 C4 -2 7 -5 10 -11 C11 -13 12 -14 14 -16 C13 -12 13 -10 12 -8 C14 -9 16 -10 18 -12 C16 -7 13 -5 10 -3 C7 -1 4 0 2 1 L3 5 L1 4 L0 8 L-1 4 L-3 5 L-2 1 C-4 0 -7 -1 -10 -3 C-13 -5 -16 -7 -18 -12 C-16 -10 -14 -9 -12 -8 C-13 -10 -13 -12 -14 -16 C-12 -14 -11 -13 -10 -11 C-7 -5 -4 -2 0 2 Z",
    // gliding flatter, long wings
    crow3: "M0 0 C6 -1 11 -2 16 -5 C18 -6 20 -6 23 -8 C20 -4 17 -3 13 -2 C8 -1 4 0 2 1 L3 4 L1 3 L0 6 L-1 3 L-3 4 L-2 1 C-4 0 -8 -1 -13 -2 C-17 -3 -20 -4 -23 -8 C-20 -6 -18 -6 -16 -5 C-11 -2 -6 -1 0 0 Z",
  };
  function svgFor(name, flip) {
    return (
      '<svg viewBox="-26 -18 52 30" aria-hidden="true"' +
      (flip ? ' style="transform:scaleX(-1)"' : "") +
      '><path filter="url(#crowRough)" d="' + SHAPES[name] + '"/></svg>'
    );
  }

  // [shape, leftN, topN, scale, opacity, driftDur(s), flapDur(s), flip]
  // A loose V-drift of corvids, varied size/depth, kept clear of the logo.
  var FLOCK = [
    ["crow1",  9, 14, 1.20, 0.92, 23, 3.0, 0],
    ["crow3", 19, 25, 0.85, 0.66, 27, 3.6, 1],
    ["crow2", 30, 11, 1.05, 0.85, 20, 2.6, 0],
    ["crow1", 41, 21, 0.60, 0.50, 31, 3.9, 0],
    ["crow3", 58, 18, 1.00, 0.80, 22, 3.2, 1],
    ["crow2", 69, 12, 0.80, 0.64, 26, 2.8, 0],
    ["crow1", 80, 23, 1.15, 0.88, 19, 2.7, 1],
    ["crow3", 90, 15, 0.55, 0.46, 32, 4.0, 0],
    ["crow2", 14, 34, 0.70, 0.55, 28, 3.0, 1],
    ["crow1", 49, 33, 0.50, 0.42, 33, 4.1, 0],
    ["crow3", 73, 72, 0.78, 0.52, 24, 3.3, 0],
    ["crow2", 30, 76, 0.62, 0.46, 29, 3.1, 1],
    ["crow1", 88, 78, 0.58, 0.44, 30, 2.9, 0],
  ];

  function buildFlock() {
    var host = document.querySelector(".hero__flock.flock");
    if (!host) return;
    var html = "";
    FLOCK.forEach(function (c) {
      html +=
        '<span class="creature" style="' +
        "left:" + c[1] + "%;top:" + c[2] + "%;" +
        "--s:" + c[3] + ";--o:" + c[4] + ";--drift:" + c[5] + "s;--flap:" + c[6] + "s;" +
        "--delay:-" + (c[6] * 0.37).toFixed(2) + "s;" +
        '">' + svgFor(c[0], c[7]) + "</span>";
    });
    host.innerHTML = html;
  }
  buildFlock();

  /* =================================================================
     2. MINI TVS
     ================================================================= */
  var grid = document.getElementById("tv-grid");
  var videos = window.PMOB_VIDEOS || [];

  function ytThumb(id) {
    // maxres isn't always available; hqdefault always is.
    return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  }
  function ytWatch(id) {
    return "https://www.youtube.com/watch?v=" + id;
  }
  function isPlaceholder(id) {
    return !id || /REPLACE_ME/i.test(id);
  }

  function makeTV(v) {
    var a = document.createElement("a");
    a.className = "tv" + (isPlaceholder(v.id) ? " tv--placeholder" : "");
    if (!isPlaceholder(v.id)) {
      a.href = ytWatch(v.id);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = "#work";
    }
    a.setAttribute("aria-label", "Watch: " + (v.title || "p/mob film"));

    var thumbHTML = isPlaceholder(v.id)
      ? ""
      : '<img class="tv__thumb" loading="lazy" alt="" ' +
        'src="' + ytThumb(v.id) + '" ' +
        // fall back to a lower-res thumb if hqdefault 404s
        "onerror=\"this.onerror=null;this.src='https://i.ytimg.com/vi/" +
        v.id + "/mqdefault.jpg'\" />";

    a.innerHTML =
      '<div class="tv__body">' +
        '<div class="tv__screen">' +
          thumbHTML +
          '<div class="tv__play"><span>▶</span></div>' +
        "</div>" +
        '<div class="tv__controls">' +
          '<span class="tv__knob"></span>' +
          '<span class="tv__speaker"></span>' +
          '<span class="tv__knob"></span>' +
          '<span class="tv__powerlight"></span>' +
        "</div>" +
      "</div>" +
      '<div class="tv__meta">' +
        '<div class="tv__title"></div>' +
        '<div class="tv__channel">' + (v.channel || "p/mob") + "</div>" +
      "</div>";

    // set title via textContent to avoid HTML injection
    a.querySelector(".tv__title").textContent = v.title || "p/mob film";
    return a;
  }

  if (grid) {
    if (!videos.length) {
      grid.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;opacity:.8">' +
        "No videos yet — add some in <code>js/videos.js</code>.</p>";
    } else {
      var nodes = videos.map(function (v) {
        var node = makeTV(v);
        grid.appendChild(node);
        return { v: v, node: node };
      });
      // auto-load real titles from YouTube (works in a live browser)
      nodes.forEach(function (n) {
        if (isPlaceholder(n.v.id)) return;
        fetchTitle(n.v.id).then(function (title) {
          if (title) n.node.querySelector(".tv__title").textContent = title;
        });
      });
    }
  }

  function fetchTitle(id) {
    var url =
      "https://www.youtube.com/oembed?format=json&url=" +
      encodeURIComponent("https://www.youtube.com/watch?v=" + id);
    return fetch(url)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { return data && data.title ? data.title : null; })
      .catch(function () { return null; }); // CORS/offline -> keep fallback
  }

  /* =================================================================
     3. QUOTE FORM
     Static site: open a prefilled email so the message reaches p/mob.
     Swap the action for a real backend / Formspree later if wanted.
     ================================================================= */
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("formNote");
  var TO = "hello@pmob.tv"; // <-- change to the real inbox

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.className = "quote__note";

      if (!form.checkValidity()) {
        note.textContent = "Fill in the required fields and try again.";
        note.classList.add("is-err");
        form.reportValidity();
        return;
      }

      var f = form.elements;
      var subject = "Quote request — " + (f.type.value || "Project") +
        " — " + f.name.value;
      var body =
        "Name: " + f.name.value + "\n" +
        "Email: " + f.email.value + "\n" +
        "Project type: " + f.type.value + "\n" +
        "Budget: " + (f.budget.value || "—") + "\n\n" +
        "Details:\n" + f.details.value + "\n";

      var mailto =
        "mailto:" + TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      note.textContent =
        "Opening your email app… if nothing happens, email us at " + TO + ".";
      note.classList.add("is-ok");
    });
  }
})();
