const { BOT_API_BASE_URL } = process.env;

exports.filterBotOnlyGuilds = async (guilds) => {
  const res = await fetch(`${BOT_API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(guilds),
  });

  return await res.json();
};
