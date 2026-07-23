/* LISTEN-360 DATA & PRESET STORE */

const POLICIES_DATA = [
  {
    id: "speak-up",
    icon: "🗣️",
    title: "Speak Up Policy",
    desc: "Guidelines for safely raising concerns without fear of retaliation or reprisal.",
    fullContent: `
      <h3>Speak Up Policy</h3>
      <p>Listen360 ensures that every employee has a safe, protected channel to express concerns. Retaliation against any individual reporting in good faith is strictly prohibited and subject to zero-tolerance disciplinary measures.</p>
      <h4>Key Pillars:</h4>
      <ul>
        <li><strong>Confidentiality First:</strong> Identity protection protocols are strictly enforced.</li>
        <li><strong>Multiple Reporting Avenues:</strong> AI Chatbot, Anonymous Hotline, HR Ombudsperson.</li>
        <li><strong>Guaranteed Follow-up:</strong> Every submitted case receives acknowledgement within 24 hours.</li>
      </ul>
    `
  },
  {
    id: "anti-harassment",
    icon: "🛡️",
    title: "Anti-Harassment Policy",
    desc: "Zero tolerance for verbal, physical, sexual, or psychological harassment.",
    fullContent: `
      <h3>Anti-Harassment & Anti-Bullying Policy</h3>
      <p>Our organization is committed to providing a work environment free of harassment, intimidation, and abuse of power. Harassment includes unwelcome conduct based on race, gender, sexual orientation, disability, or age.</p>
      <h4>Reporting & Investigation:</h4>
      <ul>
        <li>Impartial third-party case assignments.</li>
        <li>Protection against workplace hostility during investigation.</li>
        <li>Remedial actions and formal outcome reports.</li>
      </ul>
    `
  },
  {
    id: "code-of-conduct",
    icon: "📜",
    title: "Code of Conduct",
    desc: "Core ethical principles and standard of behaviour expected across all teams.",
    fullContent: `
      <h3>Global Code of Conduct</h3>
      <p>Defines our standards of integrity, professional conduct, respect, and compliance with ethical business standards worldwide.</p>
    `
  },
  {
    id: "whistleblower",
    icon: "⚖️",
    title: "Whistleblower Policy",
    desc: "Protection framework for reporting financial fraud, corruption, or legal violations.",
    fullContent: `
      <h3>Whistleblower Protection Policy</h3>
      <p>Legal and organizational safeguards for individuals disclosing corporate misconduct, regulatory non-compliance, or financial irregularities.</p>
    `
  },
  {
    id: "workplace-respect",
    icon: "🤝",
    title: "Workplace Respect Policy",
    desc: "Promoting dignity, psychological safety, and constructive communication daily.",
    fullContent: `
      <h3>Workplace Respect & Civility Policy</h3>
      <p>Fostering mutual dignity, inclusive communication, and psychological safety across all work locations and remote channels.</p>
    `
  }
];

const LEARNING_MODULES = [
  {
    id: "mh-awareness",
    banner: "🧠",
    title: "Mental Health Awareness",
    tag: "Essential",
    duration: "15 mins",
    progress: 80,
    content: "Recognizing early signs of mental fatigue, anxiety, and learning how to prioritize self-care and support peers."
  },
  {
    id: "psych-safety",
    banner: "🛡️",
    title: "Psychological Safety in Teams",
    tag: "Leadership",
    duration: "20 mins",
    progress: 45,
    content: "How to create an environment where team members feel safe to take risks, ask questions, and share honest feedback."
  },
  {
    id: "inclusive-workplace",
    banner: "🌐",
    title: "Inclusive Workplace Practices",
    tag: "Culture",
    duration: "12 mins",
    progress: 100,
    content: "Understanding microaggressions, unconscious bias, and practical strategies to foster an inclusive workplace."
  },
  {
    id: "manager-toolkit",
    banner: "🛠️",
    title: "Manager Support Toolkit",
    tag: "Management",
    duration: "25 mins",
    progress: 15,
    content: "Empathetic communication techniques, conflict resolution frameworks, and crisis response steps for leaders."
  },
  {
    id: "stress-mgmt",
    banner: "🌿",
    title: "Stress & Burnout Management",
    tag: "Well-being",
    duration: "10 mins",
    progress: 60,
    content: "Workload management techniques, mindfulness practices, and boundary-setting strategies to prevent burnout."
  },
  {
    id: "emotional-intel",
    banner: "💡",
    title: "Emotional Intelligence at Work",
    tag: "Personal Dev",
    duration: "18 mins",
    progress: 30,
    content: "Developing self-awareness, empathy, and constructive emotional regulation in high-pressure environments."
  }
];

