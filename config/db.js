const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/tusk_world" || process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
