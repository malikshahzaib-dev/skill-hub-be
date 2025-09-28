import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

res.status(err.statusCode).json({
    status:err.status,
    message:err.message || "something went wrong"
})
};

export default globalErrorHandler;