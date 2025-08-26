import express,{Request,Response} from "express";
import Organization, { IOrganization } from "../models/organizationModel";
import authMiddleware from "../middleware/authmiddleware";

const organizationRouter = express.Router()

organizationRouter.get("/", async (req:Request, res:Response) => {
    const foundOrganizations = await Organization.find()
    res.send(foundOrganizations)
}
)
organizationRouter.post("/", authMiddleware, async (req:Request, res:Response) => {
    const data:IOrganization = req.body

    const foundOrganizations = await Organization.findOne({ name: data.name })
    if (foundOrganizations) {
        return res.send("organization already exists")
    }

    const createdOrganization = await Organization.create(data)
    res.send(createdOrganization)
})
organizationRouter.patch("/:id", authMiddleware, async (req:Request, res:Response) => {
    const id = req.params.id
    const data:Partial<IOrganization> = req.body;
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
        return res.send("organization not found")
    }
    const updatedOrganization = await Organization.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    res.send(updatedOrganization)
})


organizationRouter.patch("/status/:id",authMiddleware, async (req:Request, res:Response) => {
    const id = req.params.id
    const {role,status}:{role:string;status:string} = req.body
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
      return  res.send("organization not found")
    }
    if (role !== "admin") {
      return  res.send("only admin can change role")
    }
    const updatedStatus = await Organization.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
    res.send(updatedStatus)
})



organizationRouter.get("/:id", async (req:Request, res:Response) => {
    const id = req.params.id
    const foundOrganizations = await Organization.findById(id)
    if (!foundOrganizations) {
       return res.send("organization not found")
    }
    res.send(foundOrganizations)
})

organizationRouter.delete("/:id", authMiddleware, async (req:Request, res:Response) => {
    const id = req.params.id
    const {role}:{role:string} = req.body
    if (role !== "admin") {
       return res.send("only can be deleted by admin")
    }
    const foundOrganization = await Organization.findById(id)
    if (!foundOrganization) {
        return res.send("organization not found")
    }
    const deletedOrganization = await Organization.findByIdAndDelete(id)
    res.send(deletedOrganization)
})


export default organizationRouter 