exports.sendResponse = (req, res, data, propName = "data") => {
  const withUser = req.query.withUser == "true";

  let response = withUser ? {} : data;

  if (withUser) {
    const isArray = Array.isArray(data);
    if (isArray) {
      response.user = req.discordUser;
      response[propName] = data;
    }

    if (!isArray) {
      response = { user: req.discordUser, ...data };
    }
  }

  res.json({ status: "success", data: response });
};
