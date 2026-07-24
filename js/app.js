/* LISTEN360 MAIN APPLICATION CONTROLLER */

const App = {
  token: null,
  user: null,
  currentRole: "employee",
  theme: "light",

  init() {
    // Check if token exists in localStorage; if not, initialize default employee persona
    let savedToken = localStorage.getItem("token");
    let savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      const defaultUser = { name: "Jordan Smith", role: "employee" };
      localStorage.setItem("token", "dummy-jwt-token");
      localStorage.setItem("user", JSON.stringify(defaultUser));
      savedToken = "dummy-jwt-token";
      savedUser = JSON.stringify(defaultUser);
    }

    this.token = savedToken;
    this.user = JSON.parse(savedUser);

    // Handle futuristic splash screen display (1 second delay on page load/refresh)
    const splashLoader = document.getElementById("appSplashLoader");
    if (splashLoader) {
      setTimeout(() => {
        splashLoader.classList.add("fade-out");
        setTimeout(() => {
          splashLoader.style.display = "none";
        }, 400);
      }, 1000);
    }

    // Hide SSO screen
    const ssoOverlay = document.getElementById("ssoLoginOverlay");
    const idpModal = document.getElementById("mockIdpModal");
    if (ssoOverlay) ssoOverlay.style.display = "none";
    if (idpModal) idpModal.style.display = "none";

    // Update user profile UI
    this.updateUserProfileUI();

    // Initialize modules
    this.renderLeftDashboard();
    this.updateHeroGreeting();
    ChatEngine.init();
    DashboardModule.init();
    this.setupEventListeners();
  },

  updateUserProfileUI() {
    const avatar = document.querySelector(".user-avatar");
    const nameSpan = document.querySelector(".user-profile-badge span");

    if (this.user) {
      const isInv = this.user.role === "investigator";
      if (avatar) avatar.innerText = isInv ? "AR" : "JS";
      if (nameSpan) nameSpan.innerText = isInv ? "Alex Rogers" : "Jordan Smith";

      // Default view based on logged-in role
      if (isInv) {
        this.switchRole("investigator");
      } else {
        this.switchRole("employee");
      }
    }
    this.updateHeroGreeting();
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
        App.showToast("SSO authentication failed", 'error');
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

  updateHeroGreeting() {
    const titleEl = document.getElementById("heroGreetingTitle");
    const dateSublineEl = document.getElementById("heroDateSubline");
    const timeNudgeTextEl = document.getElementById("heroTimeNudgeText");

    const userName = (this.user && this.user.name) ? this.user.name : "Jordan Smith";
    const hour = new Date().getHours();

    let timeGreeting = "👋 Welcome";
    let nudgeMsg = "Pace your priorities today and remember to take breather breaks.";

    if (hour >= 5 && hour < 12) {
      timeGreeting = `🌅 Good Morning, ${userName}`;
      nudgeMsg = "Start your workday with clarity and focus. Take short breaks to maintain momentum.";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = `👋 Good Afternoon, ${userName}`;
      nudgeMsg = "Pace your afternoon priorities and stay hydrated throughout the day.";
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = `🌆 Good Evening, ${userName}`;
      nudgeMsg = "Wind down your workday smoothly and protect your personal evening rest time.";
    } else {
      timeGreeting = `🌙 Good Evening, ${userName}`;
      nudgeMsg = "Working late? Remember to prioritize self-care and disconnect when ready.";
    }

    if (titleEl) titleEl.innerText = timeGreeting;

    if (dateSublineEl) {
      const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = new Date().toLocaleDateString('en-US', options).toUpperCase();
      dateSublineEl.innerText = `📅 ${formattedDate}`;
    }

    if (timeNudgeTextEl) timeNudgeTextEl.innerText = nudgeMsg;
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
    // Check permission for Investigator tab
    if (role === "investigator" && (!this.user || this.user.role !== "investigator")) {
      this.showInvestigatorAccessRestrictedModal();
      return;
    }

    this.currentRole = role;
    const empContainer = document.getElementById("employeeView");
    const invContainer = document.getElementById("investigatorView");
    const repContainer = document.getElementById("reportingView");
    const empBtn = document.getElementById("roleBtnEmployee");
    const invBtn = document.getElementById("roleBtnInvestigator");
    const repBtn = document.getElementById("roleBtnReporting");

    empContainer.style.display = role === "employee" ? "flex" : "none";
    invContainer.style.display = role === "investigator" ? "flex" : "none";
    repContainer.style.display = role === "reporting" ? "flex" : "none";

    [empBtn, invBtn, repBtn].forEach(btn => {
      if (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-checked", "false");
      }
    });

    if (role === "employee" && empBtn) {
      empBtn.classList.add("active");
      empBtn.setAttribute("aria-checked", "true");
    } else if (role === "investigator" && invBtn) {
      invBtn.classList.add("active");
      invBtn.setAttribute("aria-checked", "true");
      DashboardModule.renderCharts();
    } else if (role === "reporting" && repBtn) {
      repBtn.classList.add("active");
      repBtn.setAttribute("aria-checked", "true");
      ReportingModule.init();
    }
  },

  showInvestigatorAccessRestrictedModal() {
    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) {
      App.showToast("This area is exclusively for investigators. Please login with your investigator login credentials.", 'warning');
      return;
    }

    content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="text-align:center; padding:10px 0;">
        <div style="font-size:3rem; margin-bottom:10px;">🔒</div>
        <h3 style="font-size:1.2rem; font-weight:800; color:#E63946; margin:0 0 10px 0;">Access Restricted</h3>
        <p style="font-size:0.92rem; color:var(--text-main); line-height:1.5; margin-bottom:16px;">
          This area is exclusively for investigators.<br/>
          <strong>Please login with your investigator login credentials.</strong>
        </p>
        <div style="background:rgba(230, 57, 70, 0.08); border:1px solid #E63946; border-radius:8px; padding:12px; font-size:0.8rem; color:var(--text-muted); margin-bottom:20px; text-align:left;">
          ℹ️ Logged in as: <strong>${this.user ? this.user.name : 'Jordan Smith'} (Employee)</strong>.<br/>
          To access investigator cases, sign out and login with investigator credentials.
        </div>
        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="chat-opt-btn" style="background:var(--bg-panel-left); border:1px solid var(--border-color); color:var(--text-main); padding:8px 16px;" onclick="WellbeingModule.closeModal()">Cancel</button>
          <button class="chat-opt-btn" style="background:#E63946; color:#FFF; font-weight:800; border:none; padding:8px 18px;" onclick="WellbeingModule.closeModal(); App.logout();">Sign Out & Switch to Investigator SSO</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
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
            <button class="chat-opt-btn" onclick="App.showToast('Correct! Empathetic listening without judgement builds psychological safety.', 'success')">A) Offer empathetic listening and share listen360 support resources.</button>
            <button class="chat-opt-btn" onclick="App.showToast('Try again. Immediate reporting is best done with consent or through confidential channels.', 'warning')">B) Dismiss the concern as temporary stress.</button>
          </div>
        </div>
      </div>
      <button class="learning-btn" style="margin-top:14px;" onclick="WellbeingModule.closeModal()">Complete Module</button>
    `;

    modal.classList.add("active");
  },

  getTimeBasedGreeting(name = "Jordan") {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `🌅 Good Morning, ${name}`;
    if (hour >= 12 && hour < 17) return `👋 Good Afternoon, ${name}`;
    if (hour >= 17 && hour < 21) return `🌆 Good Evening, ${name}`;
    return `🌙 Good Evening, ${name}`;
  },

  openTipsModal(type) {
    const modal = document.getElementById('wellbeingModal');
    const titleEl = document.getElementById('modalTitle');
    const listEl = document.getElementById('modalItems');
    if (!modal) return;

    const data = {
      wellbeing: {
        title: "🌿 Positive Wellbeing & Healthy Habits",
        items: [
          "🌟 Gratitude Practice: Take 30 seconds to send a quick thank-you note to a teammate.",
          "💧 Hydration & Reset: Drink a full glass of water and take a 5-minute walking breather.",
          "🎯 Energy Pacing: Use high-energy windows for your most important creative priorities.",
          "🧘 Mindful Transition: Pause for 3 deep breaths between meetings to refresh clarity.",
          "🌱 Work-Life Boundaries: Set a clear log-off time to safeguard your evening personal time.",
          "🤝 Positive Connections: Take 5 minutes to have an informal check-in with a colleague."
        ]
      },
      productivity: {
        title: "⚡ Productivity Tips",
        items: [
          "🎯 Plan your three most important tasks first.",
          "⏰ Try the Pomodoro technique (25 minutes work, 5 minutes break).",
          "📴 Turn off unnecessary notifications.",
          "🚶 Take a two-minute stretch every hour.",
          "📝 Finish one task before starting another.",
          "💧 Stay hydrated throughout the day.",
          "📅 Block focus time on your calendar.",
          "📧 Avoid checking email continuously."
        ]
      },
      stress: {
        title: "🧘 Quick Stress Management Techniques",
        items: [
          "🌬 Take five slow deep breaths.",
          "🧘 Try a two-minute mindfulness exercise.",
          "🚶 Walk away from your desk for five minutes.",
          "💧 Drink a glass of water.",
          "🎵 Listen to calming music.",
          "📵 Step away from notifications for a few minutes.",
          "🤖 If you're still feeling stressed, talk to your confidential AI Companion."
        ]
      },
      support: {
        title: "🤝 Workplace Support Resources",
        items: [
          "📚 Managing Workload & Priorities Guide",
          "❤️ Employee Wellbeing & Mental Health Guide",
          "🧘 Mental Health Resources",
          "📞 Employee Assistance Program (EAP) Hotline",
          "📖 Time Management Guide",
          "🎥 Short Wellbeing Videos",
          "💡 Tips for Managing Burnout"
        ]
      }
    };

    const content = data[type] || data.productivity;
    if (titleEl) titleEl.innerText = content.title;
    if (listEl) listEl.innerHTML = content.items.map(item => `<div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px 14px; border-radius:12px; font-size:0.8rem; font-weight:600; color:#1E293B;">${item}</div>`).join('');
    modal.style.display = 'flex';
  },

  closeTipsModal() {
    const modal = document.getElementById('wellbeingModal');
    if (modal) modal.style.display = 'none';
  },

  selectMood(mood) {
    if (mood === 'reset') {
      const panel = document.getElementById('integratedRecommendationPanel');
      const resetBtn = document.getElementById('moodResetBtn');
      const badge = document.getElementById('checkInStatusBadge');
      if (panel) panel.style.display = 'none';
      if (resetBtn) resetBtn.style.display = 'none';
      if (badge) badge.style.display = 'none';
      document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.style.transform = 'none';
        btn.style.boxShadow = 'none';
        btn.style.borderColor = 'var(--border-accent)';
      });
      return;
    }

    const recData = {
      great: {
        ackHeader: "It's great to see you're having a positive day!",
        title: "Today's Wellbeing Balance",
        text: "Positive days are a wonderful opportunity to build healthy habits that support your long-term mental clarity and productivity. Take a moment to acknowledge your progress and maintain balance.",
        supportInfo: "💡 <strong>Corporate Wellness Tip:</strong> Take 30 seconds to send a recognition note to a teammate or record a positive milestone in your personal journal.",
        pBtn: "🤖 Talk to AI Companion",
        sBtn: "🌿 Explore Wellbeing Tips",
        icon: "☀️",
        bg: "#ECFDF5", border: "#A7F3D0", btnBg: "#059669",
        pAction: () => { const input = document.getElementById('chatInput'); if (input) { input.value = "Hi, I'm feeling great today! How can I maintain this positive energy?"; input.focus(); } },
        sAction: () => this.openTipsModal('wellbeing')
      },
      okay: {
        ackHeader: "😊 Thanks for checking in today.",
        title: "Productivity Guidance & Energy Pacing",
        text: "Having an 'okay' day is completely normal. Here are some actionable productivity tips to help you stay focused, organized, and energized throughout your tasks.",
        supportInfo: "💡 <strong>Focus Insight:</strong> Utilizing 25-minute Pomodoro focus blocks with 5-minute breather intervals optimizes daily output and reduces cognitive fatigue.",
        pBtn: "⚡ View Productivity Tips",
        sBtn: "🤖 Talk to AI Companion",
        icon: "😊",
        bg: "#F0F9FF", border: "#BAE6FD", btnBg: "#0284C7",
        pAction: () => this.openTipsModal('productivity'),
        sAction: () => { const input = document.getElementById('chatInput'); if (input) { input.value = "I'm feeling okay today. What are some good strategies to stay focused?"; input.focus(); } }
      },
      stressed: {
        ackHeader: "❤️ Thank you for letting us know.",
        title: "Stress Relief & Workload Management",
        text: "Workplace stress can accumulate quickly. Explore quick stress management techniques or chat confidentially with your AI companion to decompress.",
        supportInfo: "💡 <strong>Workplace Support:</strong> Trained peer MHFA Responders and confidential EAP resources are available around the clock if you need an empathetic listener.",
        pBtn: "🧘 Stress Relief Techniques",
        sBtn: "🤖 Talk to AI Companion",
        icon: "❤️",
        bg: "#FFFBEB", border: "#FDE68A", btnBg: "#D97706",
        pAction: () => this.openTipsModal('stress'),
        sAction: () => { const input = document.getElementById('chatInput'); if (input) { input.value = "I'm feeling a bit stressed today with my workload. Can you help me break down my priorities?"; input.focus(); } }
      },
      overwhelmed: {
        ackHeader: "🤝 You're not alone. Let's take it one step at a time.",
        title: "Step-by-Step Support & Guidance",
        text: "Feeling overwhelmed can happen when priorities stack up. You can explore official workplace policies below or talk confidentially with our AI Companion.",
        supportInfo: "💡 <strong>Corporate Protection Assurance:</strong> Company policy guarantees 100% zero-retaliation and complete confidentiality when raising workload concerns or seeking assistance.",
        badges: ["🔒 100% Confidential", "🛡️ Zero Retaliation", "🤝 Safe Environment"],
        pBtn: "🤖 Talk to AI Companion",
        sBtn: "📚 View Featured Policies",
        icon: "🤝",
        bg: "#FAF5FF", border: "#E9D5FF", btnBg: "#9333EA",
        pAction: () => { const input = document.getElementById('chatInput'); if (input) { input.value = "I'm feeling overwhelmed right now. Can we talk through things step by step?"; input.focus(); } },
        sAction: () => {
          const sec = document.getElementById('policiesSection') || document.querySelector('.policy-card');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        }
      },
      'need-support': {
        ackHeader: "💙 Thank you for trusting listen360.",
        title: "Confidential Support Resources Available",
        text: "You are not alone. Our confidential AI Companion is available 24×7 whenever you need someone to listen, or you can connect directly with a qualified Mental Health First Aider.",
        supportInfo: "💡 <strong>Confidentiality Notice:</strong> All interactions are 256-bit encrypted. Your identity and conversation remain strictly private and protected.",
        badges: ["🔒 Confidential", "❤️ Judgment-Free", "🤝 Available Anytime"],
        pBtn: "🤖 Talk to AI Companion",
        sBtn: "🤝 Connect with MHFA Responder",
        icon: "💙",
        bg: "#EEF2FF", border: "#C7D2FE", btnBg: "#4F46E5",
        pAction: () => { const input = document.getElementById('chatInput'); if (input) { input.value = "I need some personal support right now. Can you guide me through available resources?"; input.focus(); } },
        sAction: () => WellbeingModule.openMHFAConnectModal()
      }
    };

    const data = recData[mood];
    if (!data) return;

    // Highlight selected mood button
    document.querySelectorAll('.mood-btn').forEach(btn => {
      if (btn.getAttribute('data-mood') === mood) {
        btn.style.transform = 'scale(1.05)';
        btn.style.borderColor = 'var(--primary-teal)';
        btn.style.boxShadow = '0 0 0 2px var(--primary-teal)';
      } else {
        btn.style.transform = 'none';
        btn.style.boxShadow = 'none';
        btn.style.borderColor = 'var(--border-accent)';
      }
    });

    const panel = document.getElementById('integratedRecommendationPanel');
    const resetBtn = document.getElementById('moodResetBtn');
    const badge = document.getElementById('checkInStatusBadge');

    if (panel) {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(6px)';
      panel.style.display = 'block';
      if (resetBtn) resetBtn.style.display = 'block';
      if (badge) badge.style.display = 'inline-block';

      setTimeout(() => {
        panel.style.backgroundColor = data.bg;
        panel.style.borderColor = data.border;

        const userName = (this.user && this.user.name) ? this.user.name : "Jordan Smith";
        const greeting = this.getTimeBasedGreeting(userName);
        if (document.getElementById('recTimeGreeting')) {
          document.getElementById('recTimeGreeting').innerText = greeting;
        }

        if (document.getElementById('recIcon')) document.getElementById('recIcon').innerText = data.icon;
        if (document.getElementById('recAckHeader')) document.getElementById('recAckHeader').innerText = data.ackHeader;
        if (document.getElementById('recTitle')) document.getElementById('recTitle').innerText = data.title;
        if (document.getElementById('recText')) document.getElementById('recText').innerText = data.text;

        const infoEl = document.getElementById('recSupportInfo');
        if (infoEl) {
          infoEl.innerHTML = data.supportInfo;
          infoEl.style.display = 'block';
        }

        const badgesEl = document.getElementById('recBadges');
        if (badgesEl) {
          if (data.badges) {
            badgesEl.innerHTML = data.badges.map(b => `<span style="background:white; border:1px solid rgba(0,0,0,0.1); padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">${b}</span>`).join('');
            badgesEl.style.display = 'flex';
          } else {
            badgesEl.style.display = 'none';
          }
        }

        const pBtn = document.getElementById('recPrimaryBtn');
        if (pBtn) {
          pBtn.innerText = data.pBtn;
          pBtn.style.backgroundColor = data.btnBg;
          pBtn.onclick = data.pAction;
        }

        const sBtn = document.getElementById('recSecondaryBtn');
        if (sBtn) {
          if (data.sBtn) {
            sBtn.innerText = data.sBtn;
            sBtn.style.display = 'inline-block';
            sBtn.onclick = data.sAction;
          } else {
            sBtn.style.display = 'none';
          }
        }

        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }, 150);
    }
  },

  setupEventListeners() {
    const input = document.getElementById("chatInput");
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.sendMessage();
        }
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
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
  },

  showToast(message, type = 'info', duration = 4000) {
    try {
      let container = document.getElementById("toastContainer");
      if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
      }

      const icons = {
        success: "✅",
        info: "ℹ️",
        warning: "⚠️",
        error: "❌"
      };

      const toast = document.createElement("div");
      toast.className = `toast-notification ${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || "ℹ️"}</span>
        <div class="toast-content">${message}</div>
        <button class="toast-close-btn" onclick="this.parentElement.remove()" aria-label="Close Toast">✕</button>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => {
          if (toast.parentElement) toast.remove();
        }, 300);
      }, duration);
    } catch (err) {
      console.warn("⚠️ Toast display fallback:", message, err);
    }
  }
};

window.App = App;

window.onload = () => {
  App.init();
};

