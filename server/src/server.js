const cors = require("cors");
const express = require("express");
const db = require("../db");
const jwtUtils = require("../utils/jwtUtils");
const responseFormatter = require("../utils/responseFormatter");

const { authRoute, userRoute, chatRoute, messageRoute } = require("../routes");

const app = express();
db.connect(app);
app.use(cors());
app.use(responseFormatter);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", jwtUtils.authenticateToken, chatRoute);
app.use("/api/messages", jwtUtils.authenticateToken, messageRoute);

const port = process.env.PORT || 3000;
app.on("ready", () =>
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  })
);

module.exports = app;
