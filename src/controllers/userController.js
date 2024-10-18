const { addIsBotPresentProp } = require("../utils/botAPI");
const catchAsync = require("../utils/catchAsync");
const { fetchUserGuildsOauth } = require("../utils/discordOauth");

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.json({ status: "success", data: req.discordUser });
});

exports.getCurrentUserGuilds = catchAsync(async (req, res, next) => {
  const { adminOnly, botOnlyProp } = req.query;
  let guilds = await fetchUserGuildsOauth(req.dbUser.accessToken);

  const ADMIN_BIT = 0x0000000000000008;

  if (adminOnly == "true")
    guilds = guilds.filter((g) => (g.permissions & ADMIN_BIT) == ADMIN_BIT);

  const data = { user: req.discordUser, guilds };
  if (botOnlyProp == "true") {
    const { inviteURL, modifiedGuilds } = await addIsBotPresentProp(guilds);

    data.inviteURL = inviteURL;
    data.guilds = modifiedGuilds;
  }

  res.json({ status: "success", data });
});
