const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobId: { type: String, required: true },  // This field is required
    location: { type: String, required: true },
    jobTitle: { type: String, required: true },
    cv_file: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'processed', 'rejected'],  
        default: 'pending'
    },
    adminMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
