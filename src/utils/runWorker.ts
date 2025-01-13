import { Worker } from "worker_threads";

// Function to run a worker and return a promise
export const runWorker = (data: any) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./path/to/worker.ts", { workerData: data });

    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", (error) => {
      reject(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}; 
