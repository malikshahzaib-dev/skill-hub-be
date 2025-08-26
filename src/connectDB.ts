import mongoose from "mongoose";

const connectDB = (() =>{
mongoose.connect("mongodb://127.0.0.1:27017/skill-hubdb").then(() =>{
    console.log("mongodb is connected")
}).catch(() =>{
    console.log("mongodb is not connected")
})
    
})
export default connectDB   