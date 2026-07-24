const preExistingDbHost = process.env.DB_HOST;
require("dotenv").config();
if (preExistingDbHost) {
  process.env.DB_HOST = preExistingDbHost;
}
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "listen360_default_secret_key";

app.use(cors());
app.use(express.json());

// Initialize Database connection
let pool = null;
let useMockDb = false;

// Health check endpoint for Docker & monitoring
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "listen360-backend", db: useMockDb ? "mock" : "postgres" });
});

if (process.env.DB_HOST) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  // Verify connection and create table if it doesn't exist
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("❌ Cloud SQL PostgreSQL connection failed. Falling back to in-memory store.", err.message);
      useMockDb = true;
    } else {
      console.log("🚀 PostgreSQL connected successfully.");
      initializeDatabaseTable();
    }
  });
} else {
  console.log("ℹ️ No DB_HOST environment variable set. Using in-memory mock database store.");
  useMockDb = true;
}

// In-Memory Database fallback (pre-populated with mock data)
let mockReports = [
  {
    id: "LS360-2026-001245",
    category: "Bullying & Harassment",
    description: "Experienced microaggressions and exclusion from daily sync meetings by the engineering lead over the last three weeks.",
    date: "2026-07-20T10:00:00.000Z",
    status: "Investigating",
    risk: "High",
    department: "Engineering",
    reporter: "Anonymous",
    assigned: "Sarah Jenkins"
  },
  {
    id: "LS360-2026-001246",
    category: "Unfair Review / Bias",
    description: "Felt performance review criteria were shifted retroactively during Q2 discussions without objective evidence.",
    date: "2026-07-21T14:30:00.000Z",
    status: "Pending",
    risk: "Medium",
    department: "Sales",
    reporter: "Jordan (Employee)",
    assigned: "Unassigned"
  },
  {
    id: "LS360-2026-001248",
    category: "Retaliation",
    description: "After reporting security concerns directly to management, workload was doubled and performance feedback became hostile.",
    date: "2026-07-22T09:15:00.000Z",
    status: "Escalated",
    risk: "Critical",
    department: "Operations",
    reporter: "Anonymous",
    assigned: "Alex (Investigator)"
  }
];

// ======================================================================
// IN-MEMORY FALLBACK ARRAYS FOR CONCERN WORKFLOW TABLES
// ======================================================================
let mockEmpatheticPrefixes = [
  { id: 1, prefix_text: "I hear you, and I want you to know that you're in a safe space. Let me help you raise this concern effectively.", context: "concern_start" },
  { id: 2, prefix_text: "Thank you for sharing that — your courage matters. Let's continue step by step.", context: "workflow_step" },
  { id: 3, prefix_text: "I'm right here with you. Every detail you share helps us support you better.", context: "workflow_step" },
  { id: 4, prefix_text: "You're doing incredibly well. We're making great progress documenting your concern.", context: "workflow_step" },
  { id: 5, prefix_text: "Your feelings are valid and your voice matters. Let's keep going together.", context: "workflow_step" },
  { id: 6, prefix_text: "I understand how important this is. We're treating your concern with the highest priority.", context: "workflow_step" },
  { id: 7, prefix_text: "Take your time — there's no rush. I'm here to support you through every step.", context: "workflow_step" },
  { id: 8, prefix_text: "You're not alone in this. Together, we'll make sure your concern is heard.", context: "workflow_step" },
  { id: 9, prefix_text: "We're almost there. Let's review everything to make sure your voice is accurately captured.", context: "workflow_step" },
  { id: 10, prefix_text: "Your concern has been heard and formally documented. You have our full support.", context: "submission" }
];