const CATEGORIES_LIST = [
  { id: "Bullying / Harassment", icon: "🚫", desc: "Repeated inappropriate behavior, power imbalance, or hostile environment." },
  { id: "Discrimination", icon: "⚖️", desc: "Unfair treatment based on protected characteristics (gender, race, age, etc.)." },
  { id: "Retaliation", icon: "⚡", desc: "Adverse actions taken following a previous report or protected activity." },
  { id: "Workplace Behaviour", icon: "🗣️", desc: "Unprofessional conduct, microaggressions, or inappropriate comments." },
  { id: "Manager / Leadership Concern", icon: "👔", desc: "Abuse of authority, unfair evaluation, or lack of support." },
  { id: "Conflict / Interpersonal Issue", icon: "👥", desc: "Disagreements or strained working relationships between team members." },
  { id: "Ethics / Conduct", icon: "📜", desc: "Breaches of professional integrity, theft, or policy violations." },
  { id: "Policy Violation", icon: "📋", desc: "Failure to adhere to company compliance or safety standards." },
  { id: "Financial / Fraud Concern", icon: "💰", desc: "Accounting irregularities, misappropriation, or embezzlement." },
  { id: "Conflict of Interest", icon: "🔄", desc: "Personal interests interfering with professional duties." },
  { id: "Well-being / Mental Health", icon: "💚", desc: "Stress, burnout, anxiety, or need for personal wellbeing support." },
  { id: "Other", icon: "❓", desc: "Any other workplace concern not listed above." }
];

const CATEGORY_QUESTIONS = {
  "Bullying / Harassment": [
    "What specific words, actions, or behavior occurred?",
    "Where did the incident(s) take place (in office, virtual meeting, email)?",
    "Who was present as direct witnesses or bystanders?",
    "How frequently has this occurred (daily, weekly, isolated)?",
    "Was this behavior previously reported to any supervisor or HR?",
    "Did you directly communicate your discomfort to the individual?",
    "How did the other person react when confronted or addressed?",
    "Are there written records, messages, or emails documenting this?",
    "Has this behavior impacted your ability to perform daily tasks?",
    "What specific outcome, resolution, or interim support are you seeking?"
  ],
  "Discrimination": [
    "What protected characteristic (race, gender, age, disability, etc.) is involved?",
    "What specific action or decision was taken (promotion denial, task allocation)?",
    "Are you aware of others in similar situations receiving different treatment?",
    "When was this discriminatory pattern or decision first noticed?",
    "Who made or influenced the decision in question?",
    "Were any explicit or implicit bias statements made?",
    "Do you have documentation, emails, or performance records supporting this?",
    "Did you discuss this treatment with a manager or colleague?",
    "How has this affected your career trajectory or work environment?",
    "What remediation or corrective action do you hope to see?"
  ],
  "Retaliation": [
    "What original complaint, report, or protected activity did you engage in?",
    "When did you engage in that original activity?",
    "What retaliatory action was subsequently taken against you?",
    "What was the timing between your report and the retaliatory action?",
    "Who initiated or carried out the adverse action?",
    "Were any reasons or explanations provided for the action?",
    "How has this retaliatory behavior affected your job duties or status?",
    "Do you have evidence linking the report to the adverse action?",
    "Are there witnesses aware of the sequence of events?",
    "What protective steps or remedies would help resolve this?"
  ],
  "Well-being / Mental Health": [
    "How would you describe your current emotional state and wellbeing?",
    "Is workplace workload, environment, or relationships contributing to this?",
    "How is this impacting your physical, mental, or sleep health?",
    "Are you experiencing signs of severe burnout or anxiety?",
    "Have you spoken to a manager or medical professional regarding this?",
    "Would you like immediate confidential contact from a Mental Health First Aider?",
    "Are you interested in scheduling confidential counselling through EAP?",
    "Do you feel safe continuing your current work duties today?",
    "What temporary work adjustments (schedule, workload) would support you?",
    "Would you also like to submit a formal workplace report if applicable?"
  ],
  "Ethics / Conduct": [
    "Which company policy or ethical code was violated?",
    "What specific fraudulent, unethical, or illegal activity took place?",
    "Who are the individuals or departments involved?",
    "What is the estimated financial or organizational impact?",
    "How long has this ethical breach been taking place?",
    "Do you have financial records, receipts, or logs as evidence?",
    "Are upper management or external parties aware of this?",
    "Is there an immediate compliance or security risk to the company?",
    "Did anyone direct or pressure you to participate in this activity?",
    "What outcome or investigative action do you recommend?"
  ]
};

// Default dynamic fallback generator for other categories
function getCategoryQuestions(category) {
  if (CATEGORY_QUESTIONS[category]) return CATEGORY_QUESTIONS[category];
  return [
    `What specifically happened regarding the ${category.toLowerCase()} concern?`,
    "Where and when did this incident occur?",
    "Who were the key individuals involved?",
    "How often has this situation arisen?",
    "Were there any witnesses or colleagues present?",
    "Do you have supporting evidence (documents, messages, screenshots)?",
    "Was this raised with leadership prior to submitting this report?",
    "How has this affected your daily work performance and wellbeing?",
    "Are there immediate safety or compliance risks?",
    "What outcome or solution do you feel would be most effective?"
  ];
}

