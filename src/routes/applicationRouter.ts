import express, { NextFunction, Request, Response } from "express";
import Job from "../models/jobModel";
import Application, { IApplication } from "../models/applicationModel";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import authMiddleware from "../middleware/authmiddleware";
import applicantMiddleware from "../middleware/applicantMiddleware";
import Applicant from "../models/applicantModel";
import organizationMiddleware from "../middleware/organizationMiddleware";
import { Console } from "console";

const applicationRouter = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.get(
  "/",
  catchasync(async (req: Request, res: Response) => {
    const allApplications = await Application.find();
    res.send(allApplications);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////  /////////////////////////////

applicationRouter.post(
  "/jobs/:jobId",
  [authMiddleware,applicantMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { coverLetter, expectedSalary } = req.body;
    const { jobId } = req.params;
    console.log(req.user,'user from auth middleware')
    const userId = req.user?._id as any;
    console.log("userId",userId)

    console.log(userId,'user id')
      const foundApplicant = await Applicant.findOne({
          user: userId,
        });
        
    if (!foundApplicant) {
      return next(new AppError("applicant not found", 404));
    }
    const foundJob = await Job.findById(jobId);
    console.log("founjobss", foundJob);
    if (!foundJob) {
      return next(new AppError("job not found", 404));
    }

    const foundApplication = await Application.findOne({
      jobId: jobId,
      applicantId: foundApplicant._id,
    });
    if (foundApplication) {
      return next(new AppError("application already exists", 400));
    }
    const createdApplication = await Application.create({
      jobId: jobId,
      coverLetter,
      status: "pending",
      applicantId: foundApplicant._id,
      expectedSalary,
    });
    console.log("createdApplicationnn", createdApplication);
    res.status(200).json({
      data: createdApplication,
      message: "application creation successful",
      success: true,
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.get(
  "/user/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    console.log(req.params,"params")
    console.log(userId,"user id")
    const foundApplicant = await Applicant.findOne({
      user:userId
    })
    console.log(foundApplicant,"foundAPPLicant")
    
    
    if(!foundApplicant){
     return next(new AppError('Applicant not found',404))
    }
    const foundApplication = await Application.find({ applicantId: foundApplicant._id }).populate("jobId");
    console.log(foundApplication,"found applied aplication")
    if (!foundApplication) {
      return next(new AppError("application to fetch error", 404));
    }
    res.send(foundApplication);
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.get(
  "/:id",
  authMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundApplication = await Application.findById(id).populate("jobId");
    if (!foundApplication) {
      return next(new AppError("application not found", 404));
    }
    res.send(foundApplication);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


applicationRouter.get(
  "/job/:jobId",
  authMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.jobId;
    const id = req.params.id
    const foundApplicant = await Applicant.findById(id)
    console.log(foundApplicant,"found applicant")
    const foundApplication = await Application.find({jobId}).populate("applicantId","firstName lastName email").populate("jobId")
    console.log("foundApplication",foundApplication)
    if (!foundApplication) {
      return next(new AppError("application not found", 404));
    }
    res.send(foundApplication);
  })
);



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.get(
  "/organization/:organizationId",
  authMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.organizationId;
    const foundApplication = await Application.find({organization:id}).populate("jobId").populate("userId");
    if (!foundApplication) {
      return next(new AppError("application not found", 404));
    }
    res.send(foundApplication);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.patch(
  "/:id",
  [authMiddleware, applicantMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Partial<IApplication> = req.body;
    const foundApplication = await Application.findById(id);
    console.log("foundede application",foundApplication)
    if (!foundApplication) {
      return next(new AppError("application not found", 404));
    }
    const updatedApplication = await Application.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    res.send({
      message: "updated application successful",
      updatedApplication,
      success: true,
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.patch(
  "/:id/status",
  authMiddleware, 
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const status = req.body?.status;

    const foundApplication = await Application.findById(id);
    if (!foundApplication) {
      return next(new AppError("application not found", 404));
    }

    const role = req.user?.role;
    if (role !== "organization") {
      return res.status(403).json({
        message: "Only organization can change status",
        success: false,
      });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    );

    res.status(200).json({ application: updatedApplication,message:"Application status updated successfully", success: true });
  })
);


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

applicationRouter.delete(
  "/:id",
  [ authMiddleware,applicantMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundApplication = await Application.findById(id);
    console.log("found application",foundApplication)
    if (!foundApplication) {
      return res.status(404).json({
        message: "",
        sucess: false,
      });
    }
    const deletedApplication = await Application.findByIdAndDelete(id);
    res.status(200).json({
      applications: deletedApplication,
      sucess: true,
    });
  })
);

export default applicationRouter;

//signin
// role === applicant
//applicant information
//applicant id

//my-applied-jobs
// applicant id

//applicationModel.find({
//    applicantId:applicantid}).populate("jobId")
// return applications
//applications.map((application)=>{
//    return application.jobId
//})
