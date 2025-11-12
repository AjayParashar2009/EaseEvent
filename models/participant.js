// const mongoose = require("mongoose");

// const participantSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   mainEvent: { type: String, required: true },
//   subEvent: { type: String },
//   customEvent: { type: String },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Participant", participantSchema);


const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String },
  semester: { type: String },
  mainEvent: { type: String, required: true },
  subEvent: { type: String },
  customEvent: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Participant", participantSchema);