// Initial Sample Cases for Investigator Dashboard
const INITIAL_SAMPLE_CASES = [
  {
    id: "LS360-2026-001245",
    category: "Bullying / Harassment",
    risk: "High",
    age: "3 days",
    status: "Under Investigation",
    owner: "Investigator A (Ethics Team)",
    anonymous: true,
    date: "2026-07-19",
    impact: "Emotional well-being and work performance",
    narrative: "Manager repeatedly making derogatory remarks during team syncs.",
    aiSummary: "The employee reports repeated inappropriate comments from their manager occurring over recent weeks. The employee indicates that the behaviour has affected their emotional well-being and work performance. Witness information provided. Confidential anonymous status requested.",
    timeline: [
      { date: "2026-07-19 09:15", title: "Report Submitted", desc: "Submitted via AI Chatbot with Anonymous flag." },
      { date: "2026-07-19 11:30", title: "AI Risk Engine Classification", desc: "Automated preliminary risk set to High due to power imbalance & frequency." },
      { date: "2026-07-20 08:45", title: "Case Assigned", desc: "Assigned to Senior Investigator A for formal review." },
      { date: "2026-07-21 14:00", title: "Witness Outreach", desc: "Initial confidential interview scheduled with nominated witness." }
    ]
  },
  {
    id: "LS360-2026-001246",
    category: "Ethics / Conduct",
    risk: "Moderate",
    age: "5 days",
    status: "Under Initial Review",
    owner: "Investigator B (Compliance)",
    anonymous: false,
    date: "2026-07-17",
    impact: "Policy Violation",
    narrative: "Unapproved expense claims logged for non-business events.",
    aiSummary: "Discrepancy identified in department travel expenditures during Q2 audit.",
    timeline: [
      { date: "2026-07-17 14:20", title: "Report Submitted", desc: "Submitted by Finance Associate." }
    ]
  },
  {
    id: "LS360-2026-001247",
    category: "Well-being / Mental Health",
    risk: "Low",
    age: "1 day",
    status: "Assigned",
    owner: "MHFA Team Lead",
    anonymous: false,
    date: "2026-07-21",
    impact: "Workplace anxiety & burnout",
    narrative: "Employee requested guidance for managing high project stress.",
    aiSummary: "Employee engaged with wellbeing support pathway for workload management.",
    timeline: [
      { date: "2026-07-21 16:30", title: "MHFA Outreach Initiated", desc: "Confidential appointment booked." }
    ]
  },
  {
    id: "LS360-2026-001248",
    category: "Retaliation",
    risk: "Critical",
    age: "2 days",
    status: "Under Investigation",
    owner: "Legal & ER Director",
    anonymous: true,
    date: "2026-07-20",
    impact: "Immediate Career & Safety Impact",
    narrative: "Employee removed from projects after filing safety complaint.",
    aiSummary: "Critical risk case involving potential retaliation following safety disclosure.",
    timeline: [
      { date: "2026-07-20 10:00", title: "Urgent Escalation Triggered", desc: "Escalated immediately to Legal Director." }
    ]
  },
  {
    id: "LS360-2026-001249",
    category: "Workplace Behaviour",
    risk: "Low",
    age: "8 days",
    status: "Resolved",
    owner: "HR Business Partner",
    anonymous: false,
    date: "2026-07-14",
    impact: "Team relationships",
    narrative: "Communication friction between remote team members.",
    aiSummary: "Interpersonal communication conflict resolved via facilitated mediation.",
    timeline: [
      { date: "2026-07-14 11:00", title: "Submitted", desc: "Mediated conversation completed." },
      { date: "2026-07-18 15:00", title: "Case Resolved", desc: "Agreement signed by both parties." }
    ]
  }
];

