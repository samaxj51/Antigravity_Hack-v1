/* LISTEN-360 AI CASE INTELLIGENCE ENGINE (PART C - STEP 4) */

const AiIntelligence = {
  async processQuery(queryText) {
    const box = document.getElementById("aiIntelResponseBox");
    if (!box) return;

    box.style.display = "block";
    box.innerHTML = `<em>🤖 AI Case Intelligence analyzing query with Gemini AI model: "${queryText}"...</em>`;

    console.log(`🚀 [Client AI] Submitting query to /api/ai-intelligence: "${queryText}"`);
    
    // Check if user explicitly expresses desire to raise/file a concern
    const lowerQ = queryText.toLowerCase().trim();
    const concernTriggers = ["raise concern", "raise a concern", "file concern", "report concern", "log concern", "raise concern now", "file report", "yes raise concern"];
    
    if (concernTriggers.some(t => lowerQ.includes(t))) {
      box.innerHTML = `
        <strong>📋 Starting Confidential Concern Submission:</strong><br/>
        You are now ready to document your concern confidentially. <br/><br/>
        • <strong>Option A (Guided Chat Companion):</strong> Type your experience into the chat input on the right or click 
          <span style="color:var(--primary-teal); text-decoration:underline; font-weight:700; cursor:pointer;" onclick="document.getElementById('chatInput').focus(); document.getElementById('chatInput').value='I would like to report a workplace concern.'; App.sendMessage();">Start Guided Report Chat</span>.<br/>
        • <strong>Option B (Direct Form):</strong> Click the <span style="font-weight:700; color:#E63946;">+ Submit New Case</span> button in the top navigation header.<br/><br/>
        <em>Your privacy and zero-retaliation protection are strictly guaranteed.</em>
      `;
      return;
    }

    try {
      const response = await fetch("/api/ai-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });

      console.log(`🌐 [Client AI] Server response status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log("📦 [Client AI] Server response payload:", data);
        if (data.text && !data.fallback) {
          console.log("✅ [Client AI] Live Gemini AI response successfully rendered!");
          // Format line breaks from AI model into HTML breaks for UI presentation
          const formattedText = data.text.replace(/\n/g, "<br/>");
          
          box.innerHTML = `
            <strong>✨ AI Case Intelligence (Gemini AI Model):</strong><br/>${formattedText}
            <br/><br/>
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-accent); font-size:0.78rem; color:var(--text-muted);">
              💬 <em>Have more questions? Keep typing above. If you're ready to document an incident, type <strong>"raise concern"</strong> or click <span style="color:var(--primary-teal); text-decoration:underline; font-weight:700; cursor:pointer;" onclick="AiIntelligence.processQuery('raise concern')">here to start formal reporting</span>.</em>
            </div>
          `;
          return;
        } else {
          console.warn("⚠️ [Client AI] Server returned fallback flag. Switching to offline preset logic.");
        }
      } else {
        console.error(`❌ [Client AI] HTTP error status: ${response.status}`);
      }
    } catch (err) {
      console.warn("⚠️ Server API call failed, using client-side fallback AI intelligence.", err);
    }

    // --- FALLBACK PREDEFINED INTEL LOGIC ---
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
      } else if (q.includes("raise concern") || q.includes("raise a concern") || q.includes("file concern") || q.includes("report concern") || q.includes("log concern") || q.includes("yes")) {
        responseHtml = `
          <strong>📋 Confidential Concern Submission Guidance:</strong><br/>
          We are committed to providing a safe, confidential environment. You can submit your concern anonymously or with your contact details.<br/><br/>
          • <strong>Step 1:</strong> Click the <span style="text-decoration:underline; font-weight:600;">+ Submit New Case</span> button in the top navigation header.<br/>
          • <strong>Step 2:</strong> Select the relevant category (e.g., <em>Workplace Behaviour, Retaliation, Safety</em>).<br/>
          • <strong>Step 3:</strong> Choose your preferred anonymity level and detail your experience.<br/><br/>
          <em>Your safety, confidentiality, and protection against retaliation are strictly protected under organizational policy.</em>
        `;
      } else if (
        q.includes("psychological safety") ||
        q.includes("feel safe") ||
        q.includes("unsafe") ||
        q.includes("anxious") ||
        q.includes("anxiety") ||
        q.includes("stressed") ||
        q.includes("stress") ||
        q.includes("uncomfortable") ||
        q.includes("microaggression") ||
        q.includes("speak up") ||
        q.includes("fear") ||
        q.includes("calm") ||
        q.includes("help")
      ) {
        responseHtml = `
          <strong>🛡️ Psychological Safety & Employee Support:</strong><br/>
          Your well-being and psychological safety are our absolute priority. Listen360 provides a supportive, confidential space where your voice is heard without fear of retaliation.<br/><br/>
          • <strong>Confidentiality Assured:</strong> All inquiries and concerns are strictly managed under zero-retaliation guidelines.<br/>
          • <strong>Immediate Support:</strong> Take a deep breath — you have full control over how your concern is addressed.<br/><br/>
          ❓ <strong>Would you like to raise a confidential concern or document an incident now?</strong><br/>
          <em>Type <strong>"raise concern"</strong> or click <span style="text-decoration:underline; font-weight:600;" onclick="AiIntelligence.processQuery('raise concern')">here</span> to receive step-by-step guidance on logging your concern safely.</em>
        `;
      } else {
        responseHtml = `
          <strong>🤖 AI Analysis Output (Offline Fallback):</strong><br/>
          Analyzed cases across departments. Query "${queryText}" processed. Recommendations: Ensure high-risk case <code>LS360-2026-001248</code> has assigned legal lead outreach within 12 hours.
        `;
      }

      box.innerHTML = responseHtml;
    }, 400);
  }
};

window.AiIntelligence = AiIntelligence;

