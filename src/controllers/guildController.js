const { Guilds } = require("shared-models");
const catchAsync = require("../utils/catchAsync");

exports.getGuildSettings = catchAsync(async (req, res, next) => {
  const { guildId } = req.params;

  const doc = await Guilds.findOne({ guildId });

  res.json({
    status: "success",
    data: { user: req.discordUser, settings: doc },
  });
});