// Multi-Level Reporting Hierarchy Mock Data (HR Head / Regional / Divisional / Site)
const REPORTING_DATA = {
  orgWide: {
    totalCases: 214,
    safetyScore: 91.2,
    avgResolution: 4.1,
    highRiskPct: 11,
    anonymousRatio: 58,
    trendPct: -6.4,
    monthlyIntakeVol: 40,
    postInvestigationSatisfaction: 87.8,
    reopenedCaseRate: 3.7,
    trainingCoveragePct: 76
  },
  regions: [
    { id: "na", name: "North America", icon: "🗽", cases: 68, highRisk: 9, safetyScore: 92.6, avgResolution: 3.6, topCategory: "Workplace Behaviour", trendPct: -8.1, sitesCount: 2, divisionsCount: 4 },
    { id: "emea", name: "EMEA", icon: "🌍", cases: 61, highRisk: 8, safetyScore: 90.4, avgResolution: 4.3, topCategory: "Bullying / Harassment", trendPct: 3.2, sitesCount: 3, divisionsCount: 4 },
    { id: "apac", name: "APAC", icon: "🌏", cases: 59, highRisk: 5, safetyScore: 93.1, avgResolution: 3.9, topCategory: "Well-being / Mental Health", trendPct: -11.5, sitesCount: 2, divisionsCount: 3 },
    { id: "latam", name: "LATAM", icon: "🌎", cases: 26, highRisk: 2, safetyScore: 89.8, avgResolution: 5.2, topCategory: "Ethics / Conduct", trendPct: 5.0, sitesCount: 1, divisionsCount: 2 }
  ],
  divisions: [
    { id: "eng", name: "Engineering & Technology", icon: "💻", cases: 52, highRisk: 6, safetyScore: 93.4, avgResolution: 3.4, topCategory: "Workplace Behaviour", trendPct: -9.0, headcount: 1840 },
    { id: "sales", name: "Sales & Marketing", icon: "📈", cases: 47, highRisk: 7, safetyScore: 88.9, avgResolution: 4.6, topCategory: "Manager / Leadership Concern", trendPct: 4.4, headcount: 1120 },
    { id: "ops", name: "Operations & Supply Chain", icon: "📦", cases: 44, highRisk: 5, safetyScore: 90.1, avgResolution: 4.8, topCategory: "Ethics / Conduct", trendPct: -2.1, headcount: 980 },
    { id: "finance", name: "Finance & Corporate", icon: "💰", cases: 31, highRisk: 4, safetyScore: 92.8, avgResolution: 3.9, topCategory: "Policy Violation", trendPct: -5.6, headcount: 640 },
    { id: "cs", name: "Customer Success & Support", icon: "🎧", cases: 40, highRisk: 2, safetyScore: 94.2, avgResolution: 3.2, topCategory: "Well-being / Mental Health", trendPct: -13.7, headcount: 860 }
  ],
  sites: [
    { id: "nyc", name: "New York HQ", region: "North America", division: "Finance & Corporate", icon: "🏙️", cases: 38, highRisk: 5, safetyScore: 91.8, avgResolution: 3.7, topCategory: "Workplace Behaviour", trendPct: -7.2, headcount: 720 },
    { id: "sf", name: "San Francisco Tech Hub", region: "North America", division: "Engineering & Technology", icon: "🌉", cases: 30, highRisk: 4, safetyScore: 93.5, avgResolution: 3.2, topCategory: "Manager / Leadership Concern", trendPct: -9.8, headcount: 640 },
    { id: "london", name: "London Office", region: "EMEA", division: "Sales & Marketing", icon: "🇬🇧", cases: 27, highRisk: 4, safetyScore: 89.6, avgResolution: 4.5, topCategory: "Bullying / Harassment", trendPct: 6.1, headcount: 510 },
    { id: "berlin", name: "Berlin R&D Center", region: "EMEA", division: "Engineering & Technology", icon: "🇩🇪", cases: 19, highRisk: 2, safetyScore: 92.9, avgResolution: 3.8, topCategory: "Ethics / Conduct", trendPct: -4.4, headcount: 420 },
    { id: "dubai", name: "Dubai Regional Office", region: "EMEA", division: "Sales & Marketing", icon: "🇦🇪", cases: 15, highRisk: 2, safetyScore: 88.2, avgResolution: 5.1, topCategory: "Policy Violation", trendPct: 8.7, headcount: 260 },
    { id: "blr", name: "Bangalore Tech Park", region: "APAC", division: "Engineering & Technology", icon: "🇮🇳", cases: 34, highRisk: 3, safetyScore: 93.7, avgResolution: 3.5, topCategory: "Well-being / Mental Health", trendPct: -12.9, headcount: 980 },
    { id: "sgp", name: "Singapore Hub", region: "APAC", division: "Sales & Marketing", icon: "🇸🇬", cases: 25, highRisk: 2, safetyScore: 92.4, avgResolution: 4.0, topCategory: "Conflict / Interpersonal Issue", trendPct: -6.0, headcount: 390 },
    { id: "sp", name: "São Paulo Office", region: "LATAM", division: "Operations & Supply Chain", icon: "🇧🇷", cases: 26, highRisk: 2, safetyScore: 89.8, avgResolution: 5.2, topCategory: "Ethics / Conduct", trendPct: 5.0, headcount: 340 }
  ]
};

// Case Type Taxonomy - used specifically in the Site Head deep-dive analytics view
const CASE_TYPES = [
  { type: "Harassment", color: "#B0727A" },
  { type: "Compensation", color: "#1F7A8C" },
  { type: "Financial Fraud", color: "#C6A15B" },
  { type: "Treatment Disparity", color: "#8ECDF0" },
  { type: "Facilities", color: "#2D6A4F" },
  { type: "Real Estate", color: "#8B7FA8" },
  { type: "Other", color: "#A8D5BA" }
];

// Baseline average ageing (days) per case type, used to derive per-site ageing charts
const BASE_AGEING_DAYS = {
  "Harassment": 6.5,
  "Compensation": 4.0,
  "Financial Fraud": 9.5,
  "Treatment Disparity": 7.0,
  "Facilities": 2.5,
  "Real Estate": 5.5,
  "Other": 4.5
};

