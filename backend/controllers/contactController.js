const sendMail = require('../utils/sendMail');

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const text = `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`;

    await sendMail(process.env.MAIL_USER || 'admin@wearandgear.com', `Contact: ${subject || 'New Message'}`, text);

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitContact };
