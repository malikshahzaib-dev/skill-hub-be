import mongoose, { Document, Schema, Types } from "mongoose";




export interface IApplication extends Document {
    jobId: Types.ObjectId,
    applicantId:Types.ObjectId,
    status: string,
    coverLetter:string,
    expectedSalary:number,

}

const applicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    applicantId:{type:Schema.Types.ObjectId,ref:"Applicant",required:true},
    coverLetter:{type:String},
    expectedSalary:{type:Number},
    status: {
   type: String,
   enum: ["pending", "approved", "rejected", "hired"], default: "pending"}

 
},
    { timestamps: true }

)
const Application = mongoose.model("Application", applicationSchema)

export default Application