// Per-site deep-dive data, used only inside the Site Head Reporting Dashboard view
const SITE_DETAIL_DATA = {
  nyc: {
    monthlyIntakeVol: 7,
    postInvestigationSatisfaction: 88,
    reopenedCaseRate: 3.6,
    caseTypeWeights: { "Harassment": 0.28, "Compensation": 0.18, "Financial Fraud": 0.16, "Treatment Disparity": 0.12, "Facilities": 0.10, "Real Estate": 0.08, "Other": 0.08 },
    divisionMix: [
      { division: "Finance & Corporate", cases: 18 },
      { division: "Sales & Marketing", cases: 9 },
      { division: "Operations & Supply Chain", cases: 7 },
      { division: "Engineering & Technology", cases: 4 }
    ],
    repeatOffenders: [
      { ref: "MGR-1042", casesCount: 3, categories: ["Harassment", "Treatment Disparity"], status: "Under Investigation" },
      { ref: "SUP-0871", casesCount: 2, categories: ["Compensation"], status: "Resolved" }
    ]
  },
  sf: {
    monthlyIntakeVol: 6,
    postInvestigationSatisfaction: 91,
    reopenedCaseRate: 2.4,
    caseTypeWeights: { "Harassment": 0.18, "Compensation": 0.22, "Financial Fraud": 0.10, "Treatment Disparity": 0.16, "Facilities": 0.14, "Real Estate": 0.08, "Other": 0.12 },
    divisionMix: [
      { division: "Engineering & Technology", cases: 14 },
      { division: "Sales & Marketing", cases: 6 },
      { division: "Operations & Supply Chain", cases: 5 },
      { division: "Finance & Corporate", cases: 5 }
    ],
    repeatOffenders: [
      { ref: "LEAD-0219", casesCount: 2, categories: ["Compensation", "Treatment Disparity"], status: "Under Investigation" }
    ]
  },
  london: {
    monthlyIntakeVol: 5,
    postInvestigationSatisfaction: 84,
    reopenedCaseRate: 5.1,
    caseTypeWeights: { "Harassment": 0.30, "Compensation": 0.14, "Financial Fraud": 0.12, "Treatment Disparity": 0.18, "Facilities": 0.08, "Real Estate": 0.06, "Other": 0.12 },
    divisionMix: [
      { division: "Sales & Marketing", cases: 13 },
      { division: "Engineering & Technology", cases: 6 },
      { division: "Finance & Corporate", cases: 5 },
      { division: "Customer Success & Support", cases: 3 }
    ],
    repeatOffenders: [
      { ref: "MGR-0733", casesCount: 3, categories: ["Harassment"], status: "Escalated" },
      { ref: "SUP-0456", casesCount: 2, categories: ["Treatment Disparity"], status: "Under Investigation" }
    ]
  },
  berlin: {
    monthlyIntakeVol: 4,
    postInvestigationSatisfaction: 90,
    reopenedCaseRate: 2.9,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.16, "Financial Fraud": 0.10, "Treatment Disparity": 0.12, "Facilities": 0.18, "Real Estate": 0.14, "Other": 0.14 },
    divisionMix: [
      { division: "Engineering & Technology", cases: 10 },
      { division: "Operations & Supply Chain", cases: 4 },
      { division: "Finance & Corporate", cases: 3 },
      { division: "Sales & Marketing", cases: 2 }
    ],
    repeatOffenders: [
      { ref: "OPS-0198", casesCount: 2, categories: ["Facilities"], status: "Resolved" }
    ]
  },
  dubai: {
    monthlyIntakeVol: 3,
    postInvestigationSatisfaction: 82,
    reopenedCaseRate: 6.0,
    caseTypeWeights: { "Harassment": 0.22, "Compensation": 0.24, "Financial Fraud": 0.14, "Treatment Disparity": 0.14, "Facilities": 0.08, "Real Estate": 0.10, "Other": 0.08 },
    divisionMix: [
      { division: "Sales & Marketing", cases: 7 },
      { division: "Finance & Corporate", cases: 4 },
      { division: "Customer Success & Support", cases: 2 },
      { division: "Operations & Supply Chain", cases: 2 }
    ],
    repeatOffenders: [
      { ref: "MGR-0350", casesCount: 2, categories: ["Compensation", "Harassment"], status: "Under Investigation" }
    ]
  },
  blr: {
    monthlyIntakeVol: 6,
    postInvestigationSatisfaction: 93,
    reopenedCaseRate: 1.8,
    caseTypeWeights: { "Harassment": 0.14, "Compensation": 0.18, "Financial Fraud": 0.08, "Treatment Disparity": 0.14, "Facilities": 0.16, "Real Estate": 0.08, "Other": 0.22 },
    divisionMix: [
      { division: "Engineering & Technology", cases: 16 },
      { division: "Customer Success & Support", cases: 8 },
      { division: "Operations & Supply Chain", cases: 6 },
      { division: "Sales & Marketing", cases: 4 }
    ],
    repeatOffenders: [
      { ref: "LEAD-0602", casesCount: 2, categories: ["Treatment Disparity"], status: "Resolved" }
    ]
  },
  sgp: {
    monthlyIntakeVol: 4,
    postInvestigationSatisfaction: 89,
    reopenedCaseRate: 3.2,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.20, "Financial Fraud": 0.12, "Treatment Disparity": 0.16, "Facilities": 0.10, "Real Estate": 0.10, "Other": 0.16 },
    divisionMix: [
      { division: "Sales & Marketing", cases: 11 },
      { division: "Customer Success & Support", cases: 6 },
      { division: "Finance & Corporate", cases: 5 },
      { division: "Engineering & Technology", cases: 3 }
    ],
    repeatOffenders: [
      { ref: "SUP-0284", casesCount: 2, categories: ["Compensation"], status: "Under Investigation" }
    ]
  },
  sp: {
    monthlyIntakeVol: 5,
    postInvestigationSatisfaction: 85,
    reopenedCaseRate: 4.6,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.14, "Financial Fraud": 0.18, "Treatment Disparity": 0.10, "Facilities": 0.14, "Real Estate": 0.14, "Other": 0.14 },
    divisionMix: [
      { division: "Operations & Supply Chain", cases: 12 },
      { division: "Sales & Marketing", cases: 6 },
      { division: "Finance & Corporate", cases: 5 },
      { division: "Customer Success & Support", cases: 3 }
    ],
    repeatOffenders: [
      { ref: "OPS-0417", casesCount: 3, categories: ["Financial Fraud", "Facilities"], status: "Escalated" }
    ]
  }
};

