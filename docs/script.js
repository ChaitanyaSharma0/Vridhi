/* Vriddhi — architecture reference */

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
        <p>This is the single most important function in Vriddhi. Everything downstream depends on accurate skill extraction. We use a two-pass approach:</p>
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
&nbsp;&nbsp;→ Demand-weighted fit: <span class="highlight">42%</span><br><br>
<span class="highlight-blue">Step 4:</span> Rank missing skills by demand<br>
&nbsp;&nbsp;→ The skill most postings ask for comes first<br>
&nbsp;&nbsp;→ Salary is left to CompIntel, which prices the whole profile
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="io-box">
          <div class="io-box-header output">Final Output</div>
          <div class="io-box-body">
<span class="highlight">Fit: 42%</span><br><br>
<strong>Your matched skills:</strong>
<div class="skill-tags mt-1">
  <span class="skill-tag matched">Python ✓</span>
  <span class="skill-tag matched">SQL ✓</span>
  <span class="skill-tag matched">pandas ✓</span>
  <span class="skill-tag matched">NumPy ✓</span>
</div><br>
<strong>Learn next (ranked by how often postings ask for it):</strong><br>
1. <span class="skill-tag missing">Machine Learning</span> → asked for in 88% of postings<br>
2. <span class="skill-tag missing">TensorFlow</span> → 72%<br>
3. <span class="skill-tag missing">Statistics</span> → 68%<br>
4. <span class="skill-tag missing">Apache Spark</span> → 55%<br>
5. <span class="skill-tag missing">Deep Learning</span> → 52%
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
        <p>A multi-model ensemble (RandomForest + XGBoost + GradientBoosting) trained on Indian salary data. Predicts a salary range for a whole profile: skills, experience, location and education together. SHAP shows which parts of the profile push the range up or down.</p>
      </div>
      <div class="modal-section">
        <aside class="notice notice--salary"><p><strong>Salary disclaimer.</strong> Predicted salaries are market benchmarks derived from aggregated industry data for a given skill set, experience level, and location. They represent what the market is currently paying — not a job offer or guarantee. The purpose is to help users understand their market worth so they can negotiate fair compensation based on real industry standards.</p></aside>
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
        <h3>Your range, now and after</h3>
        <div class="io-box">
          <div class="io-box-body">
<span class="highlight-orange">Profile today:</span> Python, SQL · 3 yrs · Bangalore<br>
<span class="highlight">Expected range: ₹11.5 – 14.1 LPA</span><br><br>
<span class="highlight-orange">Same profile after closing the top 3 gaps</span> (ML, TensorFlow, Statistics):<br>
<span class="highlight">Expected range: ₹15.2 – 18.6 LPA</span><br><br>
<span class="dim">// We price the profile, never a single skill. Learning Docker alone</span><br>
<span class="dim">// doesn't add a fixed ₹X; it moves you into a different band of postings.</span>
          </div>
        </div>
      </div>
    `
  },

  rolefit: {
    title: 'RoleFit — Opportunity Finder',
    html: `
      <div class="modal-section">
        <h3>How RoleFit works</h3>
        <p>TalentMatch tells you how far you are from the role you picked. RoleFit asks the opposite question: given the skills you already have, which roles in the market do you fit today, and what would they pay you? It catches the cases people miss, like being over-qualified for the role they are applying to, or already fitting a better-paid one.</p>
      </div>
      <div class="modal-section">
        <h3>Step by step</h3>
        <div class="io-box">
          <div class="io-box-header process">Processing</div>
          <div class="io-box-body">
<span class="highlight-blue">Step 1:</span> Take the normalised skill list from Layer 2<br><br>
<span class="highlight-blue">Step 2:</span> Score it against the ideal skill vector of every role (50+)<br>
&nbsp;&nbsp;→ fit = demand-weighted share of the role's core skills you have<br><br>
<span class="highlight-blue">Step 3:</span> For each role, ask CompIntel for the range at <em>your</em> fit level<br>
&nbsp;&nbsp;→ not the role's average, the band people with your coverage actually get<br><br>
<span class="highlight-blue">Step 4:</span> Count open postings in your city from processed_postings<br><br>
<span class="highlight-blue">Step 5:</span> Flag the interesting cases<br>
&nbsp;&nbsp;→ <span class="highlight">closer fit</span>: another role fits you better than your target<br>
&nbsp;&nbsp;→ <span class="highlight">pays more</span>: a role you fit nearly as well has a higher range<br>
&nbsp;&nbsp;→ <span class="highlight">over-qualified</span>: you cover 85%+ of your target, so aim higher
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h3>Sample output</h3>
        <div class="io-box">
          <div class="io-box-header input">Input</div>
          <div class="io-box-body">
