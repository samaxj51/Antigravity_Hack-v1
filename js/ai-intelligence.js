/* LISTEN-360 AI CASE INTELLIGENCE ENGINE (PART C - STEP 4) */

const AiIntelligence = {
  processQuery(queryText) {
    const box = document.getElementById("aiIntelResponseBox");
    if (!box) return;

    box.style.display = "block";
    box.innerHTML = `<em>🤖 AI Case Intelligence analyzing query: "${queryText}"...</em>`;

    setTimeout(() => {
      let responseHtml = "";
      const q = queryText.toLowerCase();

      if (q.includes("summary of cases") || q.includes("this month")) {
        responseHtml = `
          <strong>📊 Monthly Case Volume Summary:</strong><br/>
          42 cases were received this month, representing a <strong>12% increase</strong> compared with the previous month. Workplace behaviour was the most frequently reported category, accounting for 35% of cases. 8 cases were classified as high risk, and 3 cases have exceeded the expected resolution timeline.
        `;
      } else if (q.includes("top 3") || q.includes("emerging")) {
        responseHtml = `
          <strong>📈 Top 3 Emerging Concerns:</strong><br/>
          1. <strong>Workplace Behaviour & Respect (35%):</strong> Microaggressions during hybrid team meetings.<br/>
          2. <strong>Manager/Leadership Communication (28%):</strong> Perceived power imbalances in quarterly reviews.<br/>
          3. <strong>Burnout & Anxiety (18%):</strong> Increased workload strain in engineering departments.
        `;
      } else if (q.includes("manager behaviour") || q.includes("manager")) {
        responseHtml = `
          <strong>👔 Cases Related to Manager Behaviour:</strong><br/>
          Found <strong>14 active cases</strong> involving supervisor or managerial conduct. 6 are classified as High Risk (e.g. <code>LS360-2026-001245</code>). Common themes include tone of communication, review bias, and workload distribution.
        `;
      } else if (q.includes("increased") || q.includes("quarter")) {
        responseHtml = `
          <strong>📊 Quarter-over-Quarter Category Shift:</strong><br/>
          • <strong>Bullying & Harassment:</strong> +18% increase year-over-date.<br/>
          • <strong>Mental Health & Stress Support:</strong> +24% increase in self-initiated support requests.<br/>
          • <strong>Financial / Fraud:</strong> -5% decrease.
        `;
      } else if (q.includes("high-risk") || q.includes("high risk") || q.includes("summarise all")) {
        responseHtml = `
          <strong>🔴 High-Risk & Critical Case Portfolio:</strong><br/>
          Found 2 active high-risk cases:<br/>
          1. <code>LS360-2026-001245</code> (Bullying/Harassment) — Anonymous, Manager involvement.<br/>
          2. <code>LS360-2026-001248</code> (Retaliation) — Critical Risk, Escalated to Legal & ER Director.
        `;
      } else if (q.includes("sla breach") || q.includes("sla")) {
        responseHtml = `
          <strong>⏱️ SLA Compliance & Breach Warnings:</strong><br/>
          • 1 Case (<code>LS360-2026-001246</code>) is at <strong>85% SLA threshold</strong> (5 days old, initial review pending).<br/>
          • All other active cases are currently within 24h acknowledgement and 7-day resolution targets.
        `;
      } else {
        responseHtml = `
          <strong>🤖 AI Analysis Output:</strong><br/>
          Analyzed ${INITIAL_SAMPLE_CASES.length} cases across departments. Query "${queryText}" matched 3 active records. Recommendations: Ensure high-risk case <code>LS360-2026-001248</code> has assigned legal lead outreach within 12 hours.
        `;
      }

      box.innerHTML = responseHtml;
    }, 600);
  }
};

window.AiIntelligence = AiIntelligence;

