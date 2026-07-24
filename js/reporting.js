/* LISTEN360 REPORTING DASHBOARD - MULTI-LEVEL ORGANIZATIONAL ANALYTICS */

const ReportingModule = {
    activeLevel: "hr",
    selectedSiteId: "nyc",
    selectedDivisionId: "eng",
    selectedRegionId: "na",

    // ---------- FORMATTING HELPERS ----------
    fmtPct(val) {
        return Number(val).toFixed(1);
    },

    fmtNum(val) {
        return Number(val).toLocaleString();
    },

    getRefreshedLabel() {
        return new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },

    // Count-up animation for a KPI tile — mirrors the pattern already used on the Employee homepage
    animateValue(id, end, duration = 900, suffix = "", decimals = 0) {
        const el = document.getElementById(id);
        if (!el) return;
        let startTs = null;
        const step = (ts) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            const current = progress * end;
            const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
            el.textContent = formatted + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    },

    init() {
        this.switchLevel(this.activeLevel);
    },

    switchLevel(level) {
        this.activeLevel = level;

        document.querySelectorAll(".report-level-tab").forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });
        const activeTab = document.getElementById(`repTab-${level}`);
        if (activeTab) {
            activeTab.classList.add("active");
            activeTab.setAttribute("aria-selected", "true");
        }

        this.render();
    },

    render() {
        if (this.activeLevel === "hr") this.renderHRHead();
        else if (this.activeLevel === "regional") this.renderRegionalHeadView();
        else if (this.activeLevel === "divisional") this.renderDivisionalHeadView();
        else if (this.activeLevel === "site") this.renderSiteHeadView();
    },

    // ---------- CHART HOVER TOOLTIP ----------
    ensureTooltipEl() {
        let el = document.getElementById("chartTooltipEl");
        if (!el) {
            el = document.createElement("div");
            el.id = "chartTooltipEl";
            el.className = "chart-tooltip";
            document.body.appendChild(el);
        }
        return el;
    },

    showTooltip(clientX, clientY, html) {
        const el = this.ensureTooltipEl();
        el.innerHTML = html;
        el.style.left = (clientX + 14) + "px";
        el.style.top = (clientY + 14) + "px";
        el.style.opacity = "1";
    },

    hideTooltip() {
        const el = document.getElementById("chartTooltipEl");
        if (el) el.style.opacity = "0";
    },

    // Wires hover detection onto a canvas given hit regions — {shape:'rect', x,y,w,h, html} or {shape:'arc', cx,cy,innerR,outerR,startAngle,endAngle, html}
    attachChartHover(canvas, regions) {
        if (!canvas) return;
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            const hit = regions.find(r => {
                if (r.shape === "arc") {
                    const dx = x - r.cx, dy = y - r.cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < r.innerR || dist > r.outerR) return false;
                    let angle = Math.atan2(dy, dx);
                    while (angle < r.startAngle) angle += Math.PI * 2;
                    return angle >= r.startAngle && angle <= r.endAngle;
                }
                return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
            });

            if (hit) {
                this.showTooltip(e.clientX, e.clientY, hit.html);
                canvas.style.cursor = "pointer";
            } else {
                this.hideTooltip();
                canvas.style.cursor = "default";
            }
        };
        canvas.onmouseleave = () => {
            this.hideTooltip();
            canvas.style.cursor = "default";
        };
    },


    // ---------- AUTO-GENERATED HEADLINE INSIGHTS ----------
    // Renders the insight callout markup — pass in the sentence generated from live data
    renderInsightCallout(sentence) {
        return `
      <div class="insight-callout">
        <span class="insight-callout-icon">💡</span>
        <div class="insight-callout-body">
          <span class="insight-callout-label">AI Headline Insight</span>
          ${sentence}
        </div>
      </div>
    `;
    },

    generateHRInsight() {
        const regions = REPORTING_DATA.regions;
        const fastest = regions.reduce((a, b) => a.avgResolution < b.avgResolution ? a : b);
        const lowestReopen = regions.reduce((a, b) => (REGION_DETAIL_DATA[a.id].reopenedCaseRate < REGION_DETAIL_DATA[b.id].reopenedCaseRate ? a : b));

        if (fastest.id === lowestReopen.id) {
            return `<strong>${fastest.name}</strong> has the fastest resolution time (${fastest.avgResolution}d) and the lowest reopened-case rate (${REGION_DETAIL_DATA[fastest.id].reopenedCaseRate}%) company-wide this quarter.`;
        }
        return `<strong>${fastest.name}</strong> leads on resolution speed (${fastest.avgResolution}d), while <strong>${lowestReopen.name}</strong> holds the lowest reopened-case rate (${REGION_DETAIL_DATA[lowestReopen.id].reopenedCaseRate}%) company-wide this quarter.`;
    },

    generateRegionalInsight(region) {
        const sites = REPORTING_DATA.sites.filter(s => s.region === region.name);
        if (sites.length === 0) {
            return `No site-level data is modeled for <strong>${region.name}</strong> yet.`;
        }
        if (sites.length === 1) {
            const only = sites[0];
            return `<strong>${region.name}</strong> currently has one modeled site — <strong>${only.name}</strong> — resolving cases in ${only.avgResolution} days with a ${SITE_DETAIL_DATA[only.id].reopenedCaseRate}% reopened-case rate.`;
        }
        const fastestSite = sites.reduce((a, b) => a.avgResolution < b.avgResolution ? a : b);
        const lowestReopenSite = sites.reduce((a, b) => (SITE_DETAIL_DATA[a.id].reopenedCaseRate < SITE_DETAIL_DATA[b.id].reopenedCaseRate ? a : b));

        if (fastestSite.id === lowestReopenSite.id) {
            return `<strong>${fastestSite.name}</strong> has the fastest resolution time (${fastestSite.avgResolution}d) and the lowest reopened-case rate (${SITE_DETAIL_DATA[fastestSite.id].reopenedCaseRate}%) within ${region.name} this quarter.`;
        }
        return `<strong>${fastestSite.name}</strong> leads ${region.name} on resolution speed (${fastestSite.avgResolution}d), while <strong>${lowestReopenSite.name}</strong> holds the lowest reopened-case rate (${SITE_DETAIL_DATA[lowestReopenSite.id].reopenedCaseRate}%).`;
    },

    generateDivisionalInsight(division, detail, siteMixRows) {
        const orgAvgResolution = REPORTING_DATA.orgWide.avgResolution;
        const vsOrg = division.avgResolution < orgAvgResolution ? "faster than" : (division.avgResolution > orgAvgResolution ? "slower than" : "in line with");
        const topSite = siteMixRows.length ? siteMixRows[0] : null;

        return `<strong>${division.name}</strong> resolves cases ${vsOrg} the company average (${division.avgResolution}d vs ${orgAvgResolution}d org-wide)${topSite ? `, with <strong>${topSite.site}</strong> driving the largest share of its caseload (${topSite.cases} of ${division.cases} cases)` : ""}.`;
    },

    generateSiteInsight(site, detail, caseTypeBreakdown) {
        const orgAvgResolution = REPORTING_DATA.orgWide.avgResolution;
        const orgReopenRate = REPORTING_DATA.orgWide.reopenedCaseRate;
        const vsOrgResolution = site.avgResolution < orgAvgResolution ? "faster than" : (site.avgResolution > orgAvgResolution ? "slower than" : "in line with");
        const reopenFlag = detail.reopenedCaseRate > orgReopenRate ? "above" : "below";
        const topType = caseTypeBreakdown.find(c => c.cases > 0);

        return `<strong>${site.name}</strong> resolves cases ${vsOrgResolution} the company average (${site.avgResolution}d vs ${orgAvgResolution}d), with its reopened-case rate running ${reopenFlag} the org-wide benchmark (${detail.reopenedCaseRate}% vs ${orgReopenRate}%)${topType ? `, and <strong>${topType.type}</strong> as the leading reported category (${topType.cases} cases)` : ""}.`;
    },

    renderHRHead() {
        const container = document.getElementById("reportingContent");
        if (!container) return;
        const o = REPORTING_DATA.orgWide;
        const orgBreakdown = this.aggregateOrgCaseTypeBreakdown();
        const genderBySite = this.computeGenderBySite();
        const tenureAgeKeys = ["New Hire (<1 Yr / Under 30)", "Early Career (1-3 Yrs / 30-40)", "Established (3-7 Yrs / 40-50)", "Tenured (7+ Yrs / 50+)"];
        const tenureAgeSummary = this.aggregateSegmentsAcrossRows(
            this.computeDimensionSplit(orgBreakdown, TENURE_AGE_WEIGHTS_BY_TYPE, tenureAgeKeys),
            tenureAgeKeys
        );
        const allRepeatOffenders = REPORTING_DATA.sites.flatMap(site =>
            (SITE_DETAIL_DATA[site.id].repeatOffenders || []).map(o2 => ({ ...o2, site: site.name }))
        );

        container.innerHTML = `
      <div class="investigator-top-header">
        <div>
          <h2 class="inv-title" style="font-size:1.15rem;">🏢 HR Head / Global Leads — Organization-Wide View</h2>
          <p class="inv-subtitle">Company-wide psychological safety and case management performance, aggregated across all regions, divisions, and sites.</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">🔄 Data refreshed: ${this.getRefreshedLabel()}</p>
        </div>
      </div>

      ${this.renderInsightCallout(this.generateHRInsight())}

      <div class="inv-metrics-grid" style="grid-template-columns:repeat(5, 1fr);">
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="hrKpiTotalCases">0</div>
          <div class="inv-metric-lbl">Total Cases</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="hrKpiIntake">0</div>
          <div class="inv-metric-lbl">Monthly Intake Vol.</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="hrKpiSatisfaction" style="color:var(--color-success);">0%</div>
          <div class="inv-metric-lbl">Post-Investigation Satisfaction</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="hrKpiReopened" style="color:${o.reopenedCaseRate > 4.5 ? 'var(--color-warning)' : 'var(--text-main)'};">0%</div>
          <div class="inv-metric-lbl">Reopened Case Rate</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="hrKpiResolution">0d</div>
          <div class="inv-metric-lbl">Avg Resolution Time</div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card" style="justify-content:center;">
          <div class="chart-card-title"><span>🔒 Anonymous Report Ratio</span></div>
          <div style="display:flex; align-items:baseline; gap:8px;">
            <span style="font-family:var(--font-heading); font-size:2.2rem; font-weight:800; color:var(--primary-teal);">${o.anonymousRatio}%</span>
            <span style="font-size:0.76rem; color:var(--text-muted);">of complaints filed anonymously</span>
          </div>
          <p style="font-size:0.74rem; color:var(--text-muted); margin-top:2px;">High anonymous rates can signal lower organizational trust in the reporting process — worth tracking alongside satisfaction scores.</p>
        </div>
        <div class="chart-card" style="justify-content:center;">
          <div class="chart-card-title"><span>🎓 Manager Training Coverage</span></div>
          <div style="display:flex; align-items:baseline; gap:8px;">
            <span style="font-family:var(--font-heading); font-size:2.2rem; font-weight:800; color:var(--color-success);">${o.trainingCoveragePct}%</span>
            <span style="font-size:0.76rem; color:var(--text-muted);">of site supervisors certified</span>
          </div>
          <p style="font-size:0.74rem; color:var(--text-muted); margin-top:2px;">Certified in conflict resolution and policy compliance across all sites.</p>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>⏳ Case Ageing Distribution</span>
        </div>
        <div class="chart-canvas-box" style="height:150px;">
          <canvas id="hrAgeingBucketCanvas" aria-label="Case Ageing Distribution Chart"></canvas>
        </div>
        ${this.extractBtn('extractAgeingBuckets')}
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>📊 Intake vs. Closure Trend</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">Last 6 Months</span>
        </div>
        <div class="chart-canvas-box" style="height:220px;">
          <canvas id="hrIntakeClosureCanvas" aria-label="Intake vs Closure Trend Chart"></canvas>
        </div>
        ${this.extractBtn('extractIntakeClosureTrend')}
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🗂️ Top Case Categories</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="hrCategoryDonutCanvas" aria-label="Top Case Categories Chart"></canvas>
          </div>
          ${this.extractBtn('extractTopCategories')}
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>📥 Intake Channel Split</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="hrIntakeChannelCanvas" aria-label="Intake Channel Split Chart"></canvas>
          </div>
          ${this.extractBtn('extractIntakeChannelSplit')}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>⚖️ HR-to-Headcount Ratio — All Sites</span>
          <span style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">Headcount per Active Case</span>
        </div>
        <div class="chart-canvas-box" style="height:${REPORTING_DATA.sites.length * 30 + 30}px;">
          <canvas id="hrHeadcountRatioCanvas" aria-label="HR to Headcount Ratio Chart"></canvas>
        </div>
        ${this.extractBtn('extractHeadcountRatio')}
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>⚖️ Actions Taken from Investigations, by Case Type</span>
        </div>
        <div class="chart-canvas-box" style="height:230px;">
          <canvas id="hrActionsBarCanvas" aria-label="Investigation Actions by Case Type Chart"></canvas>
        </div>
        ${this.extractBtn('extractActionsByType')}
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1.2fr;">
        <div class="table-card">
          <h3 style="font-size:0.92rem; font-weight:700; color:var(--text-main);">🔁 Repeat Offender Cases — All Sites</h3>
          <table class="cases-table" aria-label="Repeat Offender Cases">
            <thead>
              <tr><th>Ref</th><th>Site</th><th>Cases</th><th>Categories</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${allRepeatOffenders.map(o2 => `
                <tr>
                  <td><strong>${o2.ref}</strong></td>
                  <td>${o2.site}</td>
                  <td>${o2.casesCount}</td>
                  <td>${o2.categories.join(', ')}</td>
                  <td><span class="status-badge ${o2.status.toLowerCase().includes('investigation') ? 'investigation' : o2.status.toLowerCase().includes('resolved') ? 'resolved' : 'new'}">${o2.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🚻 Breakdown by Gender, per Site</span>
          </div>
          <div class="chart-canvas-box" style="height:${REPORTING_DATA.sites.length * 32 + 30}px;">
            <canvas id="hrGenderBySiteCanvas" aria-label="Breakdown by Gender per Site Chart"></canvas>
          </div>
          ${this.extractBtn('extractGenderBySite')}
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1.2fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>📅 By Tenure and Age Group</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="hrTenureAgeDonutCanvas" aria-label="Cases by Tenure and Age Group Chart"></canvas>
          </div>
          ${this.extractBtn('extractTenureAge')}
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🎖️ Corporate Title / Grade Breakdown, by Case Type</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="hrTitleGradeBarCanvas" aria-label="Corporate Title Breakdown by Case Type Chart"></canvas>
          </div>
          ${this.extractBtn('extractTitleGrade')}
        </div>
      </div>
    `;

        this.animateValue("hrKpiTotalCases", o.totalCases, 900);
        this.animateValue("hrKpiIntake", o.monthlyIntakeVol, 900);
        this.animateValue("hrKpiSatisfaction", o.postInvestigationSatisfaction, 1100, "%", 1);
        this.animateValue("hrKpiReopened", o.reopenedCaseRate, 1100, "%", 1);
        this.animateValue("hrKpiResolution", o.avgResolution, 1000, "d", 1);

        this.drawHorizontalBarChart("hrAgeingBucketCanvas", HR_AGE_BUCKETS.map(b => b.bucket), HR_AGE_BUCKETS.map(b => b.count), ["#2D6A4F", "#1F7A8C", "#C6A15B", "#B0727A"]);
        this.drawComboBarLineChart("hrIntakeClosureCanvas", HR_MONTHLY_TREND.months, HR_MONTHLY_TREND.newCases, HR_MONTHLY_TREND.closedCases, "#8ECDF0", "#1F7A8C", "New Cases", "Closed Cases");
        this.drawDonutChart("hrCategoryDonutCanvas", orgBreakdown.map(c => ({ label: c.type, value: c.cases, color: c.color })));
        this.drawDonutChart("hrIntakeChannelCanvas", INTAKE_CHANNEL_SPLIT.map(c => ({ label: c.channel, value: c.pct, color: c.color })));

        const headcountRatios = REPORTING_DATA.sites.map(s => Math.round(s.headcount / s.cases));
        this.drawHorizontalBarChart("hrHeadcountRatioCanvas", REPORTING_DATA.sites.map(s => s.name), headcountRatios, REPORTING_DATA.sites.map(() => "#1F7A8C"));

        const actionColors = { "Termination": "#B0727A", "Written Warning": "#C6A15B", "Compensation Impact": "#8B7FA8", "Promotion / Career Impact": "#1F7A8C", "Coaching / No Formal Action": "#A8D5BA" };
        this.drawStackedHorizontalBarChart("hrActionsBarCanvas", this.computeDimensionSplit(orgBreakdown, ACTION_WEIGHTS_BY_TYPE, ACTION_TYPES), ACTION_TYPES, actionColors);

        const genderColors = { "Male": "#1F7A8C", "Female": "#C6A15B", "Other": "#A8D5BA" };
        this.drawStackedHorizontalBarChart("hrGenderBySiteCanvas", genderBySite, ["Male", "Female", "Other"], genderColors);

        const tenureAgeColors = { "New Hire (<1 Yr / Under 30)": "#A8D5BA", "Early Career (1-3 Yrs / 30-40)": "#8ECDF0", "Established (3-7 Yrs / 40-50)": "#1F7A8C", "Tenured (7+ Yrs / 50+)": "#155461" };
        this.drawDonutChart("hrTenureAgeDonutCanvas", tenureAgeSummary.map(t => ({ label: t.key, value: t.value, color: tenureAgeColors[t.key] })));

        const titleKeys = ["Individual Contributor", "People Manager", "Director", "VP & Above"];
        const titleColors = { "Individual Contributor": "#8ECDF0", "People Manager": "#1F7A8C", "Director": "#8B7FA8", "VP & Above": "#B0727A" };
        this.drawStackedHorizontalBarChart("hrTitleGradeBarCanvas", this.computeDimensionSplit(orgBreakdown, TITLE_WEIGHTS_BY_TYPE, titleKeys), titleKeys, titleColors);
    },

    // Aggregates every site's own case-type breakdown into one org-wide breakdown (bottom-up, so it always matches the Site Head numbers)
    aggregateOrgCaseTypeBreakdown() {
        const totals = {};
        CASE_TYPES.forEach(ct => totals[ct.type] = 0);
        REPORTING_DATA.sites.forEach(site => {
            const breakdown = this.computeCaseTypeBreakdown(site, SITE_DETAIL_DATA[site.id]);
            breakdown.forEach(b => totals[b.type] += b.cases);
        });
        return CASE_TYPES.map(ct => ({ type: ct.type, color: ct.color, cases: totals[ct.type] })).sort((a, b) => b.cases - a.cases);
    },

    // Sums a segment value across every row of a computeDimensionSplit() result, collapsing per-category rows into one overall distribution
    aggregateSegmentsAcrossRows(rows, segmentKeys) {
        return segmentKeys.map(key => ({
            key,
            value: rows.reduce((sum, row) => sum + (row.segments.find(s => s.key === key)?.value || 0), 0)
        }));
    },

    // For every site, splits its case-type breakdown by gender then collapses that back into one Male/Female/Other total per site
    computeGenderBySite() {
        const genderKeys = ["Male", "Female", "Other"];
        return REPORTING_DATA.sites.map(site => {
            const breakdown = this.computeCaseTypeBreakdown(site, SITE_DETAIL_DATA[site.id]);
            const dimSplit = this.computeDimensionSplit(breakdown, GENDER_WEIGHTS_BY_TYPE, genderKeys);
            const totals = this.aggregateSegmentsAcrossRows(dimSplit, genderKeys);
            return {
                type: site.name,
                total: site.cases,
                segments: totals.map(t => ({ key: t.key, value: t.value }))
            };
        });
    },

    // Renders the small "Extract Line by Line" button shown on each HR Head chart
    extractBtn(fnName) {
        return `<div class="chart-extract-row" style="display:flex; justify-content:flex-end;"><button class="action-btn-sm" onclick="ReportingModule.${fnName}()">📋 Extract Line by Line</button></div>`;
    },

    // Opens the shared modal with the chart's underlying numbers as plain text, one line per data point
    showExtractModal(title, lines) {
        const modal = document.getElementById("generalModal");
        const content = document.getElementById("modalInnerContent");
        if (!modal || !content) return;

        this._lastExtractText = lines.join('\n');

        content.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal" onclick="WellbeingModule.closeModal()">✕</button>
      <h3 class="modal-title">📋 ${title}</h3>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-top:-4px;">Line-by-line data extracted from this chart.</p>
      <pre style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px; font-size:0.8rem; color:var(--text-main); white-space:pre-wrap; max-height:340px; overflow-y:auto; font-family:'Plus Jakarta Sans', monospace; margin:0;">${lines.map(l => this.escapeHtml(l)).join('\n')}</pre>
      <button class="learning-btn" onclick="ReportingModule.copyExtractText()">📋 Copy All to Clipboard</button>
    `;
        modal.classList.add("active");
    },

    copyExtractText() {
        if (!this._lastExtractText) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this._lastExtractText)
                .then(() => {
                    if (typeof App !== 'undefined' && App.showToast) App.showToast("Copied to clipboard!", 'success');
                })
                .catch(() => {
                    if (typeof App !== 'undefined' && App.showToast) App.showToast("Could not copy automatically — please select and copy the text manually.", 'warning');
                });
        } else {
            if (typeof App !== 'undefined' && App.showToast) App.showToast("Clipboard access isn't available here — please select and copy the text manually.", 'warning');
        }
    },

    escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    // Turns rows of {type, total, segments:[{key,value}]} into one readable line per row
    formatStackedLines(rows) {
        return rows.map(r => `${r.type} (Total: ${r.total}) — ${r.segments.map(s => `${s.key}: ${s.value}`).join(', ')}`);
    },

    // ---------- HR HEAD CHART EXTRACT HANDLERS ----------
    extractAgeingBuckets() {
        this.showExtractModal("Case Ageing Distribution", HR_AGE_BUCKETS.map(b => `${b.bucket}: ${b.count} cases`));
    },

    extractIntakeClosureTrend() {
        const lines = HR_MONTHLY_TREND.months.map((m, i) => `${m} — New Cases: ${HR_MONTHLY_TREND.newCases[i]}, Closed Cases: ${HR_MONTHLY_TREND.closedCases[i]}`);
        this.showExtractModal("Intake vs. Closure Trend", lines);
    },

    extractTopCategories() {
        const orgBreakdown = this.aggregateOrgCaseTypeBreakdown();
        const total = orgBreakdown.reduce((s, c) => s + c.cases, 0) || 1;
        const lines = orgBreakdown.map(c => `${c.type}: ${c.cases} cases (${Math.round(c.cases / total * 100)}%)`);
        this.showExtractModal("Top Case Categories", lines);
    },

    extractIntakeChannelSplit() {
        this.showExtractModal("Intake Channel Split", INTAKE_CHANNEL_SPLIT.map(c => `${c.channel}: ${c.pct}%`));
    },

    extractHeadcountRatio() {
        const lines = REPORTING_DATA.sites.map(s => `${s.name}: ${Math.round(s.headcount / s.cases)} employees per active case (Headcount: ${s.headcount.toLocaleString()}, Active Cases: ${s.cases})`);
        this.showExtractModal("HR-to-Headcount Ratio — All Sites", lines);
    },

    extractActionsByType() {
        const orgBreakdown = this.aggregateOrgCaseTypeBreakdown();
        const rows = this.computeDimensionSplit(orgBreakdown, ACTION_WEIGHTS_BY_TYPE, ACTION_TYPES);
        this.showExtractModal("Actions Taken from Investigations, by Case Type", this.formatStackedLines(rows));
    },

    extractGenderBySite() {
        this.showExtractModal("Breakdown by Gender, per Site", this.formatStackedLines(this.computeGenderBySite()));
    },

    extractTenureAge() {
        const orgBreakdown = this.aggregateOrgCaseTypeBreakdown();
        const tenureAgeKeys = ["New Hire (<1 Yr / Under 30)", "Early Career (1-3 Yrs / 30-40)", "Established (3-7 Yrs / 40-50)", "Tenured (7+ Yrs / 50+)"];
        const summary = this.aggregateSegmentsAcrossRows(this.computeDimensionSplit(orgBreakdown, TENURE_AGE_WEIGHTS_BY_TYPE, tenureAgeKeys), tenureAgeKeys);
        this.showExtractModal("By Tenure and Age Group", summary.map(t => `${t.key}: ${t.value} cases`));
    },

    extractTitleGrade() {
        const orgBreakdown = this.aggregateOrgCaseTypeBreakdown();
        const titleKeys = ["Individual Contributor", "People Manager", "Director", "VP & Above"];
        const rows = this.computeDimensionSplit(orgBreakdown, TITLE_WEIGHTS_BY_TYPE, titleKeys);
        this.showExtractModal("Corporate Title / Grade Breakdown, by Case Type", this.formatStackedLines(rows));
    },

    selectDivision(divisionId) {
        this.selectedDivisionId = divisionId;
        this.renderDivisionalHeadView();
    },

    // ---------- DIVISIONAL HEAD (SINGLE-DIVISION DEEP DIVE) VIEW ----------
    // Demo note: shows one division at a time. In production this would be scoped by the logged-in user's security role.
    renderDivisionalHeadView() {
        const container = document.getElementById("reportingContent");
        if (!container) return;

        const division = REPORTING_DATA.divisions.find(d => d.id === this.selectedDivisionId) || REPORTING_DATA.divisions[0];
        const detail = DIVISION_DETAIL_DATA[division.id];
        const caseTypeBreakdown = this.computeCaseTypeBreakdown(division, detail);
        const ageingByType = this.computeAgeingByType(division, caseTypeBreakdown);
        const trend = this.computeTrendByType(caseTypeBreakdown);
        const siteMix = this.computeSiteMixForDivision(division.name);

        container.innerHTML = `
      <div class="investigator-top-header">
        <div>
          <h2 class="inv-title" style="font-size:1.15rem;">🏬 Divisional Head View</h2>
          <p class="inv-subtitle">Single-division deep dive — site spread, case type breakdown, trends, ageing, and investigation outcomes.</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">🔄 Data refreshed: ${this.getRefreshedLabel()}</p>
        </div>
        <select id="divisionHeadSelector" class="filter-select" aria-label="Select Division" onchange="ReportingModule.selectDivision(this.value)">
          ${REPORTING_DATA.divisions.map(d => `<option value="${d.id}" ${d.id === division.id ? 'selected' : ''}>${d.icon} ${d.name}</option>`).join('')}
        </select>
      </div>

      ${this.renderInsightCallout(this.generateDivisionalInsight(division, detail, siteMix))}

      <div class="inv-metrics-grid" style="grid-template-columns:repeat(5, 1fr);">
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="divKpiTotalCases">0</div>
          <div class="inv-metric-lbl">Total Cases</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="divKpiIntake">0</div>
          <div class="inv-metric-lbl">Monthly Intake Vol.</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="divKpiSatisfaction" style="color:var(--color-success);">0%</div>
          <div class="inv-metric-lbl">Post-Investigation Satisfaction</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="divKpiReopened" style="color:${detail.reopenedCaseRate > 4.5 ? 'var(--color-warning)' : 'var(--text-main)'};">0%</div>
          <div class="inv-metric-lbl">Reopened Case Rate</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="divKpiResolution">0d</div>
          <div class="inv-metric-lbl">Avg Resolution Time</div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1.3fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>📍 Site-Level View — ${division.name}</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="divSiteMixDonutCanvas" aria-label="Site-Level Breakdown Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🗂️ Breakdown of Cases by Type</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="divCaseTypeBarCanvas" aria-label="Case Type Breakdown Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>📈 Trend of Cases by Case Type</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">Last 6 Months</span>
        </div>
        <div class="chart-canvas-box" style="height:220px;">
          <canvas id="divTrendLineCanvas" aria-label="Case Type Trend Chart"></canvas>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🚻 Cases by Gender & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="divGenderSplitCanvas" aria-label="Cases by Gender and Category Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🎖️ Cases by Management Layer & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="divTitleSplitCanvas" aria-label="Cases by Management Layer and Category Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1.1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>⏱️ Ageing by Case Type</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">Avg Days Open</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="divAgeingBarCanvas" aria-label="Ageing by Case Type Chart"></canvas>
          </div>
        </div>

        <div class="table-card">
          <h3 style="font-size:0.92rem; font-weight:700; color:var(--text-main);">🔁 Repeat Offender Cases</h3>
          ${detail.repeatOffenders.length === 0 ? `<p style="font-size:0.8rem; color:var(--text-muted);">No repeat offender patterns identified in this division.</p>` : `
          <table class="cases-table" aria-label="Repeat Offender Cases">
            <thead>
              <tr><th>Ref</th><th>Cases</th><th>Categories</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${detail.repeatOffenders.map(o => `
                <tr>
                  <td><strong>${o.ref}</strong></td>
                  <td>${o.casesCount}</td>
                  <td>${o.categories.join(', ')}</td>
                  <td><span class="status-badge ${o.status.toLowerCase().includes('investigation') ? 'investigation' : o.status.toLowerCase().includes('resolved') ? 'resolved' : 'new'}">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>⚖️ Actions Taken from Investigations, by Case Type</span>
        </div>
        <div class="chart-canvas-box" style="height:230px;">
          <canvas id="divActionsBarCanvas" aria-label="Investigation Actions by Case Type Chart"></canvas>
        </div>
      </div>
    `;

        this.animateValue("divKpiTotalCases", division.cases, 900);
        this.animateValue("divKpiIntake", detail.monthlyIntakeVol, 900);
        this.animateValue("divKpiSatisfaction", detail.postInvestigationSatisfaction, 1100, "%", 1);
        this.animateValue("divKpiReopened", detail.reopenedCaseRate, 1100, "%", 1);
        this.animateValue("divKpiResolution", division.avgResolution, 1000, "d", 1);

        this.drawDonutChart("divSiteMixDonutCanvas", siteMix.map((s, i) => ({
            label: s.site, value: s.cases, color: ["#1F7A8C", "#8ECDF0", "#A8D5BA", "#C6A15B", "#8B7FA8", "#B0727A", "#2D6A4F", "#155461"][i % 8]
        })));
        this.drawHorizontalBarChart("divCaseTypeBarCanvas", caseTypeBreakdown.map(c => c.type), caseTypeBreakdown.map(c => c.cases), caseTypeBreakdown.map(c => c.color));
        this.drawMultiLineChart("divTrendLineCanvas", trend.months, trend.series);

        const genderKeys = ["Male", "Female", "Other"];
        const genderColors = { "Male": "#1F7A8C", "Female": "#C6A15B", "Other": "#A8D5BA" };
        const genderSplit = this.computeDimensionSplit(caseTypeBreakdown, GENDER_WEIGHTS_BY_TYPE, genderKeys);
        this.drawStackedHorizontalBarChart("divGenderSplitCanvas", genderSplit, genderKeys, genderColors);

        const titleKeys = ["Individual Contributor", "People Manager", "Director", "VP & Above"];
        const titleColors = { "Individual Contributor": "#8ECDF0", "People Manager": "#1F7A8C", "Director": "#8B7FA8", "VP & Above": "#B0727A" };
        const titleSplit = this.computeDimensionSplit(caseTypeBreakdown, TITLE_WEIGHTS_BY_TYPE, titleKeys);
        this.drawStackedHorizontalBarChart("divTitleSplitCanvas", titleSplit, titleKeys, titleColors);

        this.drawHorizontalBarChart("divAgeingBarCanvas", ageingByType.map(a => a.type), ageingByType.map(a => a.avgAgeDays), ageingByType.map(a => a.color), "d");

        const actionColors = { "Termination": "#B0727A", "Written Warning": "#C6A15B", "Compensation Impact": "#8B7FA8", "Promotion / Career Impact": "#1F7A8C", "Coaching / No Formal Action": "#A8D5BA" };
        const actionsSplit = this.computeDimensionSplit(caseTypeBreakdown, ACTION_WEIGHTS_BY_TYPE, ACTION_TYPES);
        this.drawStackedHorizontalBarChart("divActionsBarCanvas", actionsSplit, ACTION_TYPES, actionColors);
    },

    // Derives which sites a division's cases come from, by reading each site's own divisional mix (kept consistent with the Site Head view automatically)
    computeSiteMixForDivision(divisionName) {
        const rows = [];
        REPORTING_DATA.sites.forEach(site => {
            const detail = SITE_DETAIL_DATA[site.id];
            if (!detail) return;
            const match = detail.divisionMix.find(d => d.division === divisionName);
            if (match && match.cases > 0) rows.push({ site: site.name, cases: match.cases });
        });
        return rows.sort((a, b) => b.cases - a.cases);
    },

    selectSite(siteId) {
        this.selectedSiteId = siteId;
        this.renderSiteHeadView();
    },

    // ---------- SITE HEAD (SINGLE-SITE DEEP DIVE) VIEW ----------
    renderSiteHeadView() {
        const container = document.getElementById("reportingContent");
        if (!container) return;

        const site = REPORTING_DATA.sites.find(s => s.id === this.selectedSiteId) || REPORTING_DATA.sites[0];
        const detail = SITE_DETAIL_DATA[site.id];
        const caseTypeBreakdown = this.computeCaseTypeBreakdown(site, detail);
        const ageingByType = this.computeAgeingByType(site, caseTypeBreakdown);
        const trend = this.computeTrendByType(caseTypeBreakdown);

        container.innerHTML = `
      <div class="investigator-top-header">
        <div>
          <h2 class="inv-title" style="font-size:1.15rem;">📍 Site Head View</h2>
          <p class="inv-subtitle">Single-site deep dive — divisional mix, case type breakdown, trends, ageing, and repeat offenders.</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">🔄 Data refreshed: ${this.getRefreshedLabel()}</p>
        </div>
        <select id="siteHeadSelector" class="filter-select" aria-label="Select Site" onchange="ReportingModule.selectSite(this.value)">
          ${REPORTING_DATA.sites.map(s => `<option value="${s.id}" ${s.id === site.id ? 'selected' : ''}>${s.icon} ${s.name}</option>`).join('')}
        </select>
      </div>

      ${this.renderInsightCallout(this.generateSiteInsight(site, detail, caseTypeBreakdown))}

      <div class="inv-metrics-grid" style="grid-template-columns:repeat(5, 1fr);">
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="siteKpiTotalCases">0</div>
          <div class="inv-metric-lbl">Total Cases</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="siteKpiIntake">0</div>
          <div class="inv-metric-lbl">Monthly Intake Vol.</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="siteKpiSatisfaction" style="color:var(--color-success);">0%</div>
          <div class="inv-metric-lbl">Post-Investigation Satisfaction</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="siteKpiReopened" style="color:${detail.reopenedCaseRate > 4.5 ? 'var(--color-warning)' : 'var(--text-main)'};">0%</div>
          <div class="inv-metric-lbl">Reopened Case Rate</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="siteKpiResolution">0d</div>
          <div class="inv-metric-lbl">Avg Resolution Time</div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1.3fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🏬 Divisional Breakdown — ${site.name}</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="siteDivisionDonutCanvas" aria-label="Divisional Breakdown Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🗂️ Breakdown of Cases by Type</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="siteCaseTypeBarCanvas" aria-label="Case Type Breakdown Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>📈 Trend of Cases by Case Type</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">Last 6 Months</span>
        </div>
        <div class="chart-canvas-box" style="height:220px;">
          <canvas id="siteTrendLineCanvas" aria-label="Case Type Trend Chart"></canvas>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🚻 Cases by Gender & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="siteGenderSplitCanvas" aria-label="Cases by Gender and Category Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🎖️ Cases by Corporate Title & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="siteTitleSplitCanvas" aria-label="Cases by Corporate Title and Category Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1.1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>⏱️ Ageing by Case Type</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">Avg Days Open</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="siteAgeingBarCanvas" aria-label="Ageing by Case Type Chart"></canvas>
          </div>
        </div>

        <div class="table-card">
          <h3 style="font-size:0.92rem; font-weight:700; color:var(--text-main);">🔁 Repeat Offender Cases</h3>
          ${detail.repeatOffenders.length === 0 ? `<p style="font-size:0.8rem; color:var(--text-muted);">No repeat offender patterns identified at this site.</p>` : `
          <table class="cases-table" aria-label="Repeat Offender Cases">
            <thead>
              <tr><th>Ref</th><th>Cases</th><th>Categories</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${detail.repeatOffenders.map(o => `
                <tr>
                  <td><strong>${o.ref}</strong></td>
                  <td>${o.casesCount}</td>
                  <td>${o.categories.join(', ')}</td>
                  <td><span class="status-badge ${o.status.toLowerCase().includes('investigation') ? 'investigation' : o.status.toLowerCase().includes('resolved') ? 'resolved' : 'new'}">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
        </div>
      </div>
    `;

        this.animateValue("siteKpiTotalCases", site.cases, 900);
        this.animateValue("siteKpiIntake", detail.monthlyIntakeVol, 900);
        this.animateValue("siteKpiSatisfaction", detail.postInvestigationSatisfaction, 1100, "%", 1);
        this.animateValue("siteKpiReopened", detail.reopenedCaseRate, 1100, "%", 1);
        this.animateValue("siteKpiResolution", site.avgResolution, 1000, "d", 1);

        this.drawDonutChart("siteDivisionDonutCanvas", detail.divisionMix.map((d, i) => ({
            label: d.division, value: d.cases, color: ["#1F7A8C", "#8ECDF0", "#A8D5BA", "#C6A15B", "#8B7FA8"][i % 5]
        })));
        this.drawHorizontalBarChart("siteCaseTypeBarCanvas", caseTypeBreakdown.map(c => c.type), caseTypeBreakdown.map(c => c.cases), caseTypeBreakdown.map(c => c.color));
        this.drawMultiLineChart("siteTrendLineCanvas", trend.months, trend.series);

        const genderKeys = ["Male", "Female", "Other"];
        const genderColors = { "Male": "#1F7A8C", "Female": "#C6A15B", "Other": "#A8D5BA" };
        const genderSplit = this.computeDimensionSplit(caseTypeBreakdown, GENDER_WEIGHTS_BY_TYPE, genderKeys);
        this.drawStackedHorizontalBarChart("siteGenderSplitCanvas", genderSplit, genderKeys, genderColors);

        const titleKeys = ["Individual Contributor", "People Manager", "Director", "VP & Above"];
        const titleColors = { "Individual Contributor": "#8ECDF0", "People Manager": "#1F7A8C", "Director": "#8B7FA8", "VP & Above": "#B0727A" };
        const titleSplit = this.computeDimensionSplit(caseTypeBreakdown, TITLE_WEIGHTS_BY_TYPE, titleKeys);
        this.drawStackedHorizontalBarChart("siteTitleSplitCanvas", titleSplit, titleKeys, titleColors);

        this.drawHorizontalBarChart("siteAgeingBarCanvas", ageingByType.map(a => a.type), ageingByType.map(a => a.avgAgeDays), ageingByType.map(a => a.color), "d");
    },

    // Derives a case-type breakdown for a site from its total case count + configured weights
    computeCaseTypeBreakdown(site, detail) {
        const rows = CASE_TYPES.map(ct => ({
            type: ct.type,
            color: ct.color,
            cases: Math.max(0, Math.round(site.cases * (detail.caseTypeWeights[ct.type] || 0)))
        }));
        return rows.sort((a, b) => b.cases - a.cases);
    },

    // Derives average case age per type from a global baseline, scaled by the site's own resolution speed
    computeAgeingByType(site, caseTypeBreakdown) {
        const orgAvgResolution = REPORTING_DATA.orgWide.avgResolution;
        const scale = site.avgResolution / orgAvgResolution;
        return caseTypeBreakdown
            .filter(c => c.cases > 0)
            .map(c => ({ type: c.type, color: c.color, avgAgeDays: Math.round(BASE_AGEING_DAYS[c.type] * scale * 10) / 10 }))
            .sort((a, b) => b.avgAgeDays - a.avgAgeDays);
    },

    // Distributes each case type's total across the last 6 months using a gentle upward-trend curve
    computeTrendByType(caseTypeBreakdown) {
        const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        const monthWeights = [0.12, 0.14, 0.16, 0.17, 0.19, 0.22];
        const topTypes = caseTypeBreakdown.filter(c => c.cases > 0).slice(0, 4);

        const series = topTypes.map(ct => {
            let values = monthWeights.map(w => Math.round(ct.cases * w));
            const diff = ct.cases - values.reduce((a, b) => a + b, 0);
            values[values.length - 1] += diff;
            values = values.map(v => Math.max(0, v));
            return { label: ct.type, color: ct.color, values };
        });

        return { months, series };
    },

    selectRegion(regionId) {
        this.selectedRegionId = regionId;
        this.renderRegionalHeadView();
    },

    // ---------- REGIONAL HEAD (SINGLE-REGION DEEP DIVE) VIEW ----------
    // Demo note: shows one region at a time. In production this would be scoped by the logged-in user's security role.
    renderRegionalHeadView() {
        const container = document.getElementById("reportingContent");
        if (!container) return;

        const region = REPORTING_DATA.regions.find(r => r.id === this.selectedRegionId) || REPORTING_DATA.regions[0];
        const detail = REGION_DETAIL_DATA[region.id];
        const caseTypeBreakdown = this.computeCaseTypeBreakdown(region, detail);
        const ageingByType = this.computeAgeingByType(region, caseTypeBreakdown);
        const trend = this.computeTrendByType(caseTypeBreakdown);
        const cityRows = this.computeTopCitiesForRegion(region);
        const divisionRows = this.computeDivisionSplitForRegion(region);

        container.innerHTML = `
      <div class="investigator-top-header">
        <div>
          <h2 class="inv-title" style="font-size:1.15rem;">🌍 Regional Head View</h2>
          <p class="inv-subtitle">Single-region deep dive — top cities, case type breakdown, trends, ageing, and investigation outcomes.</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">🔄 Data refreshed: ${this.getRefreshedLabel()}</p>
        </div>
        <select id="regionHeadSelector" class="filter-select" aria-label="Select Region" onchange="ReportingModule.selectRegion(this.value)">
          ${REPORTING_DATA.regions.map(r => `<option value="${r.id}" ${r.id === region.id ? 'selected' : ''}>${r.icon} ${r.name}</option>`).join('')}
        </select>
      </div>

      ${this.renderInsightCallout(this.generateRegionalInsight(region))}

      <div class="inv-metrics-grid" style="grid-template-columns:repeat(5, 1fr);">
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="regKpiTotalCases">0</div>
          <div class="inv-metric-lbl">Total Cases</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="regKpiIntake">0</div>
          <div class="inv-metric-lbl">Monthly Intake Vol.</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="regKpiSatisfaction" style="color:var(--color-success);">0%</div>
          <div class="inv-metric-lbl">Post-Investigation Satisfaction</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="regKpiReopened" style="color:${detail.reopenedCaseRate > 4.5 ? 'var(--color-warning)' : 'var(--text-main)'};">0%</div>
          <div class="inv-metric-lbl">Reopened Case Rate</div>
        </div>
        <div class="inv-metric-card">
          <div class="inv-metric-num" id="regKpiResolution">0d</div>
          <div class="inv-metric-lbl">Avg Resolution Time</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>🏙️ Top Cities by Case Type — ${region.name}</span>
        </div>
        <div class="chart-canvas-box" style="height:${Math.max(140, cityRows.length * 34 + 26)}px;">
          <canvas id="regCityBarCanvas" aria-label="Top Cities by Case Type Chart"></canvas>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1.3fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🗂️ Breakdown of Cases by Type</span>
          </div>
          <div class="chart-canvas-box" style="height:200px;">
            <canvas id="regCaseTypeBarCanvas" aria-label="Case Type Breakdown Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🏬 Divisions in ${region.name}, by Category</span>
          </div>
          <div class="chart-canvas-box" style="height:${Math.max(140, divisionRows.length * 34 + 26)}px;">
            <canvas id="regDivisionBarCanvas" aria-label="Divisional Breakdown by Category Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>📈 Trend of Cases by Case Type</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">Last 6 Months</span>
        </div>
        <div class="chart-canvas-box" style="height:220px;">
          <canvas id="regTrendLineCanvas" aria-label="Case Type Trend Chart"></canvas>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🚻 Cases by Gender & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="regGenderSplitCanvas" aria-label="Cases by Gender and Category Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>🎖️ Cases by Management Layer & Category</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="regTitleSplitCanvas" aria-label="Cases by Management Layer and Category Chart"></canvas>
          </div>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1.1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>⏱️ Ageing by Case Type</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">Avg Days Open</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="regAgeingBarCanvas" aria-label="Ageing by Case Type Chart"></canvas>
          </div>
        </div>

        <div class="table-card">
          <h3 style="font-size:0.92rem; font-weight:700; color:var(--text-main);">🔁 Repeat Offender Cases</h3>
          ${detail.repeatOffenders.length === 0 ? `<p style="font-size:0.8rem; color:var(--text-muted);">No repeat offender patterns identified in this region.</p>` : `
          <table class="cases-table" aria-label="Repeat Offender Cases">
            <thead>
              <tr><th>Ref</th><th>Cases</th><th>Categories</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${detail.repeatOffenders.map(o => `
                <tr>
                  <td><strong>${o.ref}</strong></td>
                  <td>${o.casesCount}</td>
                  <td>${o.categories.join(', ')}</td>
                  <td><span class="status-badge ${o.status.toLowerCase().includes('investigation') ? 'investigation' : o.status.toLowerCase().includes('resolved') ? 'resolved' : 'new'}">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card-title">
          <span>⚖️ Actions Taken from Investigations, by Case Type</span>
        </div>
        <div class="chart-canvas-box" style="height:230px;">
          <canvas id="regActionsBarCanvas" aria-label="Investigation Actions by Case Type Chart"></canvas>
        </div>
      </div>

      <div class="analytics-grid" style="grid-template-columns:1fr 1fr;">
        <div class="chart-card">
          <div class="chart-card-title">
            <span>📅 Offenders by Tenure and Age Group</span>
          </div>
          <div class="chart-canvas-box" style="height:210px;">
            <canvas id="regTenureAgeBarCanvas" aria-label="Offenders by Tenure and Age Group Chart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            <span>👥 Cases by Direct Report</span>
            <span style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">Site Directors reporting to this Regional Head</span>
          </div>
          <div class="chart-canvas-box" style="height:${Math.max(140, this.computeDirectReportsForRegion(region).length * 34 + 26)}px;">
            <canvas id="regDirectReportsBarCanvas" aria-label="Cases by Direct Report Chart"></canvas>
          </div>
        </div>
      </div>
    `;

        this.animateValue("regKpiTotalCases", region.cases, 900);
        this.animateValue("regKpiIntake", detail.monthlyIntakeVol, 900);
        this.animateValue("regKpiSatisfaction", detail.postInvestigationSatisfaction, 1100, "%", 1);
        this.animateValue("regKpiReopened", detail.reopenedCaseRate, 1100, "%", 1);
        this.animateValue("regKpiResolution", region.avgResolution, 1000, "d", 1);

        const caseTypeColors = Object.fromEntries(CASE_TYPES.map(t => [t.type, t.color]));

        this.drawStackedHorizontalBarChart("regCityBarCanvas", cityRows, CASE_TYPES.map(t => t.type), caseTypeColors);
        this.drawHorizontalBarChart("regCaseTypeBarCanvas", caseTypeBreakdown.map(c => c.type), caseTypeBreakdown.map(c => c.cases), caseTypeBreakdown.map(c => c.color));
        this.drawStackedHorizontalBarChart("regDivisionBarCanvas", divisionRows, CASE_TYPES.map(t => t.type), caseTypeColors);
        this.drawMultiLineChart("regTrendLineCanvas", trend.months, trend.series);

        const genderKeys = ["Male", "Female", "Other"];
        const genderColors = { "Male": "#1F7A8C", "Female": "#C6A15B", "Other": "#A8D5BA" };
        this.drawStackedHorizontalBarChart("regGenderSplitCanvas", this.computeDimensionSplit(caseTypeBreakdown, GENDER_WEIGHTS_BY_TYPE, genderKeys), genderKeys, genderColors);

        const titleKeys = ["Individual Contributor", "People Manager", "Director", "VP & Above"];
        const titleColors = { "Individual Contributor": "#8ECDF0", "People Manager": "#1F7A8C", "Director": "#8B7FA8", "VP & Above": "#B0727A" };
        this.drawStackedHorizontalBarChart("regTitleSplitCanvas", this.computeDimensionSplit(caseTypeBreakdown, TITLE_WEIGHTS_BY_TYPE, titleKeys), titleKeys, titleColors);

        this.drawHorizontalBarChart("regAgeingBarCanvas", ageingByType.map(a => a.type), ageingByType.map(a => a.avgAgeDays), ageingByType.map(a => a.color), "d");

        const actionColors = { "Termination": "#B0727A", "Written Warning": "#C6A15B", "Compensation Impact": "#8B7FA8", "Promotion / Career Impact": "#1F7A8C", "Coaching / No Formal Action": "#A8D5BA" };
        this.drawStackedHorizontalBarChart("regActionsBarCanvas", this.computeDimensionSplit(caseTypeBreakdown, ACTION_WEIGHTS_BY_TYPE, ACTION_TYPES), ACTION_TYPES, actionColors);

        const tenureAgeKeys = ["New Hire (<1 Yr / Under 30)", "Early Career (1-3 Yrs / 30-40)", "Established (3-7 Yrs / 40-50)", "Tenured (7+ Yrs / 50+)"];
        const tenureAgeColors = { "New Hire (<1 Yr / Under 30)": "#A8D5BA", "Early Career (1-3 Yrs / 30-40)": "#8ECDF0", "Established (3-7 Yrs / 40-50)": "#1F7A8C", "Tenured (7+ Yrs / 50+)": "#155461" };
        this.drawStackedHorizontalBarChart("regTenureAgeBarCanvas", this.computeDimensionSplit(caseTypeBreakdown, TENURE_AGE_WEIGHTS_BY_TYPE, tenureAgeKeys), tenureAgeKeys, tenureAgeColors);

        const directReportRows = this.computeDirectReportsForRegion(region);
        this.drawStackedHorizontalBarChart("regDirectReportsBarCanvas", directReportRows, CASE_TYPES.map(t => t.type), caseTypeColors);
    },

    // Builds "top cities" rows for a region directly from that region's own sites, reusing each site's own case-type breakdown for full consistency with the Site Head view
    computeTopCitiesForRegion(region) {
        const sites = REPORTING_DATA.sites.filter(s => s.region === region.name).sort((a, b) => b.cases - a.cases);
        return sites.map(site => {
            const siteDetail = SITE_DETAIL_DATA[site.id];
            const breakdown = this.computeCaseTypeBreakdown(site, siteDetail);
            return {
                type: site.name,
                total: site.cases,
                segments: breakdown.map(b => ({ key: b.type, value: b.cases }))
            };
        });
    },

    // Builds rows for the Regional Head's actual named direct reports (Site Directors) with the case-type mix each of their sites carries
    computeDirectReportsForRegion(region) {
        const sites = REPORTING_DATA.sites.filter(s => s.region === region.name).sort((a, b) => b.cases - a.cases);
        return sites.map(site => {
            const person = REGION_DIRECT_REPORTS[site.id];
            const siteDetail = SITE_DETAIL_DATA[site.id];
            const breakdown = this.computeCaseTypeBreakdown(site, siteDetail);
            return {
                type: person ? person.name : site.name,
                total: site.cases,
                segments: breakdown.map(b => ({ key: b.type, value: b.cases }))
            };
        });
    },

    // Builds a divisional breakdown for a region by summing each site's divisional mix, then splitting by case type using that division's own weights
    computeDivisionSplitForRegion(region) {
        const totalsByDivision = {};
        REPORTING_DATA.sites.filter(s => s.region === region.name).forEach(site => {
            const siteDetail = SITE_DETAIL_DATA[site.id];
            siteDetail.divisionMix.forEach(dm => {
                totalsByDivision[dm.division] = (totalsByDivision[dm.division] || 0) + dm.cases;
            });
        });

        return Object.entries(totalsByDivision).map(([divisionName, cases]) => {
            const divisionMeta = REPORTING_DATA.divisions.find(d => d.name === divisionName);
            const weights = (divisionMeta && DIVISION_DETAIL_DATA[divisionMeta.id]?.caseTypeWeights) || {};
            let segValues = CASE_TYPES.map(ct => Math.round(cases * (weights[ct.type] || 0)));
            const diff = cases - segValues.reduce((a, b) => a + b, 0);
            const maxIdx = segValues.indexOf(Math.max(...segValues));
            segValues[maxIdx] += diff;
            return {
                type: divisionName,
                total: cases,
                segments: CASE_TYPES.map((ct, i) => ({ key: ct.type, value: Math.max(0, segValues[i]) }))
            };
        }).sort((a, b) => b.total - a.total);
    },

    // Splits each case type's total count across a dimension (e.g. gender, corporate title) using configured weights
    computeDimensionSplit(caseTypeBreakdown, weightTable, segmentKeys) {
        return caseTypeBreakdown
            .filter(c => c.cases > 0)
            .map(c => {
                const weights = weightTable[c.type] || {};
                let segValues = segmentKeys.map(k => Math.round(c.cases * (weights[k] || 0)));
                const diff = c.cases - segValues.reduce((a, b) => a + b, 0);
                const maxIdx = segValues.indexOf(Math.max(...segValues));
                segValues[maxIdx] += diff;
                return {
                    type: c.type,
                    total: c.cases,
                    segments: segmentKeys.map((k, i) => ({ key: k, value: Math.max(0, segValues[i]) }))
                };
            });
    },

    // ---------- DONUT CHART (division mix) ----------
    drawDonutChart(canvasId, slices) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = canvas.parentElement.clientHeight || 200;

        ctx.clearRect(0, 0, width, height);

        const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
        const centerX = width / 3.2;
        const centerY = height / 2;
        const radius = Math.min(65, height / 2 - 10);
        const innerRadius = radius * 0.6;
        const hoverRegions = [];

        let startAngle = -Math.PI / 2;
        slices.forEach(slice => {
            const sliceAngle = (slice.value / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();

            const pct = Math.round((slice.value / total) * 100);
            hoverRegions.push({ shape: "arc", cx: centerX, cy: centerY, innerR: innerRadius, outerR: radius, startAngle, endAngle: startAngle + sliceAngle, html: `<strong>${slice.label}</strong>: ${slice.value} (${pct}%)` });
            startAngle += sliceAngle;
        });

        ctx.fillStyle = "gray";
        ctx.font = "700 12px 'Plus Jakarta Sans'";
        ctx.textAlign = "center";
        ctx.fillText(total, centerX, centerY + 4);
        ctx.textAlign = "left";

        let legendY = 18;
        slices.forEach(slice => {
            ctx.fillStyle = slice.color;
            ctx.fillRect(width / 1.75, legendY, 11, 11);

            ctx.fillStyle = "gray";
            ctx.font = "10.5px 'Plus Jakarta Sans'";
            const pct = Math.round((slice.value / total) * 100);
            ctx.fillText(`${slice.label} (${slice.value} • ${pct}%)`, width / 1.75 + 16, legendY + 9);
            hoverRegions.push({ shape: "rect", x: width / 1.75, y: legendY - 3, w: width - (width / 1.75) - 4, h: 20, html: `<strong>${slice.label}</strong>: ${slice.value} (${pct}%)` });
            legendY += 24;
        });

        this.attachChartHover(canvas, hoverRegions);
    },

    // ---------- HORIZONTAL BAR CHART (case type breakdown / ageing) ----------
    drawHorizontalBarChart(canvasId, labels, values, colors, unitSuffix = "") {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = canvas.parentElement.clientHeight || 200;

        ctx.clearRect(0, 0, width, height);

        const maxVal = Math.max(...values, 1) * 1.25;
        const labelWidth = 108;
        const rightPad = 44;
        const rowHeight = height / values.length;
        const barHeight = Math.min(16, rowHeight * 0.5);
        const hoverRegions = [];

        values.forEach((val, idx) => {
            const rowY = idx * rowHeight + rowHeight / 2;
            const barMaxWidth = width - labelWidth - rightPad;
            const barW = (val / maxVal) * barMaxWidth;

            // Label
            ctx.fillStyle = "gray";
            ctx.font = "600 10.5px 'Plus Jakarta Sans'";
            ctx.textAlign = "right";
            const label = labels[idx].length > 16 ? labels[idx].slice(0, 15) + "…" : labels[idx];
            ctx.fillText(label, labelWidth - 8, rowY + 4);

            // Track
            ctx.fillStyle = "rgba(31, 122, 140, 0.08)";
            const radius = barHeight / 2;
            this.roundRect(ctx, labelWidth, rowY - barHeight / 2, barMaxWidth, barHeight, radius);
            ctx.fill();

            // Bar
            ctx.fillStyle = colors[idx];
            this.roundRect(ctx, labelWidth, rowY - barHeight / 2, Math.max(barW, 4), barHeight, radius);
            ctx.fill();

            // Value
            ctx.fillStyle = "gray";
            ctx.font = "700 10.5px 'Plus Jakarta Sans'";
            ctx.textAlign = "left";
            ctx.fillText(`${val}${unitSuffix}`, labelWidth + barW + 8, rowY + 4);

            hoverRegions.push({ shape: "rect", x: 0, y: idx * rowHeight, w: width, h: rowHeight, html: `<strong>${labels[idx]}</strong>: ${val}${unitSuffix}` });
        });

        this.attachChartHover(canvas, hoverRegions);

        ctx.textAlign = "left";
    },

    // ---------- STACKED HORIZONTAL BAR CHART (gender x category, title x category) ----------
    drawStackedHorizontalBarChart(canvasId, rows, segmentKeys, segmentColors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = canvas.parentElement.clientHeight || 210;

        ctx.clearRect(0, 0, width, height);

        const labelWidth = 108;
        const rightPad = 30;
        const lineHeight = 14;
        ctx.font = "600 9.5px 'Plus Jakarta Sans'";

        // Legend — measure first to see how many lines it needs, then draw wrapped
        const legendStartX = labelWidth;
        const legendMaxX = width - 8;
        let lines = [[]];
        let cursorX = legendStartX;
        segmentKeys.forEach(k => {
            const itemWidth = ctx.measureText(k).width + 22;
            if (cursorX + itemWidth > legendMaxX && cursorX > legendStartX) {
                lines.push([]);
                cursorX = legendStartX;
            }
            lines[lines.length - 1].push(k);
            cursorX += itemWidth;
        });

        const legendHeight = lines.length * lineHeight + 6;
        const chartTop = legendHeight + 8;
        const rowAreaHeight = height - chartTop;
        const rowHeight = rowAreaHeight / rows.length;
        const barHeight = Math.min(16, rowHeight * 0.5);
        const maxTotal = Math.max(...rows.map(r => r.total), 1) * 1.1;
        const barMaxWidth = width - labelWidth - rightPad;
        const hoverRegions = [];

        ctx.textAlign = "left";
        lines.forEach((line, lineIdx) => {
            let legendX = legendStartX;
            const y = lineIdx * lineHeight + 3;
            line.forEach(k => {
                ctx.fillStyle = segmentColors[k];
                ctx.fillRect(legendX, y, 8, 8);
                ctx.fillStyle = "gray";
                ctx.fillText(k, legendX + 11, y + 8);
                legendX += ctx.measureText(k).width + 22;
            });
        });

        rows.forEach((row, idx) => {
            const rowY = chartTop + idx * rowHeight + rowHeight / 2;

            // Row label
            ctx.fillStyle = "gray";
            ctx.font = "600 10.5px 'Plus Jakarta Sans'";
            ctx.textAlign = "right";
            const label = row.type.length > 16 ? row.type.slice(0, 15) + "…" : row.type;
            ctx.fillText(label, labelWidth - 8, rowY + 4);

            // Stacked segments
            let segX = labelWidth;
            row.segments.forEach(seg => {
                const segW = (seg.value / maxTotal) * barMaxWidth;
                if (segW <= 0) return;
                ctx.fillStyle = segmentColors[seg.key];
                ctx.fillRect(segX, rowY - barHeight / 2, segW, barHeight);

                if (segW > 16) {
                    ctx.fillStyle = "rgba(255,255,255,0.95)";
                    ctx.font = "700 9px 'Plus Jakarta Sans'";
                    ctx.textAlign = "center";
                    ctx.fillText(seg.value, segX + segW / 2, rowY + 3);
                }
                hoverRegions.push({ shape: "rect", x: segX, y: rowY - rowHeight / 2, w: segW, h: rowHeight, html: `<strong>${row.type}</strong><br>${seg.key}: ${seg.value}` });
                segX += segW;
            });

            // Row total
            ctx.fillStyle = "gray";
            ctx.font = "700 10px 'Plus Jakarta Sans'";
            ctx.textAlign = "left";
            ctx.fillText(row.total, segX + 6, rowY + 3);
        });

        this.attachChartHover(canvas, hoverRegions);
        ctx.textAlign = "left";
    },

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    },

    // ---------- MULTI-LINE TREND CHART (cases by case type over time) ----------
    drawMultiLineChart(canvasId, months, series) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = canvas.parentElement.clientHeight || 220;

        ctx.clearRect(0, 0, width, height);

        const legendHeight = 24;
        const paddingLeft = 30;
        const paddingBottom = 26;
        const chartTop = legendHeight + 10;
        const chartHeight = height - chartTop - paddingBottom;
        const chartWidth = width - paddingLeft - 16;

        const maxVal = Math.max(1, ...series.flatMap(s => s.values)) * 1.2;
        const stepX = chartWidth / (months.length - 1);

        // Grid lines
        ctx.strokeStyle = "rgba(31, 122, 140, 0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 3; i++) {
            const y = chartTop + (chartHeight / 3) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - 10, y);
            ctx.stroke();
        }

        // Legend
        let legendX = paddingLeft;
        ctx.font = "600 10px 'Plus Jakarta Sans'";
        series.forEach(s => {
            ctx.fillStyle = s.color;
            ctx.fillRect(legendX, 4, 9, 9);
            ctx.fillStyle = "gray";
            ctx.textAlign = "left";
            ctx.fillText(s.label, legendX + 13, 12);
            legendX += ctx.measureText(s.label).width + 34;
        });

        // Lines
        series.forEach(s => {
            ctx.beginPath();
            s.values.forEach((val, idx) => {
                const x = paddingLeft + idx * stepX;
                const y = chartTop + chartHeight - (val / maxVal) * chartHeight;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            s.values.forEach((val, idx) => {
                const x = paddingLeft + idx * stepX;
                const y = chartTop + chartHeight - (val / maxVal) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.fill();
            });
        });

        // X-axis labels
        ctx.fillStyle = "gray";
        ctx.font = "10px 'Plus Jakarta Sans'";
        ctx.textAlign = "center";
        months.forEach((m, idx) => {
            const x = paddingLeft + idx * stepX;
            ctx.fillText(m, x, height - 8);
        });
        ctx.textAlign = "left";

        const hoverRegions = months.map((m, idx) => {
            const x = paddingLeft + idx * stepX;
            const html = `<strong>${m}</strong><br>` + series.map(s => `${s.label}: ${s.values[idx]}`).join('<br>');
            return { shape: "rect", x: x - stepX / 2, y: 0, w: stepX, h: height, html };
        });
        this.attachChartHover(canvas, hoverRegions);
    },

    // ---------- COMBO BAR + LINE CHART (intake vs. closure trend) ----------
    drawComboBarLineChart(canvasId, months, barValues, lineValues, barColor, lineColor, barLabel, lineLabel) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = canvas.parentElement.clientHeight || 220;

        ctx.clearRect(0, 0, width, height);

        const legendHeight = 24;
        const paddingLeft = 30;
        const paddingBottom = 26;
        const chartTop = legendHeight + 10;
        const chartHeight = height - chartTop - paddingBottom;
        const chartWidth = width - paddingLeft - 16;
        const maxVal = Math.max(...barValues, ...lineValues) * 1.25;
        const stepX = chartWidth / months.length;
        const barWidth = stepX * 0.42;

        // Grid lines
        ctx.strokeStyle = "rgba(31, 122, 140, 0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 3; i++) {
            const y = chartTop + (chartHeight / 3) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - 10, y);
            ctx.stroke();
        }

        // Legend
        ctx.font = "600 10px 'Plus Jakarta Sans'";
        ctx.textAlign = "left";
        ctx.fillStyle = barColor;
        ctx.fillRect(paddingLeft, 4, 9, 9);
        ctx.fillStyle = "gray";
        ctx.fillText(barLabel, paddingLeft + 13, 12);
        const barLabelWidth = ctx.measureText(barLabel).width;
        ctx.fillStyle = lineColor;
        ctx.fillRect(paddingLeft + barLabelWidth + 40, 4, 9, 9);
        ctx.fillStyle = "gray";
        ctx.fillText(lineLabel, paddingLeft + barLabelWidth + 53, 12);

        // Bars (new cases)
        barValues.forEach((val, idx) => {
            const barHeight = (val / maxVal) * chartHeight;
            const x = paddingLeft + idx * stepX + (stepX - barWidth) / 2;
            const y = chartTop + chartHeight - barHeight;
            ctx.fillStyle = barColor;
            this.roundRect(ctx, x, y, barWidth, barHeight, 4);
            ctx.fill();

            ctx.fillStyle = "gray";
            ctx.font = "700 9.5px 'Plus Jakarta Sans'";
            ctx.textAlign = "center";
            ctx.fillText(val, x + barWidth / 2, y - 5);
        });

        // Line (closed cases)
        ctx.beginPath();
        lineValues.forEach((val, idx) => {
            const x = paddingLeft + idx * stepX + stepX / 2;
            const y = chartTop + chartHeight - (val / maxVal) * chartHeight;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        lineValues.forEach((val, idx) => {
            const x = paddingLeft + idx * stepX + stepX / 2;
            const y = chartTop + chartHeight - (val / maxVal) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // X-axis labels
        ctx.fillStyle = "gray";
        ctx.font = "10px 'Plus Jakarta Sans'";
        ctx.textAlign = "center";
        months.forEach((m, idx) => {
            const x = paddingLeft + idx * stepX + stepX / 2;
            ctx.fillText(m, x, height - 8);
        });
        ctx.textAlign = "left";

        const hoverRegions = months.map((m, idx) => ({
            shape: "rect",
            x: paddingLeft + idx * stepX,
            y: 0,
            w: stepX,
            h: height,
            html: `<strong>${m}</strong><br>${barLabel}: ${barValues[idx]}<br>${lineLabel}: ${lineValues[idx]}`
        }));
        this.attachChartHover(canvas, hoverRegions);
    }
};

window.ReportingModule = ReportingModule;