<span class="highlight-blue">Skills:</span> Python, SQL, pandas, Excel, Tableau, Statistics<br>
<span class="highlight-blue">Target:</span> Data Analyst · <span class="highlight-blue">City:</span> Bangalore
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="io-box">
          <div class="io-box-header output">Output</div>
          <div class="io-box-body">
Data Analyst &nbsp;&nbsp;&nbsp;fit <span class="highlight">86%</span> · 2,800 open · ₹13.3 – 16.3L<br>
Data Scientist &nbsp;fit <span class="highlight">48%</span> · 2,400 open · ₹18.6 – 22.8L<br>
Data Engineer &nbsp;&nbsp;fit 35% · 1,900 open · ₹16.1 – 19.7L<br><br>
<span class="highlight">Over-qualified:</span> you already cover 86% of Data Analyst postings.<br>
Data Scientist pays more, and Machine Learning is the biggest gap in the way.
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
&nbsp;&nbsp;{fit: 42%, gaps: [{skill:"ML", demand:88%},<br>
&nbsp;&nbsp;&nbsp;{skill:"TensorFlow", demand:72%}, ...]}<br>
→ CompIntel returns:<br>
&nbsp;&nbsp;{range_today: "₹11.5–14.1L",<br>
&nbsp;&nbsp;&nbsp;range_gaps_closed: "₹15.2–18.6L"}<br>
→ RoleFit returns:<br>
&nbsp;&nbsp;{best_fit: "Data Analyst", fit: 74%, open: 2800}<br><br>

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
→ Profile inputs → salary range<br>
→ SHAP waterfall chart<br>
→ Range today vs. gaps closed<br><br>
<span class="highlight">Page 5: RoleFit</span><br>
→ Roles you already fit, open postings, your range in each<br><br>
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
  if (lenis) lenis.stop();
}

function closeModal(event) {
  if (event.target === event.currentTarget) closeModalDirect();
}

function closeModalDirect() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
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
// skills: [name, % of postings for this role that ask for it]
const demoDatabase = {
  'Data Scientist': {
    skills: [['Python', 95], ['Machine Learning', 88], ['SQL', 82], ['TensorFlow', 72], ['Statistics', 68], ['pandas', 64], ['Spark', 55], ['Deep Learning', 52], ['NLP', 45], ['A/B Testing', 38]],
    avgSalary: { Bangalore: 2240000, Hyderabad: 1980000, Mumbai: 2100000, 'Delhi NCR': 1950000, Pune: 1850000 },
    postings: 2400,
    trending: { up: ['LangChain', 'MLOps', 'Kubernetes'], stable: ['Python', 'SQL'], down: ['Hadoop', 'SAS'] }
  },
  'ML Engineer': {
    skills: [['Python', 94], ['PyTorch', 76], ['Docker', 71], ['TensorFlow', 68], ['Kubernetes', 62], ['AWS', 60], ['MLOps', 58], ['SQL', 55], ['CI/CD', 49], ['Spark', 41]],
    avgSalary: { Bangalore: 2600000, Hyderabad: 2300000, Mumbai: 2450000, 'Delhi NCR': 2200000, Pune: 2100000 },
    postings: 1650,
    trending: { up: ['LangChain', 'LLMs', 'Vector DBs'], stable: ['PyTorch', 'Docker'], down: ['Keras', 'Theano'] }
  },
  'Data Engineer': {
    skills: [['SQL', 90], ['Python', 86], ['Spark', 71], ['ETL', 67], ['AWS', 62], ['Airflow', 58], ['Kafka', 46], ['Docker', 44], ['Snowflake', 38], ['dbt', 35]],
    avgSalary: { Bangalore: 2000000, Hyderabad: 1800000, Mumbai: 1900000, 'Delhi NCR': 1750000, Pune: 1650000 },
    postings: 1900,
    trending: { up: ['dbt', 'Snowflake', 'Databricks'], stable: ['SQL', 'Spark'], down: ['Hadoop', 'Informatica'] }
  },
  'Backend Developer': {
    skills: [['SQL', 81], ['REST APIs', 77], ['Git', 72], ['Docker', 66], ['Node.js', 64], ['PostgreSQL', 59], ['Python', 58], ['AWS', 54], ['Microservices', 48], ['Redis', 41]],
    avgSalary: { Bangalore: 1800000, Hyderabad: 1550000, Mumbai: 1700000, 'Delhi NCR': 1600000, Pune: 1500000 },
    postings: 3900,
    trending: { up: ['Rust', 'Go', 'gRPC'], stable: ['Node.js', 'Python'], down: ['PHP', 'jQuery'] }
  },
  'DevOps Engineer': {
    skills: [['Docker', 88], ['Kubernetes', 81], ['CI/CD', 79], ['AWS', 76], ['Linux', 74], ['Git', 70], ['Terraform', 58], ['Python', 52], ['Jenkins', 49], ['Monitoring', 41]],
    avgSalary: { Bangalore: 1900000, Hyderabad: 1700000, Mumbai: 1750000, 'Delhi NCR': 1650000, Pune: 1600000 },
    postings: 2100,
    trending: { up: ['Platform Engineering', 'ArgoCD', 'OpenTelemetry'], stable: ['Kubernetes', 'Terraform'], down: ['Jenkins', 'Chef'] }
  },
  'Full Stack Developer': {
    skills: [['JavaScript', 92], ['React', 81], ['Git', 76], ['Node.js', 74], ['REST APIs', 70], ['SQL', 62], ['TypeScript', 58], ['MongoDB', 45], ['Docker', 40], ['AWS', 38]],
    avgSalary: { Bangalore: 1600000, Hyderabad: 1400000, Mumbai: 1500000, 'Delhi NCR': 1450000, Pune: 1350000 },
    postings: 4300,
    trending: { up: ['Next.js', 'TypeScript', 'tRPC'], stable: ['React', 'Node.js'], down: ['jQuery', 'AngularJS'] }
  },
  'Data Analyst': {
    skills: [['SQL', 92], ['Excel', 84], ['Python', 66], ['Data Visualization', 63], ['PowerBI', 61], ['Tableau', 58], ['Statistics', 57], ['pandas', 44], ['R', 31], ['Looker', 24]],
    avgSalary: { Bangalore: 1200000, Hyderabad: 1050000, Mumbai: 1100000, 'Delhi NCR': 1000000, Pune: 950000 },
    postings: 2800,
    trending: { up: ['dbt', 'Looker', 'Python'], stable: ['SQL', 'Excel'], down: ['SAS', 'SPSS'] }
  }
};

