const queryString = require("node:querystring");

const { Guilds } = require("shared-models");

const catchAsync = require("../utils/catchAsync");
const { fetchCachefromBot } = require("../utils/botAPI");

exports.getGuildSettings = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    query,
    discordUser,
  } = req;

  const str = queryString.stringify(query);
  console.log(str);

  const cache = await fetchCachefromBot(guildId, str);

  let settings = await Guilds.findOne({ guildId });

  res.json({
    status: "success",
    data: { user: discordUser, settings, cache },
  });
});
