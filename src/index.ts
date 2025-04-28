import express, { NextFunction } from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import { dbConnection } from "../database/dbConnection";
import { Request, Response } from "express";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import { AppError } from "./utils/AppError";
import { globalError } from "./middleware/globalErrorMiddleware";

dotenv.config();

// Setup Express App
const app = express();
const numCPUs = os.cpus().length;

// Cluster Setup for Worker Processes
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    console.log("Starting a new worker...");
    cluster.fork();
  });
} else {
  // Worker Logic
  console.log(`Worker ${process.pid} started`);

  // Middleware for Parsing Requests
  app.use(express.json({ limit: "10kb" })); // JSON Body Parsing
  app.use(express.urlencoded({ extended: false })); // URL-encoded Body Parsing

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Node js!");
  });

  // Database Connection
  dbConnection();

  // Port Setup
  const port: number = parseInt(process.env.PORT as string) || 10000;

  // Start the Server
  app.listen(port, (): void =>
    console.log(`Example app listening on port http://localhost:${port}`)
  );

  // Invalid URL Handling Middleware
  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Invalid URL ${req.originalUrl}`, 404));
  });

  // Global Error Handling Middleware
  app.use(globalError);
}
