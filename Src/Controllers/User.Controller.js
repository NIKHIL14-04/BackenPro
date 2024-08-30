import { ApiError } from "../Utils/ApiErrorhandel.js";
import asynchandler from "../Utils/asyncHandler.js";
import userModel from "../Models/User.model.js";
import FileUploadOnClodinar from "../Utils/Cloudniary.js"
import Apiresponce from "../Utils/ApiResponcehandel.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const GenrateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await userModel.findById(userId)
        const Accesstoken = user.accessGenrateToken()
        const Refreshtoken = user.refrasheGenrateToken()
        user.refreshToken = Refreshtoken
        await user.save({ validateBeforeSave: false })
        return { Accesstoken, Refreshtoken }

    } catch (error) {
        console.log(error.message)
        throw new ApiError(500, "something went worn while genrating access and refresh token..!")
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



const LoginUser = asynchandler(async (req, res) => {
    const { email, password, userName } = req.body
    if (!email) {
        throw new ApiError(400, "email and username are required  !")
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError(400, " user not found..!")
    }
    const IsPasswordvalidate = await user.isPasswordCorrect(password)
    if (!IsPasswordvalidate) {
        throw new ApiError(400, "password is not correct..!")
    }
    const { Accesstoken, Refreshtoken } = await GenrateAccessAndRefreshToken(user._id)
    const ac = await Accesstoken
    const rc = await Refreshtoken
    const logendInUser = await userModel.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("Accesstoken", ac, options)
        .cookie("Refreshtoken", rc, options)
        .json(new Apiresponce(200, { logendInUser, Accesstoken: ac, Refreshtoken: rc }, "user logoin successfully..!"))

})


const LogoutUser = asynchandler(async (req, res) => {
    try {
        const logout = await userModel.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: undefined
            }
        }, { new: true })
        const options = {
            httpOnly: true,
            secure: true
        }
        const { Accesstoken, Refreshtoken } = await GenrateAccessAndRefreshToken(req.user._id)
        const ac = await Accesstoken
        const rc = await Refreshtoken
        return res.status(200)
            .clearCookie("Accesstoken", ac, options)
            .clearCookie("Refreshtoken", rc, options)
            .json(
                new Apiresponce(200, {}, "user logout")
            )
    } catch (error) {
        console.log(error.message)
    }
})

const AccessRefreshToken = asynchandler(async (req, res) => {
    const IncomeimgrefreshToken = req.cookies?.Refreshtoken || req.body.Refreshtoken

    if (!IncomeimgrefreshToken) {
        throw new ApiError(400, "Unauthrized token..!")
    }
    const IncodedToken = jwt.verify(IncomeimgrefreshToken, process.env.REFRSH_TOKEN_SECRET)
    const user = await userModel.findById(IncodedToken?._id)
    if (!user) {
        throw new ApiError(400, "Invalid Refresh Token..!")
    }

    if (IncomeimgrefreshToken !== IncodedToken.refreshToken) {
        throw new ApiError(400, "refresh token are not match..!")
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const { Accesstoken, Refreshtoken } = await GenrateAccessAndRefreshToken(user._id)
    const ac = await Accesstoken
    const rc = await Refreshtoken

    return res.status(200)
        .cookie("Accesstoken", ac, options)
        .cookie("Refreshtoken", rc, options)
        .json(
            new Apiresponce(200, { Accesstoken: ac, Refreshtoken: rc }, "token refresh succefully..!")
        )
})

const ChangeCurrentPassword = asynchandler(async (req, res) => {
    const { oldPasswoed, NewPassword, ConfirmPassword } = req.body
    if (!oldPasswoed || !NewPassword || !ConfirmPassword) {
        throw new ApiError(400, "All filed are required...!")
    }

    if (NewPassword !== ConfirmPassword) {
        throw new ApiError(400, "Newpassword and oldpassword not match..!")

    }
    const user = await userModel.findById(user._id)

    const CheckPassword = await user.isPasswordCorrect(oldPasswoed)
    if (!CheckPassword) {
        throw new ApiError(400, "Invalid Password ...!")
    }

    user.password = NewPassword
    await user.save({ validateBeforeSave: true })

    return res.status(200).
        json(
            new Apiresponce(200, {}, "Update password successfully..!")
        )

})

const GetCurrentUser = asynchandler(async (req, res) => {
    return res.status(200).json(
        new Apiresponce(200, { data: req.user }, "current user found successfully..!")
    )
})


const UpdateAccountDetails = asynchandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!fullname || !email) {
        throw new ApiError(400, "All filed are required...!")
    }
    const user = await userModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname,
            email: email
        }
    }, { new: true }).select("-password -refreshToken")
    return res.status(200).json(
        new Apiresponce(200, user, "update successfully..!")
    )

})


