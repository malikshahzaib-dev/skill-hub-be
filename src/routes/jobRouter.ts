import express, { Request, Response } from "express"
import Job, { IJob } from "../models/jobModel"
import authMiddleware from "../middleware/authmiddleware"
import Organization from "../models/organizationModel"


const jobRouter = express.Router()

jobRouter.get("/", async (req: Request, res: Response) => {
    const  {location} = req.query

    let filter:any = {}

    if(location)
    {
        filter.location = location
    }

    const foundJobs = await Job.find(filter)
    res.send(foundJobs)
})

jobRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return res.send("job not found")
    }
    res.send(foundJob)
})
jobRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
    const { title, description, salary, organizationId, createdBy,status } = req.body
    const role = req.body.role
  //  const organizationId = req.params.organization
    if (role !== "organization admin") {
        return res.send("job only created by organization admin")
    }
    const foundOrganization = await Organization.findById(organizationId)
    if(!foundOrganization || foundOrganization.status !== "approved") {
        return res.send("organization is not approved ")
    }

    const foundJob = await Job.findOne({ title })
    if (foundJob) {
        return res.send("job already exists")
    }
    const createdJob = await Job.create({
        title,
        description,
        salary,
        organizationId,
        createdBy
    })
    res.send(createdJob)
})


jobRouter.patch("/:id", authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const data: Partial<IJob> = req.body
    const { role }: { role: string } = req.body
    if (role !== "organization admin") {
        return res.send("job only can be updated by organization admin")
    }
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return res.send("job not found")
    }
    const updatedJob = await Job.findByIdAndUpdate(id, data, { returnDocument: "after" })
    res.send(updatedJob)
})

jobRouter.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const { role }: { role: string } = req.body
    if (role !== "organization admin") {
        return res.send("job only can be created by organization admin")
    }
    const foundJob = await Job.findById(id)
    if (!foundJob) {
        return res.send("job not found")
    }
    const deletedJob = await Job.findByIdAndDelete(id)
    res.send(deletedJob)
})


export default jobRouter