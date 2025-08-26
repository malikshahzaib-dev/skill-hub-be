import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "auth");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "no token provide" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.send({ message: "Invalid  token" });
    }

    (req as any).user = decoded as JwtPayload;
    console.log("Decoded user", decoded);

    next();
  });
};

export default authMiddleware;
