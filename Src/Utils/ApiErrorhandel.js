class ApiError extends Error{
    constructor(
        statusCode,
        message="Something Went Worn !",
        errors=[],
        stack=""
        
    ){
     super(message,statusCode)
     this.statusCode=statusCode
     this.message =message
     this.data = null
     this.success =false
     this.errors = errors
    }

}
export {ApiError}