import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data.entities);
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

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

export default Upload;