const express = require('express');
const router = express.dirname ? express.Router() : require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// POST a new question/fatwa
router.post('/', async (req, res) => {
  try {
    const { name, email, question } = req.body;
    if (!name || !question) return res.status(400).json({ msg: 'الاسم والسؤال مطلوبان' });

    const newMsg = new Message({ name, email, question });
    await newMsg.save();
    res.json(newMsg);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// GET all questions (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// DELETE a question (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Mark as answered and promote to Public Archive
router.put('/:id/answer', auth, async (req, res) => {
  try {
    const { answer, category } = req.body;
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: 'Message not found' });

    msg.isAnswered = true;
    msg.answer = answer || '';
    msg.category = category || 'عام';
    await msg.save();

    // Promote to Public FatwaArchive
    const FatwaArchive = require('../models/FatwaArchive');
    const newArchive = new FatwaArchive({
      question: msg.question,
      answer: msg.answer,
      category: msg.category
    });
    await newArchive.save();

    res.json(msg);
  } catch (error) {
    console.error('Promotion to Archive failed:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
