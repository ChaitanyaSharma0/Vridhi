/* SkillForge — architecture reference */

// ── Layers ──
function setLayer(layer, open) {
  layer.classList.toggle('expanded', open);
  layer.querySelector('.layer-toggle').setAttribute('aria-expanded', open);
}

function toggleLayer(id) {
  const layer = document.getElementById(id);
  setLayer(layer, !layer.classList.contains('expanded'));
}

function expandAll() {
  document.querySelectorAll('.layer').forEach(l => setLayer(l, true));
}

function collapseAll() {
  document.querySelectorAll('.layer').forEach(l => setLayer(l, false));
}

document.addEventListener('DOMContentLoaded', () => {
  expandAll();
  renderKnowledgeGraph();
});

// ── Detail drawer content ──
const modalData = {
  naukri: {
    title: 'Naukri.com Job Postings',
    html: `
      <div class="modal-section">
        <h3>What is this?</h3>
        <p>Naukri.com is India's largest job portal. We ingest thousands of job postings to understand what skills Indian employers actually demand. Each posting gives us: job title, company, location, required skills (hidden in the description text), experience range, and salary range.</p>
      </div>
      <div class="modal-section">
        <h3>How we process it</h3>
        <div class="io-box">
          <div class="io-box-header input">Raw Job Posting (as received)</div>
          <div class="io-box-body">
{<br>
&nbsp;&nbsp;"title": "Senior Data Scientist",<br>
&nbsp;&nbsp;"company": "Flipkart",<br>
&nbsp;&nbsp;"location": "Bangalore, Karnataka",<br>
&nbsp;&nbsp;"experience": "4-7 years",<br>
&nbsp;&nbsp;"description": "We're looking for a Senior Data Scientist to join our<br>
&nbsp;&nbsp;&nbsp;recommendations team. You should have strong experience in Python,<br>
&nbsp;&nbsp;&nbsp;TensorFlow, building ML pipelines at scale, A/B testing for product<br>
&nbsp;&nbsp;&nbsp;features, SQL for data querying, and Apache Spark for big data<br>
&nbsp;&nbsp;&nbsp;processing. Strong statistical analysis background required.<br>
&nbsp;&nbsp;&nbsp;Experience with deep learning frameworks preferred.",<br>
&nbsp;&nbsp;"salary": "₹18-28 LPA",<br>
&nbsp;&nbsp;"posted_date": "2025-08-15"<br>
}
          </div>
        </div>
        <div class="flow-arrow">↓ NLP Engine (Layer 2) extracts skills</div>
        <div class="io-box">
          <div class="io-box-header output">After Processing (stored in MongoDB)</div>
          <div class="io-box-body">
{<br>
&nbsp;&nbsp;"posting_id": "NK_28491",<br>
&nbsp;&nbsp;"role_normalized": "Data Scientist",<br>
&nbsp;&nbsp;"company": "Flipkart",<br>
&nbsp;&nbsp;"city": "Bangalore",<br>
&nbsp;&nbsp;"experience_min": 4,<br>
&nbsp;&nbsp;"experience_max": 7,<br>
&nbsp;&nbsp;"salary_min": 1800000,<br>
&nbsp;&nbsp;"salary_max": 2800000,<br>
&nbsp;&nbsp;<span class="highlight">"extracted_skills"</span>: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;"Python", "TensorFlow", "Machine Learning",<br>
&nbsp;&nbsp;&nbsp;&nbsp;"A/B Testing", "SQL", "Apache Spark",<br>
&nbsp;&nbsp;&nbsp;&nbsp;"Statistical Analysis", "Deep Learning"<br>
&nbsp;&nbsp;],<br>
&nbsp;&nbsp;"skill_count": 8,<br>
&nbsp;&nbsp;"date": "2025-08-15",<br>
&nbsp;&nbsp;"source": "naukri.com"<br>
}
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h3>What it feeds into</h3>
        <p>
          → <strong>SkillRadar</strong>: Counts skill mentions per month to detect trends<br>
          → <strong>TalentMatch</strong>: Builds the "ideal skill vector" for each role<br>
          → <strong>CompIntel</strong>: Salary ranges become training data for prediction model<br>
          → <strong>Knowledge Graph</strong>: Skill-role edges weighted by mention frequency
        </p>
      </div>
    `
  },

  linkedin: {
    title: 'LinkedIn & Glassdoor India',
    html: `
      <div class="modal-section">
        <h3>What is this?</h3>
        <p>Compensation and salary data from LinkedIn Salary Insights and Glassdoor India. Provides salary distributions by role, experience, city, and company size. This is the primary training data for our CompIntel salary prediction model.</p>
      </div>
      <div class="modal-section">
        <h3>Sample Data Points</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-blue">Record 1:</span> ML Engineer, Hyderabad, 5yr exp → ₹22L base, ₹28L total<br>
<span class="highlight-blue">Record 2:</span> Data Analyst, Mumbai, 2yr exp → ₹8L base, ₹10L total<br>
<span class="highlight-blue">Record 3:</span> Senior SDE, Bangalore, 8yr exp → ₹35L base, ₹52L total<br>
<span class="highlight-blue">Record 4:</span> DevOps Engineer, Pune, 4yr exp → ₹16L base, ₹20L total<br>
<span class="highlight-blue">Record 5:</span> Data Scientist, Delhi NCR, 3yr exp → ₹14L base, ₹18L total<br>
<br><span class="dim">// Each record includes: role, city, experience, skills[], education, company_size, base_salary, total_comp</span>
          </div>
        </div>
      </div>
    `
  },

  nsdc: {
    title: 'NSDC & NASSCOM Reports',
    html: `
      <div class="modal-section">
        <h3>What is this?</h3>
        <p>Government and industry body data from the National Skill Development Corporation (NSDC) and NASSCOM. Provides official employability statistics, national qualification frameworks, and sector-wise workforce demand projections.</p>
      </div>
      <div class="modal-section">
        <h3>Key Data Points We Use</h3>
        <div class="io-box">
          <div class="io-box-body">
• <span class="highlight">NASSCOM</span>: Only ~25% of Indian graduates are employable<br>
• <span class="highlight">NSDC</span>: India produces 1.5M+ engineering graduates/year<br>
• <span class="highlight">NSDC</span>: Sector-wise skill demand projections 2025-2030<br>
• <span class="highlight">NASSCOM</span>: Technology sector workforce = 5.4M professionals<br>
• <span class="highlight">Skill Framework</span>: National Occupation Standards (NOS)<br>

          </div>
        </div>
      </div>
    `
  },

  university: {
    title: 'University Syllabi',
    html: `
      <div class="modal-section">
        <h3>What is this?</h3>
        <p>Actual course syllabi from Indian engineering institutions — IITs, NITs, and state universities. We extract topics covered per course and compare them against what the job market actually demands.</p>
      </div>
      <div class="modal-section">
        <h3>Full Processing Example</h3>
        <div class="io-box">
          <div class="io-box-header input">Raw Syllabus (PDF/text)</div>
          <div class="io-box-body">
<span class="highlight-blue">Course:</span> COL774 Machine Learning (IIT Delhi)<br>
<span class="highlight-blue">Topics:</span><br>
• Linear Regression and Logistic Regression<br>
• Support Vector Machines<br>
• Neural Networks and Backpropagation<br>
• Decision Trees and Random Forests<br>
• Clustering (K-Means, Hierarchical)<br>
• Dimensionality Reduction (PCA, t-SNE)<br>
• Bayesian Methods<br>
• Ensemble Methods
          </div>
        </div>
        <div class="flow-arrow">↓ NLP extracts skill terms + CurriculumSync scores</div>
        <div class="io-box">
          <div class="io-box-header output">CurriculumSync Output</div>
          <div class="io-box-body">
<span class="highlight">Extracted Skills:</span> ["Linear Regression", "SVM",<br>
&nbsp;&nbsp;"Neural Networks", "Decision Trees", "Random Forest",<br>
&nbsp;&nbsp;"K-Means", "PCA", "t-SNE", "Ensemble Methods"]<br><br>
<span class="highlight-blue">Market Demand Match:</span><br>
&nbsp;&nbsp;✅ Neural Networks → <span class="highlight">HIGH demand</span><br>
&nbsp;&nbsp;✅ Random Forest → <span class="highlight">HIGH demand</span><br>
&nbsp;&nbsp;✅ PCA → <span class="highlight-orange">MEDIUM demand</span><br>
&nbsp;&nbsp;⚠️ SVM → <span class="highlight-orange">LOW demand (declining)</span><br><br>
<span class="highlight-orange">Missing from syllabus (market wants):</span><br>
&nbsp;&nbsp;❌ TensorFlow/PyTorch (practical frameworks)<br>
&nbsp;&nbsp;❌ MLOps/Model Deployment<br>
&nbsp;&nbsp;❌ LLMs/Transformers<br>
&nbsp;&nbsp;❌ A/B Testing<br><br>
<span class="highlight">Alignment Score: 62%</span>
          </div>
        </div>
      </div>
    `
  },

  resumes: {
    title: 'Candidate Resumes',
    html: `
      <div class="modal-section">
        <h3>How Resume Analysis Works</h3>
        <p>Users upload a resume (or paste text). The NLP engine extracts their skills. TalentMatch then compares against the ideal skill vector for their target role. CompIntel predicts salary impact of each missing skill.</p>
      </div>
      <div class="modal-section">
        <div class="io-box">
          <div class="io-box-header input">User Uploads Resume</div>
          <div class="io-box-body">
"Rahul Sharma | 3 years experience<br>
Skills: Python, SQL, pandas, NumPy, Jupyter,<br>
Git, basic machine learning, Excel<br>
Education: B.Tech CSE, VIT Vellore<br>
Projects: Stock price predictor, sentiment analysis"
          </div>
        </div>
        <div class="flow-arrow">↓ NLP Engine extracts & normalizes</div>
        <div class="io-box">
          <div class="io-box-header output">Extracted Profile</div>
          <div class="io-box-body">
{<br>
&nbsp;&nbsp;<span class="highlight">"skills"</span>: ["Python", "SQL", "pandas", "NumPy",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Git", "Machine Learning"],<br>
&nbsp;&nbsp;<span class="highlight">"experience_years"</span>: 3,<br>
&nbsp;&nbsp;<span class="highlight">"education"</span>: "B.Tech CSE",<br>
&nbsp;&nbsp;<span class="highlight">"institution_tier"</span>: "Tier-2"<br>
}
          </div>
        </div>
      </div>
    `
  },

  esco: {
    title: 'ESCO Taxonomy',
    html: `
      <div class="modal-section">
        <h3>What is ESCO?</h3>
        <p>ESCO (European Skills, Competences, Qualifications and Occupations) is an official EU classification with 13,000+ skills. We use a curated subset of 500+ tech skills. It gives us a standardized skill vocabulary so "ML", "machine learning", and "Machine Learning (ML)" all resolve to the same canonical term.</p>
      </div>
      <div class="modal-section">
        <h3>Why It Matters</h3>
        <p>Without normalization, our models would treat "JS", "JavaScript", and "javascript" as three different skills. ESCO eliminates this.</p>
        <div class="io-box mt-2">
          <div class="io-box-body">
<span class="highlight-blue">Example mappings:</span><br><br>
"JS" → <span class="highlight">JavaScript</span><br>
"react.js" → <span class="highlight">React</span><br>
"k8s" → <span class="highlight">Kubernetes</span><br>
"DL" → <span class="highlight">Deep Learning</span><br>
"NLP" → <span class="highlight">Natural Language Processing</span><br>
"AWS" → <span class="highlight">Amazon Web Services</span><br>
"postgres" → <span class="highlight">PostgreSQL</span><br>
"tf" → <span class="highlight">TensorFlow</span>
          </div>
        </div>
      </div>
    `
  },

  skillner: {
    title: 'Skill NER (Hybrid Extraction)',
    html: `
      <div class="modal-section">
        <h3>The Core Engine</h3>
        <p>This is the single most important function in SkillForge. Everything downstream depends on accurate skill extraction. We use a two-pass approach:</p>
      </div>
      <div class="modal-section">
        <h3>Pass 1: Dictionary/Regex Match</h3>
        <div class="io-box">
          <div class="io-box-header process">How it works</div>
          <div class="io-box-body">
<span class="highlight-blue">Input text:</span><br>
"Need Python expert with TensorFlow and Spark experience"<br><br>
<span class="highlight">ESCO dictionary scan:</span><br>
→ Found: "Python" ✅ (exact match)<br>
→ Found: "TensorFlow" ✅ (exact match)<br>
→ Found: "Spark" → mapped to "Apache Spark" ✅<br><br>
<span class="dim">Fast, deterministic, catches ~80% of skills</span>
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h3>Pass 2: LLM-Assisted (Groq)</h3>
        <div class="io-box">
          <div class="io-box-header process">For skills the dictionary missed</div>
          <div class="io-box-body">
<span class="highlight-purple">Prompt to Groq:</span><br>
"Extract technical skills from this text that are NOT<br>
in this list: [Python, TensorFlow, Apache Spark].<br>
Text: 'Need Python expert with TensorFlow and Spark<br>
experience. Must know CI/CD pipelines and agile.'"<br><br>
<span class="highlight-purple">LLM returns:</span><br>
→ "CI/CD" ✅ (emerging skill, not in ESCO dictionary)<br>
→ "Agile" ✅ (methodology, often missed by regex)<br><br>
<span class="dim">Catches emerging skills, niche terms, methodologies</span>
          </div>
        </div>
      </div>
    `
  },

  embeddings: {
    title: 'Semantic Embeddings',
    html: `
      <div class="modal-section">
        <h3>What are Embeddings?</h3>
        <p>We convert text into numbers (vectors) that capture <strong>meaning</strong>. The model (MiniLM-L6-v2) turns any text into a 384-dimensional vector. Similar concepts end up as similar vectors — so we can compute "how similar is Python to pandas?" mathematically.</p>
      </div>
      <div class="modal-section">
        <h3>Where embeddings are used</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight">1. TalentMatch:</span> Resume embedding vs. role embedding<br>
&nbsp;&nbsp;→ Cosine similarity = match %<br><br>
<span class="highlight">2. RAG Pipeline:</span> User query embedded → search ChromaDB<br>
&nbsp;&nbsp;→ Find most relevant data chunks<br><br>
<span class="highlight">3. Skill Clustering:</span> Embed all skills → K-Means clustering<br>
&nbsp;&nbsp;→ Auto-discover skill categories<br><br>
<span class="highlight">4. t-SNE Visualization:</span> Reduce 384D → 2D for plotting<br>
&nbsp;&nbsp;→ A 2D skill map showing natural clusters
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h3>ChromaDB Storage</h3>
        <p>All embeddings are stored in ChromaDB — a vector database optimized for semantic search. When the RAG pipeline needs to answer "what skills should I learn?", it searches ChromaDB for the most relevant data chunks about that topic, then feeds them to Groq LLM as context.</p>
      </div>
    `
  },

  skillradar: {
    title: 'SkillRadar — Trend Forecaster',
    html: `
      <div class="modal-section">
        <h3>How SkillRadar Works</h3>
        <p>SkillRadar answers: "What skills are rising, and which are dying?" It groups job postings by month, counts skill mentions per role, and classifies trends. Then uses time-series forecasting to predict 6 months ahead.</p>
      </div>
      <div class="modal-section">
        <h3>Step-by-Step Pipeline</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-blue">Step 1:</span> Group processed_postings by (month, role, city)<br><br>
<span class="highlight-blue">Step 2:</span> Count skill mentions per group<br>
&nbsp;&nbsp;Jan 2025: Python=450, TensorFlow=180, Hadoop=45<br>
&nbsp;&nbsp;Feb 2025: Python=460, TensorFlow=210, Hadoop=38<br>
&nbsp;&nbsp;Mar 2025: Python=455, TensorFlow=245, Hadoop=30<br>
&nbsp;&nbsp;...<br><br>
<span class="highlight-blue">Step 3:</span> Calculate growth rate<br>
&nbsp;&nbsp;TensorFlow: (245-180)/180 = <span class="highlight">+36% in 3 months</span><br>
&nbsp;&nbsp;Hadoop: (30-45)/45 = <span class="highlight-orange">-33% in 3 months</span><br><br>
<span class="highlight-blue">Step 4:</span> Classify<br>
&nbsp;&nbsp;>15% growth → <span class="highlight">Rising</span><br>
&nbsp;&nbsp;-15% to +15% → <span class="highlight-blue">→ Stable</span><br>
&nbsp;&nbsp;&lt;-15% growth → <span class="highlight-orange">Declining</span><br><br>
<span class="highlight-blue">Step 5:</span> ARIMA/Linear Reg forecast for next 6 months<br>
&nbsp;&nbsp;TensorFlow (Oct 2025 predicted): 380 mentions<br>
&nbsp;&nbsp;Hadoop (Oct 2025 predicted): 12 mentions
          </div>
        </div>
      </div>
      <div class="modal-section">
        <div class="chart">
          <p class="chart-title">Data Scientist skills, Bangalore, last 6 months</p>
          <div class="bars">
            <div class="bar-row" data-trend="up"><span>LangChain</span><span class="bar-track"><span class="bar-fill" style="--w:92%"></span></span><span class="bar-value">+340%</span></div>
            <div class="bar-row" data-trend="up"><span>MLOps</span><span class="bar-track"><span class="bar-fill" style="--w:72%"></span></span><span class="bar-value">+89%</span></div>
            <div class="bar-row" data-trend="up"><span>Kubernetes</span><span class="bar-track"><span class="bar-fill" style="--w:55%"></span></span><span class="bar-value">+45%</span></div>
            <div class="bar-row"><span>Python</span><span class="bar-track"><span class="bar-fill" style="--w:95%"></span></span><span class="bar-value">95%</span></div>
            <div class="bar-row" data-trend="down"><span>Hadoop</span><span class="bar-track"><span class="bar-fill" style="--w:20%"></span></span><span class="bar-value">−52%</span></div>
            <div class="bar-row" data-trend="down"><span>jQuery</span><span class="bar-track"><span class="bar-fill" style="--w:12%"></span></span><span class="bar-value">−67%</span></div>
          </div>
          <ul class="legend"><li><i class="up"></i>Rising</li><li><i></i>Stable</li><li><i class="down"></i>Declining</li></ul>
        </div>
      </div>
    `
  },

  talentmatch: {
    title: 'TalentMatch — Gap Engine',
    html: `
      <div class="modal-section">
        <h3>How TalentMatch Works</h3>
        <p>This module answers: "How well do I match a target role, and what should I learn next?" It uses semantic embeddings to compare your skills against the ideal skill profile for any role.</p>
      </div>
      <div class="modal-section">
        <h3>Full Example Walkthrough</h3>
        <div class="io-box">
          <div class="io-box-header input">Input</div>
          <div class="io-box-body">
<span class="highlight-blue">User skills:</span> Python, SQL, pandas, NumPy, Git<br>
<span class="highlight-blue">Target role:</span> Data Scientist<br>
<span class="highlight-blue">Target city:</span> Bangalore
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="io-box">
          <div class="io-box-header process">Processing Steps</div>
          <div class="io-box-body">
<span class="highlight-blue">Step 1:</span> Aggregate all Data Scientist postings in Bangalore<br>
&nbsp;&nbsp;→ 2,400 postings found<br><br>
<span class="highlight-blue">Step 2:</span> Build "ideal skill vector"<br>
&nbsp;&nbsp;→ Most demanded: Python(95%), ML(88%), SQL(82%),<br>
&nbsp;&nbsp;&nbsp;&nbsp;TensorFlow(72%), Statistics(68%), Spark(55%),<br>
&nbsp;&nbsp;&nbsp;&nbsp;Deep Learning(52%), NLP(45%), Cloud(42%)...<br><br>
<span class="highlight-blue">Step 3:</span> Embed user skills + role skills<br>
&nbsp;&nbsp;→ Cosine similarity: <span class="highlight">0.42 (42% match)</span><br><br>
<span class="highlight-blue">Step 4:</span> Rank missing skills by impact<br>
&nbsp;&nbsp;→ For each missing skill, compute:<br>
&nbsp;&nbsp;&nbsp;&nbsp;match_boost = how much match % improves<br>
&nbsp;&nbsp;&nbsp;&nbsp;salary_impact = from CompIntel model
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="io-box">
          <div class="io-box-header output">Final Output</div>
          <div class="io-box-body">
<span class="highlight">Match Score: 42%</span><br><br>
<strong>Your matched skills:</strong>
<div class="skill-tags mt-1">
  <span class="skill-tag matched">Python ✓</span>
  <span class="skill-tag matched">SQL ✓</span>
  <span class="skill-tag matched">pandas ✓</span>
  <span class="skill-tag matched">NumPy ✓</span>
</div><br>
<strong>Skills to learn (ranked by impact):</strong><br>
1. <span class="skill-tag missing">Machine Learning</span> → +18% match | +₹2.1L/yr<br>
2. <span class="skill-tag missing">TensorFlow</span> → +14% match | +₹1.8L/yr<br>
3. <span class="skill-tag missing">Statistics</span> → +12% match | +₹1.2L/yr<br>
4. <span class="skill-tag missing">Deep Learning</span> → +8% match | +₹1.5L/yr<br>
5. <span class="skill-tag missing">Apache Spark</span> → +6% match | +₹0.9L/yr
          </div>
        </div>
      </div>
    `
  },

  compintel: {
    title: 'CompIntel — Salary Predictor',
    html: `
      <div class="modal-section">
        <h3>How CompIntel Works</h3>
        <p>A multi-model ensemble (RandomForest + XGBoost + GradientBoosting) trained on Indian salary data. Predicts salary from skills + experience + location + education. Includes a "What-if" simulator and SHAP explainability.</p>
      </div>
      <div class="modal-section">
        <h3>Model Training</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-blue">Training Data:</span><br>
→ ~10,000 salary records from LinkedIn/Glassdoor India<br>
→ Features: skills (one-hot), experience_years, city,<br>
&nbsp;&nbsp;education_level, company_size<br>
→ Target: annual_compensation<br><br>
<span class="highlight-blue">Ensemble:</span><br>
→ RandomForest(n=100) + XGBoost(n=100) + GradientBoosting(n=100)<br>
→ VotingRegressor averages predictions<br>
→ <span class="highlight">R² = 0.84</span> on test set<br>
→ <span class="highlight">RMSE = ₹2.8L</span><br><br>
<span class="highlight-blue">MLflow logging:</span><br>
→ Every training run tracked with hyperparams + metrics<br>
→ Model artifacts versioned and reproducible
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h3>"What-if" Simulator Demo</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-orange">Base profile:</span><br>
Skills: Python, SQL | Exp: 3yr | City: Bangalore<br>
<span class="highlight">Predicted salary: ₹12.8 LPA</span><br><br>
<span class="highlight-orange">What if: Add "Machine Learning"?</span><br>
<span class="highlight">New prediction: ₹15.6 LPA (+₹2.8L)</span><br><br>
<span class="highlight-orange">What if: Add "Kubernetes" too?</span><br>
<span class="highlight">New prediction: ₹17.2 LPA (+₹4.4L total)</span><br><br>
<span class="highlight-orange">What if: Move to Hyderabad?</span><br>
<span class="highlight">New prediction: ₹15.8 LPA (-₹1.4L from BLR)</span><br><br>
<span class="dim">// The slider UI in Streamlit makes this interactive</span><br>
<span class="dim">// Toggle a skill and watch the prediction change live</span>
          </div>
        </div>
      </div>
    `
  },

  curriculumsync: {
    title: 'CurriculumSync — Alignment Scorer',
    html: `
      <div class="modal-section">
        <h3>How CurriculumSync Works</h3>
        <p>Compares what universities teach vs. what the market demands. Scores each course by skill overlap. Auto-generates a PDF report for academic deans with specific recommendations.</p>
      </div>
      <div class="modal-section">
        <h3>Full Pipeline Example</h3>
        <div class="io-box">
          <div class="io-box-header input">Input: IIT Delhi CS Department</div>
          <div class="io-box-body">
8 courses analyzed:<br>
COL100, COL106, COL216, COL226, COL331,<br>
COL672, COL774, COL870
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="io-box">
          <div class="io-box-header output">Alignment Report</div>
          <div class="io-box-body">
<span class="highlight">Overall Department Score: 68%</span><br><br>
<strong>Course-by-Course:</strong><br>
COL106 Data Structures: <span class="highlight">91%</span> ████████████████████▓<br>
COL774 Machine Learning: <span class="highlight">82%</span> ██████████████████░░<br>
COL672 NLP: <span class="highlight">75%</span> █████████████████░░░<br>
COL226 Programming: <span class="highlight-blue">65%</span> ███████████████░░░░░<br>
COL331 OS: <span class="highlight-orange">45%</span> ███████████░░░░░░░░░<br>
COL216 Architecture: <span class="highlight-orange">28%</span> ████████░░░░░░░░░░░░<br><br>
<strong>✅ Strengths:</strong><br>
→ Strong ML/AI curriculum<br>
→ Good data structures foundation<br><br>
<strong>❌ Gaps to Address:</strong><br>
→ No MLOps/Deployment curriculum<br>
→ No Cloud Computing courses<br>
→ Missing: LLMs, Transformers, LangChain<br>
→ No A/B Testing / Experimentation course<br><br>
<span class="dim">→ Auto-generated PDF report: "IIT_Delhi_CS_Gap_Report.pdf"</span>
          </div>
        </div>
      </div>
    `
  },

  knowledgegraph: {
    title: 'Knowledge Graph',
    html: `
      <div class="modal-section">
        <h3>What is the Knowledge Graph?</h3>
        <p>A graph database mapping relationships between 500+ skills, 50+ job roles, and 15 industry sectors. Built with NetworkX and visualized as an interactive HTML page using pyvis. Edges are weighted by co-occurrence frequency in job postings.</p>
      </div>
      <div class="modal-section">
        <h3>What it looks like</h3>
        <p>An interactive node graph where you can click "Python" and see every role that needs it, with edge thickness showing demand strength. Click "Data Scientist" and see all skills connected to it.</p>
        <div class="io-box mt-2">
          <div class="io-box-body">
<span class="highlight-blue">Sample edges:</span><br>
"Data Scientist" → "Python" (weight: 0.95)<br>
"Data Scientist" → "TensorFlow" (weight: 0.72)<br>
"Data Scientist" → "SQL" (weight: 0.82)<br>
"ML Engineer" → "Python" (weight: 0.90)<br>
"ML Engineer" → "Kubernetes" (weight: 0.65)<br>
"Backend Dev" → "Node.js" (weight: 0.78)<br>
"FinTech" → "Data Scientist" (weight: 0.80)<br>
"E-commerce" → "ML Engineer" (weight: 0.75)
          </div>
        </div>
      </div>
    `
  },

  tsne: {
    title: 't-SNE Skill Space',
    html: `
      <div class="modal-section">
        <h3>What is t-SNE?</h3>
        <p>t-SNE (t-distributed Stochastic Neighbor Embedding) reduces our 384-dimensional skill embeddings to 2D for visualization. Similar skills end up close together on the plot. The result is a skill map where natural clusters are easy to see.</p>
      </div>
      <div class="modal-section">
        <h3>What you see</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight">Cluster 1 (blue):</span> ML/AI skills<br>
&nbsp;&nbsp;TensorFlow, PyTorch, Scikit-learn, Keras, SHAP<br><br>
<span class="highlight-green">Cluster 2 (green):</span> Data Engineering<br>
&nbsp;&nbsp;Spark, Airflow, Kafka, Hadoop, ETL<br><br>
<span class="highlight-orange">Cluster 3 (orange):</span> Web/Backend<br>
&nbsp;&nbsp;React, Node.js, Django, FastAPI, REST<br><br>
<span class="highlight-purple">Cluster 4 (purple):</span> DevOps/Cloud<br>
&nbsp;&nbsp;Docker, Kubernetes, AWS, Terraform, CI/CD<br><br>
<span class="highlight-blue">Cluster 5 (cyan):</span> Data Analysis<br>
&nbsp;&nbsp;SQL, pandas, Excel, Tableau, PowerBI<br><br>
<span class="dim">// Python sits between clusters (used everywhere)</span>
          </div>
        </div>
      </div>
    `
  },

  mlflow: {
    title: 'MLflow Experiment Tracking',
    html: `
      <div class="modal-section">
        <h3>What is MLflow?</h3>
        <p>MLflow tracks every model training run. It logs hyperparameters, metrics, and model artifacts. Gives us a web UI at localhost:5000 showing all experiments. This is the MLOps part of the stack.</p>
      </div>
      <div class="modal-section">
        <div class="io-box">
          <div class="io-box-header process">What Gets Logged</div>
          <div class="io-box-body">
<span class="highlight-blue">Experiment: salary_prediction</span><br><br>
<strong>Run 1:</strong> XGBoost(n=50, depth=4)<br>
&nbsp;&nbsp;RMSE: ₹3.4L | R²: 0.78 | MAE: ₹2.1L<br><br>
<strong>Run 2:</strong> XGBoost(n=100, depth=6)<br>
&nbsp;&nbsp;RMSE: ₹2.9L | R²: 0.82 | MAE: ₹1.8L<br><br>
<strong>Run 3:</strong> Ensemble(RF+XGB+GBM, n=100)<br>
&nbsp;&nbsp;RMSE: ₹2.8L | <span class="highlight">R²: 0.84</span> | MAE: ₹1.7L ← best<br><br>
<span class="dim">// Model artifact saved, versioned, reproducible</span>
          </div>
        </div>
      </div>
    `
  },

  rag: {
    title: 'Agentic RAG Career Counselor',
    html: `
      <div class="modal-section">
        <h3>Why "Agentic" RAG?</h3>
        <p>Normal chatbots just call an LLM with a prompt. Our system is different — the LLM acts as an <strong>agent</strong> that decides which tools to use. When a user asks "What skills should I learn?", the LLM autonomously calls TalentMatch for gap analysis AND CompIntel for salary impact. No hardcoded if/else routing.</p>
      </div>
      <div class="modal-section">
        <h3>Complete Flow (Step by Step)</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-blue">1. USER QUERY:</span><br>
"I know Python and SQL. I want to become a Data Scientist<br>
in Bangalore. What should I learn? How much can I earn?"<br><br>

<span class="highlight-purple">2. GROQ LLM INTENT ANALYSIS:</span><br>
→ Detects TWO intents: skill_gap + salary_prediction<br>
→ Decides to call TWO functions:<br>
&nbsp;&nbsp;• <span class="highlight">analyze_resume</span>(skills=["Python","SQL"],<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target="Data Scientist", city="Bangalore")<br>
&nbsp;&nbsp;• <span class="highlight">predict_salary</span>(skills=["Python","SQL"],<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exp=0, city="Bangalore")<br><br>

<span class="highlight-orange">3. FUNCTION CALLING EXECUTES:</span><br>
→ TalentMatch returns:<br>
&nbsp;&nbsp;{match: 42%, gaps: [{skill:"ML", boost:18%},<br>
&nbsp;&nbsp;&nbsp;{skill:"TensorFlow", boost:14%}, ...]}<br>
→ CompIntel returns:<br>
&nbsp;&nbsp;{predicted_salary: "₹12.8L",<br>
&nbsp;&nbsp;&nbsp;with_ml: "₹15.6L (+₹2.8L)"}<br><br>

<span class="highlight">4. CHROMADB RETRIEVAL:</span><br>
→ Query: "Data Scientist skills Bangalore"<br>
→ Returns 5 relevant chunks:<br>
&nbsp;&nbsp;• "ML demand grew 23% in Indian tech..."<br>
&nbsp;&nbsp;• "Avg DS salary in Bangalore: ₹18.5L..."<br>
&nbsp;&nbsp;• "TensorFlow most demanded DL framework..."<br><br>

<span class="highlight">5. GROQ GENERATES FINAL RESPONSE:</span><br>
→ Combines module outputs + ChromaDB context<br>
→ Generates natural language response<br>
→ Grounded in REAL data, not hallucinated<br>
→ Includes specific numbers, percentages, ₹ values
          </div>
        </div>
      </div>
    `
  },

  streamlit: {
    title: 'Streamlit Dashboard',
    html: `
      <div class="modal-section">
        <h3>Multi-Page App Structure</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight">Page 1: Home / Overview</span><br>
→ Platform stats, quick links to modules<br><br>
<span class="highlight">Page 2: SkillRadar Dashboard</span><br>
→ Skill trend charts, rising/dying lists<br>
→ Filter by role, city, timeframe<br><br>
<span class="highlight">Page 3: TalentMatch</span><br>
→ Resume upload → gap analysis<br>
→ Visual skill match bars<br><br>
<span class="highlight">Page 4: CompIntel Salary Predictor</span><br>
→ Skill sliders → salary prediction<br>
→ SHAP waterfall chart<br>
→ What-if simulator<br><br>
<span class="highlight">Page 5: CurriculumSync</span><br>
→ University selector → alignment report<br>
→ PDF download button<br><br>
<span class="highlight">Page 6: Knowledge Graph Explorer</span><br>
→ Embedded pyvis interactive graph<br><br>
<span class="highlight">Page 7: AI Career Counselor</span><br>
→ Chat interface (streamlit-chat)<br>
→ Powered by Agentic RAG<br><br>
<span class="dim">// Dark theme + custom CSS for premium look</span><br>
<span class="dim">// Deployed on Streamlit Cloud (free)</span>
          </div>
        </div>
      </div>
    `
  },

  fastapi: {
    title: 'FastAPI + OpenAPI',
    html: `
      <div class="modal-section">
        <h3>API-First Architecture</h3>
        <p>Every intelligence module is exposed as a RESTful endpoint. FastAPI auto-generates Swagger docs at /docs, so any HR platform can integrate without extra documentation.</p>
      </div>
      <div class="modal-section">
        <h3>API Endpoints & Examples</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight">GET /api/v1/skills/trending?role=data_scientist&city=bangalore</span><br>
→ Returns top trending skills with growth %<br><br>
<span class="highlight-blue">POST /api/v1/resume/analyze</span><br>
→ Body: {resume_text, target_role}<br>
→ Returns match %, skill gaps, salary impact<br><br>
<span class="highlight">GET /api/v1/salary/predict?skills=python,ml&exp=5&city=blr</span><br>
→ Returns predicted salary + confidence interval<br><br>
<span class="highlight-blue">POST /api/v1/chat</span><br>
→ Body: {message, conversation_history}<br>
→ Returns RAG-grounded response<br><br>
<span class="highlight">GET /api/v1/knowledge-graph?skill=python</span><br>
→ Returns connected roles + edges<br><br>
<span class="dim">// Swagger UI at /docs</span>
          </div>
        </div>
      </div>
    `
  }
};

