const AppError = require("./appError");

const { DISCORD_BOT_TOKEN, DISCORD_API_BASE_URL } = process.env;

exports.sendMessage = async (channelId, body) => {
  const res = await fetch(
    `${DISCORD_API_BASE_URL}/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "content-type": "application/json",
      },
      body,
    }
  );

  const e = await res.json();

  console.log(e.errors);

  console.log(e.errors?.components["0"].components["0"]);

  if (res.status === 404) throw new AppError("Channel not found", 404);
  if (res.status === 403)
    throw new AppError(
      "Bot does not have perms to send message in the channel",
      403
    );

  if (!res.ok) throw new AppError("Something went wrong", 500);

  return e;
};
