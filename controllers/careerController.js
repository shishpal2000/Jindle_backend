const Career = require('../model/career');
const StatusHistory = require('../model/statusHistory');
const transporter = require('../config/mailer');
const Template = require('../model/emailtemp');

exports.submitApplication = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, jobId, location, jobTitle } = req.body;
        const file = req.file;

        // Create a new Career application document
        const application = new Career({
            firstName,
            lastName,
            email,
            phone,
            jobId,
            location,
            jobTitle,
            cv_file: file ? file.path : null,
            status: 'pending'
        });

        await application.save();

        const template = await Template.findOne({ name: 'application_received' });

        if (!template) {
            return res.status(500).json({ message: 'Email template for application received not found' });
        }

        const htmlContent = template.htmlContent
            .replace(/{{firstName}}/g, firstName)
            .replace(/{{lastName}}/g, lastName)
            .replace(/{{email}}/g, email)
            .replace(/{{phone}}/g, phone)
            .replace(/{{location}}/g, location)
            .replace(/{{jobTitle}}/g, jobTitle);

        // Define mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.HR_EMAIL || 'Bhuvneshkardam@gmail.com',
            subject: template.subject,
            html: htmlContent,
            attachments: file ? [{
                filename: file.originalname,
                path: file.path
            }] : []
        };

        // Send email using transporter
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Aplication submit successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit application' });
    }
};

// Fetch all job applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Career.find();
        res.status(200).json({
            success: true,
            message: 'Carrer Form retrieved successfully',
            data: applications
        });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to retrieve Carrer Form', error: err.message });
    }
};

// Delete a Career form
exports.deleteApplicationsById = async (req, res) => {
    try {
        const result = await Career.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Career form not found' });
        res.status(200).json({ success: true, message: 'Career form deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.replyToApplication = async (req, res) => {
    const { id } = req.params;
    const { status, adminMessage } = req.body;

    const validStatuses = ['pending', 'reviewed', 'processed', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const career = await Career.findById(id);

        if (!career) {
            return res.status(404).json({ message: 'Career application not found' });
        }

        // Update career status
        career.status = status;
        career.adminMessage = adminMessage || '';
        await career.save();

        // Save status history
        await StatusHistory.create({
            applicationId: id,
            status,
            message: adminMessage
        });

        // Fetch email template
        const template = await Template.findOne({ status });

        if (!template) {
            return res.status(500).json({ message: 'Email template not found for the selected status' });
        }

        const htmlContent = template.htmlContent
            .replace(/{{firstName}}/g, career.firstName || '')
            .replace(/{{lastName}}/g, career.lastName || '')
            .replace(/{{jobTitle}}/g, career.jobTitle || '')
            .replace(/{{adminMessage}}/g, adminMessage || '');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: career.email,
            subject: template.subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Application status updated and email sent successfully', career });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'An error occurred while updating the application status', error: error.message });
    }
};


exports.getStatusHistory = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch status history for the given application ID
        const statusHistory = await StatusHistory.find({ applicationId: id }).sort({ date: -1 });

        if (!statusHistory) {
            return res.status(404).json({ message: 'No status history found for this candidate' });
        }

        // Fetch current status from Career model
        const career = await Career.findById(id);
        if (!career) {
            return res.status(404).json({ message: 'Career application not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Status history retrieved successfully',
            data: {
                currentStatus: career.status,
                history: statusHistory
            }
        });
    } catch (error) {
        console.error('Error fetching status history:', error);
        res.status(500).json({ message: 'Failed to retrieve status history', error: error.message });
    }
};





