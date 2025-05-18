exports.sendRes = (statusCode = 200, res, data = null, message = "") => {
  res.status(statusCode).json({
    status: true,
    data: data,
    message: message,
  });
};

// function responseHandler(req, res, next) {
//   res.sendRes = (statusCode = 200, data = "", message = "") => {
//     res.status(statusCode).json({
//       status: true,
//       data,
//       message,
//     });
//   };
//   next();
// }

// module.exports = responseHandler;
