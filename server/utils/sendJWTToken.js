const jwt = require("jsonwebtoken");

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.COOKIE_EXIPRES * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: true,
};

exports.SendToken = (user, statuscode, res, messge) => {
  const token = jwt.sign(
    { userId: user.id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res
    .cookie(`user-token`, token, cookieOptions)
    .status(statuscode)
    .json({ sucess: true, user: user, token, messge });
};
