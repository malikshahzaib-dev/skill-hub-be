import express, { NextFunction, Request, Response } from "express"
import Job, { IJob } from "../models/jobModel"
import authMiddleware from "../middleware/authmiddleware"
import Organization from "../models/organizationModel"
import catchasync from "../utils/catchasync"
import AppError from "../utils/appError"


const jobRouter = express.Router()

jobRouter.get("/", catchasync(async (req: Request, res: Response) => {
    const  {location} = req.query

    let filter:any = {}

    if(location)
    {
        filter.location = location
    }

    const foundJobs = await Job.find(filter)
    res.send(foundJobs)
}))

jobRouter.get("/:id", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return next(new AppError("job not found",404))
    }
    res.send(foundJob)
}))
jobRouter.post("/", authMiddleware, catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { title, description, salary, organizationId, createdBy,status } = req.body
    const {role,id} = (req as any).user
  //  const organizationId = req.params.organization
    if (role !== "organization") {
        return next(new AppError("job only created by organization ",403))
    }
    const foundOrganization = await Organization.findById(organizationId)
    if(!foundOrganization || foundOrganization.status !== "approved") {
        return res.send("organization is not approved ")
    }

    const foundJob = await Job.findOne({ title })
    if (foundJob) {
        return next(new AppError("job already exists",400))
    }
    const createdJob = await Job.create({
        title,
        description,
        salary,
        organizationId,
        createdBy,
   
    })
    res.status(201).json({data:createdJob,message:"job creation successful",success:true})
}))


jobRouter.patch("/:id", authMiddleware, catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const data: Partial<IJob> = req.body
    const { role }: { role: string } = req.body
    if (role !== "organization admin") {
        return res.status(403).json({message:"job only can be updated by organization admin",success:false})
    }
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return next(new AppError("job not found",404))
    }
    const updatedJob = await Job.findByIdAndUpdate(id, data, { returnDocument: "after" })
    res.send(updatedJob)
}))

jobRouter.delete("/:id", authMiddleware, catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const { role }: { role: string } = req.body
    if (role !== "organization admin") {
        return res.status(403).json({message:"job only can be created by organization admin",success:false})
    }
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return next(new AppError("job not found",404))
    }
    const deletedJob = await Job.findByIdAndDelete(id)
    res.send(deletedJob)
}))


export default jobRouter