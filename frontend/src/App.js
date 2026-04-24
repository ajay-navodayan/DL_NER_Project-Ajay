import Navigation from "./Navigation";
import Home from "./Home";
import Research from "./Research";
import Process from "./Process";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navigation />
      <Home />
      <Research />
      <Process />
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Clinical NER. Built with BioBERT for medical text analysis.</p>
          <p className="footer-note">Results are AI-generated predictions for research purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;