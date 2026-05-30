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
  // silhouette shapes, drawn in a 40x24 viewBox
  var SHAPES = {
    // gull, mid glide
    bird1: "M2 12 C10 4 15 3 20 10 C15 7 11 9 4 14 C-3 9 -11 7 -16 10 C-11 3 -7 4 2 12 Z",
    // gull, deeper wing-beat
    bird2: "M2 14 C8 3 13 1 18 8 C13 5 9 8 4 16 C-2 8 -9 5 -16 8 C-11 1 -7 3 2 14 Z",
    // gull, wide shallow soar
    bird3: "M2 11 C12 6 18 6 22 11 C16 8 9 9 4 13 C-3 9 -12 8 -18 11 C-12 6 -8 6 2 11 Z",
    // far-off speck (small V)
    bird4: "M2 10 C6 6 9 6 12 10 C8 8 5 9 2 12 C-3 9 -7 8 -10 10 C-7 6 -4 6 2 10 Z",
    // bat — scalloped wings + little ears
    bat:   "M2 7 L4 3 L5 7 C9 1 15 2 20 8 C17 8 16 11 18 14 C15 11 14 13 11 12 C9 14 7 12 5 15 C3 12 1 14 -1 12 C-4 13 -5 11 -8 14 C-6 11 -7 8 -10 8 C-5 2 1 1 5 7 L4 3 Z",
  };
  function svgFor(name, flip) {
    return (
      '<svg viewBox="-20 -2 44 22" aria-hidden="true"' +
      (flip ? ' style="transform:scaleX(-1)"' : "") +
      '><path d="' + SHAPES[name] + '"/></svg>'
    );
  }

  // [shape, leftN, topN, scale, opacity, driftDur(s), flapDur(s), flip]
  var FLOCK = [
    ["bird1",  8, 16, 1.15, 0.85, 22, 2.6, 0],
    ["bird3", 20, 26, 0.85, 0.65, 26, 3.0, 1],
    ["bird2", 31, 12, 1.30, 0.92, 19, 2.2, 0],
    ["bird4", 42, 22, 0.55, 0.45, 30, 3.4, 0],
    ["bat",   50,  9, 0.95, 0.80, 24, 2.0, 0],
    ["bird1", 60, 20, 1.05, 0.80, 21, 2.5, 1],
    ["bird3", 72, 13, 0.80, 0.62, 27, 3.1, 0],
    ["bird2", 83, 24, 1.20, 0.88, 18, 2.3, 1],
    ["bird4", 90, 15, 0.50, 0.42, 31, 3.6, 0],
    ["bat",   14, 33, 0.70, 0.62, 25, 2.1, 1],
    ["bird1", 66, 32, 0.65, 0.55, 28, 2.9, 0],
    ["bird4", 38, 35, 0.45, 0.38, 33, 3.8, 1],
    ["bat",   78, 70, 0.85, 0.55, 23, 1.9, 0],
    ["bird3", 26, 74, 0.70, 0.50, 27, 3.0, 1],
    ["bird1", 88, 78, 0.60, 0.48, 29, 2.7, 0],
  ];

  function buildFlock() {
    var host = document.querySelector(".hero__flock.flock");
    if (!host) return;
    var html = "";
    FLOCK.forEach(function (c) {
      var name = c[0], isBat = name === "bat";
      html +=
        '<span class="creature' + (isBat ? " is-bat" : "") + '" style="' +
        "left:" + c[1] + "%;top:" + c[2] + "%;" +
        "--s:" + c[3] + ";--o:" + c[4] + ";--drift:" + c[5] + "s;--flap:" + c[6] + "s;" +
        "--delay:-" + (c[6] * 0.37).toFixed(2) + "s;" +
        '">' + svgFor(name, c[7]) + "</span>";
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
