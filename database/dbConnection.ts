import mongoose from "mongoose";

export const dbConnection = () => {
  // const DB_URL=process.env.DATABASE || ""
  mongoose.connect(process.env.DATABASE!);
};
