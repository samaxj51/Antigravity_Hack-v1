// Use native fetch API (available in Node.js 18+)

async function runTests() {
  const baseUrl = "http://localhost:5001";
  console.log("🚦 Starting Gateway API tests against " + baseUrl + "...\n");

  try {
    // 1. Test SSO Login
    console.log("🧪 Testing POST /api/auth/sso-login (Persona: Employee)...");
    const loginRes = await fetch(`${baseUrl}/api/auth/sso-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: "employee" })
    });
    const loginData = await loginRes.json();
    if (loginData.token && loginData.user.name === "Jordan") {
      console.log("✅ SSO Login Succeeded. Token received: " + loginData.token.substring(0, 15) + "...");
    } else {
      console.error("❌ SSO Login Failed:", loginData);
      process.exit(1);
    }
    const token = loginData.token;

    // 2. Test Chat endpoint
    console.log("\n🧪 Testing POST /api/chat (AI empathetic response)...");
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message: "I've been feeling extremely stressed about the upcoming launch." })
    });
    const chatData = await chatRes.json();
    console.log("🤖 AI Response:", chatData.text);
    if (chatData.text) {
      console.log("✅ AI Chat Response Succeeded.");
    } else {
      console.error("❌ AI Chat Response Failed:", chatData);
      process.exit(1);
    }

    // 3. Test Submit Report
    console.log("\n🧪 Testing POST /api/reports (Submit concern)...");
    const reportRes = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        category: "Workload & Stress",
        description: "Testing automated system reporting. Burnout symptoms reported.",
        anonymous: true
      })
    });
    const reportData = await reportRes.json();
    console.log("📋 Submitted Report ID:", reportData.id);
    if (reportData.id) {
      console.log("✅ Report Submission Succeeded.");
    } else {
      console.error("❌ Report Submission Failed:", reportData);
      process.exit(1);
    }

    // 4. Test Fetch Reports
    console.log("\n🧪 Testing GET /api/reports...");
    const fetchRes = await fetch(`${baseUrl}/api/reports`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const reports = await fetchRes.json();
    console.log(`📋 Found ${reports.length} reports in database/store.`);
    if (reports.length > 0) {
      console.log("✅ Fetch Reports Succeeded.");
    } else {
      console.error("❌ Fetch Reports Failed:", reports);
      process.exit(1);
    }

    // 5. Test Analytics
    console.log("\n🧪 Testing GET /api/analytics...");
    const analyticsRes = await fetch(`${baseUrl}/api/analytics`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const analytics = await analyticsRes.json();
    console.log("📊 Analytics Data:", analytics);
    if (analytics.totalCases !== undefined) {
      console.log("✅ Fetch Analytics Succeeded.");
    } else {
      console.error("❌ Fetch Analytics Failed:", analytics);
      process.exit(1);
    }

    console.log("\n🎉 All tests passed successfully!");
  } catch (err) {
    console.error("❌ Test execution failed with error:", err.message);
    console.log("💡 Make sure the gateway server is running on port 5001 before starting tests.");
    process.exit(1);
  }
}

runTests();
