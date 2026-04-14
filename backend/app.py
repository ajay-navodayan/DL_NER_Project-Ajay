from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import pdfplumber
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model_v1"
MIN_CONFIDENCE = 0.5


def to_jsonable(value):
    if isinstance(value, dict):
        return {key: to_jsonable(item) for key, item in value.items()}

    if isinstance(value, list):
        return [to_jsonable(item) for item in value]

    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass

    return value

# Load model with a clear startup error if missing or invalid.
if not MODEL_DIR.exists():
    raise FileNotFoundError(
        f"Model folder not found: {MODEL_DIR}. "
        "Restore the model files or update MODEL_DIR."
    )

try:
    ner_pipeline = pipeline(
        "ner",
        model=str(MODEL_DIR),
        tokenizer=str(MODEL_DIR),
        aggregation_strategy="simple"
    )
except Exception as exc:
    raise RuntimeError(
        f"Failed to load model from {MODEL_DIR}: {exc}"
    ) from exc

@app.route("/chat", methods=["POST"])
def chat():
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "").strip()

    if not text:
        return jsonify({"error": "Missing text"}), 400

    results = ner_pipeline(text)

    results = [r for r in results if float(r["score"]) >= MIN_CONFIDENCE]
    results = to_jsonable(results)

    return jsonify({
        "input": text,
        "entities": results
    })

@app.route("/upload", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "Missing file"}), 400

    file = request.files["file"]

    text = ""
    with pdfplumber.open(file.stream) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    if not text.strip():
        return jsonify({"error": "No text found in PDF"}), 400

    results = ner_pipeline(text)
    results = [r for r in results if float(r["score"]) >= MIN_CONFIDENCE]
    results = to_jsonable(results)

    return jsonify({
        "entities": results
    })

if __name__ == "__main__":
    app.run(debug=True)