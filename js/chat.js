/* LISTEN360 AI CHATBOT ENGINE - EMPATHETIC PSYCHOLOGICAL SAFETY, BIASNESS & MENTAL HEALTH ASSISTANT */

const ChatEngine = {
  mode: "standard", // "standard", "biasness", "mental_health"
  step: 0, // 0=Init, 1=Narrative, 2-8=Fact-Finding Q1-Q7, 9=AI Classify, 10=Category Questions (1-10), 11=Risk, 12=Summary Review, 13=Submitted
  categoryStep: 0,
  isVoiceRecording: false,
  biasRiskScore: 0,
  mentalHealthRiskScore: 0,

  chatData: {
    category: "",
    confidence: "High",
    classificationReason: "",
    narrative: "",
    description: "",
    when: "",
    who: "",
    recurrence: "",
    frequencyCount: "",
    impact: "",
    evidence: "",
    isSafe: true,
    anonymous: true,
    categoryAnswers: [],
    riskLevel: "Moderate",
    riskScore: 50,
    riskFactors: [],
    attachments: []
  },

  empatheticStatements: [
    "Thank you for trusting me with this.",
    "I understand your concern and appreciate your courage.",
    "I'm here to listen and support you completely.",
    "I'm truly sorry you've experienced this situation.",
    "You're not alone in this—your mental health and safety are our highest priority.",
    "Your wellbeing is important, and every concern deserves to be heard.",
    "Let me help guide you through this step-by-step.",
    "Thank you for sharing something that may have been difficult to talk about."
  ],

  // 7 BASIC FACT-FINDING QUESTIONS
  factFindingQuestions: [
    {
      id: "when",
      question: "Question 1 of 7 — When did this happen?",
      options: ["Today / Recent", "Within past month", "Approximate date", "Ongoing concern", "Multiple occasions"]
    },
    {
      id: "who",
      question: "Question 2 of 7 — Who was involved?",
      options: ["Manager / Supervisor", "Colleague / Peer", "Team / Department", "External person", "Other individual"]
    },
    {
      id: "recurrence",
      question: "Question 3 of 7 — Has this happened before?",
      options: ["Yes, repeated incident", "No, first occurrence", "Not sure"]
    },
    {
      id: "impact",
      question: "Question 4 of 7 — How has this situation affected you?",
      options: ["Emotional well-being", "Mental health & anxiety", "Work performance & focus", "Career development", "Team relationships", "Sense of safety"]
    },
    {
      id: "evidence",
      question: "Question 5 of 7 — Do you have any supporting evidence?",
      options: ["Emails & Messages", "Documents & Screenshots", "Witness statements", "No evidence currently available", "Other evidence"]
    },
    {
      id: "safety",
      question: "Question 6 of 7 — Do you feel that you are currently at risk or unsafe because of this situation?",
      options: ["💚 No, I feel safe", "🚨 Yes, I feel at risk", "⚠️ I'm not sure"]
    },
    {
      id: "anonymity",
      question: "Question 7 of 7 — Would you like to remain anonymous?",
      options: ["🔒 Yes, submit 100% anonymously", "👤 No, include my identity (Jordan Smith)"]
    }
  ],

  // CATEGORIES FOR MANUAL SELECTION
  allCategories: [
    "Bullying / Harassment",
    "Discrimination",
    "Retaliation",
    "Workplace Behaviour",
    "Manager / Leadership Concern",
    "Conflict / Interpersonal Issue",
    "Ethics / Conduct",
    "Policy Violation",
    "Financial / Fraud Concern",
    "Conflict of Interest",
    "Well-being / Mental Health",
    "Other"
  ],

  // CATEGORY-SPECIFIC 5 TARGETED QUESTIONS MATRIX
  categoryQuestionsMap: {
    "Bullying / Harassment": [
      "What specific words, actions, or repeated behaviours occurred?",
      "Where and how frequently did the incident(s) take place?",
      "Who was involved or present as a witness, and was there a power imbalance?",
      "How has this impacted your psychological safety, well-being, or work performance?",
      "What supporting evidence exists (e.g., chat logs, emails), and what resolution do you seek?"
    ],
    "Discrimination": [
      "Which protected characteristic or ground do you believe was involved? (e.g. Gender, Race, Age, Disability)",
      "What specific decision or treatment was affected? (e.g. Promotion, Performance Review, Pay, Work Allocation)",
      "Were colleagues in similar roles or circumstances treated differently?",
      "Did you observe language, comments, or decisions reflecting stereotypes or intentional exclusion?",
      "How has this impacted your career development, and what outcome are you seeking?"
    ],
    "Retaliation": [
      "What was the original report, complaint, or protected activity you participated in?",
      "What retaliatory action was taken against you, and who initiated it?",
      "How much time elapsed between your original report and the retaliatory action?",
      "How has this impacted your job duties, evaluation, status, or well-being?",
      "What evidence or timeline documentation do you have, and what protection do you require?"
    ],
    "Well-being / Mental Health": [
      "What specific workplace situation or aspect of work is affecting your mental or emotional well-being?",
      "How is this situation impacting your day-to-day work performance, concentration, or personal life?",
      "Are specific workplace factors (e.g. workload, unrealistic expectations, conflict) contributing to the issue?",
      "What type of confidential support or guidance would be most helpful to you right now?",
      "Do you feel safe continuing in your current work environment today?"
    ],
    "Ethics / Conduct": [
      "What specific policy, law, or ethical standard was violated?",
      "Who was involved in the unethical conduct, and what was the financial or operational impact?",
      "Was instructions given to conceal or misrepresent information?",
      "Are financial records, contracts, messages, or audit trails available?",
      "What immediate corrective action or investigation is required?"
    ],
    "Default": [
      "Could you provide additional details regarding the primary incident or concern?",
      "Who were the key individuals involved or affected?",
      "How has this situation impacted your day-to-day work experience or safety?",
      "What supporting evidence, messages, or documents exist?",
      "What resolution, support, or outcome are you seeking from this report?"
    ]
  },

  init() {
    this.renderWelcomeMessage();
  },

  renderWelcomeMessage() {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    container.innerHTML = `
      <div class="chat-bubble-wrap ai">
        <div class="chat-bubble">
          <p><strong>Hello Jordan, welcome to listen360.</strong></p>
          <p style="margin-top:6px;">
            I am your dedicated AI Psychological Safety, Wellbeing & Workplace Integrity Assistant. I am here to listen with empathy, complete confidentiality, and zero judgment.
          </p>
          <p style="margin-top:6px; font-size:0.78rem; color:var(--primary-teal); font-weight:600;">
            🔒 <em>All conversations are 100% encrypted, confidential, and safe.</em>
          </p>
        </div>
        <div class="chat-time">Just now</div>
      </div>

      <div class="chat-bubble-wrap ai">
        <div class="chat-bubble">
          <p>How can I support you today? Describe your concern in your own words, or select a quick option:</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Bullying / Harassment')">🛑 Bullying or Anti-Harassment Issue</button>
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Well-being / Mental Health')">🌿 Mental Health & Well-being Support</button>
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Discrimination')">⚖️ Report Discrimination or Biasness</button>
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Workplace Behaviour')">💬 Report General Workplace Concern</button>
          </div>
        </div>
      </div>
    `;
    this.scrollToBottom();
  },

  selectInitialOption(categoryName) {
    this.addUserMessage(`I would like to discuss: ${categoryName}`);
    this.chatData.category = categoryName;
    this.step = 1;
    this.showEmpatheticIntakeResponse();
  },

  handleUserInput(text) {
    if (!text.trim()) return;

    this.addUserMessage(text);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      if (this.step === 0) {
        // Step 1: Free Text Narrative
        this.chatData.narrative = text;
        this.chatData.description = text;
        this.step = 1;
        this.showEmpatheticIntakeResponse();
      } else if (this.step >= 1 && this.step <= 7) {
        // Fact-Finding Questions (1 to 7)
        this.processFactFindingStep(text);
      } else if (this.step === 8) {
        // Manual Category Selection or Confirmation
        this.processCategorySelection(text);
      } else if (this.step === 10) {
        // Category-Specific Questions (1-5)
        this.processCategoryQuestionStep(text);
      } else {
        this.processStandardStep(text);
      }
    }, 1200);
  },

  // STEP 2: EMPATHETIC ACKNOWLEDGMENT & START 7 FACT-FINDING QUESTIONS
  showEmpatheticIntakeResponse() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <p>Thank you for sharing this with me. I understand that this may not have been easy to share. I will ask you a few questions to better understand your concern.</p>
        
        <div style="margin-top:10px; background:rgba(31, 122, 140, 0.06); border-left:3px solid var(--primary-teal); padding:10px 12px; border-radius:6px;">
          <strong style="color:var(--primary-teal-dark); font-size:0.85rem;">Step 1 of 7 Fact-Finding Assessment</strong>
        </div>
        
        <p style="margin-top:8px; font-weight:700; color:var(--primary-teal-dark);">${this.factFindingQuestions[0].question}</p>
        <div class="chat-options-grid">
          ${this.factFindingQuestions[0].options.map(opt => `
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('${opt}')">${opt}</button>
          `).join('')}
        </div>
      `);
      this.step = 2;
    }, 1200);
  },

  handleOptionSelect(optText) {
    this.handleUserInput(optText);
  },

  // PROCESS FACT-FINDING QUESTIONS (Q1 TO Q7)
  processFactFindingStep(userText) {
    const qIndex = this.step - 1; // 1 to 7 mapping
    const currentQ = this.factFindingQuestions[qIndex - 1];

    if (currentQ) {
      if (currentQ.id === "when") this.chatData.when = userText;
      if (currentQ.id === "who") this.chatData.who = userText;
      if (currentQ.id === "recurrence") {
        this.chatData.recurrence = userText;
        if (userText.toLowerCase().includes("yes")) {
          this.addAiMessage(`<p style="font-size:0.82rem; font-style:italic; color:var(--text-muted);">Approximately how many times has this occurred?</p>`);
        }
      }
      if (currentQ.id === "impact") this.chatData.impact = userText;
      if (currentQ.id === "evidence") this.chatData.evidence = userText;
      if (currentQ.id === "safety") {
        this.chatData.isSafe = !userText.toLowerCase().includes("yes");
        if (userText.toLowerCase().includes("yes") || userText.toLowerCase().includes("risk") || userText.toLowerCase().includes("unsafe")) {
          this.triggerUrgentSafetyEscalation();
          return;
        }
      }
      if (currentQ.id === "anonymity") {
        this.chatData.anonymous = userText.toLowerCase().includes("yes") || userText.toLowerCase().includes("anonymous");
      }
    }

    if (this.step < 7) {
      const nextQ = this.factFindingQuestions[this.step];
      this.step++;
      this.addAiMessage(`
        <p style="font-weight:700; color:var(--primary-teal-dark);">${nextQ.question}</p>
        <div class="chat-options-grid">
          ${nextQ.options.map(opt => `
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('${opt}')">${opt}</button>
          `).join('')}
        </div>
      `);
    } else {
      // Completed 7 Fact-Finding Questions -> Move to AI Classification (Step 4 & Part B)
      this.evaluateAIConcernClassification();
    }
  },

  // URGENT CRISIS ESCALATION
  triggerUrgentSafetyEscalation() {
    this.addAiMessage(`
      <div style="background:#FEE2E2; border:2px solid #E63946; border-radius:12px; padding:16px; margin-top:6px;">
        <h3 style="color:#991B1B; font-size:1.05rem; font-weight:800; display:flex; align-items:center; gap:6px;">
          🚨 Immediate Safety & Crisis Escalation
        </h3>
        <p style="margin-top:8px; font-size:0.88rem; color:#7F1D1D; line-height:1.5;">
          Your safety is our top priority. Because you indicated feeling at risk, immediate crisis support pathways are active:
        </p>

        <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
          <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#E63946; color:#991B1B; font-weight:800; padding:8px 14px; text-align:left;" onclick="WellbeingModule.openMHFAConnectModal()">🌿 Talk to Mental Health First Aider (MHFA) Right Now</button>
          <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#0284C7; color:#0369A1; font-weight:700; padding:8px 14px; text-align:left;" onclick="WellbeingModule.openMHFAConnectModal()">📅 Book Urgent Confidential Counselling</button>
          <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#D97706; color:#92400E; font-weight:700; padding:8px 14px; text-align:left;" onclick="alert('Connecting to 24/7 Helpline: 1-800-WELLBEING')">📞 Call 24/7 Crisis Helpline</button>
          <button class="chat-opt-btn" style="background:#FFFFFF; border-color:var(--primary-teal); color:var(--primary-teal); font-weight:700; padding:8px 14px; text-align:left;" onclick="ChatEngine.evaluateAIConcernClassification()">📋 Continue Formal Reporting Process</button>
        </div>
      </div>
    `);
  },

  // STEP 4: AI CONCERN CLASSIFICATION & CONFIDENCE SCORE
  evaluateAIConcernClassification() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();

      const text = (this.chatData.narrative + " " + this.chatData.description).toLowerCase();
      let detectedCategory = "Bullying / Harassment";
      let confidence = "High";
      let reasoning = "Your responses mention repeated inappropriate comments and impact on your well-being.";

      if (text.includes("mental") || text.includes("stress") || text.includes("burnout") || text.includes("anxiety") || text.includes("depress")) {
        detectedCategory = "Well-being / Mental Health";
        confidence = "High";
        reasoning = "Your responses indicate emotional strain, workload pressure, or mental health support needs.";
      } else if (text.includes("bias") || text.includes("favourit") || text.includes("favorit") || text.includes("unfair") || text.includes("discriminat")) {
        detectedCategory = "Discrimination";
        confidence = "High";
        reasoning = "Your responses mention unfair differential treatment, stereotyping, or exclusion.";
      } else if (text.includes("retaliat") || text.includes("punish") || text.includes("demot")) {
        detectedCategory = "Retaliation";
        confidence = "High";
        reasoning = "Your responses indicate adverse action following a previous report or complaint.";
      }

      this.chatData.category = detectedCategory;
      this.chatData.confidence = confidence;
      this.chatData.classificationReason = reasoning;

      // PART B: WELL-BEING PARALLEL PATHWAY CHECK
      if (detectedCategory === "Well-being / Mental Health") {
        this.renderWellbeingParallelPathway(reasoning);
        return;
      }

      // STANDARD CATEGORY CLASSIFICATION CARD
      this.addAiMessage(`
        <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:16px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">🤖</span>
              <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">AI Concern Classification</h4>
            </div>
            <span style="background:var(--color-success-bg); color:var(--color-success); border:1px solid var(--color-success); padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:800;">
              Confidence: ${confidence}
            </span>
          </div>

          <p style="font-size:0.84rem; color:var(--text-main); margin-top:8px; line-height:1.45;">
            Based on what you've shared, your concern may relate to:
          </p>
          <div style="background:rgba(31, 122, 140, 0.08); border-radius:8px; padding:10px; margin-top:6px;">
            <strong style="color:var(--primary-teal); font-size:1rem;">📌 ${detectedCategory}</strong>
            <p style="font-size:0.76rem; color:var(--text-muted); margin-top:4px;">
              <em>Why: ${reasoning}</em>
            </p>
          </div>

          <p style="font-size:0.78rem; color:var(--text-muted); margin-top:10px;">
            Would you like to continue with this category or select a different one?
          </p>

          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:center; padding:10px; border-radius:6px; font-size:0.84rem; cursor:pointer;" onclick="ChatEngine.confirmCategory('${detectedCategory}')">
              🟢 Yes, continue with ${detectedCategory}
            </button>
            <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-main); border:1px solid var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="ChatEngine.promptManualCategorySelection()">
              🔵 Choose a different category
            </button>
          </div>
        </div>
      `);
      this.step = 8;
    }, 1400);
  },

  // PART B: WELL-BEING PARALLEL PATHWAY
  renderWellbeingParallelPathway(reasoning) {
    this.addAiMessage(`
      <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:16px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
        <div style="display:flex; align-items:center; gap:8px; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
          <span style="font-size:1.2rem;">🌿</span>
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">Well-Being & Mental Health Pathway</h4>
        </div>

        <p style="font-size:0.84rem; color:var(--text-main); margin-top:8px; line-height:1.45;">
          Based on what you've shared, it sounds like you may benefit from dedicated well-being support:
        </p>

        <div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">
          <button class="chat-opt-btn" style="background:var(--bg-panel-left); border:1px solid var(--border-accent); color:var(--primary-teal-dark); font-weight:700; text-align:left; padding:10px;" onclick="WellbeingModule.openMHFAConnectModal()">
            Option 1 — Talk to a Mental Health First Aider (MHFA)
          </button>
          <button class="chat-opt-btn" style="background:var(--bg-panel-left); border:1px solid var(--border-accent); color:var(--primary-teal-dark); font-weight:700; text-align:left; padding:10px;" onclick="WellbeingModule.openMHFAConnectModal()">
            Option 2 — Book a Confidential Counselling Appointment
          </button>
          <button class="chat-opt-btn" style="background:var(--bg-panel-left); border:1px solid var(--border-color); color:var(--text-main); font-weight:600; text-align:left; padding:10px;" onclick="App.openLearningModal('mental-health')">
            Option 3 — Explore Well-Being & Stress Resources
          </button>
          <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:left; padding:10px;" onclick="ChatEngine.confirmCategory('Well-being / Mental Health')">
            Option 4 — Continue with Formal Reporting Process
          </button>
        </div>
      </div>
    `);
    this.step = 8;
  },

  // STEP 5: MANUAL CATEGORY PICKER
  promptManualCategorySelection() {
    this.addAiMessage(`
      <p>No problem. Please select the category that best describes your concern:</p>
      <div class="chat-options-grid" style="margin-top:8px;">
        ${this.allCategories.map(cat => `
          <button class="chat-opt-btn" onclick="ChatEngine.confirmCategory('${cat}')">${cat}</button>
        `).join('')}
      </div>
    `);
  },

  // STEP 6: START CATEGORY-SPECIFIC 5 TARGETED QUESTIONS
  confirmCategory(selectedCategory) {
    this.chatData.category = selectedCategory;
    this.addUserMessage(`Confirmed Category: ${selectedCategory}`);

    const questionsList = this.categoryQuestionsMap[selectedCategory] || this.categoryQuestionsMap["Default"];
    this.currentCategoryQuestions = questionsList;
    this.categoryStep = 0;

    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <div style="background:rgba(31, 122, 140, 0.08); border-left:3px solid var(--primary-teal); padding:10px 12px; border-radius:6px; margin-bottom:8px;">
          <strong>Targeted Assessment Active: ${selectedCategory}</strong><br/>
          <span style="font-size:0.76rem; color:var(--text-muted);">Asking 5 precise targeted questions for ${selectedCategory}.</span>
        </div>
        <p style="font-weight:700; color:var(--primary-teal-dark);">Question 1 of 5:</p>
        <p style="margin-top:2px;">${questionsList[0]}</p>
      `);
      this.step = 10;
      this.categoryStep = 1;
    }, 1200);
  },

  // PROCESS CATEGORY-SPECIFIC QUESTIONS (Q1 TO Q5)
  processCategoryQuestionStep(userText) {
    const qList = this.currentCategoryQuestions || this.categoryQuestionsMap["Default"];
    this.chatData.categoryAnswers.push({
      qIndex: this.categoryStep,
      question: qList[this.categoryStep - 1],
      answer: userText
    });

    if (this.categoryStep < 5 && this.categoryStep < qList.length) {
      const nextQ = qList[this.categoryStep];
      this.categoryStep++;
      this.addAiMessage(`
        <p style="font-weight:700; color:var(--primary-teal-dark);">Question ${this.categoryStep} of 5:</p>
        <p style="margin-top:2px;">${nextQ}</p>
      `);
    } else {
      // Completed all 5 targeted questions -> Move to Step 7: AI Risk Assessment
      this.evaluateAIRiskAssessment();
    }
  },

  // STEP 7: AI RISK ASSESSMENT ENGINE
  evaluateAIRiskAssessment() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();

      // Calculate risk score based on recurrence, impact, evidence, authority
      let score = 40;
      const factors = [];

      if (this.chatData.recurrence.toLowerCase().includes("yes") || this.chatData.recurrence.toLowerCase().includes("repeated")) {
        score += 20;
        factors.push("Repeated incidents reported");
      }
      if (this.chatData.who.toLowerCase().includes("manager") || this.chatData.who.toLowerCase().includes("authority")) {
        score += 15;
        factors.push("Potential power imbalance / manager involvement");
      }
      if (this.chatData.impact.toLowerCase().includes("safety") || this.chatData.impact.toLowerCase().includes("health")) {
        score += 15;
        factors.push("High impact on wellbeing & safety");
      }
      if (this.chatData.evidence && !this.chatData.evidence.toLowerCase().includes("no evidence")) {
        score += 10;
        factors.push("Supporting evidence available");
      }

      let riskLevel = "Moderate";
      let badgeColor = "#D97706";
      let icon = "🟡";

      if (score >= 70) {
        riskLevel = "Critical / Urgent";
        badgeColor = "#E63946";
        icon = "🔴";
      } else if (score >= 55) {
        riskLevel = "High";
        badgeColor = "#D97706";
        icon = "🟠";
      } else if (score < 35) {
        riskLevel = "Low";
        badgeColor = "#2D6A4F";
        icon = "🟢";
      }

      this.chatData.riskLevel = riskLevel;
      this.chatData.riskScore = score;
      this.chatData.riskFactors = factors;

      this.addAiMessage(`
        <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:16px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">📊</span>
              <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">Preliminary AI Risk Assessment</h4>
            </div>
            <span style="background:${badgeColor}; color:#FFF; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800;">
              ${icon} ${riskLevel} (${score}/100)
            </span>
          </div>

          <p style="font-size:0.8rem; color:var(--text-main); margin-top:8px;">
            This assessment is based on the following key factors:
          </p>
          <ul style="margin:6px 0 0 16px; font-size:0.76rem; color:var(--text-muted); line-height:1.45;">
            ${factors.map(f => `<li>${f}</li>`).join('')}
          </ul>

          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:center; padding:10px; border-radius:6px; font-size:0.84rem; cursor:pointer;" onclick="ChatEngine.renderStructuredCaseSummary()">
              📋 Review & Generate Structured Case Summary
            </button>
          </div>
        </div>
      `);
    }, 1400);
  },

  // STEP 8: AI-GENERATED STRUCTURED CASE SUMMARY
  renderStructuredCaseSummary() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();

      const cd = this.chatData;
      const datePeriod = cd.when || "Recent / Ongoing";
      const whoInvolved = cd.who || "Manager & Team";
      const freq = cd.recurrence || "Multiple occasions";
      const impactText = cd.impact || "Emotional well-being and work performance";
      const evidenceText = cd.evidence || "Available documents & witness statements";
      const isAnonText = cd.anonymous ? "Anonymous Report" : "Named Report (Jordan Smith)";

      const aiSummaryNarrative = `The employee reports a concern regarding "${cd.category}" occurring around ${datePeriod}. Individuals involved include ${whoInvolved}. The employee indicates frequency as "${freq}", affecting ${impactText}. Supporting evidence noted: "${evidenceText}". Preference: ${isAnonText}. Preliminary Risk: ${cd.riskLevel}.`;

      this.addAiMessage(`
        <div class="case-summary-review-card" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:16px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">📝</span>
              <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">Structured AI Case Summary</h4>
            </div>
            <span style="background:var(--secondary-sage-light); color:var(--primary-teal-dark); border:1px solid var(--border-accent); padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:800;">
              Review & Edit Mode
            </span>
          </div>

          <div style="margin-top:10px; background:var(--bg-panel-left); border:1px solid var(--border-color); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:6px; font-size:0.78rem; color:var(--text-main);">
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Concern Category:</strong> ${cd.category}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Date / Period:</strong> ${datePeriod}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Individuals Involved:</strong> ${whoInvolved}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Frequency:</strong> ${freq}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Impact:</strong> ${impactText}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Evidence:</strong> ${evidenceText}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Employee Preference:</strong> ${isAnonText}</div>
            <div><strong style="color:var(--text-muted); font-size:0.72rem;">Preliminary Risk:</strong> ${cd.riskLevel}</div>

            <div style="margin-top:6px; background:var(--bg-card); padding:8px 10px; border-radius:6px; border-left:3px solid var(--primary-teal);">
              <strong style="color:var(--primary-teal); font-size:0.72rem; display:block;">AI Narrative Summary:</strong>
              <p style="margin:2px 0 0 0; font-size:0.75rem; font-style:italic; color:var(--text-main);">"${aiSummaryNarrative}"</p>
            </div>
          </div>

          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-main); border:1px solid var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="WellbeingModule.openAddDetailsModal()">
                ✏️ Edit Summary
              </button>
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.renderStructuredCaseSummary()">
                🔄 Regenerate Summary
              </button>
            </div>
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:center; padding:10px; border-radius:6px; font-size:0.84rem; cursor:pointer;" onclick="ChatEngine.submitFinalReport()">
              ✅ Approve & Submit Formal Report
            </button>
            <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-muted); border:1px dashed var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.saveDraftReport()">
              💾 Save & Continue Later
            </button>
          </div>
        </div>
      `);
      this.step = 12;
    }, 1200);
  },

  // STEP 9 & 10: SUBMIT FINAL REPORT & GENERATE CASE REFERENCE NUMBER (LS360-2026-001245)
  submitFinalReport() {
    this.addUserMessage("Approve & Submit Formal Report");
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      const year = new Date().getFullYear();
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const caseId = `LS360-${year}-${randomId}`;

      const nowStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      const newCaseRecord = {
        id: caseId,
        category: this.chatData.category || "Workplace Behaviour",
        risk: (this.chatData.riskLevel || "Moderate").toLowerCase(),
        created: nowStr,
        status: "Submitted",
        owner: "Unassigned (Ombudsperson)",
        anonymous: this.chatData.anonymous,
        summary: this.chatData.description || "Formal report submitted via AI intake.",
        impact: this.chatData.impact || "Wellbeing and performance impact",
        chatData: { ...this.chatData }
      };

      CASES_DATA.unshift(newCaseRecord);

      this.addAiMessage(`
        <div class="final-submission-ticket-card" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:18px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
          <div style="display:flex; align-items:center; gap:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
            <div style="width:34px; height:34px; border-radius:50%; background:var(--color-success-bg); border:1.5px solid var(--color-success); color:var(--color-success); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:800; flex-shrink:0;">
              ✅
            </div>
            <div>
              <h3 style="font-size:1.02rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">Your concern has been successfully submitted</h3>
              <span style="font-size:0.75rem; color:var(--color-success); font-weight:700;">Securely recorded and routed to Ombudsperson.</span>
            </div>
          </div>

          <!-- CASE REFERENCE NUMBER BOX -->
          <div style="margin-top:12px; background:rgba(31, 122, 140, 0.05); border:1px solid var(--border-color); border-radius:8px; padding:12px; text-align:center;">
            <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:2px;">
              Case Reference Number
            </span>
            <div style="font-family:'Courier New', monospace; font-size:1.6rem; font-weight:900; color:var(--primary-teal); letter-spacing:1px;">
              ${caseId}
            </div>
          </div>

          <!-- STEP 10: CASE TRACKING TIMELINE -->
          <div style="margin-top:14px; background:var(--bg-panel-left); border:1px solid var(--border-color); border-radius:10px; padding:12px;">
            <strong style="color:var(--primary-teal-dark); font-size:0.8rem; display:block; margin-bottom:8px;">📍 Case Tracking Status Lifecycle</strong>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:0.74rem;">
              <div style="display:flex; align-items:center; gap:8px; color:var(--color-success); font-weight:700;">
                <span>● Submitted</span> <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">(${nowStr})</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Received</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Under Initial Review (24h SLA)</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Assigned to Investigator</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Under Investigation</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Action / Resolution</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
                <span>○ Closed</span>
              </div>
            </div>
          </div>

          <div style="margin-top:14px; display:flex; flex-direction:column; gap:8px;">
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:center; padding:10px; border-radius:6px; font-size:0.82rem; cursor:pointer;" onclick="ChatEngine.copyTicketNumber('${caseId}')">
              📄 Copy Case Reference Number
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.downloadReportPDF('${caseId}')">
                📥 Download Report File
              </button>
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.trackTicketById('${caseId}')">
                🔍 Live Track Status
              </button>
            </div>
            <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-main); border:1px solid var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="ChatEngine.renderWelcomeMessage()">
              💬 Return to Main Menu
            </button>
          </div>
        </div>
      `);
      this.step = 13;
    }, 1200);
  },

  startFormalReportingFlow() {
    this.submitFinalReport();
  },

  startMentalHealthAssessment() {
    this.selectInitialOption('Well-being / Mental Health');
  },

  startBiasnessAssessment() {
    this.selectInitialOption('Discrimination');
  },

  saveDraftReport() {
    const draftId = "DRAFT-" + Math.floor(1000 + Math.random() * 9000);
    this.addAiMessage(`
      <div style="background:var(--secondary-sage-light); border:1px solid var(--border-accent); padding:12px; border-radius:8px;">
        <strong>💾 Draft Saved Successfully</strong><br/>
        <span style="font-size:0.78rem; color:var(--text-muted);">Your draft reference is <code>${draftId}</code>. You can return anytime to complete and submit your report.</span>
      </div>
    `);
  },

  trackTicketById(reportId) {
    this.addUserMessage(`Track status for Case Reference: ${reportId}`);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const found = CASES_DATA.find(c => c.id && c.id.toUpperCase() === reportId.toUpperCase());
      const statusLabel = found ? (found.status || "Submitted") : "Submitted";
      const createdDate = found ? found.created : new Date().toLocaleString();
      const ownerLabel = found ? (found.owner || "Wellbeing & HR Support Team") : "Wellbeing & HR Support Team";

      this.addAiMessage(`
        <div class="ticket-status-card" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:10px; padding:16px; margin-top:6px; box-shadow:var(--shadow-sm);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:1.2rem;">🔎</span>
              <strong style="color:var(--primary-teal); font-size:0.9rem;">Case Status: ${reportId}</strong>
            </div>
            <span style="background:var(--color-success-bg); color:var(--color-success); border:1px solid var(--color-success); padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:800;">
              ● ${statusLabel}
            </span>
          </div>

          <div style="margin-top:10px; font-size:0.78rem; color:var(--text-main); line-height:1.45; display:flex; flex-direction:column; gap:6px;">
            <div><strong style="color:var(--text-muted);">Assigned Investigator:</strong> ${ownerLabel}</div>
            <div><strong style="color:var(--text-muted);">Submission Date:</strong> ${createdDate}</div>
            <div><strong style="color:var(--text-muted);">Confidentiality:</strong> Confidential</div>
          </div>

          <div style="margin-top:12px; font-size:0.72rem; color:var(--text-dim); display:flex; justify-content:space-between; padding-top:6px; border-top:1px dashed var(--border-color);">
            <span>SLA: 24h Review Guarantee</span>
            <span>Ref: <code>${reportId}</code></span>
          </div>
        </div>
      `);
    }, 1000);
  },

  copyTicketNumber(reportId) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportId);
      alert(`Case Reference ${reportId} copied to clipboard!`);
    } else {
      alert(`Case Reference: ${reportId}`);
    }
  },

  downloadReportPDF(reportId) {
    const found = CASES_DATA.find(c => c.id === reportId);
    const textContent = `CONFIDENTIAL CASE REPORT\nCase Reference Number: ${reportId}\nStatus: ${found ? found.status : 'Submitted'}\nDate: ${new Date().toLocaleString()}\nConfidentiality: Confidential\n\nCategory: ${this.chatData.category}\nNarrative: ${this.chatData.description}`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Confidential_Report_${reportId}.txt`;
    a.click();
    alert(`Report ${reportId} downloaded!`);
  },

  getRandomEmpatheticStatement() {
    const idx = Math.floor(Math.random() * this.empatheticStatements.length);
    return this.empatheticStatements[idx];
  },

  addUserMessage(text) {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap user";
    wrap.innerHTML = `
      <div class="chat-bubble">${text}</div>
      <div class="chat-time">${timeStr}</div>
    `;
    container.appendChild(wrap);
    this.scrollToBottom();
  },

  addAiMessage(htmlContent) {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap ai";
    wrap.innerHTML = `
      <div class="chat-bubble">${htmlContent}</div>
      <div class="chat-time">${timeStr}</div>
    `;
    container.appendChild(wrap);
    this.scrollToBottom();
  },

  showTypingIndicator() {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const indicator = document.createElement("div");
    indicator.id = "aiTypingIndicator";
    indicator.className = "chat-bubble-wrap ai";
    indicator.innerHTML = `
      <div class="chat-bubble typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    container.appendChild(indicator);
    this.scrollToBottom();
  },

  hideTypingIndicator() {
    const indicator = document.getElementById("aiTypingIndicator");
    if (indicator) indicator.remove();
  },

  scrollToBottom() {
    const container = document.getElementById("chatMessages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
};
