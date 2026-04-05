const Record = require("../models/Record");

// FULL SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryTotals = {};
    const recent = records.slice(-5).reverse();

    records.forEach(r => {
      if (r.type === "income") {
        totalIncome += r.amount;
      } else {
        totalExpense += r.amount;
      }

      // Category wise
      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += r.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categoryTotals,
      recent
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMonthlyTrends = async (req, res) => {
  try {
    const records = await Record.find();

    const monthly = {};

    records.forEach(r => {
      const month = new Date(r.date).toLocaleString("default", { month: "short" });

      if (!monthly[month]) {
        monthly[month] = { income: 0, expense: 0 };
      }

      if (r.type === "income") {
        monthly[month].income += r.amount;
      } else {
        monthly[month].expense += r.amount;
      }
    });

    res.json(monthly);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};