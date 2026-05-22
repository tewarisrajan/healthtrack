async function testExtract() {
    const BASE_URL = "http://localhost:4000/api";
    
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "demo@healthtrack.com", password: "demo123" })
        });
        
        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error("❌ Login failed:", loginData.message);
            return;
        }
        
        const token = loginData.token;
        const userId = loginData.user.id;
        console.log("✅ Logged in! Token received.");

        console.log("2. Creating a test record with extractedText...");
        const createRes = await fetch(`${BASE_URL}/users/${userId}/records`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title: "Test Lab Report",
                type: "LAB_REPORT",
                providerName: "Test Lab",
                extractedText: "Patient Name: John Doe\nDate: 2023-10-25\nBlood Pressure: 120/80 mmHg\nHeart Rate: 72 bpm\nMedications prescribed: Amoxicillin 500mg twice daily for 7 days.\nDiagnosis: Mild Respiratory Infection."
            })
        });

        const createData = await createRes.json();
        if (!createData.success) {
            console.error("❌ Record creation failed:", createData);
            return;
        }
        const recordId = createData.data.id;
        console.log("✅ Record created! ID:", recordId);

        console.log("3. Calling AI Extraction...");
        const aiRes = await fetch(`${BASE_URL}/ai/extract-structured/${recordId}`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });

        const aiData = await aiRes.json();
        if (aiData.success) {
            console.log("✅ AI Extraction Success!");
            console.log("Structured Data:", JSON.stringify(aiData.data.structuredData, null, 2));
        } else {
            console.error("❌ AI Call failed:", JSON.stringify(aiData, null, 2));
        }
    } catch (e) {
        console.error("❌ Network/Server error:", e.message);
    }
}

testExtract();
