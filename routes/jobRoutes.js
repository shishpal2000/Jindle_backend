const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/create-job', jobController.createJob);
router.get('/all-jobs', jobController.getAllJobs);
router.get('/get-job/:jobId', jobController.getJobById);
router.put('/update-job/:jobId', jobController.updateJob);
router.delete('/delete-job/:jobId', jobController.deleteJob);

module.exports = router;
