const axios = require("axios");
const fs = require("fs");
const expenseService = require('./expenseService.js');
const pdfParse = require("pdf-parse");
const path = require('path');
require("dotenv").config();

class ExpenseExtract {
    static async extractExpenceImage(image64) {

        
        const requestData = {
            contents: [
                {
                    parts: [
                        {
                            text: `Am sharing the expense bill :
                            Give the extracted data from the bill in the structure of
                            {expense_title : Short description (e.g., Groceries, Rent, Uber Ride),
                            items : [{amount_spent : Clearly display the cost (e.g., 500 or 10.99)},{title : T-shirt etc}](array of all individual products),
                            category : Auto-tagged or user-assigned (e.g., Food, Transport, Shopping or others((if not mentioned))),
                            date_time : When the transaction occurred format (2025-02-27),
                            payment_method : How the payment was made (Credit Card, UPI, Cash or others(if not mentioned)),
                            merchant_name : Who the payment was made to (Amazon, Starbucks, Walmart or others(if not mentioned)),amount_spen:10000} 
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

    static async extractBankStatement(fileBuffer) {
        try {
            console.log("Processing uploaded PDF...");
    
            const pdfData = await pdfParse(fileBuffer);
            const extractedText = pdfData.text;
    
            const prompt = `Extract structured financial transactions from the following bank statement:
            ${extractedText}
            Return only an json data {expense_name : name or transaction ID, date_time: "2024-03-01", amount_spent: 300 } 
            Ensure the response is valid JSON without any extra text, explanations, or formatting
            if the pdf is not applicable bank statement return an json with {status : 503 , message : invalid pdf}
            `;
    
            const response = await axios.post(
                process.env.GEMINI_URL,
                { contents: [{ parts: [{ text: prompt }] }] },
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
                throw new Error("Invalid response from Gemini API.");
            }
    
            let geminiOutput = response.data.candidates[0].content.parts[0].text;
            geminiOutput = geminiOutput.replace(/```json|```/g, "").trim();
    
            const structuredData = JSON.parse(geminiOutput);
            console.log("Final bank statement : ",structuredData);
            

            return structuredData;
    
        } catch (error) {
            console.error("Process failed:", error.message);
            throw new Error("Error processing bank statement");
        }
    }
}

module.exports = ExpenseExtract;
