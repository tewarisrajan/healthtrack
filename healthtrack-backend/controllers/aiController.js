const { GoogleGenerativeAI } = require("@google/generative-ai");
const Record = require("../models/Record");

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

const extractStructuredData = async (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.user._id || req.user.id;

    // Fetch the record to ensure the user owns it
    const record = await Record.findOneAsync({ _id: recordId, user: userId });

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    if (!record.extractedText) {
      return res.status(400).json({ success: false, message: "No text available to extract insights from." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are a medical data extraction API. Your job is to extract structured data from raw OCR text of medical documents (prescriptions, lab reports, etc.).
      You MUST return a pure JSON object. Do NOT include markdown code blocks (like \`\`\`json) or any other conversational text.
      The JSON object should have the following schema if the data is present in the text (omit fields if not found):
      {
        "vitals": [ { "name": "string", "value": "string", "unit": "string" } ],
        "medications": [ { "name": "string", "dosage": "string", "frequency": "string" } ],
        "diagnoses": [ "string" ],
        "keyFindings": [ "string" ]
      }`
    });

    const result = await model.generateContent(record.extractedText);
    let textResult = result.response.text().trim();
    
    // Attempt to extract JSON if it's wrapped in a markdown block
    const jsonMatch = textResult.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      textResult = jsonMatch[1];
    }
    
    const structuredData = JSON.parse(textResult);

    // Update the record
    await Record.updateAsync(
      { _id: recordId, user: userId },
      { $set: { structuredData } }
    );

    // Fetch updated record to return
    const updatedRecord = await Record.findOneAsync({ _id: recordId, user: userId });

    res.status(200).json({
      success: true,
      data: { ...updatedRecord, id: updatedRecord._id },
    });

  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to extract structured data.",
      details: error.message 
    });
  }
};

module.exports = {
  simulateDiagnosis,
  extractStructuredData,
};
