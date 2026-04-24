function Home() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-badge">AI-Powered Medical NLP</div>
          <h1 className="hero-title">
            Extract Medical Entities with
            <span className="gradient-text"> BioBERT Intelligence</span>
          </h1>
          <p className="hero-description">
            Advanced Named Entity Recognition for clinical text and medical documents. 
            Automatically identify diseases, symptoms, and medical conditions from unstructured healthcare data.
          </p>
          
          <div className="hero-actions">
            <button 
              className="hero-button primary"
              onClick={() => scrollToSection('process')}
            >
              Start Processing
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="hero-button secondary"
              onClick={() => scrollToSection('research')}
            >
              View Research
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">BioBERT</div>
              <div className="stat-label">Pre-trained Model</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">88%+</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">Real-time</div>
              <div className="stat-label">Processing</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📄</div>
            <div className="card-text">Clinical Notes</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🧬</div>
            <div className="card-text">Disease Detection</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📊</div>
            <div className="card-text">Entity Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