// Gender & Corporate Title distribution tendencies per case type (org-wide patterns, applied to any site's case-type counts)
const GENDER_WEIGHTS_BY_TYPE = {
  "Harassment": { "Male": 0.28, "Female": 0.65, "Other": 0.07 },
  "Compensation": { "Male": 0.42, "Female": 0.52, "Other": 0.06 },
  "Financial Fraud": { "Male": 0.55, "Female": 0.40, "Other": 0.05 },
  "Treatment Disparity": { "Male": 0.30, "Female": 0.63, "Other": 0.07 },
  "Facilities": { "Male": 0.48, "Female": 0.46, "Other": 0.06 },
  "Real Estate": { "Male": 0.50, "Female": 0.44, "Other": 0.06 },
  "Other": { "Male": 0.45, "Female": 0.48, "Other": 0.07 }
};

const TITLE_WEIGHTS_BY_TYPE = {
  "Harassment": { "Individual Contributor": 0.35, "People Manager": 0.40, "Director": 0.18, "VP & Above": 0.07 },
  "Compensation": { "Individual Contributor": 0.50, "People Manager": 0.32, "Director": 0.13, "VP & Above": 0.05 },
  "Financial Fraud": { "Individual Contributor": 0.40, "People Manager": 0.30, "Director": 0.20, "VP & Above": 0.10 },
  "Treatment Disparity": { "Individual Contributor": 0.45, "People Manager": 0.35, "Director": 0.15, "VP & Above": 0.05 },
  "Facilities": { "Individual Contributor": 0.60, "People Manager": 0.28, "Director": 0.09, "VP & Above": 0.03 },
  "Real Estate": { "Individual Contributor": 0.55, "People Manager": 0.30, "Director": 0.11, "VP & Above": 0.04 },
  "Other": { "Individual Contributor": 0.50, "People Manager": 0.32, "Director": 0.13, "VP & Above": 0.05 }
};

// Per-division deep-dive data, used only inside the Divisional Head Reporting Dashboard view
const DIVISION_DETAIL_DATA = {
  eng: {
    monthlyIntakeVol: 8,
    postInvestigationSatisfaction: 90,
    reopenedCaseRate: 3.0,
    caseTypeWeights: { "Harassment": 0.20, "Compensation": 0.18, "Financial Fraud": 0.08, "Treatment Disparity": 0.14, "Facilities": 0.16, "Real Estate": 0.10, "Other": 0.14 },
    repeatOffenders: [
      { ref: "LEAD-0219", casesCount: 2, categories: ["Compensation", "Treatment Disparity"], status: "Under Investigation" },
      { ref: "MGR-0602", casesCount: 2, categories: ["Facilities"], status: "Resolved" }
    ]
  },
  sales: {
    monthlyIntakeVol: 7,
    postInvestigationSatisfaction: 85,
    reopenedCaseRate: 4.8,
    caseTypeWeights: { "Harassment": 0.24, "Compensation": 0.24, "Financial Fraud": 0.10, "Treatment Disparity": 0.16, "Facilities": 0.08, "Real Estate": 0.06, "Other": 0.12 },
    repeatOffenders: [
      { ref: "MGR-0733", casesCount: 3, categories: ["Harassment"], status: "Escalated" },
      { ref: "SUP-0284", casesCount: 2, categories: ["Compensation"], status: "Under Investigation" }
    ]
  },
  ops: {
    monthlyIntakeVol: 6,
    postInvestigationSatisfaction: 88,
    reopenedCaseRate: 3.5,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.14, "Financial Fraud": 0.20, "Treatment Disparity": 0.10, "Facilities": 0.18, "Real Estate": 0.14, "Other": 0.08 },
    repeatOffenders: [
      { ref: "OPS-0417", casesCount: 3, categories: ["Financial Fraud", "Facilities"], status: "Escalated" }
    ]
  },
  finance: {
    monthlyIntakeVol: 5,
    postInvestigationSatisfaction: 91,
    reopenedCaseRate: 2.6,
    caseTypeWeights: { "Harassment": 0.14, "Compensation": 0.20, "Financial Fraud": 0.28, "Treatment Disparity": 0.10, "Facilities": 0.08, "Real Estate": 0.08, "Other": 0.12 },
    repeatOffenders: [
      { ref: "MGR-1042", casesCount: 3, categories: ["Harassment", "Treatment Disparity"], status: "Under Investigation" }
    ]
  },
  cs: {
    monthlyIntakeVol: 6,
    postInvestigationSatisfaction: 93,
    reopenedCaseRate: 2.0,
    caseTypeWeights: { "Harassment": 0.22, "Compensation": 0.16, "Financial Fraud": 0.06, "Treatment Disparity": 0.14, "Facilities": 0.12, "Real Estate": 0.06, "Other": 0.24 },
    repeatOffenders: [
      { ref: "LEAD-0602", casesCount: 2, categories: ["Treatment Disparity"], status: "Resolved" }
    ]
  }
};

