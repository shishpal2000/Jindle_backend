const Contact = require('../model/contact');
const transporter = require('../config/mailer');

exports.submitContactForm = async (req, res) => {
  try {
    const { first_name, last_name, email_address, phone_number, message } = req.body;

    if (!first_name || !last_name || !email_address || !phone_number || !message) {
      return res.status(400).send('All form fields are required');
    }

    const contact = new Contact({
      firstName: first_name,
      lastName: last_name,
      email: email_address,
      phone: phone_number,
      message: message
    });

    await contact.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bhuvneshkardam@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
              <html>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                          <h1 style="text-align: center; color: #333;">New Contact Form Submission</h1>
                          <p><strong>First Name:</strong> ${first_name}</p>
                          <p><strong>Last Name:</strong> ${last_name}</p>
                          <p><strong>Email:</strong> ${email_address}</p>
                          <p><strong>Phone:</strong> ${phone_number}</p>
                          <p><strong>Message:</strong></p>
                          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #007bff;">
                              ${message}
                          </blockquote>
                          <p style="text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777;">&copy; 2024 ASCHPRO. All rights reserved.</p>
                      </div>
                  </body>
              </html>
          `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully!' }); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

exports.getAllMail = async (req, res) => {
  try {
    const mail = await Contact.find();
    res.status(200).json({ success: true, message: 'Contact Form retrieved successfully', data: mail });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve Contact Form', error: err.message });
  }
};

// Delete a contact form
exports.deleteContactForm = async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Contact form not found' });
    res.status(200).json({ success: true, message: 'Contact form deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
