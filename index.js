const app = require('./app.js');
const test = require('./services/expenseExtract.js')

app.get('/',(req,res)=>{
    res.send("FinFlow....");
})

app.listen(3000,()=>{
    console.log("Running.....");
});