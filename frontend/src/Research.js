function Research() {
  return (
    <section id="research" className="research-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Our Research</h2>
          <p className="section-subtitle">
            Deep Learning-based Named Entity Recognition for Medical Text Analysis
          </p>
        </div>

        <div className="research-grid">
          <div className="research-card">
            <div className="research-icon">🎯</div>
            <h3>Project Objective</h3>
            <p>
              Develop an intelligent NER system using BioBERT to automatically extract and classify 
              medical entities (diseases, symptoms, signs) from clinical text and PDF documents, 
              enabling faster medical data analysis and decision support.
            </p>
          </div>

          <div className="research-card">
            <div className="research-icon">🧠</div>
            <h3>Model Architecture</h3>
            <p>
              Built on BioBERT (Bidirectional Encoder Representations from Transformers for Biomedical Text Mining), 
              fine-tuned on medical datasets. The model uses token classification with aggregation strategy 
              to identify entity boundaries and categories with high precision.
            </p>
          </div>

          <div className="research-card">
            <div className="research-icon">⚙️</div>
            <h3>Technical Implementation</h3>
            <p>
              Flask-based REST API backend with Transformers pipeline for inference. 
              React frontend with real-time entity highlighting. Supports both direct text input 
              and PDF document processing using pdfplumber for text extraction.
            </p>
          </div>

          <div className="research-card">
            <div className="research-icon">📈</div>
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>Multi-entity recognition (Disease, Symptom, Sign)</li>
              <li>Confidence scoring for each prediction</li>
              <li>Text chunking for long documents</li>
              <li>Sentence-level context enhancement</li>
              <li>Real-time visual feedback</li>
            </ul>
          </div>

          <div className="research-card">
            <div className="research-icon">🔬</div>
            <h3>Dataset & Training</h3>
            <p>
              Model trained on NCBI Disease Corpus with 5,479 training samples, 924 validation samples, 
              and 941 test samples. Dataset uses BIO tagging scheme with 124,943 O tags, 5,191 B-Disease tags, 
              and 6,122 I-Disease tags for comprehensive disease entity recognition.
            </p>
          </div>

          <div className="research-card">
            <div className="research-icon">🚀</div>
            <h3>Applications</h3>
            <p>
              Clinical decision support, automated medical coding, patient record analysis, 
              drug safety monitoring, epidemiological research, and healthcare data mining. 
              Reduces manual annotation time and improves consistency in medical data processing.
            </p>
          </div>
        </div>

        {/* Results & Performance Section */}
        <div className="results-performance-section">
          <h3 className="results-title">Results & Performance</h3>
          
          <div className="metrics-grid">
            <div className="metric-card highlight-card">
              <div className="metric-icon">🏆</div>
              <div className="metric-value">88.32%</div>
              <div className="metric-label">F1 Score</div>
              <div className="metric-description">Overall model performance</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-value">86.51%</div>
              <div className="metric-label">Precision</div>
              <div className="metric-description">Accuracy of predictions</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-value">90.21%</div>
              <div className="metric-label">Recall</div>
              <div className="metric-description">Entity detection rate</div>
            </div>
          </div>

          <div className="benchmark-section">
            <h4 className="benchmark-title">Comparison with State-of-the-Art Models</h4>
            <p className="benchmark-description">
              Our BioBERT NCBI model achieves competitive performance compared to established benchmarks 
              from Durango et al. (2023), demonstrating strong capability in disease entity recognition.
            </p>
            
            <div className="benchmark-table-wrapper">
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>F1 Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="highlight-row">
                    <td className="model-name">YOUR MODEL (BioBERT NCBI)</td>
                    <td className="score-value">0.8832</td>
                    <td><span className="status-badge your-model">Your Model</span></td>
                  </tr>
                  <tr>
                    <td className="model-name">n2c2 Ensemble (BERT+BiLSTM)</td>
                    <td className="score-value">0.9458</td>
                    <td><span className="status-badge benchmark">Benchmark</span></td>
                  </tr>
                  <tr>
                    <td className="model-name">CNN+BERT ICU discharge</td>
                    <td className="score-value">0.9440</td>
                    <td><span className="status-badge benchmark">Benchmark</span></td>
                  </tr>
                  <tr>
                    <td className="model-name">n2c2 2018 (BiLSTM-CRF)</td>
                    <td className="score-value">0.9200</td>
                    <td><span className="status-badge benchmark">Benchmark</span></td>
                  </tr>
                  <tr>
                    <td className="model-name">CCKS2017 (CNN+Attention)</td>
                    <td className="score-value">0.9034</td>
                    <td><span className="status-badge benchmark">Benchmark</span></td>
                  </tr>
                  <tr>
                    <td className="model-name">i2b2 2012 (Rule+ML hybrid)</td>
                    <td className="score-value">0.8760</td>
                    <td><span className="status-badge benchmark">Benchmark</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dataset-info">
            <h4 className="dataset-title">Dataset Statistics</h4>
            <div className="dataset-stats">
              <div className="stat-box">
                <div className="stat-number">5,479</div>
                <div className="stat-text">Training Samples</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">924</div>
                <div className="stat-text">Validation Samples</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">941</div>
                <div className="stat-text">Test Samples</div>
              </div>
            </div>
            
            <div className="tag-distribution">
              <h5>BIO Tag Distribution (NCBI Disease Training Set)</h5>
              <div className="tag-bars">
                <div className="tag-bar-item">
                  <div className="tag-bar-label">
                    <span className="tag-name">O (Outside)</span>
                    <span className="tag-count">124,943</span>
                  </div>
                  <div className="tag-bar-container">
                    <div className="tag-bar tag-o" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div className="tag-bar-item">
                  <div className="tag-bar-label">
                    <span className="tag-name">I-Disease (Inside)</span>
                    <span className="tag-count">6,122</span>
                  </div>
                  <div className="tag-bar-container">
                    <div className="tag-bar tag-i" style={{width: '4.9%'}}></div>
                  </div>
                </div>
                <div className="tag-bar-item">
                  <div className="tag-bar-label">
                    <span className="tag-name">B-Disease (Begin)</span>
                    <span className="tag-count">5,191</span>
                  </div>
                  <div className="tag-bar-container">
                    <div className="tag-bar tag-b" style={{width: '4.15%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="methodology-section">
          <h3 className="methodology-title">Processing Pipeline</h3>
          <div className="pipeline-flow">
            <div className="pipeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Input</h4>
                <p>Text or PDF document</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Preprocessing</h4>
                <p>Text extraction & chunking</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>BioBERT</h4>
                <p>Token classification</p>
              </div>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Output</h4>
                <p>Annotated entities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h3 className="tech-title">Technology Stack</h3>
          <div className="tech-badges">
            <span className="tech-badge">Python</span>
            <span className="tech-badge">Flask</span>
            <span className="tech-badge">Transformers</span>
            <span className="tech-badge">BioBERT</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">PDFPlumber</span>
            <span className="tech-badge">REST API</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Research;
