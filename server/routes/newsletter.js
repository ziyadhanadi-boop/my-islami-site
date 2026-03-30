const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// GET all subscribers 
router.get('/', auth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ _id: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST to send email campaign
router.post('/campaign', auth, async (req, res) => {
  try {
    const { subject, htmlBody } = req.body;
    if (!subject || !htmlBody) return res.status(400).json({ msg: 'يرجى إدخال الموضوع والرسالة' });

    const subscribers = await Newsletter.find();
    if (!subscribers.length) return res.status(400).json({ msg: 'لا يوجد مشتركون لإرسال النشرة لهم' });

    // NodeMailer logic
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Bcc all subscribers to protect privacy
    const emails = subscribers.map(s => s.email).join(', ');

    const mailOptions = {
      from: '"منصة إسلامي" <noreply@islami.com>',
      bcc: emails,
      subject: subject,
      html: htmlBody
    };

    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('--- EMAIL MOCK (No SMTP config found) ---');
      console.log('Bcc:', emails);
      console.log('Subject:', subject);
      console.log('HTML:', htmlBody);
      console.log('-----------------------------------------');
    }

    res.json({ msg: 'تم إرسال حملة البريد الإلكتروني بنجاح!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'حدث خطأ في سيرفر البريد. تأكد من إعدادات SMTP في ملف .env' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'يرجى إدخال البريد الإلكتروني' });

    let subscriber = await Newsletter.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ msg: 'هذا البريد مسجل بالفعل في قائمتنا البريدية' });
    }

    subscriber = new Newsletter({ email });
    await subscriber.save();
    
    res.json({ msg: 'تم تسجيلك في النشرة البريدية بنجاح!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
