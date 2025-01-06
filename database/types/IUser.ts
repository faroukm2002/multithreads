import { Document, ObjectId } from "mongoose";

// Define IUser to match the Mongoose schema
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    refreshToken: string;
    _id: ObjectId;
    changePasswordAt: Date
}