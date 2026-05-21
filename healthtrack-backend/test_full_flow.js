async function testIntegration() {
    const BASE_URL = "http://localhost:4000/api";
    
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "demo@healthtrack.com", password: "demo123" })
        });
        
        const loginData = await loginRes.json();
        console.log("Login Response:", JSON.stringify(loginData, null, 2));
        if (!loginData.success) {
            console.error("❌ Login failed:", loginData.message);
            return;
        }
        
        const token = loginData.token;
        console.log("✅ Logged in! Token received.");

        console.log("2. Calling AI Triage...");
        const aiRes = await fetch(`${BASE_URL}/ai/simulate`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                messages: [
                    { role: "user", content: "I have a sharp pain in my chest." }
                ]
            })
        });

        const aiData = await aiRes.json();
        if (aiData.success) {
            console.log("✅ AI Response Success!");
            console.log("AI Content:", aiData.data.content);
        } else {
            console.error("❌ AI Call failed:", JSON.stringify(aiData, null, 2));
        }
    } catch (e) {
        console.error("❌ Network/Server error:", e.message);
        console.log("Is your backend running? Try starting it with 'npm run dev' in healthtrack-backend.");
    }
}

testIntegration();
