// const asynchandler =(fn) =>async(req,res,next)=>{
//   try {
//     await fn(req,res,next)
//   } catch (error) {
//     console.log(error.message)
//      res.status(500).json({
//         success :false,
//         message : error.message
//      })
//   }
// }


// export default asynchandler;


const asynchandler =(requesthandeler)=>{
  return  (req,res,next)=>{
  Promise.resolve(requesthandeler(req,res,next)).catch((error)=>next(error))
  }

}
export default asynchandler;
