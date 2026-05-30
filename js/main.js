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

  /* =================================================================
     1. BIRD FLOCK
     A simple gull-shaped path scattered across the hero, drifting.
     ================================================================= */
  function buildFlock() {
    var g = document.querySelector(".hero__birds .flock");
    if (!g) return;
    // a single "M" gull silhouette, drawn small then positioned
    var birds = [
      [120, 80, 1.0], [210, 50, 0.7], [300, 110, 1.2], [380, 70, 0.6],
      [470, 130, 0.9], [560, 60, 1.1], [650, 100, 0.7], [740, 150, 1.3],
      [820, 80, 0.8], [910, 120, 1.0], [1000, 60, 0.7], [1080, 110, 1.1],
      [160, 170, 0.6], [430, 30, 0.8], [690, 40, 0.9], [970, 175, 0.7],
    ];
    var frag = "";
    birds.forEach(function (b, i) {
      var x = b[0], y = b[1], s = b[2];
      // gull: two curved strokes meeting in the middle
      frag +=
        '<path transform="translate(' + x + ',' + y + ') scale(' + s + ')" ' +
        'class="bird b' + (i % 4) + '" ' +
        'd="M0 0 C 6 -7 11 -8 16 -2 C 11 -4 7 -2 0 4 C -7 -2 -11 -4 -16 -2 C -11 -8 -6 -7 0 0 Z"/>';
    });
    g.innerHTML = frag;
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
