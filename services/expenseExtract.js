const axios = require("axios");
const fs = require('fs');

const imagePath = './image.jpg';
const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

class ExpenseExtract{
    static async extractExpenceImage(image64){
        console.log(process.env.GEMINI_URL);
        const axios = require('axios');
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
                merchantName : Who the payment was made to (Amazon, Starbucks, Walmart or others(if not mentioned)),totalAmount:10000} (if any field is not mentioned in the bill follow the rule {date : \"\"})
                
                if the image is not able to process then sent an json response like {error:not able to read,status:503}`,
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

        const resopnse = await axios.post(
        process.env.GEMINI_URL,
        requestData,
        { headers: { "Content-Type": "application/json" } }
        );
        
        if(resopnse.status==200){
            var value = resopnse.data.candidates[0].content.parts[0].text;
            value = value.replace(/```json|```/g, "").trim();

            var expense = JSON.parse(value);
            const totalExpense = expense.totalAmount;
            console.log(expense);
        }else if(resopnse.status==500) console.log("Internal Server Error");
        else console.log("Image is not readable");    
    }
}


module.exports = ExpenseExtract;