const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config/.env' });

class EmailSender {
    constructor() {
        // Create a Nodemailer transporter using SMTP
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }

    async sendEmail({ to, subject, text }) {
        // Email configuration
        const mailOptions = {
            from:  process.env.GMAIL,
            to,
            subject,
            text,
        };

        // Send the email
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = EmailSender;
