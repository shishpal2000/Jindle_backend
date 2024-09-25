const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    job_description: {
        keyResponsibilities: { type: [String], default: [] },
        keyRequirements: { type: [String], default: [] }
    }
});

jobSchema.index({ jobId: 1 });

module.exports = mongoose.model('Job', jobSchema);
