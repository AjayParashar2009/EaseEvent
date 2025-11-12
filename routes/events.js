const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

// GET /api/events  (public) - list upcoming events (sorted)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/events  (admin only)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { title, description, date, venue, category, metadata } = req.body;
  try {
    const ev = new Event({ title, description, date: date ? new Date(date) : undefined, venue, category, metadata });
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/events/:id (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, date, venue, category, metadata } = req.body;
    const ev = await Event.findByIdAndUpdate(req.params.id, { title, description, date, venue, category, metadata }, { new: true });
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/events/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
