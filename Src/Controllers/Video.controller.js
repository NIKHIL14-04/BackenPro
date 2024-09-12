import asynchandler from "../Utils/asyncHandler.js";

const GetAllVideos = asynchandler(async(req,res)=>{
// const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
// console.log( page = 1, limit = 10, query, sortBy, sortType, userId)
res.send(req.query)
})

export {
    GetAllVideos  
}