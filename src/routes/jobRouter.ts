import express, { NextFunction, Request, Response } from "express";
import Job, { IJob } from "../models/jobModel";
import authMiddleware from "../middleware/authmiddleware";
import Organization from "../models/organizationModel";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import organizationMiddleware from "../middleware/organizationMiddleware";

const jobRouter = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.get(
  "/job",
  catchasync(async (req: Request, res: Response) => {
    const foundJobs = await Job.find();
    res.send({message:"foundJobs",foundJobs,success:true});
    console.log("foundJobs", foundJobs);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.get(
  "/:id",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundJob = await Job.findById(id);
    if (!foundJob) {
      return next(new AppError("job not found", 404));
    }
    res.send(foundJob);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.post(
  "/:organizationId",
  [authMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const {
      jobTitle,
      jobDescription,
      createdBy,
      status,
      minimumSalary,
      maximumSalary,
      applicationclosingdate,
      benefits,
      department,
      responsibilities,   
      requirements,
      location

    } = req.body;
    console.log("req.body", req.body);
    console.log("req.params", req.params.organizationId);
    const organizationId = req.params.organizationId;
    // if (role !== "organization") {
    //     return next(new AppError("job only created by organization ",403))
    // }
    const foundOrganization = await Organization.findById(organizationId);
    console.log("foundOrganization", foundOrganization);
    if (!foundOrganization || foundOrganization.status !== "approved") {
      return res.send({ message: "organization is not approved " });
    }

    const foundJob = await Job.findOne({ jobTitle });    
    if (foundJob) {
      return next(new AppError("job already exists", 400));
    }
    const createdJob = await Job.create({
      jobTitle,
      jobDescription,
      organizationId,
      createdBy,
      minimumSalary,
      maximumSalary,
      location,
      benefits,
      applicationclosingdate,
      status,
      department,
      responsibilities,
      requirements
    });
    console.log("createdJob", createdJob);
    res
      .status(201)
      .json({
        data: createdJob,
        message: "job creation successful",
        success: true,

      });
      console.log(createdJob,"createdJob");
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.patch(
  "/:id",
  [authMiddleware,organizationMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Partial<IJob> = req.body;
    const { role }: { role: string } = req.body;
    if (role !== "organization admin") {
      return res
        .status(403)
        .json({
          message: "job only can be updated by organization admin",
          success: false,
        });
    }
    const foundJob = await Job.findById(id);
    if (!foundJob) {
      return next(new AppError("job not found", 404));
    }
    const updatedJob = await Job.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    res.send({meassage:"updatedJob successfully",updatedJob,success:true});
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.delete(
  "/:id",
  [authMiddleware,organizationMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { role }: { role: string } = req.body;
    if (role !== "organization admin") {
      return res
        .status(403)
        .json({
          message: "job only can be created by organization admin",
          success: false,
        });
    }
    const foundJob = await Job.findById(id);
    if (!foundJob) {
      return next(new AppError("job not found", 404));
    }
    const deletedJob = await Job.findByIdAndDelete(id);
    res.send({message:"job deleted success fully",deletedJob});
  })
);


export default jobRouter;
