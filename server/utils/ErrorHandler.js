// it will handle syncronous Errors

class ErrorHandler extends Error {
  constructor(message, statusCode, success) {
    super(message);
    this.statusCode = statusCode;
    this.success = success || false;
    Error.captureStackTrace(this.constructor);
  }
}

module.exports = ErrorHandler;