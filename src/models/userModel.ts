import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string,
  status: string,
  resetOtp:number,
  otpExpires:number
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "organization admin", "applicant"], default: "applicant" },
  status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Pending" },
  resetOtp:{type:Number},
  otpExpires:{type:Number}
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
