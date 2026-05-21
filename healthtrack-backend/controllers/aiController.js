const { GoogleGenerativeAI } = require("@google/generative-ai");

const simulateDiagnosis = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid payload. Expected an array of messages." });
    }

    // Initialize Gemini inside the handler to ensure it picks up the latest env vars
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are HealthBot, a professional and empathetic AI Triage Assistant for the HealthTrack platform. 
      Your goal is to help users understand their symptoms and provide preliminary advice.
      
      Guidelines:
      1. ALWAYS include a medical disclaimer: "Disclaimer: I am an AI assistant, not a doctor. This is for informational purposes only. If you have severe symptoms, seek emergency care immediately."
      2. Ask follow-up questions to understand the duration, severity, and context of symptoms.
      3. Suggest possible next steps (e.g., "Monitor your temperature", "Consult a General Physician").
      4. Keep your tone calm, professional, and empathetic.
      5. If symptoms sound life-threatening (chest pain, severe bleeding, difficulty breathing), immediately advise the user to call emergency services.`
    });

    // Format messages for Gemini (Gemini uses 'user' and 'model' roles)
    // The incoming messages from frontend are { role: 'user' | 'ai', content: string }
    let history = messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Gemini strictly requires the history to start with a 'user' message.
    // If the frontend sent the initial AI greeting as the first message, we must remove it.
    if (history.length > 0 && history[0].role === "model") {
      history.shift(); // Remove the leading model message
    }

    const userMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    const aiResponse = {
      role: "ai",
      content: text,
    };

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    console.error("Gemini AI error detailed:", error);
    
    // Fallback if API key is missing or error occurs
    res.status(500).json({ 
      success: false,
      error: "AI Assistant is currently unavailable.",
      details: error.message 
    });
  }
};

module.exports = {
  simulateDiagnosis,
};
