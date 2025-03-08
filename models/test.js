const groupTransactionsByMonth = (transactions) => {
    const groupedData = {}; 
    const monthlyData = [];

    transactions.forEach(({ date_time, amount_spent }) => {
        const date = new Date(date_time);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; 
        const monthName = date.toLocaleString('en-US', { month: 'long' });
        const formattedMonth = `${monthName}-${date.getFullYear()}`;
        const day = date.getDate() - 1;

        if (!groupedData[yearMonth]) {
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            groupedData[yearMonth] = Array.from({ length: daysInMonth }, (_, i) => [i, 0]); // Initialize with [day, 0]
            monthlyData.push({ month: formattedMonth, expense: 0, income: 0 });
        }

        groupedData[yearMonth][day] = [day, amount_spent]; // Update with actual amount spent

        // Ensure month exists in monthlyData before updating expense
        const existingMonth = monthlyData.find(m => m.month === formattedMonth);
        if (existingMonth) {
            existingMonth.expense += amount_spent;
        }
    });

    // Sort months in descending order (latest first)
    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    // Extract xList and yList
    const xList = sortedKeys.map(key => groupedData[key].map(([day]) => day));
    const yList = sortedKeys.map(key => groupedData[key].map(([_, amount]) => amount));

    return {
        xList,
        yList,
        xTitle: "Months",
        yTitle: "Expense Amount",
        monthlyData
    };
};

// Example Data:
const transactions = [
    { date_time: "2024-03-01", amount_spent: 300 },
    { date_time: "2024-03-05", amount_spent: 1500 },
    { date_time: "2024-02-15", amount_spent: 1000 },
    { date_time: "2024-02-28", amount_spent: 2500 },
];

console.log(groupTransactionsByMonth(transactions));
