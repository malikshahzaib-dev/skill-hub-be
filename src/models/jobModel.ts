import mongoose, { Document, Schema, Types } from "mongoose";


export interface IJob extends Document {
    jobTitle: string,
    department?:string,
    jobType?:string,
    jobDescription: string,
    requirements: string[],
    responsibilities?:string[],
    salary: number,
    organizationId: Types.ObjectId,
    createdBy: Types.ObjectId,
    location:string,
    status?:string,
    minimumSalary?:number,
    maximumSalary?:number   ,
    benefits?:string[]  ,
    applicationClosingDate?:Date

}
const JobSchema = new Schema<IJob>(
    {
        jobTitle: { type: String, required: true },
        department:{type:String},
        jobDescription: { type: String, required: true },
        jobType:{type:String},
        requirements: { type: [String], required: true },
        salary: { type: Number, required: true },
        responsibilities:{type:[String]},
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        organizationId: { type: Schema.Types.ObjectId, ref: "organization", required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        location:{type:String},
        minimumSalary:{type:Number},
        maximumSalary:{type:Number},
        benefits:{type:[String]},
        applicationClosingDate :{type:Date}
    },

    { timestamps: true }

)
const Job = mongoose.model<IJob>("Job", JobSchema)
export default Job

















