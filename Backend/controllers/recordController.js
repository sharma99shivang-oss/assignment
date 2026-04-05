const Record = require("../models/Record");

exports.createRecord = async (req, res) => {
  try {
    const { amount, category, type, date, note } = req.body;

    // ✅ validation
    if (!amount || !category || !type) {
      return res.status(400).json({
        message: "Amount, Category and Type required"
      });
    }

    // ✅ manual object create (IMPORTANT)
    const record = new Record({
      amount,
      category,
      type,
      date,
      note: note || ""   // 👈 force save
    });

    await record.save();

    res.status(201).json(record);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL + FILTER
exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Record.find(filter).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateRecord = async (req, res) => {
  try {
  const record = await Record.findByIdAndUpdate(
  req.params.id,
  req.body,
  { returnDocument: "after" }
);

    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteRecord = async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
