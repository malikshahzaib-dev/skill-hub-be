import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./connectDB";
import router from "./router/route";
import globalErrorHandler from "./errorHadleng/globalErrorHandling";
import cors from "cors";
import multer from "multer";



dotenv.config();

const app = express();
connectDB();

app.use(cors()); 

app.use(express.json());
app.use("/api", router);


// const upload = multer({dest:"upload/"})
// app.post("/upload",upload.single("file"),(req,res) => {
//     console.log("single file",req.file)
//     res.send("single file uploaded successfully")
// })

app.get("/", (req: Request, res: Response) => {
    res.send("Server is online");
});

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Route not found");
    res.status(404);
    next(error);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is online at http://localhost:${PORT}`);
});
