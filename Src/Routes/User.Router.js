import express from "express"
import { LoginUser, LogoutUser, RegisterUser } from "../Controllers/User.Controller.js";
import { upload } from "../Middelwares/Multer.middelware.js";
import { jwtVerifyUser } from "../Middelwares/Auth.middleware.js";
const UserRouter = express.Router()

UserRouter.post("/register",upload.fields([{name:"Avatar",maxCount:1},{name:"coverImage",maxCount:1}]),RegisterUser)
UserRouter.post("/login",LoginUser)
UserRouter.post("/logout",jwtVerifyUser,LogoutUser)

export default UserRouter;