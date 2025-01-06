import express  from "express"
    import  * as user  from "./user.controller"
const userRouter =express.Router()



userRouter.route('/').
get(user.getAllUser)


userRouter.route('/:id').
get(user.getUserByID).

put(user.updateUser).
delete(user.deleteUser)

export default userRouter


