import mongoose, { Mongoose ,Schema } from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        lowecase:true,
        trim:true
    },
    Avatar:{
        type:String, //cloudinary  image
        required:true,
    },
    coverImage:{
        type:String, //cloudinary  image
    },
    watchHistory :[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    },
},{timestamps:true}
)

userSchema.pre("save", async function(next){
   if(!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    if(password){
        return await bcryptjs.compare(password,this.password)
    }
}

userSchema.methods.accessGenrateToken = async function() {
 return await jwt.sign({
        _id:this._id,
    email:this.email,
    userName:this.userName,
    fullname:this.fullname
  },process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIER
  })
}

userSchema.methods.refrasheGenrateToken = async function() {
    return await jwt.sign({
           _id:this._id,
     },process.env.REFRSH_TOKEN_SECRET,{
       expiresIn:process.env.REFRSH_TOKEN_EXPIRE
     })
   }

 const userModel = mongoose.model("user",userSchema)
 export default userModel;
// await jwt.sign({
//     _id:this._id,
//     email:this.email,
//     userName:this.userName,
//     fullname:this.fullname
//   },process.env.ACCESS_TOKEN_SECRET

// https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj