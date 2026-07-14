"""
Concert Infographics - Flask backend
====================================
Serves the static site and provides JSON endpoints for the admin interface
to save data files directly to disk and upload artist/event logos.

Run with:
    uv run python server.py
or:
    flask --app server run --host=0.0.0.0

NOTE: No authentication is handled here. When deploying on a public v-server,
put nginx (or another reverse proxy) in front of this app and protect
/admin.html and /api/* with HTTP Basic Auth + HTTPS.
"""

import os
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, abort

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "js" / "data"
LOGOS_DIR = BASE_DIR / "assets" / "logos"

# Whitelist of data file types that may be saved.
ALLOWED_DATA_TYPES = {"artists", "venues", "concerts"}
DATA_FILENAMES = {t: f"{t}.js" for t in ALLOWED_DATA_TYPES}

# Allowed image extensions for uploads.
ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg", ".avif", ".gif", ".webp"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

# Whitelist of logo categories. Each maps to a subfolder of assets/logos/.
ALLOWED_LOGO_CATEGORIES = {"artists", "events"}

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/admin")
def admin():
    return send_from_directory(BASE_DIR, "admin.html")


@app.route("/<path:path>")
def static_files(path):
    """Serve any static file from the project root."""
    full = BASE_DIR / path
    if full.is_file():
        return send_from_directory(BASE_DIR, path)
    abort(404)


# ==================== DATA SAVE / LOAD ====================

@app.route("/api/data/<data_type>", methods=["GET"])
def get_data(data_type):
    """Return the current content of a data JS file."""
    if data_type not in ALLOWED_DATA_TYPES:
        return jsonify({"error": "Invalid data type"}), 400
    target = DATA_DIR / DATA_FILENAMES[data_type]
    if not target.is_file():
        return jsonify({"error": "Data file not found"}), 404
    return target.read_text(encoding="utf-8"), 200, {"Content-Type": "text/javascript"}


@app.route("/api/save/<data_type>", methods=["POST"])
def save_data(data_type):
    """
    Overwrite a data JS file with the body sent by the admin interface.
    The body must be the full JS file content (exactly what the admin
    already generates in generateArtistsJS() / generateVenuesJS() /
    generateConcertsJS()).
    """
    if data_type not in ALLOWED_DATA_TYPES:
        return jsonify({"error": "Invalid data type"}), 400

    content = request.get_data(as_text=True)
    if not content:
        return jsonify({"error": "Empty body"}), 400

    # Basic sanity check: the file must assign the expected variable.
    expected_var = {
        "artists": "artistsData",
        "venues": "venuesData",
        "concerts": "concertsData",
    }[data_type]
    if expected_var not in content:
        return jsonify({"error": f"Content does not define {expected_var}"}), 400

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    target = DATA_DIR / DATA_FILENAMES[data_type]
    # Atomic-ish write: write to temp then replace.
    tmp = target.with_suffix(".js.tmp")
    tmp.write_text(content, encoding="utf-8")
    tmp.replace(target)

    return jsonify({"success": True, "file": DATA_FILENAMES[data_type]})


# ==================== IMAGE UPLOAD ====================

@app.route("/api/upload/image/<category>", methods=["POST"])
def upload_image(category):
    """
    Receive a multipart file upload and save it to assets/logos/<category>/.
    <category> must be one of ALLOWED_LOGO_CATEGORIES (artists | events),
    which determines whether the logo lands in the artist or event folder.
    """
    if category not in ALLOWED_LOGO_CATEGORIES:
        return jsonify({
            "error": f"Invalid category '{category}'. Allowed: "
                     f"{', '.join(sorted(ALLOWED_LOGO_CATEGORIES))}"
        }), 400

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    # Use werkzeug's secure filename to avoid path traversal in the name.
    from werkzeug.utils import secure_filename
    filename = secure_filename(file.filename)

    # Preserve common lowercase extensions but allow the original case of the
    # base name (secure_filename already strips path separators etc.).
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return jsonify({
            "error": f"File type '{ext}' is not allowed. Allowed: "
                     f"{', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}"
        }), 400

    # Read and enforce size limit.
    data = file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        return jsonify({"error": "File too large (max 10 MB)"}), 413

    target_dir = LOGOS_DIR / category
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / filename
    target.write_bytes(data)

    return jsonify({"success": True, "filename": filename})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
