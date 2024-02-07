const cors = require("cors");
const express = require("express");
const db = require("../db");
const responseFormatter = require("../utils/responseFormatter");

const userRoute = require("../routes/userRoute");

const app = express();
db.connect(app);
app.use(cors());
app.use(responseFormatter);
app.use(express.json());
app.use("/api/users", userRoute);

const port = process.env.PORT || 3000;
app.on("ready", () =>
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  })
);

module.exports = app;
