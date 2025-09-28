import mongoose from "mongoose";

const connectDB = (() =>{
mongoose.connect("mongodb://localhost:27017/skill-hubdb")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

    
})
export default connectDB   