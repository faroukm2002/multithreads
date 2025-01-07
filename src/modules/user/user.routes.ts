import express  from "express"
    import  * as user  from "./user.controller"
import { allowedto } from "../../middleware/authorization"
const userRouter =express.Router()



userRouter.route('/').
get( user.getAllUser)


userRouter.route('/:id').
get(allowedto(["admin"]),user.getUserByID).

put(allowedto(["admin"]),user.updateUser).
delete(allowedto(["admin"]),user.deleteUser)

export default userRouter


