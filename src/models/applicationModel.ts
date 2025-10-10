import mongoose, { Document, Schema, Types } from "mongoose";




export interface IApplication extends Document {

    education: string,
    contactNumber: string,
    experience: number,
    dateofBirth: Date,
    resume: string,
    expectedSalary: number,
    jobId: Types.ObjectId,
    skills: string[],
    status: string

}

const applicationSchema = new Schema<IApplication>({

    education: { type: String, required: true },
    contactNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    dateofBirth: { type: Date, required: true },
    resume: { type: String, required: true },
    expectedSalary: { type: Number, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    skills: [{ type: String }],
    status: { 
  type: String, 
  enum: ["pending", "approved", "rejected", "hired"], default: "pending"}


},
    { timestamps: true }

)
const Application = mongoose.model("Application", applicationSchema)

export default Application