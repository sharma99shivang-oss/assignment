const express = require("express");
const router = express.Router();

const { getSummary, getMonthlyTrends } = require("../controllers/dashboardController");

router.get("/summary", getSummary);
router.get("/trends", getMonthlyTrends);

module.exports = router;