const ContactInfo = require('../model/contactInfo');

// Create or update contact information
exports.createOrUpdateContactInfo = async (req, res) => {
    const { email, address } = req.body;

    try {
        let contactInfo = await ContactInfo.findOne();

        if (contactInfo) {
            contactInfo.email = email;
            contactInfo.address = address;
            await contactInfo.save();

            return res.status(200).json({ success: true, message: 'Contact information updated successfully', data: contactInfo });
        } else {
            // Create new contact information
            contactInfo = new ContactInfo({ email, address });
            await contactInfo.save();

            return res.status(201).json({ success: true, message: 'Contact information created successfully', data: contactInfo });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Fetch contact information
exports.getContactInfo = async (req, res) => {
    try {
        const contactInfo = await ContactInfo.findOne();
        if (!contactInfo) {
            return res.status(404).json({ success: false, message: 'Contact information not found' });
        }
        res.json({ success: true, data: contactInfo });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Delete contact information
exports.deleteContactInfo = async (req, res) => {
    try {
        const contactInfo = await ContactInfo.findOneAndDelete();
        if (!contactInfo) {
            return res.status(404).json({ success: false, message: 'Contact information not found' });
        }

        res.json({ success: true, message: 'Contact information deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
