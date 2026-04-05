const express = require('express');
const cors = require('cors');

const app = express();
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Server Error"
  });
});
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

module.exports = app;