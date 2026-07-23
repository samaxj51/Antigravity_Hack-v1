/* LISTEN360 MAIN APPLICATION CONTROLLER */

const App = {
  token: null,
  user: null,
  currentRole: "employee",
  theme: "light",

  init() {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      document.getElementById("ssoLoginOverlay").style.display = "flex";
      return;
    }

    this.token = savedToken;
    this.user = JSON.parse(savedUser);
    
    // Hide SSO screen
    document.getElementById("ssoLoginOverlay").style.display = "none";
    document.getElementById("mockIdpModal").style.display = "none";

    // Update user profile UI
    this.updateUserProfileUI();

    // Initialize modules
    this.renderLeftDashboard();
    this.animateMetrics();
    ChatEngine.init();
    DashboardModule.init();
    this.setupEventListeners();
  },

  updateUserProfileUI() {
    const avatar = document.querySelector(".user-avatar");
    const nameSpan = document.querySelector(".user-profile-badge span");
    const roleSwitcher = document.querySelector(".role-switcher");

    if (this.user) {
      if (avatar) avatar.innerText = this.user.role === "investigator" ? "AR" : "JS";
      if (nameSpan) nameSpan.innerText = this.user.role === "investigator" ? "Alex Rogers" : "Jordan Smith";

      // If employee, disable/hide Investigator Switcher for demonstration, or restrict role switching
      if (roleSwitcher) {
        if (this.user.role === "employee") {
          this.switchRole("employee");
          document.getElementById("roleBtnInvestigator").style.opacity = "0.5";
          document.getElementById("roleBtnInvestigator").style.cursor = "not-allowed";
          document.getElementById("roleBtnInvestigator").title = "Access Restricted: Requires Investigator SSO login";
        } else {
          this.switchRole("investigator");
          document.getElementById("roleBtnInvestigator").style.opacity = "1";
          document.getElementById("roleBtnInvestigator").style.cursor = "pointer";
        }
      }
    }
  },

  startSSO() {
    const ssoOverlay = document.getElementById("ssoLoginOverlay");
    const idpOverlay = document.getElementById("mockIdpModal");
    
    ssoOverlay.style.display = "none";
    idpOverlay.style.display = "flex";
  },

  async completeSSO(persona) {
    try {
      const response = await fetch("/api/auth/sso-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona })
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        this.init();
      } else {
        alert("SSO authentication failed");
      }
    } catch (err) {
      console.error("SSO Error:", err);
      // Local fallback for offline/development if server is not running
      const dummyUser = persona === "investigator" ? { name: "Alex Rogers", role: "investigator" } : { name: "Jordan Smith", role: "employee" };
      localStorage.setItem("token", "dummy-jwt-token");
      localStorage.setItem("user", JSON.stringify(dummyUser));
      this.init();
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.token = null;
    this.user = null;
    document.getElementById("ssoLoginOverlay").style.display = "flex";
  },

  animateMetrics() {
    // Count-up animation for 3 metrics cards
    const animateVal = (id, start, end, duration, suffix = "") => {
      const obj = document.getElementById(id);
      if (!obj) return;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = progress * (end - start) + start;
        const formatted = (end % 1 === 0 ? Math.floor(currentVal) : currentVal.toFixed(1));
        obj.innerHTML = formatted + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    setTimeout(() => {
      animateVal("metricValSafety", 0, 96.4, 1400, "%");
      animateVal("metricValTime", 0, 3.8, 1000, " Days");
      animateVal("metricValPrograms", 0, 14, 800, " Programs");
    }, 200);
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

window.App = App;

window.onload = () => {
  App.init();
};
