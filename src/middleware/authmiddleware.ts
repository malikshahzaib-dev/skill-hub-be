import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel"; 
import AppError from "../utils/appError";

interface AuthRequest extends Request {
  user?: any; 
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
   
    // Find user in DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 401));
    }

    // Attach full user to request
    req.user = user;
    next();
  } catch (err: any) {
    return next(new AppError("Authentication failed", 401));
  }
};

export default authMiddleware;
