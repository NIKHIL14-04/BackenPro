import { Mongoose ,Schema } from "mongoose";
import mongooseaggregatepaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new Schema(
    {
        videoFile :{
            type:String,
            required:true,
        },
        thumbnail :{
            type:String,
            required:true,
        },
        title :{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration :{
            type:Number,
            required:true,
        },
        views :{
            type:Number,
            default:0
        },
        isPublihsed :{
            type:Boolean,
            default:true,
        },
        owner :{
            type:Schema.Types.ObjectId,
            ref:"userModel"
        },
    },{timestamps:true})
videoSchema.plugin(mongooseaggregatepaginate)
 export const video = Mongoose.model("video",videoSchema)