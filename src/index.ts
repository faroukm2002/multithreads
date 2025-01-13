import cluster from "cluster";
import os from "os";
import express, { NextFunction } from "express";
import dotenv from "dotenv";
import { dbConnection } from "../database/dbConnection";
import { Request, Response } from "express";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import { AppError } from "./utils/AppError";
import { globalError } from "./middleware/globalErrorMiddleware";

dotenv.config();

const app = express();

// Middleware for JSON body parsing
app.use(express.json({ limit: "10kb" })); // Parses JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded request bodies

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

const numCPUs = os.cpus().length;
const port = parseInt(process.env.PORT as string) || 10000;

// Workers can share the same port
dbConnection();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node js!");
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  app.listen(port, (): void =>
    console.log(`Worker ${process.pid} started on http://localhost:${port}`)
  );

  // Handle invalid URLs
  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Invalid URL ${req.originalUrl}`, 404));
  });

  // Global Error Handling Middleware
  app.use(globalError);
}
