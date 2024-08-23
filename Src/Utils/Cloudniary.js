import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config({path:'./.env'})

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET 
});


const FileUploadOnClodinary = async(LoaclFilePath)=>{
    try {
        if (!LoaclFilePath) return null
        const responce = await cloudinary.uploader.upload(LoaclFilePath,{resource_type:"auto"})
        fs.unlinkSync(LoaclFilePath)
        return responce
    } catch (error) {
        console.log(error.message)
        fs.unlinkSync(LoaclFilePath)
        return null
    }
}

export default FileUploadOnClodinary;