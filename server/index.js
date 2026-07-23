require("dotenv").config();
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

function initializeDatabaseTable() {
  const createTableQuery = `
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
  `;
  pool.query(createTableQuery, (err, res) => {
    if (err) {
      console.error("❌ Failed to create reports table:", err.message);
    } else {
      console.log("📊 Reports database table ready.");
      // Seed initial data if database is empty
      pool.query("SELECT COUNT(*) FROM reports", (err, countRes) => {
        if (!err && parseInt(countRes.rows[0].count) === 0) {
          console.log("🌱 Seeding reports table with mock data...");
          mockReports.forEach(r => {
            pool.query(
              "INSERT INTO reports (id, category, description, date, status, risk, department, reporter, assigned) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
              [r.id, r.category, r.description, r.date, r.status, r.risk, r.department, r.reporter, r.assigned]
            );
          });
        }
      });
    }
  });
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
  const client = await googleAuth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse.token;

  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: message }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
  });

  // Try gemini-1.5-flash first, fallback to gemini-1.0-pro
  const models = ["gemini-1.5-flash", "gemini-1.0-pro"];

  for (const model of models) {
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
        console.log(`✅ Gemini response received via ${model}`);
        return text;
      }
    } catch (err) {
      console.error(`❌ Vertex AI REST call error [${model}]:`, err.message);
    }
  }
  return null; // All models failed — caller will use fallback
}

async function callGeminiApiKey(message, systemInstruction) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({ generationConfig: { maxOutputTokens: 500, temperature: 0.2 } });
  const result = await chat.sendMessage(systemInstruction + "\n\nUser: " + message);
  return result.response.text();
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

  // 1. Try Google AI Studio API key
  if (geminiApiKey) {
    try {
      const aiText = await callGeminiApiKey(message, systemInstruction);
      if (aiText) return res.json({ text: aiText });
    } catch (err) {
      console.error("❌ AI Studio SDK error:", err.message);
    }
  }

  // 2. Try GCP Vertex AI
  if (gcpProject) {
    try {
      const aiText = await callGeminiVertex(message, systemInstruction);
      if (aiText) return res.json({ text: aiText });
    } catch (err) {
      console.error("❌ Vertex AI error:", err.message);
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

// Serve frontend static files from parent directory
const path = require("path");
app.use(express.static(path.join(__dirname, "..")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "index.html")));

app.listen(PORT, () => {
  console.log(`🚀 listen360 Gateway running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API:      http://localhost:${PORT}/api`);
});
