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
