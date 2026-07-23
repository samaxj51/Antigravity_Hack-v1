/* LISTEN-360 WELL-BEING JOURNEY MODULE (PART B) */

const WellbeingModule = {
  triggerPathway() {
    const text = `
      🌿 <strong>Well-being & Mental Health Pathway</strong><br/><br/>
      Based on what you've shared, it sounds like you may benefit from additional well-being support.<br/>
      We offer confidential pathways tailored for your emotional safety and support:
    `;

    ChatEngine.addAiMessage(text);
    
    ChatEngine.addOptions([
      "Option 1 — Talk to a Mental Health First Aider (MHFA)",
      "Option 2 — Book a Counselling Appointment",
      "Option 3 — Explore Interactive Well-being Resources",
      "Option 4 — Continue with Formal Reporting"
    ], (choice) => {
      this.handleWellbeingChoice(choice);
    });
  },

  handleWellbeingChoice(choice) {
    if (choice.includes("Option 1")) {
      this.openMHFAConnectModal();
    } else if (choice.includes("Option 2")) {
      this.openCounselorModal();
    } else if (choice.includes("Option 3")) {
      this.openBreathingToolModal();
    } else if (choice.includes("Option 4")) {
      ChatEngine.addAiMessage("Understood. You can continue with the formal reporting process at any time.");
      ChatEngine.processStep6_CategoryQs();
    }
  },

  openMHFAConnectModal() {
    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
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
    `;

    modal.classList.add("active");
  },

  connectMHFA(name) {
    alert(`Connecting confidential session with ${name}... You will receive an instant chat prompt shortly.`);
    this.closeModal();
    ChatEngine.addAiMessage(`🔒 <em>Confidential session requested with ${name}. Connection code generated: MHFA-SESSION-884.</em>`);
  },

  openCounselorModal() {
    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
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
    `;

    modal.classList.add("active");
  },

  confirmCounseling() {
    alert("Appointment successfully booked! Confirmation details sent securely.");
    this.closeModal();
    ChatEngine.addAiMessage("📅 <strong>Appointment Confirmed:</strong> Your confidential counseling session has been scheduled. Details emailed via secure gateway.");
  },

  openBreathingToolModal() {
    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
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
    `;

    modal.classList.add("active");
  },

  startBreathingCycle() {
    const circle = document.getElementById("breathingCircle");
    const text = document.getElementById("breathingText");
    if (!circle || !text) return;

    let phase = 0;
    const runPhase = () => {
      if (phase === 0) {
        circle.style.transform = "scale(1.4)";
        text.innerText = "Inhale deeply for 4s...";
        phase = 1;
      } else if (phase === 1) {
        text.innerText = "Hold breath for 4s...";
        phase = 2;
      } else if (phase === 2) {
        circle.style.transform = "scale(1.0)";
        text.innerText = "Exhale slowly for 4s...";
        phase = 3;
      } else {
        text.innerText = "Pause for 4s...";
        phase = 0;
      }
    };

    runPhase();
    setInterval(runPhase, 4000);
  },

  closeModal() {
    const modal = document.getElementById("generalModal");
    if (modal) modal.classList.remove("active");
  }
};

window.WellbeingModule = WellbeingModule;

