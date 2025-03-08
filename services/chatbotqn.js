const axios = require("axios");
require("dotenv").config();

class Chatbotqn {
    static conversationHistory = [];  

    static async getAIResponse(question) {
        try {
            console.log("Processing AI request...");
            console.log("User Question:", question);
            let historyText = Chatbotqn.conversationHistory.map(
                (entry) => `User: ${entry.question}\nAI: ${entry.answer}`
            ).join("\n");

            
            historyText = historyText.split("\n").slice(-6).join("\n");

            const prompt = `This is a conversation about finance. Here’s what we discussed so far:
            ${historyText}

            Now, answer the following finance-related question concisely:
            ${question}
            Keep it short and informative.`;

            const response = await axios.post(
                process.env.GEMINI_URL,
                { contents: [{ parts: [{ text: prompt }] }] },
                { headers: { "Content-Type": "application/json" } }
            );

            if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
                throw new Error("Invalid response from Gemini AI.");
            }

            let geminiOutput = response.data.candidates[0].content.parts[0].text;
            geminiOutput = geminiOutput.replace(/```json|```/g, "").trim();

            
            Chatbotqn.conversationHistory.push({ question, answer: geminiOutput });

            return { status: 200, answer: geminiOutput };

        } catch (error) {
            console.error("AI Processing Error:", error.message);
            return { status: 500, message: "Error processing AI response" };
        }
    }
}

module.exports = Chatbotqn;
