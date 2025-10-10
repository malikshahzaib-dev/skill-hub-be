import { NextFunction, RequestHandler } from "express";
import AppError from "../utils/appError";

const organizationMiddleware:RequestHandler = (req,res,next) => {
    const user = (req as any).user
    if(!user){
    return  next (new AppError("unothenticated",401));
}

    if(user.role !== "organization"){
        return next(new AppError("access denied:only organization can perform this acrtion",403))
    }
    next()

}
export default organizationMiddleware