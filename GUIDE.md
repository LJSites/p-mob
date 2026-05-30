# Editing your site

Everything here can be done from your web browser — no apps to install, no
code to run. When you save a change, the live site updates on its own in a
minute or two.

The one thing to know up front: your site's files live in your GitHub repo.
To change something, you open the file on GitHub, click the pencil, make the
edit, and click the green **Commit changes** button. That's it — saving is
called "committing." The site rebuilds itself after each save.

> Tip: if you ever make a change you don't like, GitHub keeps every old
> version. Nothing is ever truly broken — you can always revert. So feel free
> to experiment.

---

## Add or change a video (the most common edit)

The videos on the page come from one file: **`js/videos.js`**.

1. Open the repo on GitHub and click into the `js` folder, then `videos.js`.
2. Click the **pencil** icon (top right of the file) to edit.
3. You'll see a list of lines that look like this:

   ```js
   { id: "prqmRXzoRT4", title: "p/mob — Film", channel: "p/mob" },
   ```

4. To **add** a video, copy one of those lines, paste it as a new line, and
   change the `id`. The `id` is the part of a YouTube link after `v=`:

   ```
   https://www.youtube.com/watch?v=prqmRXzoRT4
                                    └──────────┘  ← this is the id
   ```

   (For short `youtu.be/abc123` links, it's the part after the slash.)

5. To **remove** a video, delete its line. To **reorder**, drag lines around
   (or cut/paste). The TVs appear in the same order as the list.
6. Scroll down and click **Commit changes**.

The video's title and thumbnail load from YouTube automatically — you don't
have to type them. (The `title` is just a backup label.)

---

## Change wording on the page

All the text lives in **`index.html`**. Open it the same way (pencil icon).
It looks busier than `videos.js`, but you only need to find the words you want
to change and type over them. Don't touch the `<` and `>` tags around them.

A few things you might want to edit, and what to search for (Ctrl/Cmd-F):

- **The scrolling line under the logo** — search for `production team based out of`.
- **The mission statement** — search for `Built to be watched`.
- **The paragraph under it** — search for `takes projects from`.
- **Contact details** — search for `pmob.tv` (email) or `pmob.prod` (socials).

Change the words, then **Commit changes**.

---

## Change the email the form sends to

When someone fills out "Request a Quote," it opens an email to you. To set
that address:

1. Open **`js/main.js`**.
2. Search (Ctrl/Cmd-F) for `TO =`.
3. Change the email in quotes to the address you want quote requests to go to.
4. Also update the visible email on the page: open `index.html`, search for
   `pmob.tv`, and change it there too.
5. **Commit changes** on each.

---

## Update your social links

In `index.html`, search for `instagram`, `tiktok`, or `youtube` and update the
links/handles. They appear in two places — the Request a Quote section and the
footer — so search for each and update both.

---

## After you save

Give it 1–2 minutes, then refresh the live site. If you don't see your change,
wait another minute (it's rebuilding) and refresh again. On phones, a hard
refresh sometimes helps.

If anything ever looks off, open the file's **History** on GitHub, find the
version from before your edit, and restore it — or just ask your developer.
