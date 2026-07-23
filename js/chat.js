/* LISTEN360 AI CHATBOT ENGINE - EMPATHETIC PSYCHOLOGICAL SAFETY, BIASNESS & MENTAL HEALTH ASSISTANT */

const ChatEngine = {
  mode: "standard", // "standard", "biasness", "mental_health"
  subPath: "support", // "support" or "workplace"
  step: 0,
  isVoiceRecording: false,
  biasRiskScore: 0,
  mentalHealthRiskScore: 0,
  chatData: {
    category: "",
    description: "",
    context: "",
    experiencing: "",
    dailyImpact: "",
    triggers: "",
    workloadContributing: "",
    adequateSupport: "",
    previousSteps: "",
    desiredSupport: "",
    orgContact: "",
    isSafe: true,
    anonymous: true,
    attachments: []
  },

  empatheticStatements: [
    "Thank you for trusting me with this.",
    "I understand your concern and appreciate your courage.",
    "I'm here to listen and support you completely.",
    "I'm truly sorry you've experienced this situation.",
    "You're not alone in this—your mental health and safety are our highest priority.",
    "Your wellbeing is important, and every concern deserves to be heard.",
    "Let's work through this together step-by-step.",
    "Thank you for sharing something that may have been difficult to talk about."
  ],

  // 5 STREAMLINED HIGH-RELEVANCE MENTAL HEALTH & WELLBEING QUESTIONS
  mentalHealthQuestions: [
    "What specific workplace situation or aspect of work is currently affecting your emotional or mental well-being?",
    "How is this situation impacting your day-to-day work performance, concentration, or personal life?",
    "Are specific workplace factors (e.g. workload, unrealistic expectations, conflict, management style) contributing to the issue?",
    "What type of confidential support or guidance would be most helpful to you right now?",
    "Do you feel safe at the moment?"
  ],

  // 5 STREAMLINED HIGH-RELEVANCE BIASNESS & INCLUSION RISK QUESTIONS
  biasnessQuestions: [
    "What specific situation, decision, or behaviour made you feel treated unfairly, biased, or excluded?",
    "In what context did this occur? (e.g. Promotion, Performance Review, Work Allocation, Compensation, Meetings)",
    "Did this situation involve someone with authority over you, and were you treated differently from colleagues in similar circumstances?",
    "Did you observe language, comments, or decisions reflecting stereotypes, preferences, or intentional exclusion?",
    "Has this situation affected your career development, recognition, or ability to participate fully at work?"
  ],

  standardQuestions: [
    "Could you tell me what happened in your own words?",
    "When did this occur?",
    "Is this an ongoing concern or a recent single incident?",
    "Who was involved, or which team/department did this relate to?",
    "How has this situation affected you personally or professionally?",
    "Have you already spoken with anyone else or reported this before?",
    "Would you prefer to submit this report completely anonymously?"
  ],

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
            I am your dedicated AI Psychological Safety & Mental Wellbeing Companion. I am here to listen with empathy, complete confidentiality, and zero judgment.
          </p>
          <p style="margin-top:6px; font-size:0.78rem; color:var(--primary-teal); font-weight:600;">
            🔒 <em>All conversations are 100% encrypted, confidential, and safe.</em>
          </p>
        </div>
        <div class="chat-time">Just now</div>
      </div>

      <div class="chat-bubble-wrap ai">
        <div class="chat-bubble">
          <p>How can I support you today? Select a pathway or type/record your thoughts in your own words:</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.startMentalHealthAssessment()">🌿 Mental Health & Well-being Support</button>
            <button class="chat-opt-btn" onclick="ChatEngine.startBiasnessAssessment()">⚖️ Report Biasness, Favouritism or Exclusion</button>
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Workplace Concern')">💬 Report General Workplace Concern</button>
            <button class="chat-opt-btn" onclick="ChatEngine.selectInitialOption('Harassment & Respect')">🛑 Bullying or Anti-Harassment Issue</button>
          </div>
        </div>
      </div>
    `;
    this.scrollToBottom();
  },

  // MENTAL HEALTH & WELLBEING INTAKE STARTER
  startMentalHealthAssessment() {
    this.mode = "mental_health";
    this.step = 0;
    this.mentalHealthRiskScore = 0;
    this.chatData.category = "Mental Health & Well-being";

    this.addUserMessage("I would like to seek Mental Health & Well-being support.");

    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <div style="background:rgba(168, 213, 186, 0.25); border-left:3px solid var(--primary-teal); padding:10px 12px; border-radius:6px; margin-bottom:8px;">
          <strong>🌿 Mental Health & Well-being Support Mode Active</strong><br/>
          <span style="font-size:0.76rem; color:var(--text-muted);">We will evaluate your workplace wellbeing needs and connect you directly with support resources or confidential reporting.</span>
        </div>
        <p>${this.getRandomEmpatheticStatement()}</p>
        <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 1 of 5:</p>
        <p style="margin-top:2px;">${this.mentalHealthQuestions[0]}</p>
        <div class="chat-options-grid">
          <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Workload & Stress')">Workload & Stress</button>
          <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Burnout & Exhaustion')">Burnout & Exhaustion</button>
          <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Workplace Conflict')">Workplace Conflict</button>
          <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Isolation & Distance')">Isolation & Distance</button>
          <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Uncertainty & Change')">Uncertainty & Change</button>
        </div>
      `);
      this.step = 1;
    }, 1200);
  },

  startBiasnessAssessment() {
    this.mode = "biasness";
    this.step = 0;
    this.biasRiskScore = 0;
    this.chatData.category = "Biasness & Favouritism";

    this.addUserMessage("I would like to report an issue related to biasness, favouritism, or unfair treatment.");

    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <div style="background:rgba(31, 122, 140, 0.08); border-left:3px solid var(--primary-teal); padding:10px 12px; border-radius:6px; margin-bottom:8px;">
          <strong>⚖️ Biasness & Inclusion Risk Assessment Mode Active</strong><br/>
          <span style="font-size:0.76rem; color:var(--text-muted);">I will ask 5 structured questions to analyze the risk score for biasness and inclusion.</span>
        </div>
        <p>${this.getRandomEmpatheticStatement()}</p>
        <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 1 of 5:</p>
        <p style="margin-top:2px;">${this.biasnessQuestions[0]}</p>
      `);
      this.step = 1;
    }, 1200);
  },

  selectInitialOption(optionText) {
    this.mode = "standard";
    this.addUserMessage(`I would like to discuss: ${optionText}`);
    this.chatData.category = optionText;

    const statement = this.getRandomEmpatheticStatement();
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <p>${statement}</p>
        <p style="margin-top:6px;">${this.standardQuestions[0]}</p>
      `);
      this.step = 1;
    }, 1200);
  },

  handleUserInput(text) {
    if (!text.trim()) return;

    const lower = text.toLowerCase();
    if (lower.includes("formal") || lower.includes("confidential case") || lower.includes("confidential reporting")) {
      this.startFormalReportingFlow();
      return;
    }
    if (this.mode === "standard" && (lower.includes("mental") || lower.includes("stress") || lower.includes("burnout") || lower.includes("anxiety") || lower.includes("depress"))) {
      this.startMentalHealthAssessment();
      return;
    }
    if (this.mode === "standard" && (lower.includes("bias") || lower.includes("favourit") || lower.includes("favorit") || lower.includes("unfair"))) {
      this.startBiasnessAssessment();
      return;
    }

    this.addUserMessage(text);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      if (this.mode === "mental_health") {
        this.processMentalHealthStep(text);
      } else if (this.mode === "biasness") {
        this.processBiasnessStep(text);
      } else {
        this.processStandardStep(text);
      }
    }, 1300);
  },

  // MENTAL HEALTH & WELL-BEING STEP PROCESSOR (STREAMLINED 5-QUESTION FLOW)
  processMentalHealthStep(userText) {
    const statement = this.getRandomEmpatheticStatement();

    switch (this.step) {
      case 1:
        this.chatData.description = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 2 of 5:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[1]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Concentration & Focus Impact')">Concentration & Focus Impact</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Productivity & Work Quality')">Productivity & Work Quality</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Motivation & Energy Drain')">Motivation & Energy Drain</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Sleep & Emotional Disruption')">Sleep & Emotional Disruption</button>
          </div>
        `);
        this.step = 2;
        break;

      case 2:
        this.chatData.experiencing = userText;
        this.chatData.dailyImpact = userText;
        this.mentalHealthRiskScore += 10;
        this.addAiMessage(`
          <p>Thank you for describing what you're experiencing. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 5:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[2]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, work expectations contribute significantly')">Yes, significantly</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially contributing factors')">Partially</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No, personal or non-work factors')">No</button>
          </div>
        `);
        this.step = 3;
        break;

      case 3:
        this.chatData.workloadContributing = userText;
        if (userText.toLowerCase().includes("yes")) this.mentalHealthRiskScore += 15;
        this.addAiMessage(`
          <p>${statement} Let's ensure you get the right support pathway.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 5:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[3]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Mental Health First Aider (MHFA)')">Mental Health First Aider (MHFA)</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Professional Counselling (EAP)')">Professional Counselling (EAP)</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Guidance from HR / Ombudsperson')">Guidance from HR / Ombudsperson</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Workplace Adjustments & Self-Help')">Workplace Adjustments</button>
          </div>
        `);
        this.step = 4;
        break;

      case 4:
        this.chatData.desiredSupport = userText;
        // FINAL QUESTION (5 OF 5): IMMEDIATE SAFETY & STATUS CHECK
        this.addAiMessage(`
          <p style="font-weight:700; color:var(--primary-teal-dark);">Final Question (5 of 5):</p>
          <p style="margin-top:2px; font-size:0.95rem; font-weight:700; color:var(--color-critical);">Do you feel safe at the moment?</p>
          <div class="chat-options-grid" style="margin-top:8px;">
            <button class="chat-opt-btn" style="border-color:var(--color-success); font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Yes')">💚 Yes, I feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-critical); background:#FEE2E2; color:#991B1B; font-weight:800;" onclick="ChatEngine.handleSafetyResponse('No')">🚨 No, I do not feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-warning); background:#FEF3C7; color:#92400E; font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Not sure')">⚠️ I'm not sure</button>
            <button class="chat-opt-btn" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
          </div>
        `);
        this.step = 5;
        break;

      case 5:
        this.handleSafetyResponse(userText);
        break;

      default:
        if (this.step >= 5 || userText.toLowerCase().includes("formal") || userText.toLowerCase().includes("report")) {
          this.startFormalReportingFlow();
        }
        break;
    }
  },

  // 🚨 IMMEDIATE SAFETY INTERVENTION PATHWAY
  handleSafetyResponse(responseVal) {
    if (responseVal.toLowerCase().includes("formal") || responseVal.toLowerCase().includes("confidential") || responseVal.toLowerCase().includes("report")) {
      this.startFormalReportingFlow();
      return;
    }
    this.addUserMessage(`Safety status: ${responseVal}`);

    if (responseVal === "No" || responseVal === "Not sure") {
      this.chatData.isSafe = false;
      this.showTypingIndicator();

      setTimeout(() => {
        this.hideTypingIndicator();
        this.addAiMessage(`
          <div style="background:#FEE2E2; border:2px solid #E63946; border-radius:12px; padding:16px; margin-top:6px;">
            <h3 style="color:#991B1B; font-size:1.05rem; font-weight:800; display:flex; align-items:center; gap:6px;">
              🚨 Immediate Safety & Support Intervention
            </h3>
            <p style="margin-top:8px; font-size:0.88rem; color:#7F1D1D; line-height:1.5;">
              "Thank you for letting me know. Your safety is important. Would you like to connect with a trained mental health professional or an appropriate support service now?"
            </p>

            <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#E63946; color:#991B1B; font-weight:800; padding:8px 14px; text-align:left;" onclick="WellbeingModule.openMHFAConnectModal()">🌿 Talk to an MHFA (Mental Health First Aider) Right Now</button>
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#0284C7; color:#0369A1; font-weight:700; padding:8px 14px; text-align:left;" onclick="WellbeingModule.openMHFAConnectModal()">📅 Book a Urgent Confidential Counselling Appointment</button>
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:#D97706; color:#92400E; font-weight:700; padding:8px 14px; text-align:left;" onclick="alert('Connecting to 24/7 Employee Assistance Line: 1-800-WELLBEING')">📞 Connect with 24/7 Crisis Helpline</button>
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:var(--primary-teal); color:var(--primary-teal); font-weight:700; padding:8px 14px; text-align:left;" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:var(--border-color); color:var(--text-main); font-weight:600; padding:8px 14px; text-align:left;" onclick="App.openLearningModal('mental-health')">📚 Explore Self-Help Wellbeing Resources</button>
            </div>
          </div>
        `);
      }, 1200);

    } else {
      // SAFE PATHWAY
      this.chatData.isSafe = true;
      this.showTypingIndicator();

      setTimeout(() => {
        this.hideTypingIndicator();
        this.addAiMessage(`
          <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:10px; padding:14px; margin-top:6px;">
            <h4 style="color:var(--primary-teal); font-size:0.95rem;">🌿 Well-being Assessment & Support Plan</h4>
            <p style="margin-top:6px; font-size:0.8rem; line-height:1.45;">
              Thank you for completing the mental health evaluation. Based on your responses, we have created two personalized options for you:
            </p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
              <div style="background:rgba(168, 213, 186, 0.2); border:1px solid var(--border-color); padding:10px; border-radius:8px;">
                <strong style="color:var(--primary-teal-dark); font-size:0.8rem;">Path A: Support & Care</strong>
                <p style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">Connect with MHFA, book counselling, or access self-help tools.</p>
                <button class="policy-btn" style="margin-top:6px;" onclick="WellbeingModule.openMHFAConnectModal()">Access Support</button>
              </div>
              <div style="background:rgba(31, 122, 140, 0.06); border:1px solid var(--border-accent); padding:10px; border-radius:8px;">
                <strong style="color:var(--primary-teal); font-size:0.8rem;">Path B: Formal Reporting</strong>
                <p style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">Submit confidential report to Ombudsperson regarding workplace factors.</p>
                <button class="policy-btn" style="margin-top:6px;" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
              </div>
            </div>
          </div>
        `);
      }, 1300);
    }
  },

  // BIASNESS & INCLUSION STEP PROCESSOR (STREAMLINED 5-QUESTION FLOW)
  processBiasnessStep(userText) {
    const statement = this.getRandomEmpatheticStatement();

    switch (this.step) {
      case 1:
        this.chatData.description = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 2 of 5:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[1]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Promotion & Career Advancement')">Promotion & Career Advancement</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Performance Review & Evaluation')">Performance Review</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Work Allocation & Project Assignments')">Work Allocation</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Meetings & Communication Inclusion')">Meetings & Inclusion</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Compensation & Rewards')">Compensation & Rewards</button>
          </div>
        `);
        this.step = 2;
        break;

      case 2:
        this.chatData.context = userText;
        this.biasRiskScore += 15;
        this.addAiMessage(`
          <p>Understood. Context is crucial for evaluation. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 5:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[2]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, authority figure involved & clear differential treatment')">Yes - Authority & Differential Treatment</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, differential treatment observed among peers')">Yes - Differential Treatment Observed</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially or unsure')">Partially / Unsure</button>
          </div>
        `);
        this.step = 3;
        break;

      case 3:
        this.chatData.differentialTreatment = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 20;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 5:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[3]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, language or comments reflecting stereotypes noted')">Yes - Stereotypes or Language Noted</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, excluded from key meetings or discussions')">Yes - Excluded from Meetings/Decisions</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No explicit comments noted')">No Explicit Comments</button>
          </div>
        `);
        this.step = 4;
        break;

      case 4:
        this.chatData.stereotypesObserved = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 20;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Final Question (5 of 5):</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[4]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('High Impact on career advancement & recognition')">High Impact on Career & Advancement</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Moderate Impact on morale & daily participation')">Moderate Impact on Morale</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Low Impact - Recent single situation')">Low Impact - Recent Incident</button>
          </div>
        `);
        this.step = 5;
        break;

      case 5:
        this.chatData.futureCareerImpact = userText;
        if (userText.toLowerCase().includes("high") || userText.toLowerCase().includes("yes")) this.biasRiskScore += 25;

        let riskLevel = "Low Risk";
        let riskBadgeColor = "#2D6A4F";
        if (this.biasRiskScore >= 50) {
          riskLevel = "Critical Risk";
          riskBadgeColor = "#E63946";
        } else if (this.biasRiskScore >= 35) {
          riskLevel = "High Risk";
          riskBadgeColor = "#D97706";
        } else if (this.biasRiskScore >= 20) {
          riskLevel = "Moderate Risk";
          riskBadgeColor = "#0284C7";
        }

        this.addAiMessage(`
          <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:10px; padding:14px; margin-top:6px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <h4 style="color:var(--primary-teal); font-size:0.95rem;">📊 Biasness & Inclusion Risk Evaluation</h4>
              <span style="background:${riskBadgeColor}; color:white; padding:3px 10px; border-radius:12px; font-size:0.72rem; font-weight:800;">${riskLevel} (${this.biasRiskScore}/100)</span>
            </div>
            <p style="margin-top:8px; font-size:0.8rem;">
              Your evaluation indicates a <strong>${riskLevel}</strong> of biasness or exclusion. Select an action below to complete your submission:
            </p>
            <div class="chat-options-grid" style="margin-top:10px;">
              <button class="chat-opt-btn" style="border-color:var(--primary-teal); font-weight:700; background:rgba(31, 122, 140, 0.06);" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
              <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(true)">🔒 Submit 100% Anonymously</button>
            </div>
          </div>
        `);
        this.step = 6;
        break;

      default:
        if (this.step >= 5 || userText.toLowerCase().includes("formal") || userText.toLowerCase().includes("report")) {
          this.startFormalReportingFlow();
        }
        break;
    }
  },

  processStandardStep(userText) {
    const statement = this.getRandomEmpatheticStatement();

    switch (this.step) {
      case 1:
        this.chatData.description = userText;
        this.addAiMessage(`
          <p>Thank you for explaining. ${statement}</p>
          <p style="margin-top:6px;">${this.standardQuestions[1]}</p>
        `);
        this.step = 2;
        break;

      case 2:
        this.chatData.dateOccurred = userText;
        this.addAiMessage(`
          <p>Thank you. I've noted the timeline.</p>
          <p style="margin-top:6px;">${this.standardQuestions[2]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, ongoing concern')">Yes, ongoing concern</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Recent single incident')">Recent single incident</button>
          </div>
        `);
        this.step = 3;
        break;

      case 3:
        this.chatData.ongoing = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px;">${this.standardQuestions[3]}</p>
        `);
        this.step = 4;
        break;

      case 4:
        this.chatData.peopleInvolved = userText;
        this.addAiMessage(`
          <p>Understood. ${statement}</p>
          <p style="margin-top:6px;">${this.standardQuestions[4]}</p>
        `);
        this.step = 5;
        break;

      case 5:
        this.chatData.impact = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px;">${this.standardQuestions[5]}</p>
        `);
        this.step = 6;
        break;

      case 6:
        this.chatData.spokenBefore = userText;
        this.addAiMessage(`
          <p>Understood.</p>
          <p style="margin-top:6px;">${this.standardQuestions[6]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" style="border-color:var(--primary-teal); font-weight:700; background:rgba(31, 122, 140, 0.06);" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
            <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(true)">🔒 Submit 100% Anonymously</button>
          </div>
        `);
        this.step = 7;
        break;

      default:
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px;">Is there anything else you'd like to add before submitting?</p>
        `);
        break;
    }
  },

  handleOptionSelect(optText) {
    this.handleUserInput(optText);
  },

  generateAICaseSummary() {
    const cd = this.chatData;
    
    // Primary Concern
    const primaryConcern = cd.description || "Workplace stress and emotional wellbeing factors related to workload and workplace environment.";
    
    // Emotional State
    const emotionalState = cd.experiencing || "Feeling overwhelmed, anxious, emotionally strained, and seeking support.";
    
    // Incident Summary
    const incidentSummary = cd.triggers || cd.description || "User described ongoing workplace situations and environmental pressures affecting day-to-day work experience over recent months.";
    
    // Impact
    const impact = cd.dailyImpact || "Difficulty concentrating, sleep disruption, reduced motivation, increased anxiety.";
    
    // Support Requested
    const supportRequested = cd.desiredSupport || "The user would like confidential support and wishes to formally report the issue.";
    
    // Severity assessment
    let severity = "Medium";
    if (cd.isSafe === false || this.mentalHealthRiskScore >= 40) {
      severity = "High";
    } else if (this.mentalHealthRiskScore < 20) {
      severity = "Low";
    }

    // AI Overall Summary Text
    const overallSummary = `Based on the conversation, the user appears to be experiencing persistent workplace-related stress affecting emotional wellbeing and work performance. The report should be reviewed by the appropriate wellbeing or HR team for confidential follow-up.`;

    return {
      primaryConcern,
      emotionalState,
      incidentSummary,
      impact,
      supportRequested,
      severity,
      overallSummary
    };
  },

  startFormalReportingFlow() {
    this.addUserMessage("📋 Continue with Formal Confidential Case Reporting");
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      
      // Generate Report ID (MHW-2026-483927 or CASE-582941)
      const year = new Date().getFullYear();
      const prefixes = ["MHW", "CASE"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const reportNum = prefix === "MHW" 
        ? `MHW-${year}-${Math.floor(100000 + Math.random() * 900000)}` 
        : `CASE-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate AI Summary
      const aiSummary = this.generateAICaseSummary();
      const nowStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      // Save in system database
      const caseRecord = {
        id: reportNum,
        category: "Mental Health & Well-Being",
        risk: aiSummary.severity.toLowerCase(),
        created: nowStr,
        status: "Submitted",
        owner: "Wellbeing & HR Support Team",
        anonymous: true,
        summary: aiSummary.primaryConcern,
        impact: aiSummary.impact,
        aiSummary: aiSummary,
        chatData: { ...this.chatData }
      };

      CASES_DATA.unshift(caseRecord);

      let severityBadgeColor = "#D97706";
      if (aiSummary.severity === "High") severityBadgeColor = "#E63946";
      if (aiSummary.severity === "Low") severityBadgeColor = "#2D6A4F";

      this.addAiMessage(`
        <div class="confirmation-card-ticket" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:18px; margin-top:6px; box-shadow:var(--shadow-md); border-left:4px solid var(--primary-teal);">
          
          <!-- HEADER & CHECKMARK -->
          <div style="display:flex; align-items:center; gap:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
            <div style="width:32px; height:32px; border-radius:50%; background:var(--color-success-bg); border:1.5px solid var(--color-success); color:var(--color-success); display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:800; flex-shrink:0;">
              ✅
            </div>
            <div>
              <h3 style="font-size:1.02rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">📋 Confidential Case Report Submitted</h3>
              <span style="font-size:0.75rem; color:var(--color-success); font-weight:700;">Your confidential report has been successfully created.</span>
            </div>
          </div>

          <!-- REPORT NUMBER BOX -->
          <div style="margin-top:12px; background:rgba(31, 122, 140, 0.05); border:1px solid var(--border-color); border-radius:8px; padding:12px; text-align:center;">
            <span style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:2px;">
              Report Number
            </span>
            <div style="font-family:'Courier New', monospace; font-size:1.55rem; font-weight:900; color:var(--primary-teal); letter-spacing:1px;">
              ${reportNum}
            </div>
          </div>

          <!-- STRUCTURED AI CASE SUMMARY -->
          <div style="margin-top:14px; background:var(--bg-panel-left); border:1px solid var(--border-color); border-radius:10px; padding:14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:6px;">
              <h4 style="font-size:0.88rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">✨ AI Case Summary</h4>
              <span style="background:${severityBadgeColor}; color:#FFF; padding:2px 8px; border-radius:10px; font-size:0.68rem; font-weight:800;">
                Severity: ${aiSummary.severity}
              </span>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; font-size:0.78rem; line-height:1.4; color:var(--text-main);">
              <div>
                <strong style="color:var(--text-muted); display:block; font-size:0.72rem;">Primary Concern:</strong>
                <span>${aiSummary.primaryConcern}</span>
              </div>
              <div>
                <strong style="color:var(--text-muted); display:block; font-size:0.72rem;">Emotional State:</strong>
                <span>${aiSummary.emotionalState}</span>
              </div>
              <div>
                <strong style="color:var(--text-muted); display:block; font-size:0.72rem;">Incident Summary:</strong>
                <span>${aiSummary.incidentSummary}</span>
              </div>
              <div>
                <strong style="color:var(--text-muted); display:block; font-size:0.72rem;">Impact:</strong>
                <span>${aiSummary.impact}</span>
              </div>
              <div>
                <strong style="color:var(--text-muted); display:block; font-size:0.72rem;">Support Requested:</strong>
                <span>${aiSummary.supportRequested}</span>
              </div>
              <div style="margin-top:4px; background:var(--bg-card); border-left:3px solid var(--primary-teal); padding:8px 10px; border-radius:4px;">
                <strong style="color:var(--primary-teal); display:block; font-size:0.72rem;">AI Generated Summary:</strong>
                <p style="margin:2px 0 0 0; font-size:0.76rem; color:var(--text-main); font-style:italic;">${aiSummary.overallSummary}</p>
              </div>
            </div>
          </div>

          <!-- METADATA BAR -->
          <div style="margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.74rem;">
            <div style="background:var(--bg-panel-left); padding:6px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <span style="color:var(--text-muted);">Status:</span> <strong style="color:var(--color-success);">Submitted</strong>
            </div>
            <div style="background:var(--bg-panel-left); padding:6px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <span style="color:var(--text-muted);">Confidentiality:</span> <strong>Confidential</strong>
            </div>
          </div>

          <p style="font-size:0.76rem; color:var(--text-muted); margin-top:12px; line-height:1.4;">
            Please save your Report Number. You can use it to check the status of your report later.
          </p>

          <!-- CARD ACTIONS BUTTONS -->
          <div style="margin-top:14px; display:flex; flex-direction:column; gap:8px;">
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:800; border:none; text-align:center; padding:9px 12px; border-radius:6px; font-size:0.82rem; cursor:pointer;" onclick="ChatEngine.copyTicketNumber('${reportNum}')">
              📄 Copy Report Number
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.downloadReportPDF('${reportNum}')">
                📥 Download Report (PDF)
              </button>
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.78rem; cursor:pointer;" onclick="ChatEngine.trackTicketById('${reportNum}')">
                🔍 Track Report
              </button>
            </div>
            <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-main); border:1px solid var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="ChatEngine.renderWelcomeMessage()">
              💬 Return to Chat
            </button>
          </div>

        </div>
      `);
      this.step = 99;
    }, 1000);
  },

  openEditSummaryModal() {
    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    const currentText = this.chatData.description || "Based on our conversation, this is what I understand about your concern…";

    content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.8rem;">✏️</span>
        <h3 class="modal-title">Review & Edit Summary</h3>
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
        You can edit the AI-generated summary below before submitting your formal confidential report:
      </p>
      <textarea id="editSummaryInput" style="width:100%; height:140px; margin-top:10px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-main); color:var(--text-main); font-family:inherit; font-size:0.85rem; outline:none;">${currentText}</textarea>
      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
        <button class="policy-btn" style="background:var(--bg-card); color:var(--text-main);" onclick="WellbeingModule.closeModal()">Cancel</button>
        <button class="learning-btn" onclick="ChatEngine.saveSummaryEdit()">Save Changes</button>
      </div>
    `;
    modal.classList.add("active");
  },

  saveSummaryEdit() {
    const input = document.getElementById("editSummaryInput");
    if (input) {
      this.chatData.description = input.value.trim();
      const box = document.getElementById("aiSummaryBoxText");
      if (box) box.innerText = this.chatData.description;
    }
    WellbeingModule.closeModal();
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

  finalizeReport(isAnonymous) {
    this.chatData.anonymous = isAnonymous;
    this.addUserMessage(isAnonymous ? "I would prefer to submit this report completely anonymously." : "You may include my identity.");

    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const caseId = "LIS-" + Math.floor(100000 + Math.random() * 900000);

      CASES_DATA.unshift({
        id: caseId,
        category: this.chatData.category || "Mental Health & Well-being",
        risk: this.mentalHealthRiskScore >= 30 ? "high" : "moderate",
        created: "Just Now",
        status: "submitted",
        owner: "Unassigned (Ombudsperson)",
        anonymous: isAnonymous,
        summary: this.chatData.description || "Wellbeing and workplace factors report.",
        impact: this.chatData.dailyImpact || "High wellbeing impact"
      });

      this.addAiMessage(`
        <div style="background:var(--secondary-sage-light); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal-dark); margin-bottom:6px;">✅ Confidential Case Report Submitted</h4>
          <p><strong>Tracking Case ID:</strong> <span style="font-family:monospace; background:#fff; padding:2px 6px; border-radius:4px; font-weight:700;">${caseId}</span></p>
          <p style="margin-top:6px; font-size:0.8rem;">
            Thank you for sharing something that may have been difficult to talk about. Your report has been routed securely to an assigned Independent Ombudsperson under strict 24h SLA.
          </p>
          <p style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">
            🔒 Identity Status: <strong>${isAnonymous ? '100% Anonymous' : 'Named Report (Jordan Smith)'}</strong>
          </p>
        </div>
      `);
      this.step = 99;
    }, 1600);
  },

  toggleVoiceRecording() {
    const btn = document.getElementById("voiceRecordBtn");
    const statusBox = document.getElementById("voiceStatusBox");

    if (!this.isVoiceRecording) {
      this.isVoiceRecording = true;
      if (btn) btn.classList.add("recording");
      if (statusBox) {
        statusBox.style.display = "flex";
        statusBox.innerHTML = `🔴 Recording audio... Click to finish speaking.`;
      }
    } else {
      this.isVoiceRecording = false;
      if (btn) btn.classList.remove("recording");
      if (statusBox) statusBox.style.display = "none";

      this.handleUserInput("🎙️ [Voice Audio Transcript]: I've been feeling overwhelmed by heavy workload deadlines and finding it hard to sleep.");
    }
  },

  triggerFileUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.png,.jpg";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.chatData.attachments.push(file.name);
        this.addUserMessage(`📎 Attached file: ${file.name} (${Math.round(file.size/1024)} KB)`);

        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addAiMessage(`
            <p>Thank you for attaching <strong>${file.name}</strong>. Encrypted and saved securely to your confidential report file.</p>
          `);
        }, 1000);
      }
    };
    input.click();
  },

  promptCaseTracking() {
    this.addUserMessage("I would like to track the status of my report.");
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAiMessage(`
        <p>Certainly. Please enter your Report Number (e.g. <code>MHW-2026-483927</code> or <code>CASE-582941</code>) to check live status updates and AI summary details.</p>
      `);
    }, 1000);
  },

  trackTicketById(reportId) {
    this.addUserMessage(`Track status for Report Number: ${reportId}`);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const found = CASES_DATA.find(c => c.id && c.id.toUpperCase() === reportId.toUpperCase());
      const statusLabel = found ? (found.status || "Submitted") : "Submitted";
      const createdDate = found ? found.created : new Date().toLocaleString();
      const ownerLabel = found ? (found.owner || "Wellbeing & HR Support Team") : "Wellbeing & HR Support Team";
      
      const summaryObj = found && found.aiSummary ? found.aiSummary : null;

      this.addAiMessage(`
        <div class="ticket-status-card" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:10px; padding:16px; margin-top:6px; box-shadow:var(--shadow-sm);">
          <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:1.2rem;">🔎</span>
              <strong style="color:var(--primary-teal); font-size:0.9rem;">Report Status: ${reportId}</strong>
            </div>
            <span style="background:var(--color-success-bg); color:var(--color-success); border:1px solid var(--color-success); padding:2px 8px; border-radius:10px; font-size:0.7rem; font-weight:800;">
              ● ${statusLabel}
            </span>
          </div>

          <div style="margin-top:10px; font-size:0.78rem; color:var(--text-main); line-height:1.45; display:flex; flex-direction:column; gap:6px;">
            <div><strong style="color:var(--text-muted);">Assigned Team:</strong> ${ownerLabel}</div>
            <div><strong style="color:var(--text-muted);">Submission Date:</strong> ${createdDate}</div>
            <div><strong style="color:var(--text-muted);">Confidentiality:</strong> Confidential</div>
            
            ${summaryObj ? `
            <div style="margin-top:6px; background:var(--bg-panel-left); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
              <strong style="color:var(--primary-teal); font-size:0.75rem; display:block; margin-bottom:4px;">✨ AI Case Summary:</strong>
              <div style="font-size:0.74rem; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
                <div><strong>Primary Concern:</strong> ${summaryObj.primaryConcern}</div>
                <div><strong>Emotional State:</strong> ${summaryObj.emotionalState}</div>
                <div><strong>Impact:</strong> ${summaryObj.impact}</div>
                <div><strong>Support Requested:</strong> ${summaryObj.supportRequested}</div>
                <div style="margin-top:4px; font-style:italic; color:var(--text-main);">"${summaryObj.overallSummary}"</div>
              </div>
            </div>
            ` : `
            <div style="margin-top:4px; background:var(--bg-panel-left); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <strong style="color:var(--primary-teal); font-size:0.72rem; display:block;">AI Case Summary:</strong>
              <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--text-muted); font-style:italic;">"Mental Health & Wellbeing formal confidential report submitted for review."</p>
            </div>
            `}
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
      alert(`Report Number ${reportId} copied to clipboard!`);
    } else {
      alert(`Report Number: ${reportId}`);
    }
  },

  downloadReportPDF(reportId) {
    const found = CASES_DATA.find(c => c.id === reportId);
    const textContent = found && found.aiSummary 
      ? `CONFIDENTIAL CASE REPORT\nReport Number: ${reportId}\nStatus: ${found.status}\nDate: ${found.created}\nConfidentiality: Confidential\n\n=== AI CASE SUMMARY ===\nPrimary Concern: ${found.aiSummary.primaryConcern}\nEmotional State: ${found.aiSummary.emotionalState}\nIncident Summary: ${found.aiSummary.incidentSummary}\nImpact: ${found.aiSummary.impact}\nSupport Requested: ${found.aiSummary.supportRequested}\nSeverity: ${found.aiSummary.severity}\n\nAI Summary:\n${found.aiSummary.overallSummary}`
      : `CONFIDENTIAL CASE REPORT\nReport Number: ${reportId}\nStatus: Submitted\nConfidentiality: Confidential`;

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
