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
  // Naturalistic flying-bird silhouettes (like the header flock): a body
  // with two curved, pointed wings and a small forked tail. Clean shapes,
  // varied wing positions. Authored around (50,30) in a 60x36 frame.
  var SHAPES = {
    // wings out, shallow soar
    bird1: "M50 30 C44 26 38 22 30 18 C36 22 42 25 48 28 C49 29 49 31 47 33 L50 36 L53 33 C51 31 51 29 52 28 C58 25 64 22 70 18 C62 22 56 26 50 30 Z",
    // deeper wing-beat, wings raised
    bird2: "M50 32 C45 24 40 16 34 9 C39 18 44 24 48 29 C49 30 49 32 47 34 L50 38 L53 34 C51 32 51 30 52 29 C56 24 61 16 66 9 C60 16 55 24 50 32 Z",
    // gliding flat, long wings
    bird3: "M50 30 C42 28 34 26 24 24 C33 26 41 28 48 29 C49 30 49 31 47 32 L50 34 L53 32 C51 31 51 30 52 29 C59 28 67 26 76 24 C66 26 58 28 50 30 Z",
  };
  function svgFor(name, flip) {
    return (
      '<svg viewBox="20 6 60 36" aria-hidden="true"' +
      (flip ? ' style="transform:scaleX(-1)"' : "") +
      '><path d="' + SHAPES[name] + '"/></svg>'
    );
  }

  // [shape, leftN, topN, scale, opacity, driftDur(s), flapDur(s), flip]
  // Loose, drifting flock; varied size/depth; kept clear of the logo.
  var FLOCK = [
    ["bird1",  9, 14, 1.15, 0.92, 23, 3.0, 0],
    ["bird3", 19, 24, 0.80, 0.66, 27, 3.6, 1],
    ["bird2", 31, 11, 1.00, 0.85, 20, 2.6, 0],
    ["bird1", 42, 20, 0.58, 0.50, 31, 3.9, 0],
    ["bird3", 58, 17, 0.95, 0.80, 22, 3.2, 1],
    ["bird2", 69, 12, 0.78, 0.64, 26, 2.8, 0],
    ["bird1", 80, 22, 1.10, 0.88, 19, 2.7, 1],
    ["bird3", 90, 15, 0.55, 0.46, 32, 4.0, 0],
    ["bird2", 14, 33, 0.68, 0.55, 28, 3.0, 1],
    ["bird1", 73, 72, 0.74, 0.52, 24, 3.3, 0],
    ["bird3", 31, 76, 0.60, 0.46, 29, 3.1, 1],
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

  // staggered offsets + tilts so the grid feels like a disorganized wall
  var TX  = [0, -10, 8, -6, 12, -4, 6, -12];
  var TY  = [30, 6, 44, 14, 36, 0, 22, 10];
  var ROT = [-1.6, 1.1, -0.7, 1.7, -1.2, 0.6, -1.9, 1.3];

  function makeTV(v, i) {
    var a = document.createElement("a");
    // every tuned-in set carries rolling static (clears on hover)
    var staticky = !isPlaceholder(v.id);
    a.className =
      "tv" +
      (isPlaceholder(v.id) ? " tv--placeholder" : "") +
      (staticky ? " tv--static" : "");
    a.style.cssText =
      "--tx:" + TX[i % TX.length] + "px;" +
      "--ty:" + TY[i % TY.length] + "px;" +
      "--rot:" + ROT[i % ROT.length] + "deg;";
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
      var nodes = videos.map(function (v, i) {
        var node = makeTV(v, i);
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
