// it return error in json format
exports.generatedErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    success: err.success,
    errName: err.name,
    stack: err.stack,
  });
};