import mongoose, { Document, Schema, Types } from "mongoose";


export interface IJob extends Document {
    title: string,
    description: string,
    salary: number,
    organizationId: Types.ObjectId,
    createdBy: Types.ObjectId,
    location:string

}
const JobSchema = new Schema<IJob>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        salary: { type: Number, required: true },
        organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        location:{type:String}
    },

    { timestamps: true }

)
const Job = mongoose.model<IJob>("Job", JobSchema)
export default Job

















