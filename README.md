# p/mob — productions

The official site for **p/mob productions** — a Los Angeles film & video crew.

Lo-fi screenprint / risograph aesthetic (cobalt blue, halftone grain, bird
flock, cut-out skyline, hot-red logo block) matching the channel banner.

## Sections
- **Hero** — the banner artwork rebuilt in CSS/SVG.
- **The Work** — videos shown as retro **Mini TVs** that link to YouTube.
- **Our Mission** — the crew's mission statement.
- **Request a Quote** — a form for people to reach out about shoots.

## It's a plain static site
No build step. Just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Host it anywhere static (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

```
index.html        # page markup
css/styles.css    # all styling / the aesthetic
js/videos.js      # <-- EDIT THIS to add/change videos
js/main.js        # renders Mini TVs, loads titles, handles the form
assets/skyline.svg# the cut-out collage skyline
```

## Adding or changing videos
Open **`js/videos.js`** and edit the list. For a link like
`https://www.youtube.com/watch?v=prqmRXzoRT4`, the id is `prqmRXzoRT4`:

```js
{ id: "prqmRXzoRT4", title: "My Film", channel: "p/mob" },
```

- Thumbnails are pulled from YouTube automatically.
- Real titles auto-load from YouTube in the browser; `title` is just the
  fallback shown until then.

## Things to set before launch
- **Quote inbox:** in `js/main.js`, change `TO = "hello@pmob.tv"` to the real
  email. The form opens a prefilled email; swap for Formspree/a backend if you
  want server-side submissions.
- **Social links / email** in `index.html` (Instagram `@pmob.prod`, TikTok,
  the `mailto:` in the quote section) — confirm these are correct.
