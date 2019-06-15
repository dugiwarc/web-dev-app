require("dotenv").config();

const express = require("express");
// const connectDB = require("./config/db");
const app = express();
var http = require("http");
var server = http.createServer(app);
const mongoose = require("mongoose");
var io = require("socket.io")(http);

// console.log(io);
connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB connected");
    io.on("connection", async socket => {
      try {
        console.log("user connected");
      } catch (error) {
        console.log("not connected");
      }
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const path = require("path");
const cookieParser = require("cookie-parser");

connectDB();

// Allow us to get the data in req.body
app.use(express.json({ extended: false }));
app.use(cookieParser());

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(process.env.PORT, () => console.log(`Server started`));
