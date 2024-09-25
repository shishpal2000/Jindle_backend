const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

// Import routes
const careerRoutes = require('./routes/careerRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const jobRoutes = require('./routes/jobRoutes');
const emialTempRoutes = require('./routes/emailTempRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');

// Initialize the Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/jobs', jobRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/auth', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contactinfo', contactInfoRoutes);
app.use('/api/emailtemp', emialTempRoutes);

app.use(bodyParser.json({ limit: '20mb' })); // Increase JSON limit if needed
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

module.exports = app;
