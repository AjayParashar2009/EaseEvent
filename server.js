require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const participantRoutes = require('./routes/participants');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);

// serve static frontend (place your front-end build or site in /public)
// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// For any non-API route, serve the main page
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});


// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));


// ================= NOTICES API =================
const notices = [
  {
    title: "Hackathon 2025",
    date: "February 14, 2025",
    venue: "Computer Lab Hall",
    description: "Join the annual coding challenge and showcase your innovation skills!"
  },
  {
    title: "Cultural Fest",
    date: "March 5, 2025",
    venue: "Open Auditorium",
    description: "Experience vibrant performances by students across departments."
  },
  {
    title: "Sports Meet",
    date: "April 10, 2025",
    venue: "College Ground",
    description: "Be part of inter-department sports competitions and cheer your teams!"
  }
];

app.get("/api/notices", (req, res) => {
  res.json(notices);
});

// Catch-all route for unknown paths
app.use((req, res) => {
  res.status(404).send("404: Page not found");
});
