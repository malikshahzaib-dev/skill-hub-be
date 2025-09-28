import express, { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import md5 from "md5";
import jwt from "jsonwebtoken";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";


const userRouter = express.Router();


userRouter.post("/login", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { email, password ,role} = req.body


    const hashPassword = md5(password)

    const foundUser = await User.findOne({ email, password: hashPassword })
    if (!foundUser) {
        return next( new AppError("invalid credentials",401))
    }
    const token = jwt.sign({ id: foundUser?._id , email: foundUser?.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    res.status(200).json({
        message: "login successful",
        status:"success",
        token: token,
        user: foundUser
    })

}
))



userRouter.post("/sign-up", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { firstName, lastName,confirmPassword, email, password, role, status } = req.body
    const foundUser = await User.findOne({ email })
    if (foundUser) {
        return next(new AppError("user already exists",400))

    }
    const hashPassword = md5(password)
    const createdUser = await User.create({
        firstName,
        lastName,
        confirmPassword,
        email,
        password: hashPassword,
        role: role,
        status
    })
    const token = jwt.sign({ id: createdUser._id,role: createdUser.role , email: createdUser.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    res.status(200).json({
        message: "signup successful",
        token: token,
        user: createdUser
    })
}))


userRouter.get("/", catchasync(async (req: Request, res: Response) => {
    const allUsers = await User.find()
    res.send(allUsers)
}))
userRouter.post("/forgot-password", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { email } = req.body

    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return next( new AppError("user not found ",404))
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    const expireTime = Date.now() + 5 * 60 * 1000
    foundUser?.set("resetOtp", otp)
    foundUser?.set("otpExpires", expireTime)
    await foundUser?.save()
    res.status(200).json({ message: "otp send to registered email",success:true })
}))

userRouter.post("/verify-otp", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { otp, email } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return next(new AppError("user not found",404))
    }
    if (foundUser.resetOtp !== otp || !foundUser.otpExpires || foundUser.otpExpires < Date.now()
    ) {
        return next(new AppError("invalid or expireOtp",400))
    }
    res.send("otp verified successfully")
}))



userRouter.patch("/reset-password", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const { otp, email, newPassword } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return next(new AppError("user not found",404))
    }
    if (
        foundUser.resetOtp != otp || !foundUser.otpExpires || foundUser.otpExpires < Date.now()

    ) {
        return next(new AppError("invalid  or expired otp",401))
    }
    const hashPassword = md5(newPassword)
    foundUser.set("password", hashPassword)
    foundUser.set("resetOtp", null)
    foundUser.set("otpExpires", null)
    await foundUser.save()
    res.send({ message: "password reset successful" })
}))



userRouter.get("/:id", catchasync(async (req: Request, res: Response,next:NextFunction) => {
    const id = req.params.id
    const foundUser = await User.findById(id)
    if (!foundUser) {
        return next(new AppError("user not found",404))
    }
    res.send(foundUser)
}))

export default userRouter;
