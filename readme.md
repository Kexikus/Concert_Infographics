# Concert Infographics

Interactive infographics site for concert data. Includes an admin interface
for managing artists, venues, and concerts.

## Running locally (with admin save/upload support)

Requires Python 3.10+ and [uv](https://github.com/astral-sh/uv).

```bash
uv pip install -r requirements.txt
uv run python server.py
```

Then open:
- http://localhost:5000/         — the infographics site
- http://localhost:5000/admin.html — the admin interface

When the Flask backend is running, the admin "Save" buttons write the data
JS files (`js/data/*.js`) directly to disk, and the "Upload" buttons send
artist/event logos straight to `assets/logos/<artists|events>/`.

## Running without the backend (static only)

The site also works as a pure static site (no save/upload to server):

```bash
uv run python -m http.server 8000
```

In this mode the admin "Save" buttons fall back to downloading the generated
JS file, which you then place into `js/data/` manually. Upload buttons will
show an error message — place images into `assets/logos/artists/` or
`assets/logos/events/` by hand.

## Deploying to a v-server

1. Copy the project to the server.
2. Install dependencies: `uv pip install -r requirements.txt`
3. Run with a production WSGI server, e.g.:
   ```bash
   uv run gunicorn -w 2 -b 127.0.0.1:5000 server:app
   ```
4. Put nginx (or another reverse proxy) in front, terminating TLS.
   Protect `/admin.html` and `/api/*` with HTTP Basic Auth so only you can
   edit data or upload files. The infographics site at `/` can stay public.

No authentication is handled inside the Flask app itself — that is expected
to be done at the reverse-proxy layer.
