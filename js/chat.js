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

  // 10 MENTAL HEALTH & WELL-BEING RISK QUESTIONS
  mentalHealthQuestions: [
    "What aspect of your work or workplace experience is currently affecting your mental or emotional well-being? (For example: workload, stress, burnout, workplace conflict, pressure, uncertainty, change, or isolation)",
    "How would you describe what you are currently experiencing?",
    "How is this affecting your day-to-day work experience? (For example: concentration, productivity, attendance, motivation, communication, or managing regular responsibilities)",
    "Are there specific workplace situations, activities, or interactions that tend to make the situation worse?",
    "Do you feel that your current workload, working hours, or work expectations are contributing to the concern?",
    "Do you feel you have adequate support from your manager, team, or workplace to manage the situation?",
    "Have you previously tried any steps or used any support to help manage what you are experiencing?",
    "What type of support would be most helpful to you right now?",
    "Would you like someone from the organisation to contact you to discuss available support options?",
    "Do you feel safe at the moment?"
  ],

  // 10 BIASNESS & INCLUSION RISK QUESTIONS
  biasnessQuestions: [
    "What specific action, decision, or behaviour made you feel that you were treated unfairly or excluded?",
    "In what context did this occur? (For example: recruitment, promotion, performance review, compensation, work allocation, meetings, career opportunities, recognition, or day-to-day interactions)",
    "Were you treated differently from one or more colleagues in a similar situation? If yes, please describe the difference in treatment.",
    "Did you observe others with similar qualifications, experience, or circumstances receiving different treatment or opportunities?",
    "Did the situation involve a decision made by someone with authority over you? If yes, what decision was made and how did it affect you?",
    "Did you feel that your views, ideas, or contributions were overlooked, dismissed, or not given the same consideration as others?",
    "Were you excluded from any meetings, discussions, networks, projects, or opportunities that you would reasonably have expected to participate in?",
    "Did you notice any comments, language, or behaviour that you believe reflected stereotypes, assumptions, or preferences about you or another person?",
    "Did you raise the issue or seek clarification from the person involved or another colleague? If yes, what response did you receive?",
    "Has this situation affected your access to future opportunities, career development, recognition, or ability to participate fully at work?"
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
        <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 1 of 10:</p>
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
          <span style="font-size:0.76rem; color:var(--text-muted);">I will ask 10 structured questions to analyze the risk score for biasness and inclusion.</span>
        </div>
        <p>${this.getRandomEmpatheticStatement()}</p>
        <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 1 of 10:</p>
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

  // MENTAL HEALTH & WELL-BEING STEP PROCESSOR
  processMentalHealthStep(userText) {
    const statement = this.getRandomEmpatheticStatement();

    switch (this.step) {
      case 1:
        this.chatData.description = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 2 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[1]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Stress or feeling overwhelmed')">Stress or feeling overwhelmed</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Anxiety or worry')">Anxiety or worry</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Low mood')">Low mood</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Burnout or exhaustion')">Burnout or exhaustion</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Difficulty concentrating')">Difficulty concentrating</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Feeling isolated or unsupported')">Feeling isolated or unsupported</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Loss of motivation')">Loss of motivation</button>
          </div>
        `);
        this.step = 2;
        break;

      case 2:
        this.chatData.experiencing = userText;
        this.mentalHealthRiskScore += 10;
        this.addAiMessage(`
          <p>Thank you for describing what you're experiencing. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[2]}</p>
        `);
        this.step = 3;
        break;

      case 3:
        this.chatData.dailyImpact = userText;
        this.addAiMessage(`
          <p>Understood. Impact on daily work is important to address early. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[3]}</p>
        `);
        this.step = 4;
        break;

      case 4:
        this.chatData.triggers = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 5 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[4]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, work expectations contribute significantly')">Yes, significantly</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially contributing')">Partially</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No, other factors')">No</button>
          </div>
        `);
        this.step = 5;
        break;

      case 5:
        this.chatData.workloadContributing = userText;
        if (userText.toLowerCase().includes("yes")) this.mentalHealthRiskScore += 15;
        this.addAiMessage(`
          <p>Thank you for noting that.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 6 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[5]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, adequate support')">Yes</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially supported')">Partially</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No adequate support')">No</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Prefer not to say')">Prefer not to say</button>
          </div>
        `);
        this.step = 6;
        break;

      case 6:
        this.chatData.adequateSupport = userText;
        if (userText.toLowerCase().includes("no")) this.mentalHealthRiskScore += 15;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 7 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[6]}</p>
        `);
        this.step = 7;
        break;

      case 7:
        this.chatData.previousSteps = userText;
        this.addAiMessage(`
          <p>Thank you. Let's make sure we find the right support pathway for you.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 8 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[7]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Someone to listen')">Someone to listen</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Mental Health First Aider')">Mental Health First Aider (MHFA)</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Professional counselling')">Professional counselling</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Guidance from HR')">Guidance from HR / ER</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Workplace adjustments')">Workplace adjustments</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Self-help resources')">Information & Self-help</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Not sure yet')">I'm not sure yet</button>
          </div>
        `);
        this.step = 8;
        break;

      case 8:
        this.chatData.desiredSupport = userText;
        this.addAiMessage(`
          <p>Noted. We will tailor your support options accordingly.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 9 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[8]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, contact me')">Yes</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No, self-service')">No</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('I am not sure')">I'm not sure</button>
          </div>
        `);
        this.step = 9;
        break;

      case 9:
        this.chatData.orgContact = userText;
        // QUESTION 10: IMMEDIATE SAFETY CHECK
        this.addAiMessage(`
          <p style="font-weight:700; color:var(--primary-teal-dark);">Final Question (10 of 10):</p>
          <p style="margin-top:2px; font-size:0.95rem; font-weight:700; color:var(--color-critical);">Do you feel safe at the moment?</p>
          <div class="chat-options-grid" style="margin-top:8px;">
            <button class="chat-opt-btn" style="border-color:var(--color-success); font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Yes')">💚 Yes, I feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-critical); background:#FEE2E2; color:#991B1B; font-weight:800;" onclick="ChatEngine.handleSafetyResponse('No')">🚨 No, I do not feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-warning); background:#FEF3C7; color:#92400E; font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Not sure')">⚠️ I'm not sure</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleSafetyResponse('Prefer not to say')">Prefer not to say</button>
          </div>
        `);
        this.step = 10;
        break;

      case 10:
        this.handleSafetyResponse(userText);
        break;

      default:
        if (this.step >= 10 || userText.toLowerCase().includes("formal") || userText.toLowerCase().includes("report")) {
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
                <button class="policy-btn" style="margin-top:6px;" onclick="ChatEngine.startFormalReportingFlow()">Submit Confidential Case</button>
              </div>
            </div>
          </div>
        `);
      }, 1300);
    }
  },

  processBiasnessStep(userText) {
    const statement = this.getRandomEmpatheticStatement();

    switch (this.step) {
      case 1:
        this.chatData.description = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 2 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[1]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Promotion & Advancement')">Promotion & Advancement</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Performance Review')">Performance Review</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Work Allocation')">Work Allocation</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Meetings & Visibility')">Meetings & Visibility</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Compensation & Rewards')">Compensation & Rewards</button>
          </div>
        `);
        this.step = 2;
        break;

      case 2:
        this.chatData.context = userText;
        this.biasRiskScore += 10;
        this.addAiMessage(`
          <p>Understood. Context is crucial for evaluation. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[2]}</p>
        `);
        this.step = 3;
        break;

      case 3:
        this.chatData.differentialTreatment = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 15;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[3]}</p>
        `);
        this.step = 4;
        break;

      case 4:
        this.chatData.observedOthers = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 15;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 5 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[4]}</p>
        `);
        this.step = 5;
        break;

      case 5:
        this.chatData.authorityInvolved = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 15;
        this.addAiMessage(`
          <p>Thank you. ${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 6 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[5]}</p>
        `);
        this.step = 6;
        break;

      case 6:
        this.chatData.ideasOverlooked = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 10;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 7 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[6]}</p>
        `);
        this.step = 7;
        break;

      case 7:
        this.chatData.excludedFromMeetings = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 10;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 8 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[7]}</p>
        `);
        this.step = 8;
        break;

      case 8:
        this.chatData.stereotypesObserved = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 15;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 9 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[8]}</p>
        `);
        this.step = 9;
        break;

      case 9:
        this.chatData.raisedClarification = userText;
        this.addAiMessage(`
          <p>${statement}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Final Question (10 of 10):</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[9]}</p>
        `);
        this.step = 10;
        break;

      case 10:
        this.chatData.futureCareerImpact = userText;
        if (userText.toLowerCase().includes("yes")) this.biasRiskScore += 10;

        let riskLevel = "Low Risk";
        let riskBadgeColor = "#2D6A4F";
        if (this.biasRiskScore >= 60) {
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
              Your evaluation indicates a <strong>${riskLevel}</strong> of biasness or exclusion. Would you like to submit this anonymously to the Ombudsperson?
            </p>
            <div class="chat-options-grid" style="margin-top:10px;">
              <button class="chat-opt-btn" style="border-color:var(--primary-teal); font-weight:700; background:rgba(31, 122, 140, 0.06);" onclick="ChatEngine.startFormalReportingFlow()">📋 Continue with Formal Confidential Case Reporting</button>
              <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(true)">🔒 Submit 100% Anonymously</button>
            </div>
          </div>
        `);
        this.step = 11;
        break;

      default:
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

  startFormalReportingFlow() {
    this.addUserMessage("📋 Continue with Formal Confidential Case Reporting");
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      
      // Generate a unique random ticket number (e.g. MHW-847291, CASE-592814, WB-104738)
      const prefixes = ["MHW", "CASE", "WB"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const ticketNumber = prefix + "-" + Math.floor(100000 + Math.random() * 900000);

      // Record in system cases database
      CASES_DATA.unshift({
        id: ticketNumber,
        category: this.chatData.category || "Mental Health & Well-being",
        risk: this.mentalHealthRiskScore >= 30 ? "high" : "moderate",
        created: "Just Now",
        status: "submitted",
        owner: "Unassigned (Ombudsperson)",
        anonymous: true,
        summary: this.chatData.description || "Mental Health & Wellbeing formal confidential report.",
        impact: this.chatData.dailyImpact || "Wellbeing support requested"
      });

      this.addAiMessage(`
        <div class="confirmation-card-ticket" style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:12px; padding:18px; margin-top:6px; box-shadow:var(--shadow-sm); border-left:4px solid var(--primary-teal);">
          
          <!-- HEADER & CHECKMARK -->
          <div style="display:flex; align-items:center; gap:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
            <div style="width:32px; height:32px; border-radius:50%; background:var(--color-success-bg); border:1.5px solid var(--color-success); color:var(--color-success); display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:800; flex-shrink:0;">
              ✓
            </div>
            <div>
              <h3 style="font-size:1.02rem; font-weight:800; color:var(--primary-teal-dark); margin:0;">📋 Confidential Case Report Created</h3>
            </div>
          </div>

          <!-- MESSAGE -->
          <p style="font-size:0.84rem; color:var(--text-main); margin-top:12px; line-height:1.45;">
            Your confidential case report has been successfully created and securely recorded.
          </p>

          <!-- TRACKING TICKET BOX -->
          <div style="margin-top:12px; background:rgba(31, 122, 140, 0.05); border:1px solid var(--border-color); border-radius:8px; padding:12px; text-align:center;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
              Tracking Ticket
            </span>
            <div style="font-family:'Courier New', monospace; font-size:1.55rem; font-weight:900; color:var(--primary-teal); letter-spacing:1px;">
              ${ticketNumber}
            </div>
          </div>

          <!-- ADDITIONAL TEXT -->
          <p style="font-size:0.78rem; color:var(--text-muted); margin-top:12px; line-height:1.4;">
            Please save this ticket number. You can use it later to track the status of your confidential case report.
          </p>

          <!-- CARD ACTIONS -->
          <div style="margin-top:14px; display:flex; flex-direction:column; gap:8px;">
            <button class="chat-opt-btn" style="background:var(--primary-teal); color:#FFFFFF; font-weight:700; border:none; text-align:center; padding:9px 12px; border-radius:6px; font-size:0.82rem; cursor:pointer;" onclick="ChatEngine.copyTicketNumber('${ticketNumber}')">
              📄 Copy Ticket Number
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--primary-teal-dark); border:1px solid var(--border-accent); font-weight:700; text-align:center; padding:8px; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="ChatEngine.trackTicketById('${ticketNumber}')">
                🔍 Track Report
              </button>
              <button class="chat-opt-btn" style="background:var(--bg-panel-left); color:var(--text-main); border:1px solid var(--border-color); font-weight:600; text-align:center; padding:8px; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="ChatEngine.renderWelcomeMessage()">
                💬 Return to Chat
              </button>
            </div>
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
        <p>Certainly. Please enter your 6-digit Case ID (e.g. <code>LIS-849201</code>) to check live status updates and ombudsperson notes.</p>
      `);
    }, 1000);
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
