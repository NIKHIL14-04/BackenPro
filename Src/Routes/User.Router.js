import express from "express"
import { AccessRefreshToken, 
    ChangeCurrentPassword, 
    GetCurrentUser, 
    GetUserChannelProfile, 
    GetuserWatchhistory, 
    LoginUser, 
    LogoutUser, 
    RegisterUser,
     UpdateAccountDetails, 
     UpdateUserAvatar, 
     UpdateUserCoverImage } from "../Controllers/User.Controller.js";
import { upload } from "../Middelwares/Multer.middelware.js";
import { jwtVerifyUser } from "../Middelwares/Auth.middleware.js";
const UserRouter = express.Router()

UserRouter.post("/register",upload.fields([{name:"Avatar",maxCount:1},{name:"coverImage",maxCount:1}]),RegisterUser)
UserRouter.post("/login",LoginUser)
UserRouter.post("/logout",jwtVerifyUser,LogoutUser)
UserRouter.post("/ref-token",AccessRefreshToken)
UserRouter.post("/change-password",jwtVerifyUser,ChangeCurrentPassword)
UserRouter.get("/get-user",jwtVerifyUser,GetCurrentUser)
UserRouter.patch("/update-account",jwtVerifyUser,UpdateAccountDetails)
UserRouter.patch("/Avatar",jwtVerifyUser,upload.single("Avatar"),UpdateUserAvatar)
UserRouter.patch("/coverImage",jwtVerifyUser,upload.single("coverImage"),UpdateUserCoverImage)
UserRouter.get("/user/userName",jwtVerifyUser,GetUserChannelProfile)
UserRouter.get("/history",jwtVerifyUser,GetuserWatchhistory)

export default UserRouter;