// Investigation outcome / action taxonomy, used specifically in the Divisional Head view
const ACTION_TYPES = ["Termination", "Written Warning", "Compensation Impact", "Promotion / Career Impact", "Coaching / No Formal Action"];

const ACTION_WEIGHTS_BY_TYPE = {
  "Harassment": { "Termination": 0.22, "Written Warning": 0.38, "Compensation Impact": 0.08, "Promotion / Career Impact": 0.12, "Coaching / No Formal Action": 0.20 },
  "Compensation": { "Termination": 0.05, "Written Warning": 0.15, "Compensation Impact": 0.45, "Promotion / Career Impact": 0.10, "Coaching / No Formal Action": 0.25 },
  "Financial Fraud": { "Termination": 0.40, "Written Warning": 0.20, "Compensation Impact": 0.10, "Promotion / Career Impact": 0.05, "Coaching / No Formal Action": 0.25 },
  "Treatment Disparity": { "Termination": 0.10, "Written Warning": 0.25, "Compensation Impact": 0.20, "Promotion / Career Impact": 0.20, "Coaching / No Formal Action": 0.25 },
  "Facilities": { "Termination": 0.02, "Written Warning": 0.10, "Compensation Impact": 0.03, "Promotion / Career Impact": 0.02, "Coaching / No Formal Action": 0.83 },
  "Real Estate": { "Termination": 0.05, "Written Warning": 0.15, "Compensation Impact": 0.10, "Promotion / Career Impact": 0.05, "Coaching / No Formal Action": 0.65 },
  "Other": { "Termination": 0.10, "Written Warning": 0.20, "Compensation Impact": 0.15, "Promotion / Career Impact": 0.10, "Coaching / No Formal Action": 0.45 }
};

// Per-region deep-dive data, used only inside the Regional Head Reporting Dashboard view
const REGION_DETAIL_DATA = {
  na: {
    monthlyIntakeVol: 11,
    postInvestigationSatisfaction: 89,
    reopenedCaseRate: 3.8,
    caseTypeWeights: { "Harassment": 0.22, "Compensation": 0.20, "Financial Fraud": 0.10, "Treatment Disparity": 0.14, "Facilities": 0.12, "Real Estate": 0.10, "Other": 0.12 },
    repeatOffenders: [
      { ref: "MGR-1042", casesCount: 3, categories: ["Harassment", "Treatment Disparity"], status: "Under Investigation" },
      { ref: "LEAD-0219", casesCount: 2, categories: ["Compensation"], status: "Resolved" }
    ]
  },
  emea: {
    monthlyIntakeVol: 10,
    postInvestigationSatisfaction: 85,
    reopenedCaseRate: 4.6,
    caseTypeWeights: { "Harassment": 0.26, "Compensation": 0.16, "Financial Fraud": 0.12, "Treatment Disparity": 0.16, "Facilities": 0.10, "Real Estate": 0.08, "Other": 0.12 },
    repeatOffenders: [
      { ref: "MGR-0733", casesCount: 3, categories: ["Harassment"], status: "Escalated" },
      { ref: "OPS-0198", casesCount: 2, categories: ["Facilities"], status: "Resolved" }
    ]
  },
  apac: {
    monthlyIntakeVol: 9,
    postInvestigationSatisfaction: 92,
    reopenedCaseRate: 2.6,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.18, "Financial Fraud": 0.08, "Treatment Disparity": 0.14, "Facilities": 0.16, "Real Estate": 0.10, "Other": 0.18 },
    repeatOffenders: [
      { ref: "LEAD-0602", casesCount: 2, categories: ["Treatment Disparity"], status: "Resolved" },
      { ref: "SUP-0284", casesCount: 2, categories: ["Compensation"], status: "Under Investigation" }
    ]
  },
  latam: {
    monthlyIntakeVol: 4,
    postInvestigationSatisfaction: 86,
    reopenedCaseRate: 5.0,
    caseTypeWeights: { "Harassment": 0.16, "Compensation": 0.14, "Financial Fraud": 0.18, "Treatment Disparity": 0.10, "Facilities": 0.14, "Real Estate": 0.14, "Other": 0.14 },
    repeatOffenders: [
      { ref: "OPS-0417", casesCount: 3, categories: ["Financial Fraud", "Facilities"], status: "Escalated" }
    ]
  }
};

