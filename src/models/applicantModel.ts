import mongoose, { Schema } from "mongoose"





export interface IApplicant extends Document{
    education:string,
    contactNumber:string,
    experience:string,
    dateofBirth:Date,
    resume:string,
    address:string,
    skills:[]

}
const applicantSchema = new Schema<IApplicant>({
    education: { type: String, required: true },
    contactNumber: { type: String, required: true },
    experience: { type: String, required: true },
    dateofBirth: { type: Date, required: true },
    resume: { type: String, required: false },
    address: { type: String, required: true },
    skills: { type: [String], required: true }
})
const Applicant = mongoose.model("Applicant",applicantSchema)
export default Applicant