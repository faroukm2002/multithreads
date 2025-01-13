import express from "express";
import * as user from "./user.controller";
import { IsAllowedto } from "../../middleware/authorization";
const userRouter = express.Router();

userRouter.route("/").get(user.getAllUser);

userRouter
  .route("/:id")
  .get(IsAllowedto(["admin"]), user.getUserByID)
  .put(IsAllowedto(["admin"]), user.updateUser)
  .delete(IsAllowedto(["admin"]), user.deleteUser);

export default userRouter;
