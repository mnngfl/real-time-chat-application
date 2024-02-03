import express from "express";

const { ChatModel } = require("../models/chat/chat");

const db = require("../db");
const app = express();

db.connect(app);
app.use(express.json());

const port = process.env.PORT || 3000;
app.on("ready", () =>
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  })
);

module.exports = app;
