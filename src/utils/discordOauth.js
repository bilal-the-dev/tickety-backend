const DiscordOauth2 = require("discord-oauth2");
const { promisify } = require("util");

const AppError = require("./appError");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const oauth2Options = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
};
const oauth = new DiscordOauth2(oauth2Options);

// oauth
//   .tokenRequest({
//     code: "query code",
//     scope: "identify guilds",
//     grantType: "authorization_code",

//     redirectUri: "http://localhost/callback",
//   })
//   .then(console.log);
console.log(oauth2Options);

exports.getAccessTokenFromCode = async (code) => {
  const res = await oauth
    .tokenRequest({
      code,
      scope: "identify guilds",
      grantType: "authorization_code",
    })
    .catch((e) => e);

  if (res.code === 400)
    throw new AppError("The authorization code is not valid", 401);

  if (!res.access_token) throw new AppError("Something went wrong", 500);
  return res;
};
exports.getDiscordUserFromToken = async (accessToken) => {
  const res = await oauth.getUser(accessToken).catch((e) => e);

  if (res.code === 401)
    throw new AppError("Could not get user profile unauthorized", 401);

  return res;
};

exports.fetchUserGuildsOauth = async (accessToken) => {
  const res = await oauth.getUserGuilds(accessToken).catch((e) => e);

  if (res.code === 401)
    throw new AppError("Could not get user guilds unauthorized", 401);

  return res;
};

exports.isLoggedIn = async (req) => {
  // 1) Getting token and check of it's there

  if (!req.cookies.JWT)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    req.cookies.JWT,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findOne({ userId: decoded.userId });

  if (!currentUser)
    throw new AppError(
      "The user belonging to this token does no longer exist.",
      401
    );

  const discordUser = await this.getDiscordUserFromToken(
    currentUser.accessToken
  );

  req.dbUser = currentUser;
  req.discordUser = discordUser;
};
