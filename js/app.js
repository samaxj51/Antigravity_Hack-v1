/* LISTEN360 MAIN APPLICATION CONTROLLER */

const App = {
  currentRole: "employee", // "employee" or "investigator"
  theme: "light",

  init() {
    this.renderLeftDashboard();
    this.animateMetrics();
    ChatEngine.init();
    DashboardModule.init();
    this.setupEventListeners();
  },

  animateMetrics() {
    this.updateEmployeeCaseMetrics();
  },

  updateEmployeeCaseMetrics() {
    const cases = (typeof CASES_DATA !== 'undefined' && Array.isArray(CASES_DATA)) ? CASES_DATA : [];
    const totalRaised = cases.length;
    const resolvedCount = cases.filter(c => c.status === "Resolved" || c.status === "Closed").length;
    const ongoingCount = totalRaised - resolvedCount;

    const animateVal = (id, start, end, duration) => {
      const obj = document.getElementById(id);
      if (!obj) return;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal;
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    setTimeout(() => {
      animateVal("metricValTotalRaised", 0, totalRaised, 800);
      animateVal("metricValOngoing", 0, ongoingCount, 800);
      animateVal("metricValResolved", 0, resolvedCount, 800);
    }, 100);

    this.renderRaisedCasesList();
  },

  renderRaisedCasesList() {
    const container = document.getElementById("myRaisedCasesContainer");
    if (!container) return;

    const cases = (typeof CASES_DATA !== 'undefined' && Array.isArray(CASES_DATA)) ? CASES_DATA : [];

    if (cases.length === 0) {
      container.innerHTML = `<p style="font-size:0.78rem; color:var(--text-muted);">No cases raised yet.</p>`;
      return;
    }

    container.innerHTML = cases.slice(0, 5).map(c => {
      let badgeStyle = "background:rgba(31, 122, 140, 0.1); color:var(--primary-teal-dark); border:1px solid var(--border-accent);";
      let statusIcon = "🔵";
      if (c.status === "Resolved" || c.status === "Closed") {
        badgeStyle = "background:var(--color-success-bg); color:var(--color-success); border:1px solid var(--color-success);";
        statusIcon = "🟢";
      } else if (c.status === "Under Investigation" || c.status === "Assigned") {
        badgeStyle = "background:#FEF3C7; color:#92400E; border:1px solid #F59E0B;";
        statusIcon = "🟠";
      }

      return `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:10px 12px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-family:'Courier New', monospace; font-size:0.84rem; color:var(--primary-teal);">${c.id}</strong>
              <span style="${badgeStyle} padding:1px 6px; border-radius:8px; font-size:0.68rem; font-weight:800;">${statusIcon} ${c.status}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-main); margin-top:2px;">
              <strong>${c.category}</strong> • <span style="color:var(--text-muted);">${c.created || c.date || 'Recent'}</span>
            </div>
          </div>
          <button class="chat-opt-btn" style="padding:4px 8px; font-size:0.72rem; border-color:var(--primary-teal); color:var(--primary-teal);" onclick="ChatEngine.trackTicketById('${c.id}')">
            🔍 Track Status
          </button>
        </div>
      `;
    }).join('');
  },

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.theme);
    const btn = document.querySelector(".theme-toggle-btn");
    if (btn) {
      btn.innerText = this.theme === "light" ? "🌙" : "☀️";
    }
    if (this.currentRole === "investigator") {
      DashboardModule.renderCharts();
    }
  },

  switchRole(role) {
    this.currentRole = role;
    const empContainer = document.getElementById("employeeView");
    const invContainer = document.getElementById("investigatorView");
    const empBtn = document.getElementById("roleBtnEmployee");
    const invBtn = document.getElementById("roleBtnInvestigator");

    if (role === "employee") {
      empContainer.style.display = "flex";
      invContainer.style.display = "none";
      empBtn.classList.add("active");
      empBtn.setAttribute("aria-checked", "true");
      invBtn.classList.remove("active");
      invBtn.setAttribute("aria-checked", "false");
    } else {
      empContainer.style.display = "none";
      invContainer.style.display = "flex";
      empBtn.classList.remove("active");
      empBtn.setAttribute("aria-checked", "false");
      invBtn.classList.add("active");
      invBtn.setAttribute("aria-checked", "true");
      DashboardModule.renderCharts();
    }
  },

  renderLeftDashboard() {
    // Render Policies
    const polContainer = document.getElementById("policiesGrid");
    if (polContainer) {
      polContainer.innerHTML = POLICIES_DATA.map(p => `
        <div class="policy-card" tabindex="0" role="article" aria-label="${p.title}">
          <div class="policy-card-body">
            <div class="policy-icon" aria-hidden="true">${p.icon}</div>
            <div class="policy-name">${p.title}</div>
            <div class="policy-desc">${p.desc}</div>
          </div>
          <button class="policy-btn" aria-label="View policy for ${p.title}" onclick="App.openPolicyModal('${p.id}')">View Policy</button>
        </div>
      `).join('');
    }

    // Render Learning Modules
    const learnContainer = document.getElementById("learningGrid");
    if (learnContainer) {
      learnContainer.innerHTML = LEARNING_MODULES.map(m => `
        <div class="learning-card" tabindex="0" role="article" aria-label="${m.title}">
          <div class="learning-banner">
            ${m.banner}
            <span class="learning-tag">${m.tag}</span>
          </div>
          <div class="learning-content">
            <div class="learning-title">${m.title}</div>
            <div>
              <div class="progress-bar-box" role="progressbar" aria-valuenow="${m.progress}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar-fill" style="width: ${m.progress}%;"></div>
              </div>
              <div class="progress-text">
                <span>⏱️ ${m.duration}</span>
                <span>${m.progress}%</span>
              </div>
            </div>
            <button class="learning-btn" aria-label="Start learning ${m.title}" onclick="App.openLearningModal('${m.id}')">Start Learning</button>
          </div>
        </div>
      `).join('');
    }
  },

  openPolicyModal(policyId) {
    const p = POLICIES_DATA.find(item => item.id === policyId);
    if (!p) return;

    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:2rem;">${p.icon}</span>
        <h3 class="modal-title">${p.title}</h3>
      </div>
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6; margin-top:10px;">
        ${p.fullContent}
      </div>
      <button class="learning-btn" style="margin-top:14px;" onclick="WellbeingModule.closeModal()">Close Document</button>
    `;

    modal.classList.add("active");
  },

  openLearningModal(moduleId) {
    const m = LEARNING_MODULES.find(item => item.id === moduleId);
    if (!m) return;

    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:2.2rem;">${m.banner}</span>
        <div>
          <h3 class="modal-title">${m.title}</h3>
          <span style="font-size:0.75rem; color:var(--primary-teal); font-weight:700;">${m.tag} • ${m.duration}</span>
        </div>
      </div>
      <div style="font-size:0.92rem; color:var(--text-main); line-height:1.6; margin-top:10px;">
        <p>${m.content}</p>
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
    `;

    modal.classList.add("active");
  },

  scrollToLearningSection() {
    const el = document.getElementById("learningWellbeingSection");
    const container = document.querySelector(".left-dashboard-panel");
    if (el && container) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add("highlight-pulse");
      setTimeout(() => el.classList.remove("highlight-pulse"), 3000);
    }
    this.openLearningModal('mental-health');
  },

  setupEventListeners() {
    const input = document.getElementById("chatInput");
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage();
        }
      });
    }
  },

  sendMessage() {
    const input = document.getElementById("chatInput");
    if (input && input.value.trim()) {
      const val = input.value.trim();
      input.value = "";
      ChatEngine.handleUserInput(val);
    }
  }
};

window.onload = () => {
  App.init();
};
