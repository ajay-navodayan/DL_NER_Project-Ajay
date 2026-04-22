import { useMemo, useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [pdfText, setPdfText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = "http://127.0.0.1:5000";

  const sortedEntities = useMemo(() => {
    return [...result]
      .filter((item) => Number.isFinite(item.start) && Number.isFinite(item.end))
      .sort((a, b) => a.start - b.start);
  }, [result]);

  const highlightedText = useMemo(() => {
    if (!pdfText.trim() || sortedEntities.length === 0) {
      return pdfText;
    }

    const parts = [];
    let lastIndex = 0;

    sortedEntities.forEach((entity, index) => {
      const start = Math.max(0, entity.start);
      const end = Math.max(start, entity.end);

      if (start > lastIndex) {
        parts.push({
          key: `pdf-${index}-before`,
          value: pdfText.slice(lastIndex, start),
          highlight: false
        });
      }

      if (end > start) {
        parts.push({
          key: `pdf-${index}-entity`,
          value: pdfText.slice(start, end),
          highlight: true,
          label: entity.entity_group
        });
      }

      lastIndex = Math.max(lastIndex, end);
    });

    if (lastIndex < pdfText.length) {
      parts.push({
        key: "pdf-tail",
        value: pdfText.slice(lastIndex),
        highlight: false
      });
    }

    return parts;
  }, [pdfText, sortedEntities]);

  const uploadFile = async () => {
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError("");
    setResult([]);
    setPdfText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "PDF processing failed.");
        return;
      }

      setPdfText(data.text || "");
      setResult(Array.isArray(data.entities) ? data.entities : []);
    } catch (err) {
      setError("Unable to reach the API. Please confirm the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label className="field-label" htmlFor="pdf-upload">
        Upload a PDF report
      </label>
      <input
        id="pdf-upload"
        className="file-input"
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div className="actions-row">
        <button className="button" onClick={uploadFile} disabled={!file || isLoading}>
          {isLoading ? "Processing PDF..." : "Analyze PDF"}
        </button>
        <span className="helper-text">
          {file
            ? `Selected: ${file.name} · Large PDFs may take 30-60 seconds`
            : "PDF files only"}
        </span>
      </div>

      {error ? <p className="empty-state">{error}</p> : null}

      <div className="results-block">
        <h3>Highlighted PDF text</h3>
        <div className="highlighted-text">
          {Array.isArray(highlightedText) ? (
            highlightedText.map((part) =>
              part.highlight ? (
                <mark
                  key={part.key}
                  className="entity-mark"
                  title={part.label}
                >
                  {part.value}
                </mark>
              ) : (
                <span key={part.key}>{part.value}</span>
              )
            )
          ) : (
            <span>{highlightedText || "Upload a PDF to see highlighted text."}</span>
          )}
        </div>
      </div>

      <div className="results-block">
        <h3>Entities</h3>
        {result.length === 0 ? (
          <p className="empty-state">No entities yet.</p>
        ) : (
          <table className="entity-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Entity</th>
                <th>Score</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {result.map((entity, index) => (
                <tr key={`${entity.word}-${index}`}>
                  <td>{entity.word}</td>
                  <td>{entity.entity_group ?? "-"}</td>
                  <td>{entity.score?.toFixed ? entity.score.toFixed(2) : "-"}</td>
                  <td>{entity.start ?? "-"}</td>
                  <td>{entity.end ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Upload;