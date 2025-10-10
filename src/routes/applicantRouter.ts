import mongoose from "mongoose";
import express, { NextFunction } from "express"
import applicant from "../models/applicantModel";
import Applicant from "../models/applicantModel";
import {Request,Response} from "express"
import AppError from "../utils/appError";
import Job from "../models/jobModel";


const applicantRouter = express.Router()



applicantRouter.get("/",async(req:Request,res:Response) =>{
    const allApplicants = await Applicant.find()
    res.send(allApplicants)
})


applicantRouter.post("/",async(req:Request,res:Response,next:NextFunction) => {
    const {contactNumber,address,education,skills,dateofBirth,resume} = req.body
    const jobId = req.params.job.id
    const foundApplicant = await Applicant.findOne({contactNumber,resume})
    if(foundApplicant){
        return next(new AppError("applicant already exists",400))
    }
    const foundJob = await Job.findById(jobId)
    if(!foundJob){
        return next(new AppError("job not found",404))
    }


    const createdApplicant = await Applicant.create({
        contactNumber,
        address,
        education,
        skills,
        dateofBirth,
        resume
    })
    res.status(201).json({
        data:createdApplicant,
        message:"applicant creation successful",
        success:true
    })



    applicantRouter.get("/:id",async(req:Request,res:Response,next:NextFunction) => {
        const id = req.params.id
        const foundApplicant = await applicant.findById(id)
        if(!foundApplicant){
            return next(new AppError("applicant not found",404))
        }
        res.send({message:'foundApplicant',foundApplicant})
    })


    applicantRouter.patch("/:id",async(req:Request,res:Response,next:NextFunction) => {
        const id = req.params.id
        const data = req.body
        const foundApplicant = await applicant.findById(id)
        if(!foundApplicant){
            return next(new AppError("applicant not found",404))
        }
        const updatedApplicant = await applicant.findByIdAndUpdate(id,data,{
            returnDocument:"after"
        })
        res.send({message:"applicant updated successfully",success:true})

        })


        applicantRouter.delete("/:id",async(req:Request,res:Response,next:NextFunction) =>{
            const id = req.params.id
            const foundApplicant = await applicant.findById(id)
            if(!foundApplicant){
                return next(new AppError("applicant not found",404))
            }
            const deletedApplicant = await applicant.findByIdAndDelete(id)
            res.send(message:"applicant deleed successfully")
        })





})


export default applicantRouter