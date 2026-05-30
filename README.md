# p/mob

Website for **p/mob** — a production team based out of LA, formed by the Perez family.

Dark, grainy, lo-fi aesthetic. Sections: a hero lockup, a scrolling intro
line, the work shown on retro "Mini TVs" that link to YouTube, a mission
statement, and a Request a Quote form.

## Running it

It's a plain static site — no build step, nothing to install. Open
`index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

It can be hosted on anything that serves static files (GitHub Pages,
Netlify, Vercel, Cloudflare Pages).

## Files

```
index.html          page content
css/styles.css      all styling / the look
js/videos.js        the list of videos  ← edit this to change the TVs
js/main.js          builds the TVs, loads titles, handles the form
.github/workflows/  auto-publishes the site when changes are pushed
```

## Editing

Day-to-day changes (adding videos, changing wording, updating the contact
email and socials) are covered in **[GUIDE.md](GUIDE.md)** in plain English —
no coding background needed.
