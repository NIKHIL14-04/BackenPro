import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const FileUploadOnClodinary = async(LoaclFilePath)=>{
    try {
        if (!LoaclFilePath) return null
        const responce = await cloudinary.uploader.upload(LoaclFilePath,{resource_type:"auto"})
        console.log(responce)
        return responce
    } catch (error) {
        fs.unlinkSync(LoaclFilePath)
        return null
    }
}