let mockConcernCategories = [
  { id: 1, name: "Bullying / Harassment", icon: "🚫", description: "Repeated inappropriate behavior, power imbalance, or hostile environment." },
  { id: 2, name: "Discrimination", icon: "⚖️", description: "Unfair treatment based on protected characteristics (gender, race, age, etc.)." },
  { id: 3, name: "Retaliation", icon: "⚡", description: "Adverse actions taken following a previous report or protected activity." },
  { id: 4, name: "Workplace Behaviour", icon: "🗣️", description: "Unprofessional conduct, microaggressions, or inappropriate comments." },
  { id: 5, name: "Manager / Leadership Concern", icon: "👔", description: "Abuse of authority, unfair evaluation, or lack of support." },
  { id: 6, name: "Conflict / Interpersonal Issue", icon: "👥", description: "Disagreements or strained working relationships between team members." },
  { id: 7, name: "Ethics / Conduct", icon: "📜", description: "Breaches of professional integrity, theft, or policy violations." },
  { id: 8, name: "Policy Violation", icon: "📋", description: "Failure to adhere to company compliance or safety standards." },
  { id: 9, name: "Financial / Fraud Concern", icon: "💰", description: "Accounting irregularities, misappropriation, or embezzlement." },
  { id: 10, name: "Conflict of Interest", icon: "🔄", description: "Personal interests interfering with professional duties." },
  { id: 11, name: "Well-being / Mental Health", icon: "💚", description: "Stress, burnout, anxiety, or need for personal wellbeing support." },
  { id: 12, name: "Other", icon: "❓", description: "Any other workplace concern not listed above." }
];

let mockConcernCategoryQuestions = [
  // Bullying / Harassment (category_id: 1)
  { id: 1, category_id: 1, question_text: "What specific words, actions, or repeated behaviours occurred?", sort_order: 1 },
  { id: 2, category_id: 1, question_text: "Where and how frequently did the incident(s) take place?", sort_order: 2 },
  { id: 3, category_id: 1, question_text: "Who was involved or present as a witness, and was there a power imbalance?", sort_order: 3 },
  { id: 4, category_id: 1, question_text: "How has this impacted your psychological safety, well-being, or work performance?", sort_order: 4 },
  { id: 5, category_id: 1, question_text: "What supporting evidence exists (e.g., chat logs, emails), and what resolution do you seek?", sort_order: 5 },
  // Discrimination (category_id: 2)
  { id: 6, category_id: 2, question_text: "Which protected characteristic or ground do you believe was involved? (e.g. Gender, Race, Age, Disability)", sort_order: 1 },
  { id: 7, category_id: 2, question_text: "What specific decision or treatment was affected? (e.g. Promotion, Performance Review, Pay, Work Allocation)", sort_order: 2 },
  { id: 8, category_id: 2, question_text: "Were colleagues in similar roles or circumstances treated differently?", sort_order: 3 },
  { id: 9, category_id: 2, question_text: "Did you observe language, comments, or decisions reflecting stereotypes or intentional exclusion?", sort_order: 4 },
  { id: 10, category_id: 2, question_text: "How has this impacted your career development, and what outcome are you seeking?", sort_order: 5 },
  // Retaliation (category_id: 3)
  { id: 11, category_id: 3, question_text: "What was the original report, complaint, or protected activity you participated in?", sort_order: 1 },
  { id: 12, category_id: 3, question_text: "What retaliatory action was taken against you, and who initiated it?", sort_order: 2 },
  { id: 13, category_id: 3, question_text: "How much time elapsed between your original report and the retaliatory action?", sort_order: 3 },
  { id: 14, category_id: 3, question_text: "How has this impacted your job duties, evaluation, status, or well-being?", sort_order: 4 },
  { id: 15, category_id: 3, question_text: "What evidence or timeline documentation do you have, and what protection do you require?", sort_order: 5 },
  // Well-being / Mental Health (category_id: 11)
  { id: 16, category_id: 11, question_text: "What specific workplace situation or aspect of work is affecting your mental or emotional well-being?", sort_order: 1 },
  { id: 17, category_id: 11, question_text: "How is this situation impacting your day-to-day work performance, concentration, or personal life?", sort_order: 2 },
  { id: 18, category_id: 11, question_text: "Are specific workplace factors (e.g. workload, unrealistic expectations, conflict) contributing to the issue?", sort_order: 3 },
  { id: 19, category_id: 11, question_text: "What type of confidential support or guidance would be most helpful to you right now?", sort_order: 4 },
  { id: 20, category_id: 11, question_text: "Do you feel safe continuing in your current work environment today?", sort_order: 5 },
  // Ethics / Conduct (category_id: 7)
  { id: 21, category_id: 7, question_text: "What specific policy, law, or ethical standard was violated?", sort_order: 1 },
  { id: 22, category_id: 7, question_text: "Who was involved in the unethical conduct, and what was the financial or operational impact?", sort_order: 2 },
  { id: 23, category_id: 7, question_text: "Was instructions given to conceal or misrepresent information?", sort_order: 3 },
  { id: 24, category_id: 7, question_text: "Are financial records, contracts, messages, or audit trails available?", sort_order: 4 },
  { id: 25, category_id: 7, question_text: "What immediate corrective action or investigation is required?", sort_order: 5 },
  // Default (category_id: 0 — used for all other categories)
  { id: 26, category_id: 0, question_text: "Could you provide additional details regarding the primary incident or concern?", sort_order: 1 },
  { id: 27, category_id: 0, question_text: "Who were the key individuals involved or affected?", sort_order: 2 },
  { id: 28, category_id: 0, question_text: "How has this situation impacted your day-to-day work experience or safety?", sort_order: 3 },
  { id: 29, category_id: 0, question_text: "What supporting evidence, messages, or documents exist?", sort_order: 4 },
  { id: 30, category_id: 0, question_text: "What resolution, support, or outcome are you seeking from this report?", sort_order: 5 }
];

