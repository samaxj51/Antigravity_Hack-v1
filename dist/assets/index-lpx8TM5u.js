(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();const g=[{id:"speak-up",icon:"🗣️",title:"Speak Up Policy",desc:"Guidelines for safely raising concerns without fear of retaliation or reprisal.",fullContent:`
      <h3>Speak Up Policy</h3>
      <p>Listen360 ensures that every employee has a safe, protected channel to express concerns. Retaliation against any individual reporting in good faith is strictly prohibited and subject to zero-tolerance disciplinary measures.</p>
      <h4>Key Pillars:</h4>
      <ul>
        <li><strong>Confidentiality First:</strong> Identity protection protocols are strictly enforced.</li>
        <li><strong>Multiple Reporting Avenues:</strong> AI Chatbot, Anonymous Hotline, HR Ombudsperson.</li>
        <li><strong>Guaranteed Follow-up:</strong> Every submitted case receives acknowledgement within 24 hours.</li>
      </ul>
    `},{id:"anti-harassment",icon:"🛡️",title:"Anti-Harassment Policy",desc:"Zero tolerance for verbal, physical, sexual, or psychological harassment.",fullContent:`
      <h3>Anti-Harassment & Anti-Bullying Policy</h3>
      <p>Our organization is committed to providing a work environment free of harassment, intimidation, and abuse of power. Harassment includes unwelcome conduct based on race, gender, sexual orientation, disability, or age.</p>
      <h4>Reporting & Investigation:</h4>
      <ul>
        <li>Impartial third-party case assignments.</li>
        <li>Protection against workplace hostility during investigation.</li>
        <li>Remedial actions and formal outcome reports.</li>
      </ul>
    `},{id:"code-of-conduct",icon:"📜",title:"Code of Conduct",desc:"Core ethical principles and standard of behaviour expected across all teams.",fullContent:`
      <h3>Global Code of Conduct</h3>
      <p>Defines our standards of integrity, professional conduct, respect, and compliance with ethical business standards worldwide.</p>
    `},{id:"whistleblower",icon:"⚖️",title:"Whistleblower Policy",desc:"Protection framework for reporting financial fraud, corruption, or legal violations.",fullContent:`
      <h3>Whistleblower Protection Policy</h3>
      <p>Legal and organizational safeguards for individuals disclosing corporate misconduct, regulatory non-compliance, or financial irregularities.</p>
    `},{id:"workplace-respect",icon:"🤝",title:"Workplace Respect Policy",desc:"Promoting dignity, psychological safety, and constructive communication daily.",fullContent:`
      <h3>Workplace Respect & Civility Policy</h3>
      <p>Fostering mutual dignity, inclusive communication, and psychological safety across all work locations and remote channels.</p>
    `}];window.POLICIES_DATA=g;window.LEARNING_DATA=LEARNING_DATA;window.MHFA_CONNECT_DATA=MHFA_CONNECT_DATA;window.MOCK_INCIDENTS=MOCK_INCIDENTS;const m={mode:"standard",subPath:"support",step:0,isVoiceRecording:!1,biasRiskScore:0,mentalHealthRiskScore:0,chatData:{category:"",description:"",context:"",experiencing:"",dailyImpact:"",triggers:"",workloadContributing:"",adequateSupport:"",previousSteps:"",desiredSupport:"",orgContact:"",isSafe:!0,anonymous:!0,attachments:[]},empatheticStatements:["Thank you for trusting me with this.","I understand your concern and appreciate your courage.","I'm here to listen and support you completely.","I'm truly sorry you've experienced this situation.","You're not alone in this—your mental health and safety are our highest priority.","Your wellbeing is important, and every concern deserves to be heard.","Let's work through this together step-by-step.","Thank you for sharing something that may have been difficult to talk about."],mentalHealthQuestions:["What aspect of your work or workplace experience is currently affecting your mental or emotional well-being? (For example: workload, stress, burnout, workplace conflict, pressure, uncertainty, change, or isolation)","How would you describe what you are currently experiencing?","How is this affecting your day-to-day work experience? (For example: concentration, productivity, attendance, motivation, communication, or managing regular responsibilities)","Are there specific workplace situations, activities, or interactions that tend to make the situation worse?","Do you feel that your current workload, working hours, or work expectations are contributing to the concern?","Do you feel you have adequate support from your manager, team, or workplace to manage the situation?","Have you previously tried any steps or used any support to help manage what you are experiencing?","What type of support would be most helpful to you right now?","Would you like someone from the organisation to contact you to discuss available support options?","Do you feel safe at the moment?"],biasnessQuestions:["What specific action, decision, or behaviour made you feel that you were treated unfairly or excluded?","In what context did this occur? (For example: recruitment, promotion, performance review, compensation, work allocation, meetings, career opportunities, recognition, or day-to-day interactions)","Were you treated differently from one or more colleagues in a similar situation? If yes, please describe the difference in treatment.","Did you observe others with similar qualifications, experience, or circumstances receiving different treatment or opportunities?","Did the situation involve a decision made by someone with authority over you? If yes, what decision was made and how did it affect you?","Did you feel that your views, ideas, or contributions were overlooked, dismissed, or not given the same consideration as others?","Were you excluded from any meetings, discussions, networks, projects, or opportunities that you would reasonably have expected to participate in?","Did you notice any comments, language, or behaviour that you believe reflected stereotypes, assumptions, or preferences about you or another person?","Did you raise the issue or seek clarification from the person involved or another colleague? If yes, what response did you receive?","Has this situation affected your access to future opportunities, career development, recognition, or ability to participate fully at work?"],standardQuestions:["Could you tell me what happened in your own words?","When did this occur?","Is this an ongoing concern or a recent single incident?","Who was involved, or which team/department did this relate to?","How has this situation affected you personally or professionally?","Have you already spoken with anyone else or reported this before?","Would you prefer to submit this report completely anonymously?"],init(){this.renderWelcomeMessage()},renderWelcomeMessage(){const t=document.getElementById("chatMessages");t&&(t.innerHTML=`
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
    `,this.scrollToBottom())},startMentalHealthAssessment(){this.mode="mental_health",this.step=0,this.mentalHealthRiskScore=0,this.chatData.category="Mental Health & Well-being",this.addUserMessage("I would like to seek Mental Health & Well-being support."),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
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
      `),this.step=1},1200)},startBiasnessAssessment(){this.mode="biasness",this.step=0,this.biasRiskScore=0,this.chatData.category="Biasness & Favouritism",this.addUserMessage("I would like to report an issue related to biasness, favouritism, or unfair treatment."),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
        <div style="background:rgba(31, 122, 140, 0.08); border-left:3px solid var(--primary-teal); padding:10px 12px; border-radius:6px; margin-bottom:8px;">
          <strong>⚖️ Biasness & Inclusion Risk Assessment Mode Active</strong><br/>
          <span style="font-size:0.76rem; color:var(--text-muted);">I will ask 10 structured questions to analyze the risk score for biasness and inclusion.</span>
        </div>
        <p>${this.getRandomEmpatheticStatement()}</p>
        <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 1 of 10:</p>
        <p style="margin-top:2px;">${this.biasnessQuestions[0]}</p>
      `),this.step=1},1200)},selectInitialOption(t){this.mode="standard",this.addUserMessage(`I would like to discuss: ${t}`),this.chatData.category=t;const e=this.getRandomEmpatheticStatement();this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
        <p>${e}</p>
        <p style="margin-top:6px;">${this.standardQuestions[0]}</p>
      `),this.step=1},1200)},handleUserInput(t){if(!t.trim())return;const e=t.toLowerCase();if(this.mode==="standard"&&(e.includes("mental")||e.includes("stress")||e.includes("burnout")||e.includes("anxiety")||e.includes("depress"))){this.startMentalHealthAssessment();return}if(this.mode==="standard"&&(e.includes("bias")||e.includes("favourit")||e.includes("favorit")||e.includes("unfair"))){this.startBiasnessAssessment();return}this.addUserMessage(t),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.mode==="mental_health"?this.processMentalHealthStep(t):this.mode==="biasness"?this.processBiasnessStep(t):this.processStandardStep(t)},1300)},processMentalHealthStep(t){const e=this.getRandomEmpatheticStatement();switch(this.step){case 1:this.chatData.description=t,this.addAiMessage(`
          <p>${e}</p>
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
        `),this.step=2;break;case 2:this.chatData.experiencing=t,this.mentalHealthRiskScore+=10,this.addAiMessage(`
          <p>Thank you for describing what you're experiencing. ${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[2]}</p>
        `),this.step=3;break;case 3:this.chatData.dailyImpact=t,this.addAiMessage(`
          <p>Understood. Impact on daily work is important to address early. ${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[3]}</p>
        `),this.step=4;break;case 4:this.chatData.triggers=t,this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 5 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[4]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, work expectations contribute significantly')">Yes, significantly</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially contributing')">Partially</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No, other factors')">No</button>
          </div>
        `),this.step=5;break;case 5:this.chatData.workloadContributing=t,t.toLowerCase().includes("yes")&&(this.mentalHealthRiskScore+=15),this.addAiMessage(`
          <p>Thank you for noting that.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 6 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[5]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, adequate support')">Yes</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Partially supported')">Partially</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No adequate support')">No</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Prefer not to say')">Prefer not to say</button>
          </div>
        `),this.step=6;break;case 6:this.chatData.adequateSupport=t,t.toLowerCase().includes("no")&&(this.mentalHealthRiskScore+=15),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 7 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[6]}</p>
        `),this.step=7;break;case 7:this.chatData.previousSteps=t,this.addAiMessage(`
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
        `),this.step=8;break;case 8:this.chatData.desiredSupport=t,this.addAiMessage(`
          <p>Noted. We will tailor your support options accordingly.</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 9 of 10:</p>
          <p style="margin-top:2px;">${this.mentalHealthQuestions[8]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, contact me')">Yes</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('No, self-service')">No</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('I am not sure')">I'm not sure</button>
          </div>
        `),this.step=9;break;case 9:this.chatData.orgContact=t,this.addAiMessage(`
          <p style="font-weight:700; color:var(--primary-teal-dark);">Final Question (10 of 10):</p>
          <p style="margin-top:2px; font-size:0.95rem; font-weight:700; color:var(--color-critical);">Do you feel safe at the moment?</p>
          <div class="chat-options-grid" style="margin-top:8px;">
            <button class="chat-opt-btn" style="border-color:var(--color-success); font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Yes')">💚 Yes, I feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-critical); background:#FEE2E2; color:#991B1B; font-weight:800;" onclick="ChatEngine.handleSafetyResponse('No')">🚨 No, I do not feel safe</button>
            <button class="chat-opt-btn" style="border-color:var(--color-warning); background:#FEF3C7; color:#92400E; font-weight:700;" onclick="ChatEngine.handleSafetyResponse('Not sure')">⚠️ I'm not sure</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleSafetyResponse('Prefer not to say')">Prefer not to say</button>
          </div>
        `),this.step=10;break}},handleSafetyResponse(t){this.addUserMessage(`Safety status: ${t}`),t==="No"||t==="Not sure"?(this.chatData.isSafe=!1,this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
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
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:var(--primary-teal); color:var(--primary-teal); font-weight:700; padding:8px 14px; text-align:left;" onclick="ChatEngine.finalizeReport(true)">📋 Continue with Formal Confidential Case Reporting</button>
              <button class="chat-opt-btn" style="background:#FFFFFF; border-color:var(--border-color); color:var(--text-main); font-weight:600; padding:8px 14px; text-align:left;" onclick="App.openLearningModal('mental-health')">📚 Explore Self-Help Wellbeing Resources</button>
            </div>
          </div>
        `)},1200)):(this.chatData.isSafe=!0,this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
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
                <button class="policy-btn" style="margin-top:6px;" onclick="ChatEngine.finalizeReport(true)">Submit Confidential Case</button>
              </div>
            </div>
          </div>
        `)},1300))},processBiasnessStep(t){const e=this.getRandomEmpatheticStatement();switch(this.step){case 1:this.chatData.description=t,this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 2 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[1]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Promotion & Advancement')">Promotion & Advancement</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Performance Review')">Performance Review</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Work Allocation')">Work Allocation</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Meetings & Visibility')">Meetings & Visibility</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Compensation & Rewards')">Compensation & Rewards</button>
          </div>
        `),this.step=2;break;case 2:this.chatData.context=t,this.biasRiskScore+=10,this.addAiMessage(`
          <p>Understood. Context is crucial for evaluation. ${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 3 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[2]}</p>
        `),this.step=3;break;case 3:this.chatData.differentialTreatment=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=15),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 4 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[3]}</p>
        `),this.step=4;break;case 4:this.chatData.observedOthers=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=15),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 5 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[4]}</p>
        `),this.step=5;break;case 5:this.chatData.authorityInvolved=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=15),this.addAiMessage(`
          <p>Thank you. ${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 6 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[5]}</p>
        `),this.step=6;break;case 6:this.chatData.ideasOverlooked=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=10),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 7 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[6]}</p>
        `),this.step=7;break;case 7:this.chatData.excludedFromMeetings=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=10),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 8 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[7]}</p>
        `),this.step=8;break;case 8:this.chatData.stereotypesObserved=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=15),this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Question 9 of 10:</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[8]}</p>
        `),this.step=9;break;case 9:this.chatData.raisedClarification=t,this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px; font-weight:700; color:var(--primary-teal-dark);">Final Question (10 of 10):</p>
          <p style="margin-top:2px;">${this.biasnessQuestions[9]}</p>
        `),this.step=10;break;case 10:this.chatData.futureCareerImpact=t,t.toLowerCase().includes("yes")&&(this.biasRiskScore+=10);let i="Low Risk",o="#2D6A4F";this.biasRiskScore>=60?(i="Critical Risk",o="#E63946"):this.biasRiskScore>=35?(i="High Risk",o="#D97706"):this.biasRiskScore>=20&&(i="Moderate Risk",o="#0284C7"),this.addAiMessage(`
          <div style="background:var(--bg-card); border:1.5px solid var(--border-accent); border-radius:10px; padding:14px; margin-top:6px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <h4 style="color:var(--primary-teal); font-size:0.95rem;">📊 Biasness & Inclusion Risk Evaluation</h4>
              <span style="background:${o}; color:white; padding:3px 10px; border-radius:12px; font-size:0.72rem; font-weight:800;">${i} (${this.biasRiskScore}/100)</span>
            </div>
            <p style="margin-top:8px; font-size:0.8rem;">
              Your evaluation indicates a <strong>${i}</strong> of biasness or exclusion. Would you like to submit this anonymously to the Ombudsperson?
            </p>
            <div class="chat-options-grid" style="margin-top:10px;">
              <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(true)">🔒 Yes, Submit 100% Anonymously</button>
              <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(false)">👤 Submit with Identity (Jordan Smith)</button>
            </div>
          </div>
        `),this.step=11;break}},processStandardStep(t){const e=this.getRandomEmpatheticStatement();switch(this.step){case 1:this.chatData.description=t,this.addAiMessage(`
          <p>Thank you for explaining. ${e}</p>
          <p style="margin-top:6px;">${this.standardQuestions[1]}</p>
        `),this.step=2;break;case 2:this.chatData.dateOccurred=t,this.addAiMessage(`
          <p>Thank you. I've noted the timeline.</p>
          <p style="margin-top:6px;">${this.standardQuestions[2]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Yes, ongoing concern')">Yes, ongoing concern</button>
            <button class="chat-opt-btn" onclick="ChatEngine.handleOptionSelect('Recent single incident')">Recent single incident</button>
          </div>
        `),this.step=3;break;case 3:this.chatData.ongoing=t,this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px;">${this.standardQuestions[3]}</p>
        `),this.step=4;break;case 4:this.chatData.peopleInvolved=t,this.addAiMessage(`
          <p>Understood. ${e}</p>
          <p style="margin-top:6px;">${this.standardQuestions[4]}</p>
        `),this.step=5;break;case 5:this.chatData.impact=t,this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px;">${this.standardQuestions[5]}</p>
        `),this.step=6;break;case 6:this.chatData.spokenBefore=t,this.addAiMessage(`
          <p>Understood.</p>
          <p style="margin-top:6px;">${this.standardQuestions[6]}</p>
          <div class="chat-options-grid">
            <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(true)">🔒 Yes, 100% Anonymous</button>
            <button class="chat-opt-btn" onclick="ChatEngine.finalizeReport(false)">👤 No, include my name (Jordan Smith)</button>
          </div>
        `),this.step=7;break;default:this.addAiMessage(`
          <p>${e}</p>
          <p style="margin-top:6px;">Is there anything else you'd like to add before submitting?</p>
        `);break}},handleOptionSelect(t){this.handleUserInput(t)},finalizeReport(t){this.chatData.anonymous=t,this.addUserMessage(t?"I would prefer to submit this report completely anonymously.":"You may include my identity."),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator();const e="LIS-"+Math.floor(1e5+Math.random()*9e5);CASES_DATA.unshift({id:e,category:this.chatData.category||"Mental Health & Well-being",risk:this.mentalHealthRiskScore>=30?"high":"moderate",created:"Just Now",status:"submitted",owner:"Unassigned (Ombudsperson)",anonymous:t,summary:this.chatData.description||"Wellbeing and workplace factors report.",impact:this.chatData.dailyImpact||"High wellbeing impact"}),this.addAiMessage(`
        <div style="background:var(--secondary-sage-light); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal-dark); margin-bottom:6px;">✅ Confidential Case Report Submitted</h4>
          <p><strong>Tracking Case ID:</strong> <span style="font-family:monospace; background:#fff; padding:2px 6px; border-radius:4px; font-weight:700;">${e}</span></p>
          <p style="margin-top:6px; font-size:0.8rem;">
            Thank you for sharing something that may have been difficult to talk about. Your report has been routed securely to an assigned Independent Ombudsperson under strict 24h SLA.
          </p>
          <p style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">
            🔒 Identity Status: <strong>${t?"100% Anonymous":"Named Report (Jordan Smith)"}</strong>
          </p>
        </div>
      `),this.step=99},1600)},toggleVoiceRecording(){const t=document.getElementById("voiceRecordBtn"),e=document.getElementById("voiceStatusBox");this.isVoiceRecording?(this.isVoiceRecording=!1,t&&t.classList.remove("recording"),e&&(e.style.display="none"),this.handleUserInput("🎙️ [Voice Audio Transcript]: I've been feeling overwhelmed by heavy workload deadlines and finding it hard to sleep.")):(this.isVoiceRecording=!0,t&&t.classList.add("recording"),e&&(e.style.display="flex",e.innerHTML="🔴 Recording audio... Click to finish speaking."))},triggerFileUpload(){const t=document.createElement("input");t.type="file",t.accept=".pdf,.doc,.docx,.png,.jpg",t.onchange=e=>{const i=e.target.files[0];i&&(this.chatData.attachments.push(i.name),this.addUserMessage(`📎 Attached file: ${i.name} (${Math.round(i.size/1024)} KB)`),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
            <p>Thank you for attaching <strong>${i.name}</strong>. Encrypted and saved securely to your confidential report file.</p>
          `)},1e3))},t.click()},promptCaseTracking(){this.addUserMessage("I would like to track the status of my report."),this.showTypingIndicator(),setTimeout(()=>{this.hideTypingIndicator(),this.addAiMessage(`
        <p>Certainly. Please enter your 6-digit Case ID (e.g. <code>LIS-849201</code>) to check live status updates and ombudsperson notes.</p>
      `)},1e3)},getRandomEmpatheticStatement(){const t=Math.floor(Math.random()*this.empatheticStatements.length);return this.empatheticStatements[t]},addUserMessage(t){const e=document.getElementById("chatMessages");if(!e)return;const i=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),o=document.createElement("div");o.className="chat-bubble-wrap user",o.innerHTML=`
      <div class="chat-bubble">${t}</div>
      <div class="chat-time">${i}</div>
    `,e.appendChild(o),this.scrollToBottom()},addAiMessage(t){const e=document.getElementById("chatMessages");if(!e)return;const i=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),o=document.createElement("div");o.className="chat-bubble-wrap ai",o.innerHTML=`
      <div class="chat-bubble">${t}</div>
      <div class="chat-time">${i}</div>
    `,e.appendChild(o),this.scrollToBottom()},showTypingIndicator(){const t=document.getElementById("chatMessages");if(!t)return;const e=document.createElement("div");e.id="aiTypingIndicator",e.className="chat-bubble-wrap ai",e.innerHTML=`
      <div class="chat-bubble typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `,t.appendChild(e),this.scrollToBottom()},hideTypingIndicator(){const t=document.getElementById("aiTypingIndicator");t&&t.remove()},scrollToBottom(){const t=document.getElementById("chatMessages");t&&(t.scrollTop=t.scrollHeight)}};window.ChatEngine=m;const b={triggerPathway(){ChatEngine.addAiMessage(`
      🌿 <strong>Well-being & Mental Health Pathway</strong><br/><br/>
      Based on what you've shared, it sounds like you may benefit from additional well-being support.<br/>
      We offer confidential pathways tailored for your emotional safety and support:
    `),ChatEngine.addOptions(["Option 1 — Talk to a Mental Health First Aider (MHFA)","Option 2 — Book a Counselling Appointment","Option 3 — Explore Interactive Well-being Resources","Option 4 — Continue with Formal Reporting"],e=>{this.handleWellbeingChoice(e)})},handleWellbeingChoice(t){t.includes("Option 1")?this.openMHFAConnectModal():t.includes("Option 2")?this.openCounselorModal():t.includes("Option 3")?this.openBreathingToolModal():t.includes("Option 4")&&(ChatEngine.addAiMessage("Understood. You can continue with the formal reporting process at any time."),ChatEngine.processStep6_CategoryQs())},openMHFAConnectModal(){const t=document.getElementById("generalModal"),e=document.getElementById("modalInnerContent");!t||!e||(e.innerHTML=`
      <button class="modal-close-btn" onclick="WellbeingModule.closeModal()">✕</button>
      <h3 class="modal-title">🤝 Connect with a Mental Health First Aider</h3>
      <p style="color:var(--text-muted); font-size:0.9rem;">
        Our certified MHFA team members are trained peers ready to offer confidential, non-judgmental listening and immediate guidance.
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
        <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-color); padding:14px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>Sarah Jenkins (Lead MHFA)</strong><br/>
            <span style="font-size:0.75rem; color:#10B981;">🟢 Available Now (Instant Chat / Voice)</span>
          </div>
          <button class="action-btn-sm" onclick="WellbeingModule.connectMHFA('Sarah Jenkins')">Connect Now</button>
        </div>

        <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-color); padding:14px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>David Chen (MHFA Specialist)</strong><br/>
            <span style="font-size:0.75rem; color:var(--accent-cyan);">🔵 Next available in 15 mins</span>
          </div>
          <button class="action-btn-sm" onclick="WellbeingModule.connectMHFA('David Chen')">Request Call</button>
        </div>
      </div>
    `,t.classList.add("active"))},connectMHFA(t){alert(`Connecting confidential session with ${t}... You will receive an instant chat prompt shortly.`),this.closeModal(),ChatEngine.addAiMessage(`🔒 <em>Confidential session requested with ${t}. Connection code generated: MHFA-SESSION-884.</em>`)},openCounselorModal(){const t=document.getElementById("generalModal"),e=document.getElementById("modalInnerContent");!t||!e||(e.innerHTML=`
      <button class="modal-close-btn" onclick="WellbeingModule.closeModal()">✕</button>
      <h3 class="modal-title">📅 Book a Confidential Counseling Appointment</h3>
      <p style="color:var(--text-muted); font-size:0.9rem;">
        Through our Employee Assistance Program (EAP), access licensed professional counselors at no cost.
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
        <label style="font-size:0.85rem; color:var(--text-muted);">Select Consultation Mode:</label>
        <select class="filter-select" style="width:100%;">
          <option>Virtual Video Call (Confidential)</option>
          <option>Phone Consultation</option>
          <option>In-Person Clinic Visit</option>
        </select>

        <label style="font-size:0.85rem; color:var(--text-muted);">Preferred Date & Time:</label>
        <input type="datetime-local" class="chat-input" style="width:100%;" value="2026-07-24T10:00" />

        <button class="learning-btn" style="margin-top:10px;" onclick="WellbeingModule.confirmCounseling()">
          Confirm Appointment Booking
        </button>
      </div>
    `,t.classList.add("active"))},confirmCounseling(){alert("Appointment successfully booked! Confirmation details sent securely."),this.closeModal(),ChatEngine.addAiMessage("📅 <strong>Appointment Confirmed:</strong> Your confidential counseling session has been scheduled. Details emailed via secure gateway.")},openBreathingToolModal(){const t=document.getElementById("generalModal"),e=document.getElementById("modalInnerContent");!t||!e||(e.innerHTML=`
      <button class="modal-close-btn" onclick="WellbeingModule.closeModal()">✕</button>
      <h3 class="modal-title">🌿 Guided Breathing & Micro-Grounding</h3>
      <p style="color:var(--text-muted); font-size:0.88rem; text-align:center;">
        Take a moment to calm your nervous system with box breathing.
      </p>

      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:30px 0;">
        <div id="breathingCircle" style="width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg, var(--primary-600), var(--accent-cyan)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.1rem; box-shadow:0 0 30px rgba(6, 182, 212, 0.5); transition:transform 4s ease-in-out;">
          Inhale...
        </div>
        <div id="breathingText" style="font-size:1.1rem; font-weight:600; color:var(--accent-cyan);">
          Inhale deeply for 4 seconds
        </div>
        <button class="learning-btn" style="width:180px;" onclick="WellbeingModule.startBreathingCycle()">
          Start Breathing Cycle
        </button>
      </div>
    `,t.classList.add("active"))},startBreathingCycle(){const t=document.getElementById("breathingCircle"),e=document.getElementById("breathingText");if(!t||!e)return;let i=0;const o=()=>{i===0?(t.style.transform="scale(1.4)",e.innerText="Inhale deeply for 4s...",i=1):i===1?(e.innerText="Hold breath for 4s...",i=2):i===2?(t.style.transform="scale(1.0)",e.innerText="Exhale slowly for 4s...",i=3):(e.innerText="Pause for 4s...",i=0)};o(),setInterval(o,4e3)},closeModal(){const t=document.getElementById("generalModal");t&&t.classList.remove("active")}};window.WellbeingModule=b;const y={activeFilterCategory:"all",activeFilterRisk:"all",activeFilterStatus:"all",searchTerm:"",init(){this.renderMetrics(),this.renderCharts(),this.renderCasesTable()},renderMetrics(){const t=INITIAL_SAMPLE_CASES.length,e=INITIAL_SAMPLE_CASES.filter(a=>a.status==="Submitted"||a.status==="New").length,i=INITIAL_SAMPLE_CASES.filter(a=>a.risk==="High"||a.risk==="Critical").length,o=Math.round(INITIAL_SAMPLE_CASES.filter(a=>a.anonymous).length/t*100),n=document.getElementById("invMetricsGrid");n&&(n.innerHTML=`
      <div class="inv-metric-card">
        <div class="inv-metric-num">${t}</div>
        <div class="inv-metric-lbl">Total Cases</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num" style="color:var(--primary-teal);">${e}</div>
        <div class="inv-metric-lbl">New This Week</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num" style="color:var(--color-critical);">${i}</div>
        <div class="inv-metric-lbl">High / Critical Risk</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num">3.8 Days</div>
        <div class="inv-metric-lbl">Avg Resolution Time</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num">4.2 Days</div>
        <div class="inv-metric-lbl">Avg Case Age</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num" style="color:var(--color-success);">${o}%</div>
        <div class="inv-metric-lbl">Anonymous Ratio</div>
      </div>
    `)},renderCharts(){this.drawVolumeLineChart(),this.drawCategoryDonutChart()},drawVolumeLineChart(){const t=document.getElementById("volumeChartCanvas");if(!t)return;const e=t.getContext("2d"),i=t.width=t.parentElement.clientWidth,o=t.height=200;e.clearRect(0,0,i,o),e.strokeStyle="rgba(31, 122, 140, 0.1)",e.lineWidth=1;for(let s=1;s<=4;s++){const r=o/4*s-20;e.beginPath(),e.moveTo(30,r),e.lineTo(i-20,r),e.stroke()}const n=[12,18,15,26,32,28,42],a=["Jan","Feb","Mar","Apr","May","Jun","Jul"],c=(i-60)/(n.length-1),p=50,h=e.createLinearGradient(0,0,0,o);h.addColorStop(0,"rgba(31, 122, 140, 0.3)"),h.addColorStop(1,"rgba(31, 122, 140, 0.0)"),e.beginPath(),n.forEach((s,r)=>{const l=40+r*c,d=o-30-s/p*(o-50);r===0?e.moveTo(l,d):e.lineTo(l,d)}),e.lineTo(40+(n.length-1)*c,o-30),e.lineTo(40,o-30),e.closePath(),e.fillStyle=h,e.fill(),e.beginPath(),n.forEach((s,r)=>{const l=40+r*c,d=o-30-s/p*(o-50);r===0?e.moveTo(l,d):e.lineTo(l,d)}),e.strokeStyle="#1F7A8C",e.lineWidth=3,e.stroke(),n.forEach((s,r)=>{const l=40+r*c,d=o-30-s/p*(o-50);e.beginPath(),e.arc(l,d,5,0,Math.PI*2),e.fillStyle="#8ECDF0",e.fill(),e.strokeStyle="#1F7A8C",e.lineWidth=2,e.stroke(),e.fillStyle="gray",e.font="11px 'Plus Jakarta Sans'",e.fillText(a[r],l-10,o-10)})},drawCategoryDonutChart(){const t=document.getElementById("categoryChartCanvas");if(!t)return;const e=t.getContext("2d"),i=t.width=t.parentElement.clientWidth,o=t.height=200,n=[{label:"Workplace Behaviour",value:32,color:"#1F7A8C"},{label:"Bullying & Harassment",value:25,color:"#D97706"},{label:"Discrimination",value:15,color:"#8ECDF0"},{label:"Ethics",value:12,color:"#2D6A4F"},{label:"Retaliation",value:8,color:"#9333EA"},{label:"Well-being",value:8,color:"#A8D5BA"}],a=i/3.2,c=o/2,p=65,h=40;let s=0;n.forEach(l=>{const d=l.value/100*Math.PI*2;e.beginPath(),e.arc(a,c,p,s,s+d),e.arc(a,c,h,s+d,s,!0),e.closePath(),e.fillStyle=l.color,e.fill(),s+=d});let r=25;n.forEach(l=>{e.fillStyle=l.color,e.fillRect(i/1.7,r,12,12),e.fillStyle="gray",e.font="11px 'Plus Jakarta Sans'",e.fillText(`${l.label} (${l.value}%)`,i/1.7+20,r+10),r+=26})},renderCasesTable(){const t=document.getElementById("casesTableBody");if(!t)return;let e=INITIAL_SAMPLE_CASES.filter(i=>{if(this.activeFilterCategory!=="all"&&!i.category.includes(this.activeFilterCategory)||this.activeFilterRisk!=="all"&&i.risk.toLowerCase()!==this.activeFilterRisk.toLowerCase()||this.activeFilterStatus!=="all"&&i.status.toLowerCase()!==this.activeFilterStatus.toLowerCase())return!1;if(this.searchTerm){const o=this.searchTerm.toLowerCase();return i.id.toLowerCase().includes(o)||i.category.toLowerCase().includes(o)||i.narrative.toLowerCase().includes(o)}return!0});t.innerHTML=e.map(i=>`
      <tr tabindex="0" onclick="DashboardModule.openCaseDetails('${i.id}')" onkeypress="if(event.key==='Enter') DashboardModule.openCaseDetails('${i.id}')">
        <td><strong>${i.id}</strong></td>
        <td>${i.category}</td>
        <td><span class="risk-badge ${i.risk.toLowerCase()}">${i.risk}</span></td>
        <td>${i.age}</td>
        <td><span class="status-badge ${i.status.toLowerCase().includes("investigation")?"investigation":i.status.toLowerCase().includes("resolved")?"resolved":"new"}">${i.status}</span></td>
        <td>${i.anonymous?"🔒 Anonymous":"👤 "+i.owner}</td>
        <td><button class="action-btn-sm" aria-label="View case ${i.id}">View & Manage</button></td>
      </tr>
    `).join("")},filterCategory(t){this.activeFilterCategory=t,this.renderCasesTable()},filterRisk(t){this.activeFilterRisk=t,this.renderCasesTable()},filterStatus(t){this.activeFilterStatus=t,this.renderCasesTable()},handleSearch(t){this.searchTerm=t,this.renderCasesTable()},openCaseDetails(t){const e=INITIAL_SAMPLE_CASES.find(n=>n.id===t);if(!e)return;const i=document.getElementById("generalModal"),o=document.getElementById("modalInnerContent");!i||!o||(o.innerHTML=`
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
        <div>
          <h3 class="modal-title">${e.id}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Submitted on ${e.date} • ${e.anonymous?"🔒 Anonymous Reporter":"👤 Identified"}</span>
        </div>
        <span class="risk-badge ${e.risk.toLowerCase()}">${e.risk} Risk</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px; margin-top:14px;">
        <div style="background:rgba(31, 122, 140, 0.04); border:1px solid var(--border-color); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal); margin-bottom:4px;">Employee Statement</h4>
          <p style="font-size:0.88rem; color:var(--text-main);">"${e.narrative}"</p>
        </div>

        <div style="background:rgba(168, 213, 186, 0.15); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal); margin-bottom:4px;">AI-Generated Case Summary</h4>
          <p style="font-size:0.88rem; color:var(--text-main);">${e.aiSummary}</p>
        </div>

        <div style="background:var(--bg-card); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--text-main); margin-bottom:6px;">🤖 AI-Assisted Case Routing & Owner Assignment</h4>
          <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
            Recommended Routing: <strong style="color:var(--primary-teal);">Ethics & Workplace Conduct Team</strong>
          </p>
          <div style="display:flex; gap:10px;">
            <select id="caseRoutingSelect" class="filter-select" aria-label="Select Owner" style="flex:1;">
              <option ${e.owner.includes("Investigator A")?"selected":""}>Investigator A (Ethics Team)</option>
              <option ${e.owner.includes("Compliance")?"selected":""}>Investigator B (Compliance)</option>
              <option ${e.owner.includes("HR")?"selected":""}>HR Business Partner</option>
              <option ${e.owner.includes("Legal")?"selected":""}>Legal & Employee Relations</option>
              <option ${e.owner.includes("MHFA")?"selected":""}>MHFA / Well-being Team</option>
            </select>
            <button class="action-btn-sm" onclick="DashboardModule.updateCaseOwner('${e.id}')">Reassign Case</button>
          </div>
        </div>

        <div>
          <h4 style="color:var(--text-main); margin-bottom:8px;">Timeline & Investigation Activity</h4>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:0.82rem; border-left:2px solid var(--border-accent); padding-left:12px;">
            ${e.timeline.map(n=>`
              <div>
                <strong style="color:var(--primary-teal);">${n.date}</strong> — <strong>${n.title}:</strong> ${n.desc}
              </div>
            `).join("")}
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="learning-btn" style="flex:1;" onclick="DashboardModule.addNotePrompt('${e.id}')">➕ Add Note</button>
          <button class="learning-btn" style="flex:1; background:var(--primary-teal); color:white;" onclick="DashboardModule.resolveCase('${e.id}')">✅ Close Case</button>
        </div>
      </div>
    `,i.classList.add("active"))},updateCaseOwner(t){const e=document.getElementById("caseRoutingSelect");if(!e)return;const i=e.value,o=INITIAL_SAMPLE_CASES.find(n=>n.id===t);o&&(o.owner=i,o.timeline.push({date:new Date().toLocaleString(),title:"Owner Reassigned",desc:`Reassigned to ${i} via AI-assisted routing.`}),alert(`Case ${t} reassigned to ${i}`),this.renderCasesTable(),this.openCaseDetails(t))},addNotePrompt(t){const e=prompt("Enter investigator note:");if(e){const i=INITIAL_SAMPLE_CASES.find(o=>o.id===t);i&&(i.timeline.push({date:new Date().toLocaleString(),title:"Investigator Note",desc:e}),this.openCaseDetails(t))}},resolveCase(t){const e=INITIAL_SAMPLE_CASES.find(i=>i.id===t);e&&(e.status="Resolved",e.timeline.push({date:new Date().toLocaleString(),title:"Case Resolved & Closed",desc:"Investigation completed and remedial actions recorded."}),alert(`Case ${t} marked as Resolved.`),WellbeingModule.closeModal(),this.renderCasesTable(),this.renderMetrics())}};window.DashboardModule=y;const f={processQuery(t){const e=document.getElementById("aiIntelResponseBox");e&&(e.style.display="block",e.innerHTML=`<em>🤖 AI Case Intelligence analyzing query: "${t}"...</em>`,setTimeout(()=>{let i="";const o=t.toLowerCase();o.includes("summary of cases")||o.includes("this month")?i=`
          <strong>📊 Monthly Case Volume Summary:</strong><br/>
          42 cases were received this month, representing a <strong>12% increase</strong> compared with the previous month. Workplace behaviour was the most frequently reported category, accounting for 35% of cases. 8 cases were classified as high risk, and 3 cases have exceeded the expected resolution timeline.
        `:o.includes("top 3")||o.includes("emerging")?i=`
          <strong>📈 Top 3 Emerging Concerns:</strong><br/>
          1. <strong>Workplace Behaviour & Respect (35%):</strong> Microaggressions during hybrid team meetings.<br/>
          2. <strong>Manager/Leadership Communication (28%):</strong> Perceived power imbalances in quarterly reviews.<br/>
          3. <strong>Burnout & Anxiety (18%):</strong> Increased workload strain in engineering departments.
        `:o.includes("manager behaviour")||o.includes("manager")?i=`
          <strong>👔 Cases Related to Manager Behaviour:</strong><br/>
          Found <strong>14 active cases</strong> involving supervisor or managerial conduct. 6 are classified as High Risk (e.g. <code>LS360-2026-001245</code>). Common themes include tone of communication, review bias, and workload distribution.
        `:o.includes("increased")||o.includes("quarter")?i=`
          <strong>📊 Quarter-over-Quarter Category Shift:</strong><br/>
          • <strong>Bullying & Harassment:</strong> +18% increase year-over-date.<br/>
          • <strong>Mental Health & Stress Support:</strong> +24% increase in self-initiated support requests.<br/>
          • <strong>Financial / Fraud:</strong> -5% decrease.
        `:o.includes("high-risk")||o.includes("high risk")||o.includes("summarise all")?i=`
          <strong>🔴 High-Risk & Critical Case Portfolio:</strong><br/>
          Found 2 active high-risk cases:<br/>
          1. <code>LS360-2026-001245</code> (Bullying/Harassment) — Anonymous, Manager involvement.<br/>
          2. <code>LS360-2026-001248</code> (Retaliation) — Critical Risk, Escalated to Legal & ER Director.
        `:o.includes("sla breach")||o.includes("sla")?i=`
          <strong>⏱️ SLA Compliance & Breach Warnings:</strong><br/>
          • 1 Case (<code>LS360-2026-001246</code>) is at <strong>85% SLA threshold</strong> (5 days old, initial review pending).<br/>
          • All other active cases are currently within 24h acknowledgement and 7-day resolution targets.
        `:i=`
          <strong>🤖 AI Analysis Output:</strong><br/>
          Analyzed ${INITIAL_SAMPLE_CASES.length} cases across departments. Query "${t}" matched 3 active records. Recommendations: Ensure high-risk case <code>LS360-2026-001248</code> has assigned legal lead outreach within 12 hours.
        `,e.innerHTML=i},600))}};window.AiIntelligence=f;const u={currentRole:"employee",theme:"light",init(){this.renderLeftDashboard(),this.animateMetrics(),ChatEngine.init(),DashboardModule.init(),this.setupEventListeners()},animateMetrics(){const t=(e,i,o,n,a="")=>{const c=document.getElementById(e);if(!c)return;let p=null;const h=s=>{p||(p=s);const r=Math.min((s-p)/n,1),l=r*(o-i)+i,d=o%1===0?Math.floor(l):l.toFixed(1);c.innerHTML=d+a,r<1&&window.requestAnimationFrame(h)};window.requestAnimationFrame(h)};setTimeout(()=>{t("metricValSafety",0,96.4,1400,"%"),t("metricValTime",0,3.8,1e3," Days"),t("metricValPrograms",0,14,800," Programs")},200)},toggleTheme(){this.theme=this.theme==="light"?"dark":"light",document.documentElement.setAttribute("data-theme",this.theme);const t=document.querySelector(".theme-toggle-btn");t&&(t.innerText=this.theme==="light"?"🌙":"☀️"),this.currentRole==="investigator"&&DashboardModule.renderCharts()},switchRole(t){this.currentRole=t;const e=document.getElementById("employeeView"),i=document.getElementById("investigatorView"),o=document.getElementById("roleBtnEmployee"),n=document.getElementById("roleBtnInvestigator");t==="employee"?(e.style.display="flex",i.style.display="none",o.classList.add("active"),o.setAttribute("aria-checked","true"),n.classList.remove("active"),n.setAttribute("aria-checked","false")):(e.style.display="none",i.style.display="flex",o.classList.remove("active"),o.setAttribute("aria-checked","false"),n.classList.add("active"),n.setAttribute("aria-checked","true"),DashboardModule.renderCharts())},renderLeftDashboard(){const t=document.getElementById("policiesGrid");t&&(t.innerHTML=POLICIES_DATA.map(i=>`
        <div class="policy-card" tabindex="0" role="article" aria-label="${i.title}">
          <div class="policy-card-body">
            <div class="policy-icon" aria-hidden="true">${i.icon}</div>
            <div class="policy-name">${i.title}</div>
            <div class="policy-desc">${i.desc}</div>
          </div>
          <button class="policy-btn" aria-label="View policy for ${i.title}" onclick="App.openPolicyModal('${i.id}')">View Policy</button>
        </div>
      `).join(""));const e=document.getElementById("learningGrid");e&&(e.innerHTML=LEARNING_MODULES.map(i=>`
        <div class="learning-card" tabindex="0" role="article" aria-label="${i.title}">
          <div class="learning-banner">
            ${i.banner}
            <span class="learning-tag">${i.tag}</span>
          </div>
          <div class="learning-content">
            <div class="learning-title">${i.title}</div>
            <div>
              <div class="progress-bar-box" role="progressbar" aria-valuenow="${i.progress}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar-fill" style="width: ${i.progress}%;"></div>
              </div>
              <div class="progress-text">
                <span>⏱️ ${i.duration}</span>
                <span>${i.progress}%</span>
              </div>
            </div>
            <button class="learning-btn" aria-label="Start learning ${i.title}" onclick="App.openLearningModal('${i.id}')">Start Learning</button>
          </div>
        </div>
      `).join(""))},openPolicyModal(t){const e=POLICIES_DATA.find(n=>n.id===t);if(!e)return;const i=document.getElementById("generalModal"),o=document.getElementById("modalInnerContent");!i||!o||(o.innerHTML=`
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:2rem;">${e.icon}</span>
        <h3 class="modal-title">${e.title}</h3>
      </div>
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6; margin-top:10px;">
        ${e.fullContent}
      </div>
      <button class="learning-btn" style="margin-top:14px;" onclick="WellbeingModule.closeModal()">Close Document</button>
    `,i.classList.add("active"))},openLearningModal(t){const e=LEARNING_MODULES.find(n=>n.id===t);if(!e)return;const i=document.getElementById("generalModal"),o=document.getElementById("modalInnerContent");!i||!o||(o.innerHTML=`
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:2.2rem;">${e.banner}</span>
        <div>
          <h3 class="modal-title">${e.title}</h3>
          <span style="font-size:0.75rem; color:var(--primary-teal); font-weight:700;">${e.tag} • ${e.duration}</span>
        </div>
      </div>
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6; margin-top:10px;">
        <p>${e.content}</p>
        <div style="margin-top:14px; background:rgba(31, 122, 140, 0.06); padding:14px; border-radius:10px; border:1px solid var(--border-color);">
          <strong>Interactive Learning Exercise:</strong><br/>
          Select the best action when observing workplace distress:
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
            <button class="chat-opt-btn" onclick="alert('Correct! Empathetic listening without judgement builds psychological safety.')">A) Offer empathetic listening and share listen360 support resources.</button>
            <button class="chat-opt-btn" onclick="alert('Try again. Immediate reporting is best done with consent or through confidential channels.')">B) Dismiss the concern as temporary stress.</button>
          </div>
        </div>
      </div>
      <button class="learning-btn" style="margin-top:14px;" onclick="WellbeingModule.closeModal()">Complete Module</button>
    `,i.classList.add("active"))},setupEventListeners(){const t=document.getElementById("chatInput");t&&t.addEventListener("keypress",e=>{e.key==="Enter"&&this.sendMessage()})},sendMessage(){const t=document.getElementById("chatInput");if(t&&t.value.trim()){const e=t.value.trim();t.value="",ChatEngine.handleUserInput(e)}}};window.App=u;window.onload=()=>{u.init()};
