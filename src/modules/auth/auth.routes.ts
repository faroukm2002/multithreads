import express  from "express"
import { refreshToken, signIn, signUp } from "./auth.controller"
const authRouter =express.Router()



authRouter.post('/signUp',signUp)
authRouter.post('/signIn',signIn)
authRouter.post('/refresh-token', refreshToken); // Add the refresh token route
export default authRouter


