import { ApiError } from "../Utils/ApiErrorhandel.js";
import asynchandler from "../Utils/asyncHandler.js";
import userModel from "../Models/User.model.js";
import FileUploadOnClodinar from "../Utils/Cloudniary.js"
import Apiresponce from "../Utils/ApiResponcehandel.js";
const RegisterUser = asynchandler(async(req,res)=>{
    const {userName,email,fullname,password} = req.body
    if([userName,email,fullname,password].some((filed)=>filed?.trim() === "")){
             throw new ApiError(409,"All filed are required !")
    }

    const UserExisted = await userModel.findOne({
        $or:[{userName},{email}]
    })
    if(UserExisted){
        throw new ApiError(409,"username and email alredy existed")
    }
     let AvatarImageLocal;
    if(req.files && Array.isArray(req.files.Avatar) && req.files.Avatar.length>0){
        AvatarImageLocal = req.files.Avatar[0].path
    }

    let coverImageLocal;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocal = req.files.coverImage[0].path
    }
    if(!AvatarImageLocal){
        throw new ApiError(400,"Avatar filed is required")
    }
    const avatar = await FileUploadOnClodinar(AvatarImageLocal)
    const coverImage = await FileUploadOnClodinar(coverImageLocal)
     if(!avatar){
        throw new ApiError(409," Clodinary avatar filed is required")
     }
   const User = await userModel.create({
      fullname,
      email,
      Avatar : avatar?.url,
      coverImage: coverImage?.url,
      userName:userName.toLowerCase(),
      password
   })

   

      const Userisdb = await userModel.findById(User._id).select("-password -refreshToken")
      if(!Userisdb){
        throw new ApiError(500,"user not found..!")
      }

     return res.status(201).json(
        new Apiresponce(201,Userisdb,"Register")
     )
})

export {RegisterUser}