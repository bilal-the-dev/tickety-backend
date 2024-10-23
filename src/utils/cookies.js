const jwt = require("jsonwebtoken");
const { sendResponse } = require("./sendResponse");

exports.setJWTCookie = async (user, req, res) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("JWT", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: process.env === "production",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite : process.env === "production" ? 'None' : 'lax',
  });

  sendResponse(req, res, user);
  // res.json({ status: "success", data: user });
};
