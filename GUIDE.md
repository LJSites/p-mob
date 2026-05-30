# How to manage your p/mob site

Hey! This folder is everything that runs your website. You don't need to know
how to code to keep it updated — adding videos and changing wording is mostly
copy, paste, and save. Here's the whole thing in plain English.

## What's in here
- `index.html` — the page itself (all the text and sections)
- `css/styles.css` — the look (colors, fonts, spacing)
- `js/videos.js` — the list of videos on the TVs  ← you'll touch this the most
- `js/main.js` — behind-the-scenes wiring (the contact form, etc.)
- a couple of helper files you can ignore

## Peek at it first
Double-click `index.html` and it opens in your web browser so you can look
around. (A few things like video titles only fully load once the site is
online, but this is plenty for a preview.)

## Putting it online (one time)
The easiest way to host it for free **and** be able to edit it later from your
browser is GitHub:

1. Make a free account at **github.com**.
2. Click the **+** in the top-right corner → **New repository**. Give it a
   name like `pmob`, then **Create repository**.
3. On the new page, click **"uploading an existing file,"** then drag in
   everything from this folder. Click **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment," set **Source** to
   **GitHub Actions**.
5. Give it a minute — your live link shows up right there on the Pages screen.

Want it on your own web address (something like **pmob.com**)? Buy the domain,
then add it under **Settings → Pages → Custom domain**. If the domain part feels
fiddly, that's a good one to hand back to whoever set this up for you.

## Making changes (anytime)
On github.com, open your repo, click the file you want to change, click the
**pencil** icon, make your edit, then click **Commit changes**. The site
updates itself in a minute or two.

Don't worry about breaking it — GitHub saves every past version, so you can
always undo. Experiment freely.

### Add or swap a video (the most common edit)
Open `js/videos.js`. You'll see lines like this:

    { id: "prqmRXzoRT4", title: "p/mob — Film", channel: "p/mob" },

Copy a line, paste it below, and change the **id**. The id is the part of a
YouTube link right after `v=`:

    youtube.com/watch?v=prqmRXzoRT4   →   prqmRXzoRT4

Delete a line to remove a video. The order of the lines is the order they show
up on the page. Titles and thumbnails load from YouTube on their own — you
don't have to type them. Then **Commit changes**.

### Change words on the page
Open `index.html`. Use your browser's Find (**Ctrl-F** / **Cmd-F**) to jump to
the text you want, then type over it — just leave the `<` `>` tags alone.
Useful things to search for:

- the scrolling line under the logo: `production team based out of`
- the mission statement: `Built to be watched`
- your email: `pmobdance@gmail.com`
- your socials: `pmob.prod`
- your Linktree: `linktr.ee`

### Change the email the contact form sends to
Open `js/main.js`, find `TO =`, and put your email between the quotes. Then
open `index.html`, find `pmobdance@gmail.com`, and change it there too so it
shows on the page. Commit both.

## If something looks off
Open the file's **History** on GitHub, pick the version from before your
change, and restore it. Or just message whoever built this — it's a quick fix.
