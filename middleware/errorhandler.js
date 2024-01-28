exports.notFound =(req,res,next) => {
    const error = new Error( `not found ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
}




exports.errorHandler =(err,req,res,next) => {
    const statusCode = res.statusCode ===200 ? 500 : res.statusCode
    res.status(statusCode).json({err:err.message})
}