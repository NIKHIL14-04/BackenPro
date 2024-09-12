import express from "express"
import { jwtVerifyUser } from "../Middelwares/Auth.middleware.js"
import { upload } from "../Middelwares/Multer.middelware.js"
import { GetAllVideos } from "../Controllers/Video.controller.js"



const VideoRouter = express.Router()

// VideoRouter.use(jwtVerifyUser)
VideoRouter.get("/All",GetAllVideos)

export default VideoRouter;