// ── Detail drawer ──
let lastFocus = null;

function openModal(key) {
  const data = modalData[key];
  if (!data) return;
  lastFocus = document.activeElement;
  document.getElementById('modalTitle').textContent = data.title;
  const body = document.getElementById('modalBody');
  body.innerHTML = data.html;
  body.parentElement.scrollTop = 0;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-close').focus();
}

function closeModal(event) {
  if (event.target === event.currentTarget) closeModalDirect();
}

function closeModalDirect() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModalDirect();
});

// Any element with data-modal opens its drawer; the title button inside handles keyboard.
document.addEventListener('click', e => {
  const el = e.target.closest('[data-modal]');
  if (el) openModal(el.dataset.modal);
});

// ── Interactive demo ──
const demoDatabase = {
  'Data Scientist': {
    idealSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics', 'Deep Learning', 'pandas', 'NLP', 'Spark', 'A/B Testing'],
    avgSalary: { Bangalore: 2240000, Hyderabad: 1980000, Mumbai: 2100000, 'Delhi NCR': 1950000, Pune: 1850000 },
    trending: { up: ['LangChain', 'MLOps', 'Kubernetes'], stable: ['Python', 'SQL'], down: ['Hadoop', 'SAS'] }
  },
  'ML Engineer': {
    idealSkills: ['Python', 'PyTorch', 'TensorFlow', 'Kubernetes', 'Docker', 'MLOps', 'SQL', 'AWS', 'CI/CD', 'Spark'],
    avgSalary: { Bangalore: 2600000, Hyderabad: 2300000, Mumbai: 2450000, 'Delhi NCR': 2200000, Pune: 2100000 },
    trending: { up: ['LangChain', 'LLMs', 'Vector DBs'], stable: ['PyTorch', 'Docker'], down: ['Keras', 'Theano'] }
  },
  'Backend Developer': {
    idealSkills: ['Python', 'Node.js', 'SQL', 'Docker', 'REST APIs', 'PostgreSQL', 'Redis', 'Git', 'AWS', 'Microservices'],
    avgSalary: { Bangalore: 1800000, Hyderabad: 1550000, Mumbai: 1700000, 'Delhi NCR': 1600000, Pune: 1500000 },
    trending: { up: ['Rust', 'Go', 'gRPC'], stable: ['Node.js', 'Python'], down: ['PHP', 'jQuery'] }
  },
  'Data Analyst': {
    idealSkills: ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'pandas', 'Statistics', 'R', 'Git', 'Looker'],
    avgSalary: { Bangalore: 1200000, Hyderabad: 1050000, Mumbai: 1100000, 'Delhi NCR': 1000000, Pune: 950000 },
    trending: { up: ['dbt', 'Looker', 'Python'], stable: ['SQL', 'Excel'], down: ['SAS', 'SPSS'] }
  }
};

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = s => s.replace(/[&<>"']/g, c => HTML_ESCAPES[c]);
const tag = (s, kind) => `<span class="skill-tag ${kind}">${escapeHtml(s)}</span>`;
const lakh = n => `₹${n.toFixed(1)}L`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let demoTimers = [];

function runInteractiveDemo() {
  const userSkills = document.getElementById('demoSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  const role = document.getElementById('demoRole').value;
  const city = document.getElementById('demoCity').value;
  const roleData = demoDatabase[role];

  const has = new Set(userSkills.map(s => s.toLowerCase()));
  const matched = roleData.idealSkills.filter(s => has.has(s.toLowerCase()));
  const missing = roleData.idealSkills.filter(s => !has.has(s.toLowerCase()));
  const perSkill = Math.round(100 / roleData.idealSkills.length);
  const matchPct = Math.round((matched.length / roleData.idealSkills.length) * 100);

  const salary = roleData.avgSalary[city] / 100000;
  const unit = Math.round(salary * 0.08 * 10) / 10;
  const boost = i => unit * (2.5 - 0.5 * i);  // salary gain for the i-th ranked gap
  const postings = (1200 + Math.floor(Math.random() * 800)).toLocaleString('en-IN');

  const gapItems = n => missing.slice(0, n)
    .map((s, i) => `<li>${tag(s, 'missing')} +${perSkill}% match · +${lakh(boost(i))}</li>`).join('');

  const gapList = missing.length
    ? `<ol class="gap-list">${gapItems(5)}</ol>`
    : '<p>No gaps. You already cover every core skill for this role.</p>';

  let whatIf = '<p>Nothing left to add for this role.</p>';
  if (missing.length) {
    whatIf = `<p>Add ${tag(missing[0], 'missing')} → <strong>${lakh(salary + boost(0))}</strong> (+${lakh(boost(0))})`;
    if (missing[1]) whatIf += `<br>Add ${tag(missing[1], 'missing')} too → <strong>${lakh(salary + boost(0) + boost(1))}</strong> (+${lakh(boost(0) + boost(1))})`;
    whatIf += '</p>';
  }

  const answer = missing.length
    ? `<p>Learn these next:</p><ol class="gap-list">${gapItems(3)}</ol>`
    : '<p>You already cover the core skills. The rising ones are where to look next.</p>';

  const steps = [
    {
      layer: 'Layer 1 · Ingestion',
      title: 'Find the relevant postings',
      detail: `<p>Filters 15,000+ processed postings in MongoDB for role “${role}” and city “${city}”. <strong>${postings}</strong> postings match.</p>`
    },
    {
      layer: 'Layer 2 · NLP',
      title: 'Normalise your skills',
      detail: userSkills.length
        ? `<div class="skill-tags">${userSkills.map(s => tag(s, 'neutral')).join('')}</div><p>Mapped to ESCO names and embedded with MiniLM-L6-v2 for comparison against the ${role} skill vector.</p>`
        : '<p>No skills entered, so everything below is measured from zero.</p>'
    },
    {
      layer: 'Layer 3 · TalentMatch',
      title: 'Measure the gap',
      detail: `<p class="big-num">${matchPct}%<small>match with ${role}</small></p>
        ${matched.length ? `<div class="skill-tags">${matched.map(s => tag(s, 'matched')).join('')}</div>` : ''}
        ${gapList}`
    },
    {
      layer: 'Layer 3 · CompIntel',
      title: 'Predict the salary',
      detail: `<p class="big-num">${lakh(salary)}<small>per year in ${city}</small></p>${whatIf}
        <p>Biggest SHAP factors: experience, ${escapeHtml(matched[0] || 'Python')}, city.</p>`
    },
    {
      layer: 'Layer 3 · SkillRadar',
      title: `Check what's moving for ${role}`,
      detail: `<div class="trend-lines">
        <div><span class="k">rising</span>${roleData.trending.up.map(s => tag(s, 'missing')).join('')}</div>
        <div><span class="k">stable</span>${roleData.trending.stable.map(s => tag(s, 'matched')).join('')}</div>
        <div><span class="k">declining</span>${roleData.trending.down.map(s => tag(s, 'neutral')).join('')}</div>
      </div>`
    },
    {
      layer: 'Layer 4 · Counselor',
      title: 'Answer in plain language',
      detail: `<div class="chat">
        <p class="chat-head">Counselor</p>
        <div class="msg user"><span class="who">You</span><p>I know ${userSkills.length ? escapeHtml(userSkills.join(', ')) : 'nothing yet'}. I want to become a ${role} in ${city}. What should I learn?</p></div>
        <div class="msg bot"><span class="who">SkillForge</span><div>
          <p>Across ${postings} ${role} postings in ${city}, you match <strong>${matchPct}%</strong>. Expected salary is <strong>${lakh(salary)}</strong>.</p>
          ${answer}
          <p class="source">Trending now: ${roleData.trending.up[0]}. Sources: TalentMatch, CompIntel, SkillRadar</p>
        </div></div>
      </div>`
    }
  ];

  demoTimers.forEach(clearTimeout);
  demoTimers = [];

  const list = document.getElementById('demoSteps');
  list.innerHTML = steps.map((s, i) => `
    <li class="demo-step">
      <span class="demo-num">0${i + 1}</span>
      <div>
        <h3><small>${s.layer}</small>${s.title}</h3>
        <div class="demo-detail">${s.detail}</div>
      </div>
    </li>`).join('');

  const items = [...list.children];
  if (reduceMotion) {
    items.forEach(el => el.classList.add('active'));
    return;
  }
  items.forEach((el, i) => demoTimers.push(setTimeout(() => el.classList.add('active'), 150 + i * 650)));
}

// ── Walkthrough: follow a packet down the layers, then run the demo ──
function runFullDemo() {
  expandAll();
  demoTimers.forEach(clearTimeout);
  demoTimers = [];

  const at = (ms, fn) => demoTimers.push(setTimeout(fn, reduceMotion ? 0 : ms));
  const pulse = id => {
    const p = document.getElementById(id);
    p.classList.remove('animate');
    void p.offsetWidth;  // restart the animation
    p.classList.add('animate');
  };
  const show = id => document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  at(300, () => show('layer1'));
  at(1600, () => { pulse('packet12'); show('layer2'); });
  at(3000, () => { pulse('packet23'); show('layer3'); });
  at(4400, () => { pulse('packet34'); show('layer4'); });
  at(5800, () => { show('demo'); runInteractiveDemo(); });
}

// ── Knowledge graph ──
const kgNodes = [
  { id: 'Data Scientist', type: 'role', x: 0.2, y: 0.22 },
  { id: 'ML Engineer', type: 'role', x: 0.5, y: 0.12 },
  { id: 'Backend Dev', type: 'role', x: 0.82, y: 0.26 },
  { id: 'Data Analyst', type: 'role', x: 0.14, y: 0.68 },
  { id: 'Python', type: 'skill', x: 0.38, y: 0.45 },
  { id: 'SQL', type: 'skill', x: 0.25, y: 0.52 },
  { id: 'TensorFlow', type: 'skill', x: 0.36, y: 0.24 },
  { id: 'Kubernetes', type: 'skill', x: 0.66, y: 0.36 },
  { id: 'Docker', type: 'skill', x: 0.74, y: 0.52 },
  { id: 'pandas', type: 'skill', x: 0.1, y: 0.42 },
  { id: 'PyTorch', type: 'skill', x: 0.56, y: 0.28 },
  { id: 'Node.js', type: 'skill', x: 0.9, y: 0.44 },
  { id: 'Tableau', type: 'skill', x: 0.1, y: 0.88 },
  { id: 'Statistics', type: 'skill', x: 0.32, y: 0.7 },
  { id: 'AWS', type: 'skill', x: 0.72, y: 0.12 },
  { id: 'MLOps', type: 'skill', x: 0.56, y: 0.55 },
  { id: 'FinTech', type: 'sector', x: 0.46, y: 0.84 },
  { id: 'E-commerce', type: 'sector', x: 0.66, y: 0.76 },
  { id: 'Healthcare', type: 'sector', x: 0.86, y: 0.72 }
];

const kgEdges = [
  ['Data Scientist', 'Python'], ['Data Scientist', 'SQL'], ['Data Scientist', 'TensorFlow'],
  ['Data Scientist', 'pandas'], ['Data Scientist', 'Statistics'],
  ['ML Engineer', 'Python'], ['ML Engineer', 'PyTorch'], ['ML Engineer', 'TensorFlow'],
  ['ML Engineer', 'Kubernetes'], ['ML Engineer', 'Docker'], ['ML Engineer', 'MLOps'], ['ML Engineer', 'AWS'],
  ['Backend Dev', 'Python'], ['Backend Dev', 'Node.js'], ['Backend Dev', 'Docker'],
  ['Backend Dev', 'Kubernetes'], ['Backend Dev', 'AWS'],
  ['Data Analyst', 'SQL'], ['Data Analyst', 'Python'], ['Data Analyst', 'pandas'],
  ['Data Analyst', 'Tableau'], ['Data Analyst', 'Statistics'],
  ['FinTech', 'Data Scientist'], ['FinTech', 'ML Engineer'],
  ['E-commerce', 'Backend Dev'], ['E-commerce', 'Data Scientist'],
  ['Healthcare', 'Data Analyst'], ['Healthcare', 'ML Engineer'],
  ['Python', 'pandas'], ['Docker', 'Kubernetes']
];

// Positions are percentages, so the graph scales with its box and needs no resize handler.
function renderKnowledgeGraph() {
  const box = document.getElementById('kgContainer');
  const svg = document.getElementById('kgSvg');
  const pos = Object.fromEntries(kgNodes.map(n => [n.id, n]));

  svg.innerHTML = kgEdges.map(([a, b]) =>
    `<line data-a="${a}" data-b="${b}" x1="${pos[a].x * 100}" y1="${pos[a].y * 100}" x2="${pos[b].x * 100}" y2="${pos[b].y * 100}" vector-effect="non-scaling-stroke"/>`
  ).join('');
  const lines = [...svg.querySelectorAll('line')];

  const nodes = kgNodes.map(n => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `kg-node ${n.type}`;
    el.textContent = n.id;
    el.dataset.id = n.id;
    el.style.left = `${n.x * 100}%`;
    el.style.top = `${n.y * 100}%`;
    box.appendChild(el);
    return el;
  });

  const focusNode = id => {
    box.classList.toggle('is-focused', Boolean(id));
    const linked = new Set([id]);
    lines.forEach(l => {
      const on = l.dataset.a === id || l.dataset.b === id;
      l.classList.toggle('on', on);
      if (on) { linked.add(l.dataset.a); linked.add(l.dataset.b); }
    });
    nodes.forEach(el => el.classList.toggle('linked', linked.has(el.dataset.id)));
  };

  nodes.forEach(el => {
    el.addEventListener('mouseenter', () => focusNode(el.dataset.id));
    el.addEventListener('focus', () => focusNode(el.dataset.id));
    el.addEventListener('mouseleave', () => focusNode(null));
    el.addEventListener('blur', () => focusNode(null));
  });
}
