const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { setJWTCookie } = require("../utils/cookies");
const {
  getAccessTokenFromCode,
  getDiscordUserFromToken,
  isLoggedIn,
} = require("../utils/discordOauth");
const { sendResponse } = require("../utils/sendResponse");

exports.login = catchAsync(async (req, res, next) => {
  const {
    query: { code },
    cookies,
  } = req;

  let data;

  if (!code && !cookies.JWT) throw new AppError("You are not logged in", 401);

  console.log(cookies);

  if (!code && cookies.JWT) {
    await isLoggedIn(req);
    return sendResponse(req, res, req.discordUser);
  }

  if (code && !cookies.JWT) data = await getAccessTokenFromCode(code);

  if (code && cookies.JWT) data = await getAccessTokenFromCode(code);

  const discordUser = await getDiscordUserFromToken(data.access_token);

  const userDoc = await User.findOne({ userId: discordUser.id });

  if (userDoc)
    await userDoc.updateOne({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

  if (!userDoc)
    await User.create({
      userId: discordUser.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

  await setJWTCookie(discordUser, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("JWT", "loggedout", {
    expires: new Date(Date.now() - 1000),
    // httpOnly: true,
  });
  sendResponse(req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  await isLoggedIn(req);
  next();
});
