const express = require('express');
const router = express.Router();
const templateController = require('../controllers/emailTempController'); // Adjust path as needed

// POST endpoint to create or update a template
router.post('/templates', templateController.createOrUpdateTemplate);

// GET endpoint to retrieve a template by status
router.get('/templates/:status', templateController.getTemplateByStatus);

module.exports = router;
