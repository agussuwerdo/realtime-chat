// server/index.js
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Pusher = require("pusher"); // Import Pusher
const Message = require("./models/Message");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true, // Enable TLS for secure communication
});

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost/chat-app";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Watch for changes in the message collection and trigger Pusher events
  const messageCollection = db.collection("messages");
  const changeStream = messageCollection.watch();

  changeStream.on("change", (change) => {
    console.log(`Document ${change.operationType}`);
  });
});

// Route to send a new message
app.post("/messages", async (req, res) => {
  const newMessage = new Message({
    username: req.body.username,
    message: req.body.message,
    timestamp: new Date(),
  });

  try {
    // Save the new message to the database and wait for it to complete
    const savedMessage = await newMessage.save();

    // Trigger the Pusher event and wait for it to complete
    await pusher.trigger("chat", "newMessage", {
      _id: savedMessage._id,
      username: savedMessage.username,
      message: savedMessage.message,
      timestamp: savedMessage.timestamp,
    });

    // Send a success response after the message is saved and broadcast
    res.status(201).send("Message saved and broadcast via Pusher");
  } catch (err) {
    // Handle any errors
    res.status(500).send(err);
  }
});

// Route to send previous messages when the client requests them
app.get("/messages", (req, res) => {
  Message.find()
    .sort({ timestamp: 1 }) // Sort messages by timestamp (ascending)
    .then((messages) => {
      res.json(messages); // Send the messages as JSON
    })
    .catch((err) => res.status(500).send(err));
});

// Route to delete a message
app.delete("/messages/:id", async (req, res) => {
  // Make the route handler async
  const id = req.params.id;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id); // Await the deletion

    if (deletedMessage) {
      await pusher.trigger("chat", "deleteMessage", {
        // Await the Pusher trigger
        messageId: deletedMessage._id,
      });

      res.status(200).send("Message deleted and broadcast via Pusher");
    } else {
      res.status(404).send("Message not found");
    }
  } catch (err) {
    res.status(500).send(err); // Catch and handle any errors
  }
});

// Serve the React app for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Only listen to a port in development (Vercel will handle ports automatically)
if (!process.env.VERCEL_ENV) {
  const NODE_PORT = process.env.NODE_PORT || 5000;
  app.listen(NODE_PORT, () =>
    console.log(`Server running on port ${NODE_PORT}`)
  );

  // Error-handling middleware only in development mode
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace in the console
    res.status(500).json({
      message: err.message,
      stack: err.stack, // Show stack trace 
    });
  });
}

// Export the Express app (necessary for Vercel serverless functions)
module.exports = app;
