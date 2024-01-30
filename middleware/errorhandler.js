exports.noFound =(req,res,next) => {
    const error = new Error( `not found ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
}




exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 for internal server errors
    res.status(statusCode);
    
    if (statusCode === 404) {
        // Render the not found template
        res.render("not_found");
    } else {
        // Render the error template
        const errorMessage = err.message || 'Internal Server Error';
        res.render("error", { error: errorMessage });
    }
};

