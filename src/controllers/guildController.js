const { Guilds } = require("shared-models");
const catchAsync = require("../utils/catchAsync");
const { fetchRolesfromBot } = require("../utils/botAPI");

exports.getGuildSettings = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    discordUser,
  } = req;

  const doc = await Guilds.findOne({ guildId });

  const fetchedRoles = res.json({
    status: "success",
    data: { user: discordUser, settings: doc },
  });
});

exports.getGuildRoles = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    discordUser,
  } = req;

  const roles = await fetchRolesfromBot(guildId);

  res.json({
    status: "success",
    data: { user: discordUser, roles },
  });
});
