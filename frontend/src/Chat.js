import { useMemo, useState } from "react";

function Chat() {
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);

  const sortedEntities = useMemo(() => {
    return [...result]
      .filter((item) => Number.isFinite(item.start) && Number.isFinite(item.end))
      .sort((a, b) => a.start - b.start);
  }, [result]);

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
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setResult(data.entities);
  };

  return (
    <div>
      <h2>Chat Detection</h2>
      <p style={{ color: "#555" }}>
        Enter clinical text and see disease entities highlighted with table details.
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter medical text..."
      />
      <button onClick={sendMessage}>Analyze</button>

      <div style={{ marginTop: "16px" }}>
        <h3>Highlighted Text</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "12px",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            minHeight: "60px"
          }}
        >
          {Array.isArray(highlightedText) ? (
            highlightedText.map((part) =>
              part.highlight ? (
                <mark
                  key={part.key}
                  style={{
                    backgroundColor: "#ffe9a8",
                    padding: "0 4px",
                    borderRadius: "3px",
                    marginRight: "2px"
                  }}
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

      <div style={{ marginTop: "16px" }}>
        <h3>Entities</h3>
        {result.length === 0 ? (
          <p>No entities yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  Word
                </th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  Entity
                </th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  Score
                </th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  Start
                </th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                  End
                </th>
              </tr>
            </thead>
            <tbody>
              {result.map((entity, index) => (
                <tr key={`${entity.word}-${index}`}>
                  <td style={{ padding: "6px 4px" }}>{entity.word}</td>
                  <td style={{ padding: "6px 4px" }}>{entity.entity_group}</td>
                  <td style={{ padding: "6px 4px" }}>
                    {entity.score?.toFixed ? entity.score.toFixed(2) : "-"}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{entity.start ?? "-"}</td>
                  <td style={{ padding: "6px 4px" }}>{entity.end ?? "-"}</td>
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