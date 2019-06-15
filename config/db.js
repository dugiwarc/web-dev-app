const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB connected");
    io.on("connection", socket => {
      console.log("user connected");
      socket.on("chat-message", msg => {
        console.log("message sent" + JSON.stringify(msg));
        io.emit("chat-message", msg);
      });
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
