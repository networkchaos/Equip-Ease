const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const errorHandler = require('./middleware/errorHandler');
const equipmentRoutes = require('./routes/equipmentRoutes');
const path = require('path');
const equipment = require('./routes/equipment');

const reviewRoutes = require('./routes/review');
const mpesaRoutes = require('./routes/mpesaRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
  console.log("✅ /api/test was called!");
  res.json({ message: 'Backend is working!' });
});

app.use('/api', authRoutes);
app.use('/api', communityRoutes);
app.use('/api/equipment', equipment);

app.use('/api/reviews', reviewRoutes);
// Safaricom callback
app.use('/api', mpesaRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/equipment', equipmentRoutes);
// error handling middleware
app.use(errorHandler);

module.exports = app;
