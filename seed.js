require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected. Seeding...");
    await Event.deleteMany({});
    const items = [
      {
        title: "Hackathon 2025",
        description: "Annual coding challenge",
        date: new Date("2025-02-14"),
        venue: "Computer Lab Hall",
        category: "hackathon",
      },
      {
        title: "Cultural Fest",
        description: "Cultural performances",
        date: new Date("2025-03-05"),
        venue: "Open Auditorium",
        category: "cultural",
      },
      {
        title: "Sports Meet",
        description: "Inter-department sports day",
        date: new Date("2025-04-10"),
        venue: "College Ground",
        category: "sports",
      },
    ];
    await Event.insertMany(items);
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
