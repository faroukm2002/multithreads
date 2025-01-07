import { NextFunction, Request, Response } from "express";
import { userModel } from "../../../database/models/user.model";
import { catchError } from "../../utils/catchError";
import bcrypt from 'bcrypt';
import generateToken from "../../utils/generateToken";
import { AppError } from "../../utils/AppError";
import verifyToken from "../../utils/verifyToken";

const signUp = catchError(async (req: Request, res: Response, next: NextFunction) => {
      let {email} = req.body

  let isUser = await userModel.findOne({ email });
  if (isUser) return next(new AppError("Account already exists", 409));
  const user = new userModel(req.body);
  
  await user.save();

  // Created
  res.status(201).json({ message: "success", user });
});

const signIn = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError("Incorrect email or password", 409));

  // Generate access and refresh tokens
  const tokens = generateToken({
    name: user.name,
    email: user.email,
    id: user._id.toString(),
    role: user.role,

  });
  await userModel.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  res.status(200).json({ message: "success", tokens });
});



const refreshToken = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return next(new AppError("Refresh token is missing", 400));

  // Verify refresh token
  const decoded = verifyToken(refreshToken);  // Assuming verifyToken returns decoded object
    if (!decoded) return next(new AppError("Invalid refresh token", 401));

 // Check if the refresh token matches the one in the database
    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return next(new AppError("Invalid or expired refresh token", 401));

  // Generate new tokens (access and refresh tokens)
  const tokens = generateToken({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Update the user's refresh token in the database
  await userModel.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  // Send the new tokens
  res.status(200).json({ message: "Tokens refreshed successfully", tokens });
});
export{ 
    signUp,
  signIn,
    refreshToken
}