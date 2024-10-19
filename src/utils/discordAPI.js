const AppError = require("./appError");

const { DISCORD_BOT_TOKEN, DISCORD_API_BASE_URL } = process.env;

exports.dealWithMessage = async (channelId, body, method, url) => {
  const res = await fetch(
    `${DISCORD_API_BASE_URL}/channels/${channelId}/${url}`,
    {
      method,
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "content-type": "application/json",
      },
      body,
    }
  );

  if (res.status === 404) throw new AppError("Channel not found", 404);
  if (res.status === 403)
    throw new AppError(
      "Bot does not have perms to send message in the channel",
      403
    );

  if (!res.ok) throw new AppError("Something went wrong", 500);

  return res;
};
