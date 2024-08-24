import { ApiError } from "../Utils/ApiErrorhandel.js";
import asynchandler from "../Utils/asyncHandler.js";
import userModel from "../Models/User.model.js";
import FileUploadOnClodinar from "../Utils/Cloudniary.js"
import Apiresponce from "../Utils/ApiResponcehandel.js";


const GenrateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await userModel.findById(userId)
        const Accesstoken =  user.accessGenrateToken()
        const Refreshtoken  = user.refrasheGenrateToken()
        user.refreshToken = Refreshtoken
        await user.save({validateBeforeSave:false})
        return {Accesstoken,Refreshtoken}

    } catch (error) {
        console.log(error.message)
        throw new ApiError(500,"something went worn while genrating access and refresh token..!")
    }
}


const RegisterUser = asynchandler(async (req, res) => {
    const { userName, email, fullname, password } = req.body
    if ([userName, email, fullname, password].some((filed) => filed?.trim() === "")) {
        throw new ApiError(409, "All filed are required !")
    }
    const UserExisted = await userModel.findOne({
        $or: [{ userName }, { email }]
    })
    if (UserExisted) {
        throw new ApiError(409, "username and email alredy existed")
    }
    let AvatarImageLocal;
    if (req.files && Array.isArray(req.files.Avatar) && req.files.Avatar.length > 0) {
        AvatarImageLocal = req.files.Avatar[0].path
    }

    let coverImageLocal;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocal = req.files.coverImage[0].path
    }
    if (!AvatarImageLocal) {
        throw new ApiError(400, "Avatar filed is required")
    }
    const avatar = await FileUploadOnClodinar(AvatarImageLocal)
    const coverImage = await FileUploadOnClodinar(coverImageLocal)
    if (!avatar) {
        throw new ApiError(409, " Clodinary avatar filed is required")
    }
    const User = await userModel.create({
        fullname,
        email,
        Avatar: avatar?.url,
        coverImage: coverImage?.url,
        userName: userName.toLowerCase(),
        password
    })
    const Userisdb = await userModel.findById(User._id).select("-password -refreshToken")
    if (!Userisdb) {
        throw new ApiError(500, "user not found..!")
    }
    return res.status(201).json(
        new Apiresponce(201, Userisdb, "Register")
    )
})



const LoginUser = asynchandler(async(req,res)=>{
  const {email,password,userName} = req.body
  if(!email || !userName){
    throw new ApiError(400,"email and username are required  !") 
  }
  const user = await userModel.findOne({$or:[email,userName]})
  if(!user){
    throw new ApiError(400," user not found..!") 
  }
  const IsPasswordvalidate = await user.isPasswordCorrect(password)
  if (!IsPasswordvalidate) {
    throw new ApiError(400,"password is not correct..!") 
  }
const {Accesstoken,Refreshtoken}= await GenrateAccessAndRefreshToken(user._id)
  const logendInUser = await userModel.findById(user._id).select("-password -refreshToken")

  const options ={
    httpOnly:true,
    secure:true
  }

  return res.status(200)
  .cookie("Accesstoken",Accesstoken,options)
  .cookie("Refreshtoken",Refreshtoken,options)
  .json(new Apiresponce(200,{logendInUser,Accesstoken,Refreshtoken},"user logoin successfully..!"))

})


const LogoutUser = asynchandler(async(req,res)=>{
    const logout = await userModel.findByIdAndUpdate(req.user._id,{$set:{
        refreshToken:undefined
    }},{new:true})
    const options ={
        httpOnly:true,
        secure:true
      }  

      return res.status(200)
      .clearCookie(Accesstoken,options)
      .clearCookie(Refreshtoken,options)
      .json(
        new Apiresponce(200,{},"user logout")
      )
})



export { RegisterUser,LoginUser,LogoutUser }