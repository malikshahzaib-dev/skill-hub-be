import express, { NextFunction, Request, Response } from "express";
import Organization, { IOrganization } from "../models/organizationModel";
import authMiddleware from "../middleware/authmiddleware";
import catchasync from "../utils/catchasync";
import AppError from "../utils/appError";
import organizationMiddleware from "../middleware/organizationMiddleware";

const organizationRouter = express.Router();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.get(
  "/",
  [authMiddleware],
  catchasync(async (req: Request, res: Response) => {
    const user = req.user
    console.log(user,'user')
     const {admin} = req.query
     if(user?.role === "admin"){
      const foundAllOrganizations = await Organization.find()
    return  res.send({message:"found all organizatioin by super admin",foundAllOrganizations,success:true})
     }
     else if (user?.role === "organization") {
      const foundOrganizations = await Organization.find({ admin: user?._id });
      return res.send({
        message: "found organization by organization admin",
        foundOrganizations,
        success: true,
      });
    } else {
      return res.status(403).send({
        message: " only organization role allowed",
        success: false,
      });
    }
  })
);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.post(
  "/",
  authMiddleware,
  organizationMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const data: IOrganization = req.body;
    const organizationId = (req as any).user.id;

    const foundOrganizations = await Organization.findOne({
      name: req.body.name,
      admin: organizationId,
    });
    if (foundOrganizations) {
      return next(new AppError("organization already exists", 400));
    }

    const createdOrganization = await Organization.create({
      ...req.body,
      admin: organizationId,
    });
    res.status(200).json({
      data: createdOrganization,
      message: "organization creation successfull",
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.patch(
  "/:id",
  authMiddleware,
  organizationMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Partial<IOrganization> = req.body;
    const foundOrganization = await Organization.findById(id);
    console.log("organizations",foundOrganization)
    if (!foundOrganization) {
      return next(new AppError("organization not found", 404));
    }
    const updatedOrganization = await Organization.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    res.status(200).json({
      message: "organization updated successfully",
      organization: updatedOrganization,
      status: "success",
    });
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.patch(
  "/:id/status",
  authMiddleware,
  
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const {  status }= req.body;
    const foundOrganization = await Organization.findById(id);
    if (!foundOrganization) {
      return next(new AppError("organization not found", 404));
    }
    if (req.user?.role !== "admin") {
      return next(new AppError("only admin can change role", 403));
    }
    const updatedStatus = await Organization.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    );
    res.send(updatedStatus);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.get(
  "/:id",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foundOrganization = await Organization.findById(id);
    if (!foundOrganization) {
      return next(new AppError("organization not found", 404));
    }
    res.send(foundOrganization);
  })
);


organizationRouter.get(
  "/users/:userId",
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    const foundOrganizations = await Organization.findOne({
      admin:id
    });
    if (!foundOrganizations) {
      return next(new AppError("organization not found", 404));
    }
    res.send(foundOrganizations);
  })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

organizationRouter.delete(
  "/:id",
  authMiddleware,
  catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const role = req.user?.role
    if (role !== "admin") {
      return next(new AppError("only can be deleted by admin", 403));
    }
    const foundOrganization = await Organization.findById(id);
    if (!foundOrganization) {
      return next(new AppError("organization not found", 404));
    }
    const deletedOrganization = await Organization.findByIdAndDelete(id);
    res.send(deletedOrganization);
  })
);

export default organizationRouter;
