import { NextFunction, Request, RequestHandler, Response } from "express";

const catchasync = (fn : (req:Request,res:Response, next: NextFunction) => Promise<void | Response<any>>): RequestHandler => {
    return (req,res,next) =>{
        fn(req , res, next) .catch(next)
    }
}
export default catchasync


