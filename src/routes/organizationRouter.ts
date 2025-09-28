import express,{NextFunction, Request,Response} from "express";
import Organization, { IOrganization } from "../models/organizationModel";
import authMiddleware from "../middleware/authmiddleware";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import User from "../models/userModel";


const organizationRouter = express.Router()

organizationRouter.get("/", catchasync(async (req:Request, res:Response) => {
    const foundOrganizations = await Organization.find()
    res.status(200).json({success:true,message:"organizzation fetch successfully",data:foundOrganizations})
})
)
organizationRouter.post("/", authMiddleware, catchasync(async (req:Request, res:Response,next:NextFunction) => {
    const data:IOrganization = req.body
    const organizationId = (req as any).user.id

    const foundOrganizations = await Organization.findOne({  name: req.body.name,admin:organizationId })
    if (foundOrganizations) {
        return next(new AppError("organization already exists",400))
    }

    const createdOrganization = await Organization.create({...req.body,admin:organizationId})
    res.status(200).json({data:createdOrganization,message:"organization creatio successfull"})
}))
organizationRouter.patch("/:id", authMiddleware, catchasync(async (req:Request, res:Response,next:NextFunction) => {
    const id = req.params.id
    const data:Partial<IOrganization> = req.body;
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
        return next(new AppError("organization not found",404))
    }
    const updatedOrganization = await Organization.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    res.status(200).json({message:"organization update successfull",organization:updatedOrganization,status:"success"})
}))


organizationRouter.patch("/status/:id",authMiddleware, catchasync(async (req:Request, res:Response,next:NextFunction) => {
    const id = req.params.id
    const {role,status}:{role:string;status:string} = req.body
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
      return  next(new AppError("organization not found",404))
    }
    if (role !== "admin") {
      return  next(new AppError("only admin can change role",403))
    }
    const updatedStatus = await Organization.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
    res.send(updatedStatus)
}))



organizationRouter.get("/:id", catchasync(async (req:Request, res:Response,next:NextFunction) => {
    const id = req.params.id
    const foundOrganizations = await Organization.findById(id)
    if (!foundOrganizations) {
       return next(new AppError("organization not found",404))
    }
    res.send(foundOrganizations)
}))

organizationRouter.delete("/:id", authMiddleware, catchasync(async (req:Request, res:Response,next:NextFunction) => {
    const id = req.params.id
    const {role}:{role:string} = req.body
    if (role !== "admin") {
       return next(new AppError("only can be deleted by admin",403))
    }
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
        return next(new AppError("organization not found",404))
    }
    const deletedOrganization = await Organization.findByIdAndDelete(id)
    res.send(deletedOrganization)
}))


export default organizationRouter 