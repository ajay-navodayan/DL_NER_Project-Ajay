from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import pdfplumber
from pathlib import Path
import re

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "biobert_disease_ner_final"
MIN_CONFIDENCE = 0.3
MAX_CHARS = 1200
CHUNK_OVERLAP = 200
ALLOWED_ENTITY_GROUPS = {"disease", "symptom", "sign", "symptom/sign"}
SHORT_TEXT_MAX_LEN = 80
SHORT_TEXT_CONFIDENCE = 0.2
SHORT_TEXT_PREFIX = "Patient reports "
FALLBACK_SYMPTOMS = [
    
]


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

def chunk_text(text, max_len=MAX_CHARS, overlap=CHUNK_OVERLAP):
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = min(start + max_len, length)

        if end < length:
            split_at = text.rfind(" ", start + 1, end)
            if split_at != -1 and split_at > start + 200:
                end = split_at

        if end <= start:
            end = min(start + max_len, length)

        chunks.append((text[start:end], start))

        if end >= length:
            break

        start = max(0, end - overlap)

    return chunks

def merge_entities(entities):
    best = {}

    for entity in entities:
        key = (
            entity.get("start"),
            entity.get("end"),
            entity.get("entity_group")
        )
        score = float(entity.get("score") or 0)

        if key not in best or score > float(best[key].get("score") or 0):
            best[key] = entity

    return list(best.values())

def split_sentences(text):
    sentences = []

    for match in re.finditer(r"[^.!?\n]+", text):
        raw = match.group(0)
        if not raw.strip():
            continue

        left_trim = len(raw) - len(raw.lstrip())
        sentence = raw.strip()
        offset = match.start() + left_trim

        sentences.append((sentence, offset))

    return sentences

def add_entities(
    entities,
    all_entities,
    offset=0,
    prefix_len=0,
    min_confidence=MIN_CONFIDENCE
):
    for entity in entities:
        if float(entity.get("score", 0)) < min_confidence:
            continue

        group = str(entity.get("entity_group", "")).strip().lower()
        if group and group not in ALLOWED_ENTITY_GROUPS:
            continue

        updated = dict(entity)
        start = updated.get("start")
        end = updated.get("end")

        if start is not None and end is not None:
            start = int(start)
            end = int(end)

            if prefix_len and (start < prefix_len or end <= prefix_len):
                continue

            updated["start"] = start - prefix_len + offset
            updated["end"] = end - prefix_len + offset

        all_entities.append(updated)

def add_fallback_symptoms(text, offset, all_entities):
    if not text:
        return

    for symptom in FALLBACK_SYMPTOMS:
        for match in re.finditer(rf"\b{re.escape(symptom)}\b", text, re.IGNORECASE):
            start = offset + match.start()
            end = offset + match.end()

            if any(
                entity.get("start") == start and entity.get("end") == end
                for entity in all_entities
            ):
                continue

            all_entities.append({
                "word": match.group(0),
                "entity_group": "Symptom",
                "score": SHORT_TEXT_CONFIDENCE,
                "start": start,
                "end": end
            })

def extract_entities(text):
    all_entities = []

    if len(text) <= SHORT_TEXT_MAX_LEN:
        results = ner_pipeline(SHORT_TEXT_PREFIX + text)
        add_entities(
            results,
            all_entities,
            prefix_len=len(SHORT_TEXT_PREFIX),
            min_confidence=sentence_confidence(text)
        )

    for chunk, offset in chunk_text(text):
        results = ner_pipeline(chunk)

        add_entities(
            results,
            all_entities,
            offset=offset,
            min_confidence=MIN_CONFIDENCE
        )

    for sentence, offset in split_sentences(text):
        results = ner_pipeline(SHORT_TEXT_PREFIX + sentence)
        add_entities(
            results,
            all_entities,
            offset=offset,
            prefix_len=len(SHORT_TEXT_PREFIX),
            min_confidence=sentence_confidence(sentence)
        )

        add_fallback_symptoms(sentence, offset, all_entities)

    return merge_entities(all_entities)

def sentence_confidence(sentence):
    return SHORT_TEXT_CONFIDENCE if len(sentence) <= SHORT_TEXT_MAX_LEN else MIN_CONFIDENCE

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

    results = to_jsonable(extract_entities(text))

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

    results = to_jsonable(extract_entities(text))

    return jsonify({
        "text": text,
        "entities": results
    })

if __name__ == "__main__":
    app.run(debug=True)