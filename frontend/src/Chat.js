import { useLayoutEffect, useMemo, useRef, useState } from "react";

const MAX_TEXTAREA_HEIGHT = 320;

function Chat() {
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);
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
    if (!textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  const highlightedText = useMemo(() => {
    if (!text.trim() || sortedEntities.length === 0) {
      return text;
    }

    const parts = [];
    let lastIndex = 0;

    sortedEntities.forEach((entity, index) => {
      const start = Math.max(0, entity.start);
      const end = Math.max(start, entity.end);

      if (start > lastIndex) {
        parts.push({
          key: `text-${index}-before`,
          value: text.slice(lastIndex, start),
          highlight: false
        });
      }

      if (end > start) {
        parts.push({
          key: `text-${index}-entity`,
          value: text.slice(start, end),
          highlight: true,
          label: entity.entity_group
        });
      }

      lastIndex = Math.max(lastIndex, end);
    });

    if (lastIndex < text.length) {
      parts.push({
        key: "text-tail",
        value: text.slice(lastIndex),
        highlight: false
      });
    }

    return parts;
  }, [text, sortedEntities]);

  const sendMessage = async () => {
    setIsLoading(true);
    setError("");
    setResult([]);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Text analysis failed.");
        return;
      }

      setResult(Array.isArray(data.entities) ? data.entities : []);
    } catch (err) {
      setError("Unable to reach the API. Please confirm the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label className="field-label" htmlFor="clinical-text">
        Clinical text
      </label>
      <textarea
        id="clinical-text"
        className="textarea auto-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste a clinical note or discharge summary..."
        ref={textareaRef}
      />
      <div className="actions-row">
        <button
          className="button"
          onClick={sendMessage}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze text"}
        </button>
        <span className="helper-text">
          Entity highlights and table results update after analysis.
        </span>
      </div>

      {error ? <p className="empty-state">{error}</p> : null}

      <div className="results-block">
        <h3>Highlighted text</h3>
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
            <span>{highlightedText}</span>
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

export default Chat;