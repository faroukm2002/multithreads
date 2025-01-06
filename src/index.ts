import express  from "express";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection";
import { Request, Response } from "express";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";

dotenv.config()

const app = express();
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);

// Middleware for JSON body parsing
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: false}));





const port :number  = parseInt(process.env.PORT as string) || 10000


dbConnection()
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Node js!');
});  


app.listen(port, ():void =>
    console.log(`Example app listening on port http://localhost:${port}`)) 
 
