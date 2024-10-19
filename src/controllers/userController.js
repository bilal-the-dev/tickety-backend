const { addIsBotPresentProp } = require("../utils/botAPI");
const catchAsync = require("../utils/catchAsync");
const { fetchUserGuildsOauth } = require("../utils/discordOauth");
const { sendResponse } = require("../utils/sendResponse");

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  sendResponse(req, res, req.discordUser);
});

exports.getCurrentUserGuilds = catchAsync(async (req, res, next) => {
  const { adminOnly, botOnlyProp } = req.query;
  let guilds = await fetchUserGuildsOauth(req.dbUser.accessToken);

  const ADMIN_BIT = 0x0000000000000008;

  if (adminOnly == "true")
    guilds = guilds.filter((g) => (g.permissions & ADMIN_BIT) == ADMIN_BIT);

  const data = { guilds };
  if (botOnlyProp == "true") {
    const { inviteURL, modifiedGuilds } = await addIsBotPresentProp(guilds);

    data.inviteURL = inviteURL;
    data.guilds = modifiedGuilds;
  }

  sendResponse(req, res, data);
});
