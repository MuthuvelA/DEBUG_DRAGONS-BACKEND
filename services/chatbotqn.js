const axios = require("axios");
const expenseService = require("./expenseService");

class Chatbotqn {
    static conversationHistory = [];  

    static async getAIResponse(question) {
        try {
            console.log("Processing AI request...");
            console.log("User Question:", question);
            let historyText = Chatbotqn.conversationHistory.map(
                (entry) => `User: ${entry.question}\nAI: ${entry.answer}`
            ).join("\n");
            const last2monthData = await expenseService.getDataByValue({year : 0,month : 2});
            if(question === "Finantial Insights" || question === "Revenue Analysis" || question === "Conversion Rates" || question === "Growth Trends"){
                console.log("last month data : ",last2monthData);
                const prompt = `it is an last 2 month data : ${last2monthData}, give me an ${question} analysis in five line`;

                const response = await axios.post(process.env.GEMINI_URL, { contents: [{ parts: [{ text: prompt }] }] },
                { headers: { "Content-Type": "application/json" } });

                console.log("response ->" ,response.data.candidates[0].content.parts[0].text);
                return  { status: 200, answer: response.data.candidates[0].content.parts[0].text };
                
            }
            historyText = historyText.split("\n").slice(-6).join("\n");

            const prompt = `This is a conversation about finance. Here’s what we discussed so far:
            ${historyText} and data : ${last2monthData}

            Now, answer the following finance-related question concisely:
            ${question}
            Keep it short five lines and informative.
            `;

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
