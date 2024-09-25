const Job = require('../model/job');

// Generate the next job ID
const generateJobId = async () => {
    try {
        const latestJob = await Job.findOne().sort({ jobId: -1 }).exec();
        if (!latestJob) return 'ASCH000001';

        const lastNumber = parseInt(latestJob.jobId.slice(4), 10);
        return `ASCH${(lastNumber + 1).toString().padStart(6, '0')}`;
    } catch (error) {
        console.error('Error generating Job ID:', error);
        throw error;
    }
};

// Get a job by its ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findOne({ jobId: req.params.jobId });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job retrieved successfully', data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const newJobId = await generateJobId();
        const job = new Job({ jobId: newJobId, ...req.body });
        await job.save();
        res.status(201).json({ success: true, message: 'Job created successfully', data: job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ success: false, message: 'Failed to create job' });
    }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json({ success: true, message: 'Jobs retrieved successfully', data: jobs });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate({ jobId: req.params.jobId }, req.body, { new: true });
        if (!updatedJob) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job updated successfully', data: updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const result = await Job.findOneAndDelete({ jobId: req.params.jobId });
        if (!result) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};