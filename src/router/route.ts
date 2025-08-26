import express from "express"
import userRouter from "../routes/userRouter"
import organizationRouter from "../routes/organizationRouter";
import jobRouter from "../routes/jobRouter";
import applicationRouter from "../routes/applicationRouter";

const router = express.Router();


router.use("/users",userRouter)
router.use("/organization",organizationRouter)
router.use("/job",jobRouter)
router.use("/application",applicationRouter)





export default router