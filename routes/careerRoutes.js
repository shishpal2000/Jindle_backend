const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const upload = require('../middleware/upload');

router.post('/application-submit', upload.single('cv_file'), careerController.submitApplication); //working
router.get('/get-all-application', careerController.getAllApplications); //working
router.delete('/delete-application/:id', careerController.deleteApplicationsById);
router.post('/applications/:id/reply', careerController.replyToApplication); //working
router.get('/applications/:id/status-history', careerController.getStatusHistory);

module.exports = router;
