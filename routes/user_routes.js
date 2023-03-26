import express from "express";
import { deleteUser, getAllUser, getBookingsOfUser, getUserById, login, signup, updateUser } from "../controllers/user_controller";

const userRouter=express.Router();

userRouter.get("/",getAllUser);
userRouter.get("/:id",getUserById);
userRouter.post("/signup",signup);
userRouter.put("/:id",updateUser);
userRouter.delete("/:id",deleteUser);
userRouter.post("/login",login);
userRouter.get("/bookings/:id",getBookingsOfUser)

export default userRouter;