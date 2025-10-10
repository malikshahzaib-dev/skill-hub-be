import express, { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import md5 from "md5";
import jwt from "jsonwebtoken";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import { generateOTP, verifyOtp } from "../utils/otpService";
import { sendEmail } from "../utils/emailService";
import Organization from "../models/organizationModel";

const userRouter = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.post(
  "/login",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;

    const hashPassword = md5(password);

    const foundUser = await User.findOne({ email, password: hashPassword });
    if (!foundUser) {
      return next(new AppError("invalid credentials", 401));
    }
    const token = jwt.sign(
      { id: foundUser?._id, email: foundUser?.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    let organizationInformation = null;
    if (foundUser.role === "organization") {
      organizationInformation = await Organization.findOne({
        admin: foundUser._id,
      });
    }

    res.status(200).json({
      message: "login successful",
      status: "success",
      token: token,
      user: foundUser,
      isOrganizationComplete:  
        foundUser.role === "organization" && organizationInformation
          ? true
          : false,
      
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.post(
  "/sign-up",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, confirmPassword, email, password, role } =
      req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return next(new AppError("user already exists", 400));
    }
    const hashPassword = md5(password);
    const createdUser = await User.create({
      firstName,
      lastName,
      confirmPassword,
      email,
      password: hashPassword,
      role: role,
    });
    const token = jwt.sign(
      { id: createdUser._id, role: createdUser.role, email: createdUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    res.status(200).json({
      message: "signup successful",
      token: token,
      user: createdUser,
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.get(
  "/",
  catchasync(async (req: Request, res: Response) => {
    const allUsers = await User.find();
    res.send(allUsers);
  })
);

userRouter.post(
  "/forgot-password",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const foundUser = await User.findOne({ email });
    console.log("founduser");
    if (!foundUser) {
      return next(new AppError("user not found ", 404));
    }
    const otp = await generateOTP(email);
    console.log("generated otp", otp);
    await sendEmail(
      email,
      "Otp for reset password",
      `Your otp for the reset password is ${otp}`
    );
    res.send({
      message: "Otp sent successfully",
      success: true,
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.post(
  "/verify-otp",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { otp, email } = req.body;
    const foundUser = await User.findOne({ email });
    console.log("founduser", foundUser);
    if (!foundUser) {
      return next(new AppError("user not found", 404));
    }
    const isOtpValid = await verifyOtp(email, otp,false);
    if (!isOtpValid) {
      return next(new AppError("invalid or expire Otp", 400));
    }
    res.send({ message: "otp verified successfully" });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.patch(
  "/reset-password",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const { otp, email, newPassword } = req.body;
    console.log("req.body", req.body);
    const foundUser = await User.findOne({ email });
    console.log("founduser", foundUser);
    if (!foundUser) {
      return next(new AppError("user not found", 404));
    }
    const isOtpValid = await verifyOtp(email, otp,true);
    console.log("isOtpValid", isOtpValid);

    if (!isOtpValid) {
      return next(new AppError("invalid or expireOtp", 400));
    }
    const hashPassword = md5(newPassword);
    foundUser.set("password", hashPassword);
    foundUser.set("resetOtp", null);
    foundUser.set("otpExpires", null);
    await foundUser.save();
    res.send({ message: "password reset successful", success: true });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

userRouter.get(
  "/:id",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return next(new AppError("user not found", 404));
    }
    res.send(foundUser);
  })
);

export default userRouter;
