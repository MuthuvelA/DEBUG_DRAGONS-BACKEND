const axios = require("axios");
const fs = require("fs");
const expenseService = require('./expenseService.js');
const pdfParse = require("pdf-parse");
const path = require('path');
require("dotenv").config();


const imagePath = "./image.jpg";
const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

class ExpenseExtract {
    static async extractExpenceImage(image64) {

        
        const requestData = {
            contents: [
                {
                    parts: [
                        {
                            text: `Am sharing the expense bill :
                            Give the extracted data from the bill in the structure of
                            {expenseTitle : Short description (e.g., Groceries, Rent, Uber Ride),
                            [{amountSpent : Clearly display the cost (e.g., 500 or 10.99)},{title : T-shirt etc}](array of all individual products),
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
                                data: image64
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
                
        
// const directoryPath = path.join(__dirname, '../uploads/');
// const filePath = path.join(directoryPath, 'base64.txt');
//         fs.writeFile(filePath, imageBase64, 'utf8', (err) => {
//             if (err) {
//                 console.error("Error saving Base64:", err);
//             }
 
//         });
                await expenseService.addExpense(expense);
                return expense;
            }else {
                console.log("hekllo");
                throw new Error('Internal server error');
            }
        } catch (error) {
            console.log(error.message);
            
            throw error;
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