let mockFactFindingQuestions = [
  {
    id: 1, question_key: "who_when", sort_order: 1,
    question_text: "Question 1 of 3 — Who was involved, and approximately when did this happen?",
    options: ["Manager / Supervisor — Ongoing concern", "Manager / Supervisor — Recent incident", "Colleague / Peer — Multiple occasions", "Team / Department — Recent", "External person or Other"]
  },
  {
    id: 2, question_key: "recurrence_evidence", sort_order: 2,
    question_text: "Question 2 of 3 — Has this happened before, and do you have supporting evidence (e.g. emails, chat logs, witnesses)?",
    options: ["Repeated incident & Evidence available", "Repeated incident & No evidence currently", "Single occurrence & Evidence available", "Single occurrence & No evidence currently"]
  },
  {
    id: 3, question_key: "safety_anonymity", sort_order: 3,
    question_text: "Question 3 of 3 — Do you feel currently safe at work, and would you like to remain 100% anonymous?",
    options: ["💚 Safe & Submit 100% Anonymously", "💚 Safe & Include Identity (Jordan Smith)", "🚨 Unsafe / At Risk — Immediate Support Required"]
  }
];

let mockConcernCases = [];

// ======================================================================
// DATABASE INITIALIZATION — ALL TABLES
// ======================================================================
function initializeDatabaseTable() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS reports (
      id VARCHAR(50) PRIMARY KEY,
      category VARCHAR(100),
      description TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50),
      risk VARCHAR(50),
      department VARCHAR(100),
      reporter VARCHAR(100),
      assigned VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS empathetic_prefixes (
      id SERIAL PRIMARY KEY,
      prefix_text TEXT NOT NULL,
      context VARCHAR(50) DEFAULT 'workflow_step'
    );

    CREATE TABLE IF NOT EXISTS concern_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(10),
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS concern_category_questions (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES concern_categories(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      sort_order INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS fact_finding_questions (
      id SERIAL PRIMARY KEY,
      question_key VARCHAR(50) NOT NULL,
      question_text TEXT NOT NULL,
      options JSONB NOT NULL DEFAULT '[]',
      sort_order INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS concern_cases (
      id VARCHAR(50) PRIMARY KEY,
      category VARCHAR(100),
      risk_level VARCHAR(50),
      risk_score INTEGER DEFAULT 0,
      risk_factors JSONB DEFAULT '[]',
      status VARCHAR(50) DEFAULT 'Submitted',
      anonymous BOOLEAN DEFAULT true,
      narrative TEXT,
      who_involved TEXT,
      when_occurred TEXT,
      recurrence TEXT,
      impact TEXT,
      evidence TEXT,
      owner VARCHAR(100) DEFAULT 'Unassigned (Ombudsperson)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS concern_responses (
      id SERIAL PRIMARY KEY,
      case_id VARCHAR(50) REFERENCES concern_cases(id) ON DELETE CASCADE,
      question_text TEXT,
      answer_text TEXT,
      step_type VARCHAR(50) DEFAULT 'category',
      sort_order INTEGER DEFAULT 1
    );
  `;

  pool.query(createTablesQuery, (err) => {
    if (err) {
      console.error("❌ Failed to create database tables:", err.message);
    } else {
      console.log("📊 All database tables ready.");
      seedAllTables();
    }
  });
}

async function seedAllTables() {
  try {
    // Seed reports
    const reportCount = await pool.query("SELECT COUNT(*) FROM reports");
    if (parseInt(reportCount.rows[0].count) === 0) {
      console.log("🌱 Seeding reports table...");
      for (const r of mockReports) {
        await pool.query(
          "INSERT INTO reports (id, category, description, date, status, risk, department, reporter, assigned) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
          [r.id, r.category, r.description, r.date, r.status, r.risk, r.department, r.reporter, r.assigned]
        );
      }
    }

    // Seed empathetic prefixes
    const prefixCount = await pool.query("SELECT COUNT(*) FROM empathetic_prefixes");
    if (parseInt(prefixCount.rows[0].count) === 0) {
      console.log("🌱 Seeding empathetic_prefixes table...");
      for (const p of mockEmpatheticPrefixes) {
        await pool.query("INSERT INTO empathetic_prefixes (prefix_text, context) VALUES ($1, $2)", [p.prefix_text, p.context]);
      }
    }

    // Seed concern categories
    const catCount = await pool.query("SELECT COUNT(*) FROM concern_categories");
    if (parseInt(catCount.rows[0].count) === 0) {
      console.log("🌱 Seeding concern_categories table...");
      for (const c of mockConcernCategories) {
        await pool.query("INSERT INTO concern_categories (id, name, icon, description) VALUES ($1, $2, $3, $4)", [c.id, c.name, c.icon, c.description]);
      }
      // Reset sequence to match max id
      await pool.query("SELECT setval('concern_categories_id_seq', (SELECT MAX(id) FROM concern_categories))");
    }

    // Seed concern category questions (requires categories to exist)
    const qCount = await pool.query("SELECT COUNT(*) FROM concern_category_questions");
    if (parseInt(qCount.rows[0].count) === 0) {
      console.log("🌱 Seeding concern_category_questions table...");
      for (const q of mockConcernCategoryQuestions) {
        // category_id 0 = Default, store as NULL in DB
        const catId = q.category_id === 0 ? null : q.category_id;
        await pool.query(
          "INSERT INTO concern_category_questions (category_id, question_text, sort_order) VALUES ($1, $2, $3)",
          [catId, q.question_text, q.sort_order]
        );
      }
    }

    // Seed fact-finding questions
    const ffCount = await pool.query("SELECT COUNT(*) FROM fact_finding_questions");
    if (parseInt(ffCount.rows[0].count) === 0) {
      console.log("🌱 Seeding fact_finding_questions table...");
      for (const ff of mockFactFindingQuestions) {
        await pool.query(
          "INSERT INTO fact_finding_questions (question_key, question_text, options, sort_order) VALUES ($1, $2, $3, $4)",
          [ff.question_key, ff.question_text, JSON.stringify(ff.options), ff.sort_order]
        );
      }
    }

    console.log("✅ All database tables seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding tables:", err.message);
  }
}

// Initialize AI: Use direct REST to aiplatform.googleapis.com (works on enterprise GCP projects)
const { GoogleAuth } = require("google-auth-library");
const https = require("https");

const gcpProject = process.env.GCP_PROJECT_ID;
const gcpLocation = process.env.GCP_LOCATION || "us-central1";
const geminiApiKey = process.env.GEMINI_API_KEY;

const googleAuth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

async function callGeminiVertex(message, systemInstruction) {
  console.log("🔍 [Backend AI] Attempting GCP Vertex AI call (Primary: gemini-3.6-flash, Fallback: gemini-2.5-flash)...");
  try {
    const client = await googleAuth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;
    console.log("🔑 [Backend AI] GCP ADC Token acquired successfully.");

    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
    });

    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.6-flash"];
    for (const model of models) {
      console.log(`📡 [Backend AI] Calling Vertex model endpoint: ${model}...`);
      try {
        const result = await new Promise((resolve, reject) => {
          const options = {
            hostname: `${gcpLocation}-aiplatform.googleapis.com`,
            path: `/v1/projects/${gcpProject}/locations/${gcpLocation}/publishers/google/models/${model}:generateContent`,
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(body),
            },
          };
          const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) reject(new Error(JSON.stringify(parsed.error)));
                else resolve(parsed);
              } catch (e) { reject(e); }
            });
          });
          req.on("error", reject);
          req.write(body);
          req.end();
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`✅ [Backend AI] Vertex Gemini response received via ${model}`);
          return text;
        }
      } catch (err) {
        console.error(`❌ [Backend AI] Vertex AI REST error [${model}]:`, err.message);
      }
    }
  } catch (authErr) {
    console.error("❌ [Backend AI] GCP Auth Token error:", authErr.message);
  }
  return null;
}

async function callGeminiApiKey(message, systemInstruction) {
  console.log("🔍 [Backend AI] Attempting Google Generative AI API call (Primary: gemini-3.6-flash, Fallback: gemini-2.5-flash)...");
  if (!geminiApiKey) {
    console.warn("⚠️ [Backend AI] GEMINI_API_KEY is not defined in environment.");
    return null;
  }

  const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash"];

  // 1. Try via direct REST API (generativelanguage.googleapis.com)
  for (const modelName of modelsToTry) {
    console.log(`📡 [Backend AI] Requesting Generative Language REST API (${modelName})...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser Question/Message: ${message}` }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.2
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (response.ok && resData.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = resData.candidates[0].content.parts[0].text;
        console.log(`✅ [Backend AI] Live response received via Generative Language API (${modelName})!`);
        return text;
      } else if (resData.error) {
        console.error(`❌ [Backend AI] REST API error [${modelName}]: ${resData.error.message}`);
      }
    } catch (err) {
      console.error(`❌ [Backend AI] REST fetch error [${modelName}]:`, err.message);
    }
  }

  // 2. Try SDK fallback
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  for (const modelName of modelsToTry) {
    console.log(`📡 [Backend AI] Requesting AI Studio SDK (${modelName})...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const chat = model.startChat({ generationConfig: { maxOutputTokens: 500, temperature: 0.2 } });
      const result = await chat.sendMessage(systemInstruction + "\n\nUser Query: " + message);
      const text = result.response.text();
      if (text) {
        console.log(`✅ [Backend AI] AI Studio SDK response received (${modelName})`);
        return text;
      }
    } catch (err) {
      console.error(`❌ [Backend AI] AI Studio SDK error [${modelName}]:`, err.message);
    }
  }
  return null;
}