const UpdateUserAvatar = asynchandler(async (req, res) => {
    const { AvatarLoaclpath } = req.file?.path
    if (!AvatarLoaclpath) {
        throw new ApiError(400, "Avatart file are missing...!")
    }
    const Avatar = await FileUploadOnClodinar(AvatarLoaclpath)
    if (!Avatar.url) {
        throw new ApiError(400, "error while uploading vatart file!")
    }
    const updateAvatarFile = await userModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            Avatar: Avatar.url
        }
    }, { new: true }).select("-password -refreshToken")
    return res.status(200).json(
        new Apiresponce(200, updateAvatarFile, "update avatar file successfully..!")
    )

})
const UpdateUserCoverImage = asynchandler(async (req, res) => {
    const { CoverimageLoaclpath } = req.file?.path
    if (!CoverimageLoaclpath) {
        throw new ApiError(400, "Covar Image file are missing...!")
    }
    const Covarimage = await FileUploadOnClodinar(CoverimageLoaclpath)
    if (!Covarimage.url) {
        throw new ApiError(400, "error while uploading Covarimage file!")
    }
    const updateCovarimage = await userModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: Covarimage.url
        }
    }, { new: true }).select("-password -refreshToken")
    return res.status(200).json(
        new Apiresponce(200, updateCovarimage, "update coverimage file successfully..!")
    )

})


const GetUserChannelProfile = asynchandler(async(req,res)=>{
    const {userName} = req.params
    if(!userName){
        throw new ApiError(400,"Username are missing...!")
    }
    const channel = await userModel.aggregate([{
        $match:{
            userName:userName?.toLowerCase()
        }
    },{
        $lookup:{
            from:"subscriptionModel",
            foreignField:"channel",
            localField:"_id",
            as:"subscriber"
        }
    },
    {
     $lookup:{
            from:"subscriptionModel",
            foreignField:"subscriber",
            localField:"_id",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            SubscribersCount:{
                $size:"$subscriber"
            },
            SubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed :{
                $cond:{
                    if:{$in:[req.user?._id ,"$subscriber.subscriber"]},then:true,else:false
                }
            }
        }
    },{
        $project:{
            SubscribersCount:1,
            SubscribedToCount:1,
            userName:1,
            coverImage:1,
            Avatar:1,
            fullname:1,
            email:1
        }
    }
])
if(!channel){
    throw new ApiError(400,"User !")
  
}
return res.status(200).json(
    new Apiresponce(200,channel[0],"all data found successfully..!")
)
})

const GetuserWatchhistory =asynchandler(async(req,res)=>{
  const user = await userModel.aggregate([{
    $match:{
        _id:new mongoose.Types.ObjectId(req.user?._id)
    }
  },{
    $lookup:{
        from:"videos",
        foreignField:"_id",
        localField:"watchHistory",
        as:"watchHistory",
        pipeline:[
            {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                    $project:{
                        fullname:1,
                        userName:1,
                        Avatar:1,
                        coverImage:1
                    }
                },{
                $addFields:{
                    owner:{
                        $first:"$owner"
                    }
                }
            }
            ]
            }
    }]
    }
  }
])

return res.status(200).json(
    new Apiresponce(
        200,
        user[0].watchHistory,
        "get data successfully.!"
    )
)


})

export {
    RegisterUser,
    LoginUser,
    LogoutUser,
    AccessRefreshToken,
    ChangeCurrentPassword,
    GetCurrentUser,
    UpdateAccountDetails,
    UpdateUserAvatar,
    UpdateUserCoverImage,
    GetUserChannelProfile,
    GetuserWatchhistory
}