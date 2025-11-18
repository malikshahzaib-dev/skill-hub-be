import mongoose from "mongoose";
import User from "./models/userModel";
import md5 from "md5";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/skill-hubdb");
    console.log("MongoDB connected");

    const foundUser = await User.findOne({ email: "admin@gmail.com" });
    if (!foundUser) {
      const hashedPassword = md5("12345678"); // password as string
      await User.create({
        firstName: "Sami",
        lastName: "Ullah",
        password: hashedPassword,
        role: "admin",
        email: "admin@gmail.com",
      });
      console.log("Admin has been seeded");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
export default connectDB