const simulateDiagnosis = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid payload. Expected an array of messages." });
    }

    // Simulate network and processing delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // A generic, robust AI-like response
    const aiResponse = {
      role: "ai",
      content: "Based on your symptoms, it sounds like you might be experiencing something common like stress or a mild viral infection. Please make sure to stay hydrated, document your vitals, and get plenty of rest. \n\n**Disclaimer:** I am an AI assistant and not a licensed doctor. If your symptoms worsen or persist for more than 48 hours, please consult a real physician immediately or visit the emergency room.",
    };

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ error: "Server error during AI simulation" });
  }
};

module.exports = {
  simulateDiagnosis,
};
