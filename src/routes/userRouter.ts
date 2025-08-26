import express, { Request, Response } from "express";
import User from "../models/userModel";
import md5 from "md5";
import jwt from "jsonwebtoken";

const userRouter = express.Router();


userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body


    const hashPassword = md5(password)

    const foundUser = await User.findOne({ email, password: hashPassword })
    if (!foundUser) {
        return res.send("invalid credentials")
    }
    const token = jwt.sign({ id: foundUser?._id, email: foundUser?.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    res.send({
        message: "login successful",
        token: token,
        user: foundUser
    })

})



userRouter.post("/sign-up", async (req: Request, res: Response) => {
    const { name, email, password, role,status } = req.body
    const foundUser = await User.findOne({ email })
    if (foundUser) {
        return res.send("user already exists")

    }
    const hashPassword = md5(password)
    const createdUser = await User.create({
        name,
        email,
        password: hashPassword,
        role: role,
        status
    })
    const token = jwt.sign({ id: createdUser._id, email: createdUser.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    res.send({
        message: "signup successful",
        token: token,
        user: createdUser
    })
})


userRouter.get("/", async (req: Request, res: Response) => {
    const allUsers = await User.find()
    res.send(allUsers)
})
userRouter.post("/forgot-password", async (req: Request, res: Response) => {
    const { email } = req.body

    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return res.send("user not found ")
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    const expireTime = Date.now() + 5 * 60 * 1000
    foundUser?.set("resetOtp", otp)
    foundUser?.set("otpExpires", expireTime)
    await foundUser?.save()
    res.send({ message: "otp send to registered email" })
})

userRouter.post("/verify-otp", async (req: Request, res: Response) => {
    const { otp, email } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return res.send("user not found")
    }
    if (foundUser.resetOtp !== otp || !foundUser.otpExpires || foundUser.otpExpires < Date.now()
    ) {
        res.send("invalid or expireOtp")
    }
    res.send("otp verified successfully")
})



userRouter.post("/reset-password", async (req: Request, res: Response) => {
    const { otp, email, newPassword } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        return res.send("user not found")
    }
    if (
        foundUser.resetOtp != otp || !foundUser.otpExpires || foundUser.otpExpires < Date.now()

    ) {
        return res.send("invalid  or expired otp")
    }
    const hashPassword = md5(newPassword)
    foundUser.set("password", hashPassword)
    foundUser.set("resetOtp", null)
    foundUser.set("otpExpires", null)
    await foundUser.save()
    res.send({ message: "password reset successful" })
})



userRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const foundUser = await User.findById(id)
    if (!foundUser) {
        return res.send("user not found")
    }
    res.send(foundUser)
})

export default userRouter;
