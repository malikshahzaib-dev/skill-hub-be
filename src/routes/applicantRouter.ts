import mongoose from "mongoose";
import express, { NextFunction } from "express";
import applicant from "../models/applicantModel";
import Applicant from "../models/applicantModel";
import { Request, Response } from "express";
import AppError from "../utils/appError";
import authMiddleware from "../middleware/authmiddleware";

const applicantRouter = express.Router();


applicantRouter.post(
  "/",
  [authMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      contactNumber,
      address,
      education,
      skills,
      dateofBirth,
      resume,
      experience,
    } = req.body;
    const foundApplicant = await Applicant.findOne({ contactNumber });
      
    if (foundApplicant) {
      return next(new AppError("applicant already exists", 400));
    }

    const createdApplicant = await Applicant.create({
      user: req?.user?.id,
      contactNumber,
      address,
      education,
      skills,
      dateofBirth,
      resume,
      experience,
    });
    console.log(createdApplicant, "createdApplicant");
    res.status(201).json({
      data: createdApplicant,
      message: "applicant creation successful",
      success: true,
    });
 
  }
);


   applicantRouter.get(
      "/users/:userId",
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.userId;
        const foundApplicant = await Applicant.findOne({
          user: id,
        });
        if (!foundApplicant) {
          return next(new AppError("applicant not found", 404));
        }
        res.send({ message: "foundApplicant", foundApplicant });
      }
    );

    applicantRouter.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const foundApplicant = await Applicant.findById(id);
        if (!foundApplicant) {
          return next(new AppError("applicant not found", 404));
        }
        res.send({ message: "foundApplicant", foundApplicant });
      }
    );


    

    applicantRouter.patch(
      "/users/:userId",
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.userId;
        console.log("ids",id)
        const data = req.body;
        console.log(data,"data")
        const foundApplicant = await Applicant.findOne({user:id});
        if (!foundApplicant) {
          return next(new AppError("applicant not found", 404));
        }
        const updatedApplicant = await Applicant.findByIdAndUpdate(foundApplicant.id, data, {
          returnDocument: "after",
        });
        res.send({
          message: "applicant updated successfully",
          success: true,
          data: updatedApplicant,
        });
      }
    );

    applicantRouter.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const foundApplicant = await applicant.findById(id);
        if (!foundApplicant) {
          return next(new AppError("applicant not found", 404));
        }
        const deletedApplicant = await applicant.findByIdAndDelete(id);
        res.send({
          message: "applicant deleed successfully",
          deletedApplicant,
        });
      }
    );

export default applicantRouter;
