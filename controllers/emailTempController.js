const Template = require('../model/emailtemp');

exports.createOrUpdateTemplate = async (req, res) => {
    try {
        const { name, subject, htmlContent, status } = req.body;

        const result = await Template.findOneAndUpdate(
            { name },  
            { subject, htmlContent, status },  
            { new: true, upsert: true }  
        );

        res.status(200).json({
            success: true,
            message: 'Template saved successfully',
            data: result
        });
    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save template',
            error: error.message
        });
    }
};
// Get a template by status
exports.getTemplateByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const template = await Template.findOne({ status });
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        res.status(200).json({ success: true, template });
    } catch (error) {
        console.error('Error retrieving template:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve template', error: error.message });
    }
};
