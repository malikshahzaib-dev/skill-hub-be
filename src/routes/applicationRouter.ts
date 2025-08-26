import express, { Request, Response } from "express"
import Applicant, { IApplication } from "../models/applicantModel"
import Job from "../models/jobModel"
import Application from "../models/applicantModel"

const applicationRouter = express.Router()


applicationRouter.get("/", async (req: Request, res: Response) => {
    const allApplications = await Applicant.find()
    res.send(allApplications)
})


applicationRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const foundApplication = await Applicant.findById(id)
    if (!foundApplication) {
        return res.send("applicant not found")
    }
    res.send(foundApplication)
})

applicationRouter.post("/", async (req: Request, res: Response) => {
    const { name, email, experience, age, resume, jobId, skills, status } = req.body
    const foundJob = await Job.findById(jobId)
    if (!foundJob) {
        return res.send("job not found")
    }
    const foundApplication = await Applicant.findOne({ email, jobId })
    if (foundApplication) {
        return res.send("applicant already exists")
    }
    const createdApplication = await Applicant.create({
        name,
        email,
        age,
        experience,
        jobId,
        skills,
        status,
        resume
    })
    res.send(createdApplication)
})

applicationRouter.patch("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const data: Partial<IApplication> = req.body
    const foundApplication = await Application.findById(id)
    if (!foundApplication) {
        return res.send("application not found")
    }
    const updatedApplication = await Application.findByIdAndUpdate(id, data, { returnDocument: "after" })
    res.send(updatedApplication)
})




applicationRouter.patch("/:id/status", async (req: Request, res: Response) => {
    const id = req.params.id

    const { status, role } = req.body

    const foundApplication = await Application.findById(id)
    if (!foundApplication) {

        return res.send("application not found")

    }

    if ( role !== "organization admin") {
        return res.send("only can changed status by organization admin")
    }
    const updatedStatus = await Application.findByIdAndUpdate(
        id,
        { status },
        { returnDocument: "after" }
    )
    res.send(updatedStatus)
})

applicationRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const foundApplication = await Application.findById(id)
    if (!foundApplication) {
        return res.send("apllication not found")
    }
    const deletedApplication = await Application.findByIdAndDelete(id)
    res.send(deletedApplication)
})










export default applicationRouter