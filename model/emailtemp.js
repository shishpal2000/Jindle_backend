const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    htmlContent: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'processed', 'rejected'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
