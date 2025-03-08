const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const imagePath = "./image.jpg";
const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

class ExpenseExtract {
    static async extractExpenceImage(image64) {
        console.log(process.env.GEMINI_URL);
        const requestData = {
            contents: [
                {
                    parts: [
                        {
                            text: `Am sharing the expense bill :
                            Give the extracted data from the bill in the structure of
                            {expenseTitle : Short description (e.g., Groceries, Rent, Uber Ride),
                            items : [{amountSpent : Clearly display the cost (e.g., 500 or 10.99)},{title : T-shirt etc}](array of all individual products),
                            category : Auto-tagged or user-assigned (e.g., Food, Transport, Shopping or others((if not mentioned))),
                            date : When the transaction occurred (e.g., Mar 8, 2025),
                            paymentMethod : How the payment was made (Credit Card, UPI, Cash or others(if not mentioned)),
                            merchantName : Who the payment was made to (Amazon, Starbucks, Walmart or others(if not mentioned)),totalAmount:10000} 
                            (if any field is not mentioned in the bill follow the rule {date : ""})
                            
                            if the image is not able to process then send a JSON response like {error:not able to read,status:503}`,
                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg", 
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        };

        try {
            const response = await axios.post(
                process.env.GEMINI_URL,
                requestData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                let value = response.data.candidates[0].content.parts[0].text;
                value = value.replace(/```json|```/g, "").trim();
                
                const expense = JSON.parse(value);
                console.log(expense);
            } else if (response.status === 500) {
                console.log("Internal Server Error");
            } else {
                console.log("Image is not readable");
            }
        } catch (error) {
            console.error("Error processing image:", error.message);
        }
    }

    static async extractBankStatement(pdfPath) {
        try {
            console.log("Processing PDF:", pdfPath);
            const dataBuffer = fs.readFileSync(pdfPath);
            const pdfData = await pdfParse(dataBuffer);
            const extractedText = pdfData.text;
           
            const prompt = `Extract structured financial transactions from the following bank statement:
            ${extractedText}
            Return only an array of objects in this format:
            [{"date": "YYYY-MM-DD", "debit": amount, "credit": amount, "balance": amount}]
            Ensure the response is valid JSON without any extra text, explanations, or formatting.`;

            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                { contents: [{ parts: [{ text: prompt }] }] },
                { headers: { "Content-Type": "application/json" } }
            );

            if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
                throw new Error("Invalid response from Gemini API.");
            }

            let geminiOutput = response.data.candidates[0].content.parts[0].text;
            geminiOutput = geminiOutput.replace(/```json|```/g, "").trim();

            const structuredData = JSON.parse(geminiOutput);
            const OUTPUT_JSON_FILE = "output.json";
            fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(structuredData, null, 2));

            console.log(`Output saved to ${OUTPUT_JSON_FILE}`);
        } catch (error) {
            console.error("Process failed:", error.message);
        }
    }
}

module.exports = ExpenseExtract;
