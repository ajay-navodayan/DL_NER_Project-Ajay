import Chat from "./Chat";
import Upload from "./Upload";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">NER</div>
          <div>
            <p className="brand-title">Clinical NER Studio</p>
            <p className="brand-subtitle">
              Disease entity extraction for text and PDFs
            </p>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-meta">Clinical NLP workspace</div>
        </div>
      </header>

      <main className="app-grid">
        <section className="card">
          <div className="card-header">
            <h2>Realtime Text Analysis</h2>
            <p>Paste clinical notes to highlight disease entities in context.</p>
          </div>
          <div className="card-body">
            <Chat />
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>PDF Entity Scan</h2>
            <p>Upload a PDF report and review extracted entities instantly.</p>
          </div>
          <div className="card-body">
            <Upload />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        Built for rapid medical NLP review. Results shown are model outputs only.
      </footer>
    </div>
  );
}

export default App;