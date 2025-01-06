import { Schema,model } from "mongoose"
import { IUser } from "../types/IUser";
import bcrypt from "bcrypt"

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
          match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please enter a valid email'], 

    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
        match: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'Password must contain at least one letter, one number, and one special character'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    refreshToken: {
            type: String,
            default: null,
    },
            changePasswordAt:Date,

}, { timestamps: true });

// hash password bt4 adduser  and signUP **************
userSchema.pre('save',function(){
    // console.log(this)
    this.password=bcrypt.hashSync(this.password,parseInt(process.env.SALT_ROUND!))
})



export const userModel=model<IUser>('user',userSchema) 