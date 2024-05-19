const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './config/config.env' });
const connectDB = async () => {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(
      `MongoDB Connected :${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.log("catch error".red.bold, err);
  }
};
module.exports = connectDB;
