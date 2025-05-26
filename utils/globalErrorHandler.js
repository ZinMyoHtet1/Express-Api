const CustomError =require("./CustomError.js");

function castErrorHandler(err){
    const msg=`Invalid value for field ${err.path}: ${err.value}`
    return new CustomError(msg,400)
}

function duplicateKeyErrorHandler(err){
    const msg=`There already had phone name. Please try another name`
    return new CustomError(msg,400)
    
};

function validationErrorHandler(err){
    const contents= Object.values(err.errors).map(val=> val).join(". ")
    const msg=`Validation Failed: ${contents}`
    return new CustomError(msg,400)
}

function referenceErrorHandler(err){
    const msg=`ReferenceError : ${err.message}`
    return new CustomError(msg,400)
}

function devError(res,error) {
    console.log(error?.name);
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
};

function proError(res,error) {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message

        })} else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong! Try again later."
        })}
}

module.exports = function(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    
    if(process.env.MODE==="development"){
        devError(res,error)
        
    }else if(process.env.MODE==="production"){
        if(error?.name==="CastError") error =castErrorHandler(error)
        
        if(error?.errorResponse?.code===11000) error =duplicateKeyErrorHandler(error)
        
        console.log(error?.name)
        
        if(error?.name==="ValidationError") error=validationErrorHandler(error)
        if(error?.name==="ReferenceError") error= referenceErrorHandler(error)
        proError(res,error)
    }
}