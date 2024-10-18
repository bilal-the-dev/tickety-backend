const AppError = require("./appError");

const { BOT_API_BASE_URL } = process.env;

exports.addIsBotPresentProp = async (guilds) => {
  const res = await fetch(`${BOT_API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(guilds),
  });

  if (!res.ok) throw new AppError("Something went wrong", 500);

  return await res.json();
};
