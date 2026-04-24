import { useLayoutEffect, useMemo, useRef, useState } from "react";

const MAX_TEXTAREA_HEIGHT = 320;

function Process() {
  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [processedText, setProcessedText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const apiBase = "http://127.0.0.1:5000";

  const sortedEntities = useMemo(() => {
    return [...result]
      .filter((item) => Number.isFinite(item.start) && Number.isFinite(item.end))
      .sort((a, b) => a.start - b.start);
  }, [result]);

  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  const displayText = activeTab === "text" ? processedText : pdfText;

  const highlightedText = useMemo(() => {
    if (!displayText.trim() || sortedEntities.length === 0) {
      return displayText;
    }

    const parts = [];
    let lastIndex = 0;

    sortedEntities.forEach((entity, index) => {
      const start = Math.max(0, entity.start);
      const end = Math.max(start, entity.end);

      if (start > lastIndex) {
        parts.push({
          key: `text-${index}-before`,
          value: displayText.slice(lastIndex, start),
          highlight: false
        });
      }

      if (end > start) {
        parts.push({
          key: `text-${index}-entity`,
          value: displayText.slice(start, end),
          highlight: true,
          label: entity.entity_group
        });
      }

      lastIndex = Math.max(lastIndex, end);
    });

    if (lastIndex < displayText.length) {
      parts.push({
        key: "text-tail",
        value: displayText.slice(lastIndex),
        highlight: false
      });
    }

    return parts;
  }, [displayText, sortedEntities]);

  const sendMessage = async () => {
    setIsLoading(true);
    setError("");
    setResult([]);
    setProcessedText("");

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Text analysis failed.");
        return;
      }

      setProcessedText(text);
      setResult(Array.isArray(data.entities) ? data.entities : []);
    } catch (err) {
      setError("Unable to reach the API. Please confirm the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    setResult([]);
    setPdfText("");
    setProcessedText("");

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
    <section id="process" className="process-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Process Medical Text</h2>
          <p className="section-subtitle">
            Extract medical entities from clinical notes or PDF documents
          </p>
        </div>

        <div className="process-tabs">
          <button
            className={`tab-button ${activeTab === "text" ? "active" : ""}`}
            onClick={() => setActiveTab("text")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 6h12M4 10h12M4 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Text Input
          </button>
          <button
            className={`tab-button ${activeTab === "pdf" ? "active" : ""}`}
            onClick={() => setActiveTab("pdf")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 2h8l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            PDF Upload
          </button>
        </div>

        <div className="process-content">
          {activeTab === "text" ? (
            <div className="input-section">
              <label className="input-label" htmlFor="clinical-text">
                Clinical Text
              </label>
              <textarea
                id="clinical-text"
                className="process-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste clinical notes, discharge summary, or medical reports here..."
                ref={textareaRef}
              />
              <button
                className="process-button"
                onClick={sendMessage}
                disabled={!text.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Analyze Text
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="input-section">
              <label className="input-label" htmlFor="pdf-upload">
                Upload PDF Document
              </label>
              <div className="file-upload-area">
                <input
                  id="pdf-upload"
                  className="file-input-hidden"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="pdf-upload" className="file-upload-label">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 32V16m0 0l-8 8m8-8l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M40 32v4a4 4 0 01-4 4H12a4 4 0 01-4-4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="file-upload-text">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="file-upload-hint">PDF files only</span>
                </label>
              </div>
              <button
                className="process-button"
                onClick={uploadFile}
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing PDF...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Analyze PDF
                  </>
                )}
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {(result.length > 0 || displayText) && (
            <div className="results-section">
              <div className="result-card">
                <h3 className="result-title">Highlighted Text</h3>
                <div className="highlighted-content">
                  {displayText ? (
                    Array.isArray(highlightedText) ? (
                      highlightedText.map((part) =>
                        part.highlight ? (
                          <mark key={part.key} className="entity-highlight" title={part.label}>
                            {part.value}
                          </mark>
                        ) : (
                          <span key={part.key}>{part.value}</span>
                        )
                      )
                    ) : (
                      <span>{highlightedText}</span>
                    )
                  ) : (
                    <span className="placeholder-text">Analyzed text will appear here with highlighted entities...</span>
                  )}
                </div>
              </div>

              <div className="result-card">
                <h3 className="result-title">Extracted Entities</h3>
                {result.length === 0 ? (
                  <p className="empty-message">No entities detected yet.</p>
                ) : (
                  <div className="entity-table-wrapper">
                    <table className="entity-table">
                      <thead>
                        <tr>
                          <th>Entity</th>
                          <th>Type</th>
                          <th>Confidence</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.map((entity, index) => (
                          <tr key={`${entity.word}-${index}`}>
                            <td className="entity-word">{entity.word}</td>
                            <td>
                              <span className="entity-type-badge">
                                {entity.entity_group ?? "-"}
                              </span>
                            </td>
                            <td>
                              <span className="confidence-score">
                                {entity.score?.toFixed ? (entity.score * 100).toFixed(0) + "%" : "-"}
                              </span>
                            </td>
                            <td className="position-cell">
                              {entity.start ?? "-"} - {entity.end ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Process;
