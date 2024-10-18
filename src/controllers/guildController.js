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

  const { withDiscordSettings, withAutoResponders } = query;

  const str = queryString.stringify(query);

  const cache = await fetchCachefromBot(guildId, str);

  let settings;

  if (withDiscordSettings || withAutoResponders)
    settings = await Guilds.findOne(
      { guildId },
      {
        guildId: 1,
        ...(query.withDiscordSettings && { discordSettings: 1 }),
        ...(query.withAutoResponders && {
          [`autoResponders.trigger`]: 1,
          [`autoResponders.reply`]: 1,
          [`autoResponders._id`]: 1,
        }),
      }
    ).lean();

  const data = { settings, cache };

  if (query.withUser == "true") data.user = discordUser;
  res.json({
    status: "success",
    data,
  });
});

exports.getResponderById = catchAsync(async (req, res, next) => {
  const {
    params: { guildId, responderId },
    query,
    discordUser,
  } = req;

  const str = queryString.stringify(query);

  const cache = await fetchCachefromBot(guildId, str);

  const responders = await Guilds.findOne(
    { guildId, [`autoResponders._id`]: responderId },
    // { $and: [{ guildId }, { [`autoResponders._id`]: responderId }] },
    {
      [`autoResponders.$`]: 1,
    }
  );

  const data = { responder: responders?.autoResponders[0], cache };

  if (query.withUser == "true") data.user = discordUser;
  res.json({
    status: "success",
    data,
  });
});

exports.createResponder = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    body,
    query,
    discordUser,
  } = req;

  const responder = await Guilds.findOneAndUpdate(
    { guildId },

    {
      $push: {
        autoResponders: body,
      },
    },
    { runValidators: true }
  );

  const data = { responder };

  if (query.withUser == "true") data.user = discordUser;
  res.json({
    status: "success",
    data,
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

    obj[`discordSettings.${key}`] = val;
  });

  const settings = await Guilds.findOneAndUpdate({ guildId }, obj, {
    new: true,
  });

  res.json({
    status: "success",
    data: { user: discordUser, settings },
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

    obj[`discordSettings.${key}`] = val;
  });

  const settings = await Guilds.findOneAndUpdate({ guildId }, obj, {
    new: true,
  });

  res.json({
    status: "success",
    data: { user: discordUser, settings },
  });
});