// Mock Token Generator Helper
function generateToken(user) {
  return jwt.sign({ name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// --- API ROUTES ---

// 1. Mock SSO Login Endpoint
app.post("/api/auth/sso-login", (req, res) => {
  const { persona } = req.body;
  
  let user = null;
  if (persona === "employee") {
    user = { name: "Jordan", role: "employee" };
  } else if (persona === "investigator") {
    user = { name: "Alex", role: "investigator" };
  } else {
    return res.status(400).json({ error: "Invalid persona specified" });
  }

  const token = generateToken(user);
  res.json({ token, user });
});

// 2. AI Conversational Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const systemInstruction =
    "You are Jordan's supportive corporate AI Psychological Safety & Mental Wellbeing Companion for listen360. " +
    "You speak with deep empathy, confidentiality, and zero judgment. Keep answers under 3 sentences unless asked otherwise. " +
    "Always focus on mental safety, bias detection, and support resource availability.";

  // 1. Try GCP Vertex AI (Enterprise GCP)
  if (gcpProject) {
    try {
      const aiText = await callGeminiVertex(message, systemInstruction);
      if (aiText) return res.json({ text: aiText, source: "GCP Vertex AI" });
    } catch (err) {
      console.error("❌ Vertex AI error:", err.message);
    }
  }

  // 2. Try Google AI Studio API key fallback
  if (geminiApiKey) {
    try {
      const aiText = await callGeminiApiKey(message, systemInstruction);
      if (aiText) return res.json({ text: aiText });
    } catch (err) {
      console.error("❌ AI Studio SDK error:", err.message);
    }
  }

  // 3. Empathetic simulation fallback
  const fallbacks = [
    "I understand completely. Please know you are not alone in this.",
    "Thank you for sharing this. Your mental safety and workspace well-being are paramount.",
    "I appreciate your courage. I am documenting this with absolute confidentiality."
  ];
  const responseText = `[Simulated AI] ${fallbacks[Math.floor(Math.random() * fallbacks.length)]} How else can I help?`;
  res.json({ text: responseText });
});

// 2b. AI Intelligence Query Endpoint
app.post("/api/ai-intelligence", async (req, res) => {
  const { query } = req.body;
  console.log(`📩 [Backend AI /api/ai-intelligence] Incoming query: "${query}"`);
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const systemInstruction =
    "You are the AI Companion and Case Intelligence Engine for Listen360, a corporate workplace ethics, compliance, and psychological safety platform. " +
    "Engage with employees and managers in a continuous, supportive, natural conversation. Answer questions about workplace psychological safety, employee rights, stress, manager conduct, and case trends. " +
    "Speak with empathy, clarity, and reassuring tone to de-escalate anxiety. " +
    "At the end of your answer, if relevant, remind the user that if they wish to formally document or raise a confidential concern, they can simply type 'raise concern' to start the guided reporting process.";

  // 1. Try GCP Vertex AI (Enterprise GCP)
  if (gcpProject) {
    try {
      const aiText = await callGeminiVertex(query, systemInstruction);
      if (aiText) return res.json({ text: aiText, source: "Vertex Gemini" });
    } catch (err) {
      console.error("❌ Vertex AI error:", err.message);
    }
  }

  // 2. Try Google AI Studio API key fallback
  if (geminiApiKey) {
    try {
      const aiText = await callGeminiApiKey(query, systemInstruction);
      if (aiText) return res.json({ text: aiText, source: "Gemini AI Model" });
    } catch (err) {
      console.error("❌ AI Studio SDK error:", err.message);
    }
  }

  console.warn("⚠️ [Backend AI] All live AI model attempts failed. Returning fallback indicator.");
  res.json({ fallback: true });
});


// 3. Submit Report (Employee View)
app.post("/api/reports", async (req, res) => {
  const { category, description, reporter, anonymous } = req.body;

  const reportId = `LS360-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const departmentOptions = ["Engineering", "HR", "Sales", "Operations", "Finance", "Legal"];
  const department = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
  const risks = ["Low", "Medium", "High", "Critical"];
  const risk = risks[Math.floor(Math.random() * risks.length)];

  const newReport = {
    id: reportId,
    category: category || "General Concern",
    description: description || "No details provided.",
    date: new Date().toISOString(),
    status: "Pending",
    risk: risk,
    department: department,
    reporter: anonymous ? "Anonymous" : (reporter || "Jordan (Employee)"),
    assigned: "Unassigned"
  };

  if (useMockDb) {
    mockReports.unshift(newReport);
    res.json(newReport);
  } else {
    try {
      await pool.query(
        "INSERT INTO reports (id, category, description, date, status, risk, department, reporter, assigned) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [newReport.id, newReport.category, newReport.description, newReport.date, newReport.status, newReport.risk, newReport.department, newReport.reporter, newReport.assigned]
      );
      res.json(newReport);
    } catch (err) {
      console.error("❌ Database insert error:", err.message);
      res.status(500).json({ error: "Failed to save report" });
    }
  }
});

// 4. Retrieve Reports (Investigator Dashboard)
app.get("/api/reports", async (req, res) => {
  if (useMockDb) {
    return res.json(mockReports);
  }

  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database query error:", err.message);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// 5. Analytics and Dashboard Trends Endpoint
app.get("/api/analytics", async (req, res) => {
  let reportsToUse = [];
  if (useMockDb) {
    reportsToUse = mockReports;
  } else {
    try {
      const result = await pool.query("SELECT * FROM reports");
      reportsToUse = result.rows;
    } catch (err) {
      console.error("❌ Database query error:", err.message);
      return res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }

  // Count risk counts
  const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  reportsToUse.forEach(r => {
    if (riskCounts[r.risk] !== undefined) riskCounts[r.risk]++;
  });

  // Category distribution
  const categoryCounts = {};
  reportsToUse.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  res.json({
    totalCases: reportsToUse.length,
    riskDistribution: riskCounts,
    categoryDistribution: categoryCounts
  });
});

// ======================================================================
// CONCERN WORKFLOW API ROUTES
// ======================================================================

// 6. Get Empathetic Prefixes
app.get("/api/concern/prefixes", async (req, res) => {
  if (!useMockDb) {
    try {
      const result = await pool.query("SELECT * FROM empathetic_prefixes ORDER BY id");
      if (result.rows.length > 0) return res.json(result.rows);
    } catch (err) {
      console.error("❌ DB error fetching prefixes:", err.message);
    }
  }
  res.json(mockEmpatheticPrefixes);
});

// 7. Get Concern Categories with their Questions
app.get("/api/concern/categories", async (req, res) => {
  if (!useMockDb) {
    try {
      const cats = await pool.query("SELECT * FROM concern_categories ORDER BY id");
      const questions = await pool.query("SELECT * FROM concern_category_questions ORDER BY category_id, sort_order");
      
      const categoriesWithQuestions = cats.rows.map(cat => ({
        ...cat,
        questions: questions.rows.filter(q => q.category_id === cat.id).map(q => q.question_text)
      }));
      
      // Add default questions (category_id IS NULL)
      const defaultQuestions = questions.rows.filter(q => q.category_id === null).map(q => q.question_text);
      
      return res.json({ categories: categoriesWithQuestions, defaultQuestions });
    } catch (err) {
      console.error("❌ DB error fetching categories:", err.message);
    }
  }
  
  // Fallback: build from in-memory arrays
  const categoriesWithQuestions = mockConcernCategories.map(cat => ({
    ...cat,
    questions: mockConcernCategoryQuestions.filter(q => q.category_id === cat.id).map(q => q.question_text)
  }));
  const defaultQuestions = mockConcernCategoryQuestions.filter(q => q.category_id === 0).map(q => q.question_text);
  res.json({ categories: categoriesWithQuestions, defaultQuestions });
});

// 8. Get Fact-Finding Questions
app.get("/api/concern/fact-finding", async (req, res) => {
  if (!useMockDb) {
    try {
      const result = await pool.query("SELECT * FROM fact_finding_questions ORDER BY sort_order");
      if (result.rows.length > 0) {
        // Parse options if stored as string
        const parsed = result.rows.map(r => ({
          ...r,
          options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options
        }));
        return res.json(parsed);
      }
    } catch (err) {
      console.error("❌ DB error fetching fact-finding questions:", err.message);
    }
  }
  res.json(mockFactFindingQuestions);
});

// 9. Submit Concern Case (Dual-write: DB + in-memory arrays)
app.post("/api/concern/cases", async (req, res) => {
  const {
    id, category, risk_level, risk_score, risk_factors, status,
    anonymous, narrative, who_involved, when_occurred, recurrence,
    impact, evidence, owner, responses
  } = req.body;

  const caseId = id || `LS360-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowISO = new Date().toISOString();

  const newCase = {
    id: caseId,
    category: category || "Workplace Behaviour",
    risk_level: risk_level || "Moderate",
    risk_score: risk_score || 50,
    risk_factors: risk_factors || [],
    status: status || "Submitted",
    anonymous: anonymous !== false,
    narrative: narrative || "",
    who_involved: who_involved || "",
    when_occurred: when_occurred || "",
    recurrence: recurrence || "",
    impact: impact || "",
    evidence: evidence || "",
    owner: owner || "Unassigned (Ombudsperson)",
    created_at: nowISO,
    updated_at: nowISO
  };

  // Always push to in-memory fallback
  mockConcernCases.push(newCase);

  // Also push to mockReports for the existing reports API / investigator dashboard
  mockReports.unshift({
    id: caseId,
    category: newCase.category,
    description: newCase.narrative,
    date: nowISO,
    status: newCase.status,
    risk: newCase.risk_level,
    department: "Self-Reported",
    reporter: newCase.anonymous ? "Anonymous" : "Jordan (Employee)",
    assigned: newCase.owner
  });

  if (!useMockDb) {
    try {
      await pool.query(
        `INSERT INTO concern_cases (id, category, risk_level, risk_score, risk_factors, status, anonymous, narrative, who_involved, when_occurred, recurrence, impact, evidence, owner, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [caseId, newCase.category, newCase.risk_level, newCase.risk_score, JSON.stringify(newCase.risk_factors),
         newCase.status, newCase.anonymous, newCase.narrative, newCase.who_involved, newCase.when_occurred,
         newCase.recurrence, newCase.impact, newCase.evidence, newCase.owner, newCase.created_at, newCase.updated_at]
      );

      // Also insert into reports table for the investigator dashboard
      await pool.query(
        "INSERT INTO reports (id, category, description, date, status, risk, department, reporter, assigned) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [caseId, newCase.category, newCase.narrative, nowISO, newCase.status, newCase.risk_level, "Self-Reported",
         newCase.anonymous ? "Anonymous" : "Jordan (Employee)", newCase.owner]
      );

      // Insert individual responses
      if (responses && Array.isArray(responses)) {
        for (let i = 0; i < responses.length; i++) {
          const r = responses[i];
          await pool.query(
            "INSERT INTO concern_responses (case_id, question_text, answer_text, step_type, sort_order) VALUES ($1,$2,$3,$4,$5)",
            [caseId, r.question_text || r.question, r.answer_text || r.answer, r.step_type || "category", i + 1]
          );
        }
      }

      console.log(`✅ Concern case ${caseId} saved to database.`);
    } catch (err) {
      console.error("❌ DB error saving concern case:", err.message);
      // Case is already in mockConcernCases and mockReports, so the app still works
    }
  }

  res.json({ success: true, case: newCase });
});

// 10. Track/Retrieve Concern Case by ID
app.get("/api/concern/cases/:caseId", async (req, res) => {
  const { caseId } = req.params;

  if (!useMockDb) {
    try {
      const caseResult = await pool.query("SELECT * FROM concern_cases WHERE id = $1", [caseId]);
      if (caseResult.rows.length > 0) {
        const responses = await pool.query(
          "SELECT * FROM concern_responses WHERE case_id = $1 ORDER BY sort_order",
          [caseId]
        );
        return res.json({ ...caseResult.rows[0], responses: responses.rows });
      }
    } catch (err) {
      console.error("❌ DB error tracking case:", err.message);
    }
  }

  // Fallback: search in-memory arrays
  const found = mockConcernCases.find(c => c.id && c.id.toUpperCase() === caseId.toUpperCase());
  if (found) return res.json(found);

  // Also check mockReports
  const fromReports = mockReports.find(r => r.id && r.id.toUpperCase() === caseId.toUpperCase());
  if (fromReports) return res.json(fromReports);

  res.status(404).json({ error: "Case not found" });
});


const path = require("path");
app.use(express.static(path.join(__dirname, "..")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "index.html")));

app.listen(PORT, () => {
  console.log(`🚀 listen360 Gateway running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API:      http://localhost:${PORT}/api`);
});
