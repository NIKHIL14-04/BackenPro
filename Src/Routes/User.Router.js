import express from "express"
import { RegisterUser } from "../Controllers/User.Controller.js";
import { upload } from "../Middelwares/Multer.middelware.js";
const UserRouter = express.Router()

UserRouter.post("/register",upload.fields([{name:"Avatar",maxCount:1},{name:"coverImage",maxCount:1}]),RegisterUser)

export default UserRouter;