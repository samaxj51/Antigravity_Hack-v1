/* LISTEN360 INVESTIGATOR DASHBOARD & ANALYTICS */

const DashboardModule = {
  activeFilterCategory: "all",
  activeFilterRisk: "all",
  activeFilterStatus: "all",
  searchTerm: "",

  init() {
    this.renderMetrics();
    this.renderCharts();
    this.renderCasesTable();
  },

  renderMetrics() {
    const totalCases = INITIAL_SAMPLE_CASES.length;
    const newCases = INITIAL_SAMPLE_CASES.filter(c => c.status === "Submitted" || c.status === "New").length;
    const highRisk = INITIAL_SAMPLE_CASES.filter(c => c.risk === "High" || c.risk === "Critical").length;
    const anonRatio = Math.round((INITIAL_SAMPLE_CASES.filter(c => c.anonymous).length / totalCases) * 100);

    const container = document.getElementById("invMetricsGrid");
    if (!container) return;

    container.innerHTML = `
      <div class="inv-metric-card">
        <div class="inv-metric-num">${totalCases}</div>
        <div class="inv-metric-lbl">Total Cases</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num" style="color:var(--primary-teal);">${newCases}</div>
        <div class="inv-metric-lbl">New This Week</div>
      </div>
      <div class="inv-metric-card">
        <div class="inv-metric-num" style="color:var(--color-critical);">${highRisk}</div>
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
        <div class="inv-metric-num" style="color:var(--color-success);">${anonRatio}%</div>
        <div class="inv-metric-lbl">Anonymous Ratio</div>
      </div>
    `;
  },

  renderCharts() {
    this.drawVolumeLineChart();
    this.drawCategoryDonutChart();
  },

  drawVolumeLineChart() {
    const canvas = document.getElementById("volumeChartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 200;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(31, 122, 140, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (height / 4) * i - 20;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    const points = [12, 18, 15, 26, 32, 28, 42];
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const stepX = (width - 60) / (points.length - 1);
    const maxY = 50;

    // Gradient area
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(31, 122, 140, 0.3)");
    gradient.addColorStop(1, "rgba(31, 122, 140, 0.0)");

    ctx.beginPath();
    points.forEach((val, idx) => {
      const x = 40 + idx * stepX;
      const y = height - 30 - (val / maxY) * (height - 50);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineTo(40 + (points.length - 1) * stepX, height - 30);
    ctx.lineTo(40, height - 30);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((val, idx) => {
      const x = 40 + idx * stepX;
      const y = height - 30 - (val / maxY) * (height - 50);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#1F7A8C";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Points
    points.forEach((val, idx) => {
      const x = 40 + idx * stepX;
      const y = height - 30 - (val / maxY) * (height - 50);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#8ECDF0";
      ctx.fill();
      ctx.strokeStyle = "#1F7A8C";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "gray";
      ctx.font = "11px 'Plus Jakarta Sans'";
      ctx.fillText(labels[idx], x - 10, height - 10);
    });
  },

  drawCategoryDonutChart() {
    const canvas = document.getElementById("categoryChartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 200;

    const slices = [
      { label: "Workplace Behaviour", value: 32, color: "#1F7A8C" },
      { label: "Bullying & Harassment", value: 25, color: "#D97706" },
      { label: "Discrimination", value: 15, color: "#8ECDF0" },
      { label: "Ethics", value: 12, color: "#2D6A4F" },
      { label: "Retaliation", value: 8, color: "#9333EA" },
      { label: "Well-being", value: 8, color: "#A8D5BA" }
    ];

    const centerX = width / 3.2;
    const centerY = height / 2;
    const radius = 65;
    const innerRadius = 40;

    let startAngle = 0;
    slices.forEach(slice => {
      const sliceAngle = (slice.value / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    let legendY = 25;
    slices.forEach(slice => {
      ctx.fillStyle = slice.color;
      ctx.fillRect(width / 1.7, legendY, 12, 12);
      
      ctx.fillStyle = "gray";
      ctx.font = "11px 'Plus Jakarta Sans'";
      ctx.fillText(`${slice.label} (${slice.value}%)`, width / 1.7 + 20, legendY + 10);
      legendY += 26;
    });
  },

  renderCasesTable() {
    const tbody = document.getElementById("casesTableBody");
    if (!tbody) return;

    let filtered = INITIAL_SAMPLE_CASES.filter(c => {
      if (this.activeFilterCategory !== "all" && !c.category.includes(this.activeFilterCategory)) return false;
      if (this.activeFilterRisk !== "all" && c.risk.toLowerCase() !== this.activeFilterRisk.toLowerCase()) return false;
      if (this.activeFilterStatus !== "all" && c.status.toLowerCase() !== this.activeFilterStatus.toLowerCase()) return false;
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        return c.id.toLowerCase().includes(term) || c.category.toLowerCase().includes(term) || c.narrative.toLowerCase().includes(term);
      }
      return true;
    });

    tbody.innerHTML = filtered.map(c => `
      <tr tabindex="0" onclick="DashboardModule.openCaseDetails('${c.id}')" onkeypress="if(event.key==='Enter') DashboardModule.openCaseDetails('${c.id}')">
        <td><strong>${c.id}</strong></td>
        <td>${c.category}</td>
        <td><span class="risk-badge ${c.risk.toLowerCase()}">${c.risk}</span></td>
        <td>${c.age}</td>
        <td><span class="status-badge ${c.status.toLowerCase().includes('investigation') ? 'investigation' : c.status.toLowerCase().includes('resolved') ? 'resolved' : 'new'}">${c.status}</span></td>
        <td>${c.anonymous ? '🔒 Anonymous' : '👤 ' + c.owner}</td>
        <td><button class="action-btn-sm" aria-label="View case ${c.id}">View & Manage</button></td>
      </tr>
    `).join('');
  },

  filterCategory(val) {
    this.activeFilterCategory = val;
    this.renderCasesTable();
  },

  filterRisk(val) {
    this.activeFilterRisk = val;
    this.renderCasesTable();
  },

  filterStatus(val) {
    this.activeFilterStatus = val;
    this.renderCasesTable();
  },

  handleSearch(val) {
    this.searchTerm = val;
    this.renderCasesTable();
  },

  openCaseDetails(caseId) {
    const item = INITIAL_SAMPLE_CASES.find(c => c.id === caseId);
    if (!item) return;

    const modal = document.getElementById("generalModal");
    const content = document.getElementById("modalInnerContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
        <div>
          <h3 class="modal-title">${item.id}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Submitted on ${item.date} • ${item.anonymous ? '🔒 Anonymous Reporter' : '👤 Identified'}</span>
        </div>
        <span class="risk-badge ${item.risk.toLowerCase()}">${item.risk} Risk</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px; margin-top:14px;">
        <div style="background:rgba(31, 122, 140, 0.04); border:1px solid var(--border-color); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal); margin-bottom:4px;">Employee Statement</h4>
          <p style="font-size:0.88rem; color:var(--text-main);">"${item.narrative}"</p>
        </div>

        <div style="background:rgba(168, 213, 186, 0.15); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--primary-teal); margin-bottom:4px;">AI-Generated Case Summary</h4>
          <p style="font-size:0.88rem; color:var(--text-main);">${item.aiSummary}</p>
        </div>

        <div style="background:var(--bg-card); border:1px solid var(--border-accent); padding:14px; border-radius:10px;">
          <h4 style="color:var(--text-main); margin-bottom:6px;">🤖 AI-Assisted Case Routing & Owner Assignment</h4>
          <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
            Recommended Routing: <strong style="color:var(--primary-teal);">Ethics & Workplace Conduct Team</strong>
          </p>
          <div style="display:flex; gap:10px;">
            <select id="caseRoutingSelect" class="filter-select" aria-label="Select Owner" style="flex:1;">
              <option ${item.owner.includes('Investigator A') ? 'selected' : ''}>Investigator A (Ethics Team)</option>
              <option ${item.owner.includes('Compliance') ? 'selected' : ''}>Investigator B (Compliance)</option>
              <option ${item.owner.includes('HR') ? 'selected' : ''}>HR Business Partner</option>
              <option ${item.owner.includes('Legal') ? 'selected' : ''}>Legal & Employee Relations</option>
              <option ${item.owner.includes('MHFA') ? 'selected' : ''}>MHFA / Well-being Team</option>
            </select>
            <button class="action-btn-sm" onclick="DashboardModule.updateCaseOwner('${item.id}')">Reassign Case</button>
          </div>
        </div>

        <div>
          <h4 style="color:var(--text-main); margin-bottom:8px;">Timeline & Investigation Activity</h4>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:0.82rem; border-left:2px solid var(--border-accent); padding-left:12px;">
            ${item.timeline.map(t => `
              <div>
                <strong style="color:var(--primary-teal);">${t.date}</strong> — <strong>${t.title}:</strong> ${t.desc}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="learning-btn" style="flex:1;" onclick="DashboardModule.addNotePrompt('${item.id}')">➕ Add Note</button>
          <button class="learning-btn" style="flex:1; background:var(--primary-teal); color:white;" onclick="DashboardModule.resolveCase('${item.id}')">✅ Close Case</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  updateCaseOwner(caseId) {
    const sel = document.getElementById("caseRoutingSelect");
    if (!sel) return;
    const newOwner = sel.value;
    const item = INITIAL_SAMPLE_CASES.find(c => c.id === caseId);
    if (item) {
      item.owner = newOwner;
      item.timeline.push({
        date: new Date().toLocaleString(),
        title: "Owner Reassigned",
        desc: `Reassigned to ${newOwner} via AI-assisted routing.`
      });
      alert(`Case ${caseId} reassigned to ${newOwner}`);
      this.renderCasesTable();
      this.openCaseDetails(caseId);
    }
  },

  addNotePrompt(caseId) {
    const note = prompt("Enter investigator note:");
    if (note) {
      const item = INITIAL_SAMPLE_CASES.find(c => c.id === caseId);
      if (item) {
        item.timeline.push({
          date: new Date().toLocaleString(),
          title: "Investigator Note",
          desc: note
        });
        this.openCaseDetails(caseId);
      }
    }
  },

  resolveCase(caseId) {
    const item = INITIAL_SAMPLE_CASES.find(c => c.id === caseId);
    if (item) {
      item.status = "Resolved";
      item.timeline.push({
        date: new Date().toLocaleString(),
        title: "Case Resolved & Closed",
        desc: "Investigation completed and remedial actions recorded."
      });
      alert(`Case ${caseId} marked as Resolved.`);
      WellbeingModule.closeModal();
      this.renderCasesTable();
      this.renderMetrics();
    }
  }
};
