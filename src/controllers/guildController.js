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

  const cache = await fetchCachefromBot(guildId, str);

  let settings = await Guilds.findOne({ guildId });

  res.json({
    status: "success",
    data: { user: discordUser, settings, cache },
  });
});

exports.updateGuildSettings = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    body,
    discordUser,
  } = req;

  delete body.guildId;

  const obj = {};

  Object.entries(body).forEach((e) => {
    const [key, val] = e;

    console.log(e);

    if (typeof val !== "object") return;

    Object.entries(val).forEach((e) => {
      const [nestedK, nestedVal] = e;
      obj[`discordSettings.${key}.${nestedK}`] = nestedVal;
    });
  });

  console.log(obj);

  const settings = await Guilds.findOneAndUpdate({ guildId }, obj, {
    new: true,
  });

  res.json({
    status: "success",
    data: { user: discordUser, settings },
  });
});
