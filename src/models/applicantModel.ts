import mongoose, { Schema } from "mongoose"





export interface IApplicant extends Document{
    education:string,
    contactNumber:string,
    experience:number,
    dateofBirth:Date,
    resume:File,
    address:string,
    skills:[]

}
const applicationSchema = new Schema<IApplicant>({
    education: { type: String, required: true },
    contactNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    dateofBirth: { type: Date, required: true },
    resume: { type: File, required: true },
    address: { type: String, required: true },
    skills: { type: [String], required: true }
})
const Applicant = mongoose.model("Applicant",applicationSchema)
export default Applicant