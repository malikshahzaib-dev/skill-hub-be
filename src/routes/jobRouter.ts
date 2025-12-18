import express, { NextFunction, Request, Response } from "express";
import Job, { IJob } from "../models/jobModel";
import authMiddleware from "../middleware/authmiddleware";
import Organization from "../models/organizationModel";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import organizationMiddleware from "../middleware/organizationMiddleware";
import Application from "../models/applicationModel";

const jobRouter = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.get(
  "/",
  catchasync(async (req: Request, res: Response) => {
    const { createdBy, jobTitle } = req.query;
    // const {jobId} = req.body
    if (jobTitle) {
      const findJob = await Job.find({
        jobTitle: { $regex: jobTitle, $options: "i" },
      });
      return res.send({
        // message: "found jobs by jobTitle",
        findJob,
        success: true,
      });
    } else if (createdBy) {
      const foundJobsCreatedBy = await Job.find({ createdBy });

      const countApplications = await Promise.all(
        foundJobsCreatedBy.map(async (job: any) => {
          const count = await Application.countDocuments({ jobId: job._id });
          return {
            ...job._doc,
            applicationCount: count,
          };
        })
      );

      return res.send({
        foundJobsCreatedBy: countApplications,
        success: true,
      });
    } else {
      const foundJobs = await Job.find();
      res.send({
        // message: "foundJobs",
        foundJobs,
        success: true,
      });
    }
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.get(
  "/:id",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundJob = await Job.findById(id);
    console.log("foundJobbb", foundJob);
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
      location,
      jobType,
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
    return next(new AppError('Organization is not approved yet',202))
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
      requirements,
      jobType,
    });
    console.log("createdJob", createdJob);
    res.status(201).json({
      data: createdJob,
      message: "job creation successful",
      success: true,
    });
    console.log(createdJob, "createdJob");
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.patch(
  "/:id",
  [authMiddleware, organizationMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Partial<IJob> = req.body;
    const role = req.user?.role;
    console.log("organization role", role);
    if (role !== "organization") {
      return res.status(403).json({
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
    res.send({
      meassage: "updatedJob successfully",
      updatedJob,
      success: true,
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

jobRouter.delete(
  "/:id",
  [authMiddleware, organizationMiddleware],
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const role = req.user?.role;
    console.log(role, "role");
    if (role !== "organization") {
      return res.status(403).json({
        message: "job only can be deleted by organization admin",
        success: false,
      });
    }
    const foundJob = await Job.findById(id);
    console.log("fetch job for deleted", foundJob);
    if (!foundJob) {
      return next(new AppError("job not found", 404));
    }
    const deletedJob = await Job.findByIdAndDelete(id);
    res.send({ message: "job deleted success fully", deletedJob });
  })
);

export default jobRouter;
