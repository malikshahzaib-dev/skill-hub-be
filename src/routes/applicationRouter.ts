import express, { NextFunction, Request, Response } from "express"
import Applicant, { IApplication } from "../models/applicationModel"
import Job from "../models/jobModel"
import Application from "../models/applicationModel"
import catchasync from "../utils/catchasync"
import AppError from "../utils/appError"
import authMiddleware from "../middleware/authmiddleware"
import applicantMiddleware from "../middleware/applicantMiddleware"

      
const applicationRouter = express.Router()


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



applicationRouter.get("/", catchasync(async (req: Request, res: Response) => {
    const allApplications = await Application.find()
    res.send(allApplications)
}))




/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////  /////////////////////////////



applicationRouter.post("/", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { education,contactNumber, experience,expectedSalary ,dateofBirth, resume, jobId, skills, status } = req.body
    const foundJob = await Job.findById(jobId)
    if (!foundJob) {
        return next(new AppError("job not found",404))
    }
    const foundApplication = await Application.findOne({ contactNumber, jobId })
    if (foundApplication) {
        return res.send("applicant already exists")
    }
    const createdApplication = await Application.create({
    
        education,
        contactNumber,
        dateofBirth,
        experience,
        jobId,
        skills,
        status,
        resume,
        expectedSalary
    })
    res.status(200).json({
        data:createdApplication,message:"application creation successful",success:true
    })
}))



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



applicationRouter.get("/:id",authMiddleware, catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const foundApplication = await Application.findById(id)
    if (!foundApplication) {
        return next(new AppError("application not found",404))
    }
    res.send(foundApplication)
}))



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


applicationRouter.patch("/:id",[authMiddleware,applicantMiddleware] ,catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const data: Partial<IApplication> = req.body
    const foundApplication = await Application.findById(id)
    if (!foundApplication) {
        return next(new AppError("application not found",404))
    }
    const updatedApplication = await Application.findByIdAndUpdate(id, data, { returnDocument: "after" })
    res.send(updatedApplication)
}))



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




applicationRouter.patch("/:id/status",[authMiddleware,applicantMiddleware], catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id

    const { status, role } = req.body

    const foundApplication = await Application.findById(id)
    if (!foundApplication) {

        return next(new AppError("application not found",404))

    }

    if ( role !== "organization admin") {
        return res.status(403).json({message:"only can changed status by organization admin",success:false})
    }
    const updatedStatus = await Application.findByIdAndUpdate(
        id,
        { status },
        { returnDocument: "after" }
    )
    res.status(403).json({message:updatedStatus,success:true})
}))



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



applicationRouter.delete("/:id",[applicantMiddleware,authMiddleware] ,catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const foundApplication = await Application.findById(id)
    if (!foundApplication) {
        return res.status(404).json({
            message:"",
            sucess:false,
        })
    }
    const deletedApplication = await Application.findByIdAndDelete(id)
    res.status(200).json({
        applications:deletedApplication,
        sucess:true,
    })
}))










export default applicationRouter