// Share of each role's postings found in a city (Bangalore = 1)
const cityShare = { Bangalore: 1, Hyderabad: 0.62, Mumbai: 0.55, 'Delhi NCR': 0.58, Pune: 0.41 };

// A few of the ESCO normalisations Layer 2 performs
const skillAliases = {
  ml: 'machine learning', dl: 'deep learning', js: 'javascript', ts: 'typescript', tf: 'tensorflow',
  k8s: 'kubernetes', postgres: 'postgresql', node: 'node.js', nodejs: 'node.js', reactjs: 'react',
  'power bi': 'powerbi', stats: 'statistics', 'apache spark': 'spark', pyspark: 'spark', 'amazon web services': 'aws'
};

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = s => s.replace(/[&<>"']/g, c => HTML_ESCAPES[c]);
const tag = (s, kind) => `<span class="skill-tag ${kind}">${escapeHtml(s)}</span>`;
const lakhRange = ([lo, hi]) => `₹${lo.toFixed(1)} – ${hi.toFixed(1)}L`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Demand-weighted share of a role's core skills the user has (0..1)
function roleFit(role, has) {
  const total = role.skills.reduce((sum, [, d]) => sum + d, 0);
  const got = role.skills.reduce((sum, [name, d]) => sum + (has.has(name.toLowerCase()) ? d : 0), 0);
  return got / total;
}

// Expected range for a profile at a given fit: 0.75x the city average at zero fit, 1.2x at full fit
function salaryRange(role, city, fit) {
  const mid = (role.avgSalary[city] / 100000) * (0.75 + 0.45 * fit);
  return [mid * 0.9, mid * 1.1];
}

let demoTimers = [];

function runInteractiveDemo() {
  const raw = document.getElementById('demoSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  const targetName = document.getElementById('demoRole').value;
  const city = document.getElementById('demoCity').value;
  const target = demoDatabase[targetName];

  const canonical = Object.fromEntries(Object.values(demoDatabase).flatMap(r => r.skills.map(([n]) => [n.toLowerCase(), n])));
  const keys = raw.map(s => skillAliases[s.toLowerCase()] || s.toLowerCase());
  const normalised = keys.map((k, i) => canonical[k] || raw[i]);  // display names
  const has = new Set(keys);
  const renamed = raw.filter(s => skillAliases[s.toLowerCase()]);

  const matched = target.skills.filter(([n]) => has.has(n.toLowerCase())).map(([n]) => n);
  const missing = target.skills.filter(([n]) => !has.has(n.toLowerCase()));  // already sorted by demand
  const fit = roleFit(target, has);
  const fitPct = Math.round(fit * 100);
  const openHere = r => Math.round(r.postings * cityShare[city]).toLocaleString('en-IN');

  // What closing the top 3 gaps would do to fit and range
  const closed = new Set([...has, ...missing.slice(0, 3).map(([n]) => n.toLowerCase())]);
  const fitAfter = roleFit(target, closed);

  // RoleFit: every role, scored on the same skills
  const roles = Object.entries(demoDatabase).map(([name, r]) => {
    const f = roleFit(r, has);
    return { name, fit: f, range: salaryRange(r, city, f), open: openHere(r) };
  }).sort((a, b) => b.fit - a.fit);
  const targetRow = roles.find(r => r.name === targetName);
  const bestFit = roles[0];
  const mid = r => (r.range[0] + r.range[1]) / 2;
  // Best-fitting role that pays clearly more than the target at the user's current level
  const betterPaid = roles.find(r => r.name !== targetName && r.fit >= 0.4 && mid(r) > mid(targetRow) * 1.1);

  let verdict;
  if (fit >= 0.85 && betterPaid) {
    const next = demoDatabase[betterPaid.name].skills.filter(([n]) => !has.has(n.toLowerCase())).slice(0, 2).map(([n]) => `<strong>${n}</strong>`);
    verdict = `You're <strong>over-qualified</strong> for ${targetName}: you already cover ${fitPct}% of it. <strong>${betterPaid.name}</strong> pays ${lakhRange(betterPaid.range)} at your level and you fit ${Math.round(betterPaid.fit * 100)}% of it already${next.length ? `. ${next.join(' and ')} would close most of the gap` : ''}.`;
  } else if (betterPaid && betterPaid.fit >= fit - 0.1) {
    verdict = `<strong>${betterPaid.name}</strong> fits you about as well (${Math.round(betterPaid.fit * 100)}%) and pays more: ${lakhRange(betterPaid.range)}.`;
  } else if (bestFit.name !== targetName && bestFit.fit - fit >= 0.1) {
    verdict = `You're a closer fit for <strong>${bestFit.name}</strong> right now (${Math.round(bestFit.fit * 100)}% vs ${fitPct}%). Good as a stepping stone while you close the ${targetName} gaps.`;
  } else if (fit >= 0.85) {
    verdict = `You already clear most ${targetName} postings. Apply now, and aim for the upper end of the range.`;
  } else {
    verdict = `${targetName} is already your best match. Closing the gaps above is the fastest way up.`;
  }

  const gapTable = missing.length
    ? `<table class="demo-table">
        <thead><tr><th>Learn next</th><th>Asked for in</th></tr></thead>
        <tbody>${missing.slice(0, 5).map(([n, d]) => `<tr><td>${tag(n, 'missing')}</td><td><span class="meter"><span style="--w:${d}%"></span></span>${d}% of postings</td></tr>`).join('')}</tbody>
      </table>`
    : '<p>No gaps. You cover every core skill for this role.</p>';

  const roleTable = `<table class="demo-table">
      <thead><tr><th>Role</th><th>Your fit</th><th>Open in ${city}</th><th>Your range</th></tr></thead>
      <tbody>${roles.slice(0, 5).map(r => `<tr${r.name === targetName ? ' class="is-target"' : ''}>
        <td>${r.name}${r.name === targetName ? ' <small>target</small>' : ''}</td>
        <td><span class="meter"><span style="--w:${Math.round(r.fit * 100)}%"></span></span>${Math.round(r.fit * 100)}%</td>
        <td>${r.open}</td>
        <td>${lakhRange(r.range)}</td></tr>`).join('')}</tbody>
    </table>`;

  const steps = [
    {
      layer: 'Layer 1 · Ingestion',
      title: 'Find the relevant postings',
      detail: `<p>Filters 15,000+ processed postings in MongoDB for role “${targetName}” in ${city}. <strong>${openHere(target)}</strong> postings match.</p>`
    },
    {
      layer: 'Layer 2 · NLP',
      title: 'Normalise your skills',
      detail: raw.length
        ? `<div class="skill-tags">${normalised.map(s => tag(s, 'neutral')).join('')}</div>
           <p>${renamed.length ? `Mapped to ESCO names (${renamed.map(s => `“${escapeHtml(s)}” → ${escapeHtml(canonical[skillAliases[s.toLowerCase()]] || skillAliases[s.toLowerCase()])}`).join(', ')}), then embedded` : 'Mapped to ESCO names and embedded'} with MiniLM-L6-v2.</p>`
        : '<p>No skills entered, so everything below is measured from zero.</p>'
    },
    {
      layer: 'Layer 3 · TalentMatch',
      title: `How close you are to ${targetName}`,
      detail: `<p class="big-num">${fitPct}%<small>fit, weighted by how often postings ask for each skill</small></p>
        ${matched.length ? `<div class="skill-tags">${matched.map(s => tag(s, 'matched')).join('')}</div>` : ''}
        ${gapTable}`
    },
    {
      layer: 'Layer 3 · CompIntel',
      title: 'What you can expect to earn',
      detail: `<div class="range-compare">
          <div><span class="k">today</span><p class="big-num">${lakhRange(salaryRange(target, city, fit))}</p><small>${targetName} in ${city} at ${fitPct}% fit</small></div>
          ${missing.length ? `<div><span class="k">top ${Math.min(3, missing.length)} gaps closed</span><p class="big-num">${lakhRange(salaryRange(target, city, fitAfter))}</p><small>adds ${missing.slice(0, 3).map(([n]) => escapeHtml(n)).join(', ')} → ${Math.round(fitAfter * 100)}% fit</small></div>` : ''}
        </div>
        <aside class="notice notice--salary"><p><strong>Salary disclaimer.</strong> Predicted salaries are market benchmarks derived from aggregated industry data for a given skill set, experience level, and location. They represent what the market is currently paying — not a job offer or guarantee. The purpose is to help users understand their market worth so they can negotiate fair compensation based on real industry standards.</p></aside>`
    },
    {
      layer: 'Layer 3 · RoleFit',
      title: 'Roles you already fit',
      detail: `${roleTable}<p class="verdict">${verdict}</p>`
    },
    {
      layer: 'Layer 3 · SkillRadar',
      title: `What's moving for ${targetName}`,
      detail: `<div class="trend-lines">
        <div><span class="k">rising</span>${target.trending.up.map(s => tag(s, 'missing')).join('')}</div>
        <div><span class="k">stable</span>${target.trending.stable.map(s => tag(s, 'matched')).join('')}</div>
        <div><span class="k">declining</span>${target.trending.down.map(s => tag(s, 'neutral')).join('')}</div>
      </div>`
    },
    {
      layer: 'Layer 4 · Counselor',
      title: 'The answer, in plain language',
      detail: `<div class="chat">
        <p class="chat-head">Counselor</p>
        <div class="msg user"><span class="who">You</span><p>I know ${raw.length ? escapeHtml(raw.join(', ')) : 'nothing yet'}. I want to become a ${targetName} in ${city}. Where do I stand?</p></div>
        <div class="msg bot"><span class="who">Vriddhi</span><div>
          <p>You cover <strong>${fitPct}%</strong> of what ${targetName} postings in ${city} ask for, which puts you around <strong>${lakhRange(salaryRange(target, city, fit))}</strong>.</p>
          ${missing.length ? `<p>Learn ${missing.slice(0, 3).map(([n]) => `<strong>${escapeHtml(n)}</strong>`).join(', ')} next. Together they take you to about ${lakhRange(salaryRange(target, city, fitAfter))}.</p>` : ''}
          <p>${verdict}</p>
          <p class="source">Trending for this role: ${target.trending.up[0]}. Sources: TalentMatch, CompIntel, RoleFit, SkillRadar</p>
        </div></div>
      </div>`
    }
  ];

  demoTimers.forEach(clearTimeout);
  demoTimers = [];

  const list = document.getElementById('demoSteps');
  list.innerHTML = steps.map((s, i) => `
    <li class="demo-step">
      <span class="demo-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="demo-card">
        <h3><small>${s.layer}</small>${s.title}</h3>
        <div class="demo-detail">${s.detail}</div>
      </div>
    </li>`).join('');

  const items = [...list.children];
  if (reduceMotion) {
    items.forEach(el => el.classList.add('active'));
    return;
  }
  items.forEach((el, i) => demoTimers.push(setTimeout(() => el.classList.add('active'), 150 + i * 600)));
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
  const show = id => scrollToEl(document.getElementById(id));

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

// ── Smooth scrolling (Lenis). Off for reduced-motion users; native scroll if the CDN fails. ──
const lenis = !reduceMotion && window.Lenis ? new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 }) : null;
if (lenis) {
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

function scrollToEl(el) {
  if (lenis) lenis.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

// In-page links glide instead of jumping
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  const target = a && document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  scrollToEl(target);
  if (a.classList.contains('skip')) target.focus?.();
});
