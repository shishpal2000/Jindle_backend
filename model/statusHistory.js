const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'processed', 'rejected'], required: true },
    message: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
