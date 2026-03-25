const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { fullName, address, city, postcode, phone, totalAmount, orderRef } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: 'boizupdate@gmail.com', // Sending straight to your email
        subject: `🚨 New Axiom Labs Order: ${orderRef}`,
        text: `
A new order is awaiting bank transfer.

REFERENCE: ${orderRef}
TOTAL: ${totalAmount}

CUSTOMER DETAILS:
Name: ${fullName}
Phone: ${phone}

ADDRESS:
${address}
${city}
${postcode}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Order sent to email' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send order' });
    }
}