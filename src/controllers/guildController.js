const { sendResponse } = require("../utils/sendResponse");

const queryString = require("node:querystring");

const { Guilds } = require("shared-models");

const catchAsync = require("../utils/catchAsync");
const { fetchCachefromBot } = require("../utils/botAPI");

exports.getGuildSettings = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    query,
    cache,
  } = req;

  const { withDiscordSettings, withAutoResponders } = query;

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

  sendResponse(req, res, data);
});

exports.getResponderById = catchAsync(async (req, res, next) => {
  const {
    params: { guildId, responderId },
    cache,
  } = req;

  const responders = await Guilds.findOne(
    { guildId, [`autoResponders._id`]: responderId },
    {
      [`autoResponders.$`]: 1,
    }
  ).lean();

  const data = { responder: responders?.autoResponders[0], cache };

  sendResponse(req, res, data);
});

exports.createResponder = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    body,
  } = req;

  const doc = await Guilds.findOneAndUpdate(
    { guildId },

    {
      $push: {
        autoResponders: body,
      },
    },
    { runValidators: true, new: true }
  );

  res.status(201);

  sendResponse(req, res, { doc });
});

exports.updateGuildSettings = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    body,
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

  sendResponse(req, res, settings);
});

exports.updateResponderById = catchAsync(async (req, res, next) => {
  const {
    params: { guildId, responderId },
    body,
  } = req;

  body._id = responderId;

  const doc = await Guilds.findOneAndUpdate(
    { guildId, [`autoResponders._id`]: responderId },
    { ["autoResponders.$"]: body },
    { new: true }
  );

  sendResponse(req, res, doc);
});

exports.deleteResponderById = catchAsync(async (req, res, next) => {
  const {
    params: { guildId, responderId },
  } = req;

  await Guilds.findOneAndUpdate(
    { guildId },
    { $pull: { autoResponders: { _id: responderId } } }
  );

  res.status(204).json();
});

exports.addCacheIfInQuery = catchAsync(async (req, res, next) => {
  const { query, method } = req;

  if (method !== "GET" || !query.guildId) return next();

  const str = queryString.stringify(query);

  const cache = await fetchCachefromBot(query.guildId, str);

  req.cache = cache;
  next();
});
