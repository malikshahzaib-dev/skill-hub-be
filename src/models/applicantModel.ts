import mongoose, { Document, Schema, Types } from "mongoose";




export interface IApplication extends Document {

    fullName: string,
    email: string,
    experience: number,
    age: number,
    resume: string,
    jobId: Types.ObjectId,
    skills: string[],
    status: string

}

const applicationSchema = new Schema<IApplication>({

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: Number, required: true },
    age: { type: Number, required: true },
    resume: { type: String, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    skills: [{ type: String }],
status: { 
  type: String, 
  enum: ["pending", "approved", "rejected", "hired"], default: "pending"}


},
    { timestamps: true }

)
const Application = mongoose.model("Applicant", applicationSchema)

export default Application