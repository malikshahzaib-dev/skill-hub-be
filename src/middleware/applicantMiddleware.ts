import { NextFunction, RequestHandler } from "express";
import AppError from "../utils/appError";


const applicantMiddleware:RequestHandler = (req,res,next) => {
    const user = (req as any).user
    if(!user){
        return next(new AppError("unothenticated",4021))
    }
    if(user.role !== "applicant"){
        return  next(new AppError("access denied:only applicant can perform this action",403))
    }
    next()
}
export default applicantMiddleware