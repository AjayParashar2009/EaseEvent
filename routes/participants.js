const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const { body, validationResult } = require('express-validator');

// POST /api/participants  (submit registration)
router.post('/', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('mainEvent').notEmpty()
], async (req, res) => {
  console.log("Incoming data:", req.body); // log to confirm frontend is sending

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, course, semester, mainEvent, subEvent, customEvent, email, phone } = req.body;

  try {
    const p = new Participant({ name, course, semester, mainEvent, subEvent, customEvent, email, phone });
    await p.save();
    console.log("Saved:", p);
    res.status(201).json({ msg: 'Registered', participant: p });
  } catch (err) {
    console.error("Error saving participant:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/participants  (list participants - public for now)
router.get('/', async (req, res) => {
  try {
    const list = await Participant.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching participants:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/participants/:id (for testing)
router.delete('/:id', async (req, res) => {
  try {
    const p = await Participant.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error("Error deleting participant:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
