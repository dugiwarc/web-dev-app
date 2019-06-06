require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");

connectDB();

// Allow us to get the data in req.body
app.use(express.json({ extended: false }));
app.use(cookieParser());

// Locals
app.use((req, res, next) => {
  app.locals.io = io;
  next();
});

app.get("/", (req, res) => res.send("API RUNNING"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