// Offender tenure & age group cohort tendency per case type
const TENURE_AGE_WEIGHTS_BY_TYPE = {
  "Harassment": { "New Hire (<1 Yr / Under 30)": 0.20, "Early Career (1-3 Yrs / 30-40)": 0.32, "Established (3-7 Yrs / 40-50)": 0.30, "Tenured (7+ Yrs / 50+)": 0.18 },
  "Compensation": { "New Hire (<1 Yr / Under 30)": 0.10, "Early Career (1-3 Yrs / 30-40)": 0.25, "Established (3-7 Yrs / 40-50)": 0.35, "Tenured (7+ Yrs / 50+)": 0.30 },
  "Financial Fraud": { "New Hire (<1 Yr / Under 30)": 0.08, "Early Career (1-3 Yrs / 30-40)": 0.20, "Established (3-7 Yrs / 40-50)": 0.32, "Tenured (7+ Yrs / 50+)": 0.40 },
  "Treatment Disparity": { "New Hire (<1 Yr / Under 30)": 0.22, "Early Career (1-3 Yrs / 30-40)": 0.34, "Established (3-7 Yrs / 40-50)": 0.28, "Tenured (7+ Yrs / 50+)": 0.16 },
  "Facilities": { "New Hire (<1 Yr / Under 30)": 0.25, "Early Career (1-3 Yrs / 30-40)": 0.28, "Established (3-7 Yrs / 40-50)": 0.27, "Tenured (7+ Yrs / 50+)": 0.20 },
  "Real Estate": { "New Hire (<1 Yr / Under 30)": 0.20, "Early Career (1-3 Yrs / 30-40)": 0.27, "Established (3-7 Yrs / 40-50)": 0.30, "Tenured (7+ Yrs / 50+)": 0.23 },
  "Other": { "New Hire (<1 Yr / Under 30)": 0.20, "Early Career (1-3 Yrs / 30-40)": 0.28, "Established (3-7 Yrs / 40-50)": 0.30, "Tenured (7+ Yrs / 50+)": 0.22 }
};

// Named direct reports of each Regional Head — modeled as the Site Directors of the sites within that region
const REGION_DIRECT_REPORTS = {
  nyc: { name: "Michael Chen", title: "Site Director, New York HQ" },
  sf: { name: "Priya Patel", title: "Site Director, San Francisco Tech Hub" },
  london: { name: "James Whitfield", title: "Site Director, London Office" },
  berlin: { name: "Anna Fischer", title: "Site Director, Berlin R&D Center" },
  dubai: { name: "Fatima Al-Sayed", title: "Site Director, Dubai Regional Office" },
  blr: { name: "Arjun Mehta", title: "Site Director, Bangalore Tech Park" },
  sgp: { name: "Wei Ling Tan", title: "Site Director, Singapore Hub" },
  sp: { name: "Carlos Mendes", title: "Site Director, São Paulo Office" }
};

// Org-wide case ageing distribution buckets, used in the HR Head view
const HR_AGE_BUCKETS = [
  { bucket: "0-7 Days", count: 120 },
  { bucket: "8-14 Days", count: 58 },
  { bucket: "15-30 Days", count: 26 },
  { bucket: "30+ Days", count: 10 }
];

// Org-wide monthly intake vs. closure trend, used in the HR Head view
const HR_MONTHLY_TREND = {
  months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  newCases: [28, 31, 29, 35, 38, 34],
  closedCases: [24, 27, 30, 32, 35, 36]
};

// Org-wide intake channel split, used in the HR Head view
const INTAKE_CHANNEL_SPLIT = [
  { channel: "AI Chatbot / Web Portal", pct: 52, color: "#1F7A8C" },
  { channel: "Confidential Hotline", pct: 28, color: "#C6A15B" },
  { channel: "Open-Door / In-Person", pct: 20, color: "#8ECDF0" }
];

window.HR_AGE_BUCKETS = HR_AGE_BUCKETS;
window.HR_MONTHLY_TREND = HR_MONTHLY_TREND;
window.INTAKE_CHANNEL_SPLIT = INTAKE_CHANNEL_SPLIT;
window.REGION_DIRECT_REPORTS = REGION_DIRECT_REPORTS;

window.POLICIES_DATA = POLICIES_DATA;
window.LEARNING_MODULES = LEARNING_MODULES;
window.CATEGORIES_LIST = CATEGORIES_LIST;
window.CATEGORY_QUESTIONS = CATEGORY_QUESTIONS;
window.INITIAL_SAMPLE_CASES = INITIAL_SAMPLE_CASES;
window.REPORTING_DATA = REPORTING_DATA;
window.CASE_TYPES = CASE_TYPES;
window.BASE_AGEING_DAYS = BASE_AGEING_DAYS;
window.SITE_DETAIL_DATA = SITE_DETAIL_DATA;
window.GENDER_WEIGHTS_BY_TYPE = GENDER_WEIGHTS_BY_TYPE;
window.TITLE_WEIGHTS_BY_TYPE = TITLE_WEIGHTS_BY_TYPE;
window.DIVISION_DETAIL_DATA = DIVISION_DETAIL_DATA;
window.ACTION_TYPES = ACTION_TYPES;
window.ACTION_WEIGHTS_BY_TYPE = ACTION_WEIGHTS_BY_TYPE;
window.REGION_DETAIL_DATA = REGION_DETAIL_DATA;
window.TENURE_AGE_WEIGHTS_BY_TYPE = TENURE_AGE_WEIGHTS_BY_TYPE;

