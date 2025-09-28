import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: string,
  status: string,
  resetOtp:number,
  otpExpires:number
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  role: { type: String, enum: ["admin", "organization", "applicant"], default: "applicant" },
  status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Pending" },
  resetOtp:{type:Number},
  otpExpires:{type:Number}
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
