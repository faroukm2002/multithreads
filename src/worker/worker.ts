import { parentPort, workerData } from "worker_threads";

if (!parentPort) {
  throw new Error("Worker thread must have a parent port");
}

// Example: Processing request data
const processRequest = (data: any) => {
  const { method, url, body, query } = data;
  return {
    message: `Processed ${method} request to ${url}`,
    body,
    query,
  };
};

// Run the worker logic
const result = processRequest(workerData);
parentPort.postMessage(result);
