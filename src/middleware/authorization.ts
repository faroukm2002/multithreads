import { Request, Response, NextFunction } from "express";
import { userModel } from "../../database/models/user.model";
import { AppError } from "../utils/AppError";
import { catchError } from "../utils/catchError";
import verifyToken from "../utils/verifyToken";
import { IUser } from "../../database/types/IUser.js";
// 1- check we have token or not 
// 2- verfy token
// 3 if user of this token exist or not 

const allowedto = (roles: string[]) => {
  return catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

        // 1- Check if authorization header is present and starts with Bearer key
        if (!authorization?.startsWith(process.env.BEARER_KEY || "Bearer")) {
      return next(new AppError("Invalid Bearer Key", 400));
    }

        // 1- check we have token or not 
        const token = authorization.split(process.env.BEARER_KEY || "Bearer")[1]?.trim();
    if (!token) {
      return next(new AppError("Token is missing", 400));
    }

        // 2- verfy token
        let decoded = verifyToken(token);
    console.log("Decoded token:", decoded);  // Check token payload

    if (!decoded.id) {
      return next(new AppError("Invalid token Payload", 401));
    }

    // 3- Check if user of this token exists or not
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // 4- Check if the user has the required role
    if (!roles.includes(user.role)) {
        console.log("User role:", user.role);

      return next(new AppError("You are not authorized to access this route.", 403));
    }

    req.user = user as IUser; 
    next();
  });
};

export { allowedto };
