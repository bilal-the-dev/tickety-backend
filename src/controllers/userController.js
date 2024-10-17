const catchAsync = require("../utils/catchAsync");
const { fetchUserGuildsOauth } = require("../utils/discordOauth");

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.json({ status: "success", data: req.discordUser });
});

exports.getCurrentUserGuilds = catchAsync(async (req, res, next) => {
  const guilds = await fetchUserGuildsOauth(req.dbUser.accessToken);
  res.json({ status: "success", data: { user: req.discordUser, guilds } });
});
