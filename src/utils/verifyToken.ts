import jwt from "jsonwebtoken";
import { AppError } from "./AppError";
import { DecodedToken } from "../../database/types/DecodedToken";

// Define the structure of the decoded token


const verifyToken = (token: string): DecodedToken => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; // For access token
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
  return decoded;
};

export default verifyToken;
