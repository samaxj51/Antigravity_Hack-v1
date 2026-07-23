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

  getTimeBasedGreeting(name = "Jordan") {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `☀️ Good Morning, ${name}`;
    if (hour >= 12 && hour < 17) return `🌤️ Good Afternoon, ${name}`;
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
    titleEl.innerText = content.title;
    listEl.innerHTML = content.items.map(item => `<div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px 14px; border-radius:12px; font-size:0.8rem; font-weight:600; color:#1E293B;">${item}</div>`).join('');
    modal.style.display = 'flex';
  },

  closeTipsModal() {
    const modal = document.getElementById('wellbeingModal');
    if (modal) modal.style.display = 'none';
  },

  selectMood(mood) {
    const recData = {
      great: {
        ackHeader: "It's great to see you're having a positive day.",
        title: "Today's Wellbeing Reminder",
        text: "Positive days are a great opportunity to build healthy habits that support your long-term wellbeing. Take a few moments to acknowledge your progress, stay hydrated, and maintain a healthy balance throughout your day.",
        pBtn: "🤖 Talk to AI", sBtn: "🌿 Explore Wellbeing Tips", icon: "☀️",
        bg: "#ECFDF5", border: "#A7F3D0", btnBg: "#059669", actionType: "modal", modalType: "wellbeing"
      },
      okay: {
        ackHeader: "😊 Thanks for checking in.",
        title: "Productivity Guidance",
        text: "Here are a few productivity tips to help you have a focused day.",
        pBtn: "View Productivity Tips ⚡", sBtn: "🤖 Talk to AI", icon: "😊",
        bg: "#F0F9FF", border: "#BAE6FD", btnBg: "#0284C7", actionType: "modal", modalType: "productivity"
      },
      stressed: {
        ackHeader: "❤️ Thanks for letting us know.",
        title: "Stress Relief Techniques",
        text: "Here are some quick stress management techniques that may help.",
        pBtn: "Stress Management Tips 🧘", sBtn: "🤖 Talk to AI", icon: "❤️",
        bg: "#FFFBEB", border: "#FDE68A", btnBg: "#D97706", actionType: "modal", modalType: "stress"
      },
      overwhelmed: {
        ackHeader: "🤝 You're not alone.",
        title: "Step-by-Step Support",
        text: "Let's focus on one step at a time. Explore our official workplace policies below or connect confidentially with your AI Companion.",
        pBtn: "🤖 Talk to AI", sBtn: "📚 View Featured Policies", icon: "🤝",
        bg: "#FAF5FF", border: "#E9D5FF", btnBg: "#9333EA", actionType: "chat"
      },
      'need-support': {
        ackHeader: "💙 Thank you for trusting us.",
        title: "Your Wellbeing Matters",
        text: "You are not alone.\n\nOur confidential AI Companion is available whenever you need someone to listen.",
        badges: ["🔒 Confidential", "❤️ Judgment-Free", "🤝 Available Anytime"],
        pBtn: "🤖 Talk to AI", icon: "💙",
        bg: "#EEF2FF", border: "#C7D2FE", btnBg: "#4F46E5", actionType: "chat"
      }
    };

    const data = recData[mood];
    if (!data) return;

    const panel = document.getElementById('integratedRecommendationPanel');
    const resetBtn = document.getElementById('moodResetBtn');

    if (panel) {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(6px)';
      panel.style.display = 'block';
      if (resetBtn) resetBtn.style.display = 'block';

      setTimeout(() => {
        panel.style.backgroundColor = data.bg;
        panel.style.borderColor = data.border;

        const greeting = this.getTimeBasedGreeting("Jordan");
        if (document.getElementById('recTimeGreeting')) {
          document.getElementById('recTimeGreeting').innerText = greeting;
        }

        document.getElementById('recIcon').innerText = data.icon;
        document.getElementById('recAckHeader').innerText = data.ackHeader;
        document.getElementById('recTitle').innerText = data.title;
        document.getElementById('recText').innerText = data.text;

        const badgesEl = document.getElementById('recBadges');
        if (data.badges) {
          badgesEl.innerHTML = data.badges.map(b => `<span style="background:white; border:1px solid rgba(0,0,0,0.1); padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">${b}</span>`).join('');
          badgesEl.style.display = 'flex';
        } else {
          badgesEl.style.display = 'none';
        }

        const pBtn = document.getElementById('recPrimaryBtn');
        pBtn.innerText = data.pBtn;
        pBtn.style.backgroundColor = data.btnBg;
        pBtn.onclick = () => document.getElementById('chatInput').focus();

        const sBtn = document.getElementById('recSecondaryBtn');
        if (data.sBtn) {
          sBtn.innerText = data.sBtn;
          sBtn.style.display = 'inline-block';
          if (mood === 'great') {
            sBtn.onclick = () => this.openTipsModal('wellbeing');
          } else if (mood === 'overwhelmed') {
            sBtn.onclick = () => {
              const sec = document.getElementById('policiesSection') || document.querySelector('.policy-card');
              if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            };
          } else {
            sBtn.onclick = () => document.getElementById('chatInput').focus();
          }
        } else {
          sBtn.style.display = 'none';
        }

        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }, 150);
    }
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
      animateVal("metricValPrograms", 0, 14, 800, " Programs");
      animateVal("metricValConfidential", 0, 100, 1000, "%");
      animateVal("metricValContacts", 0, 12, 1200, " On-Call");
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
