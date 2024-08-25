import userModel from "../Models/User.model.js";
import { ApiError } from "../Utils/ApiErrorhandel.js";
import asynchandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const jwtVerifyUser = asynchandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.Accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(409,"access token not provide")
        }
        const decodeToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  

        const user = await userModel.findById(decodeToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(400,"access token invalid")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(400,error.message)

    }
})
