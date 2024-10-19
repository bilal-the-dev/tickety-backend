const { Panels } = require("shared-models");
const catchAsync = require("../utils/catchAsync");
const { sendResponse } = require("../utils/sendResponse");
const AppError = require("../utils/appError");
const { dealWithMessage } = require("../utils/discordAPI");

exports.getPanelsForGuild = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    cache,
  } = req;

  const panels = await Panels.find(
    { guildId },
    { ticketOpenCategoryId: 1, panelName: 1 }
  ).lean();

  sendResponse(req, res, { cache, panels });
});

exports.getPanelById = catchAsync(async (req, res, next) => {
  const {
    params: { panelId },
    cache,
  } = req;

  const panel = await Panels.findById(panelId).lean();

  sendResponse(req, res, { cache, panel });
});

exports.createPanel = catchAsync(async (req, res, next) => {
  const {
    params: { guildId },
    body,
    cache,
  } = req;

  const doc = await Panels.create({ guildId, ...body });

  sendResponse(req, res, { cache, doc });
});

exports.publishPanel = catchAsync(async (req, res, next) => {
  const {
    params: { panelId, channelId: panelChannelId },
  } = req;

  const doc = await Panels.findById(panelId).lean();

  if (!doc) throw new AppError("Panel not found", 404);

  const body = generateMessageBody(doc);

  const response = await dealWithMessage(
    panelChannelId,
    JSON.stringify(body),
    "POST",
    "messages"
  );

  const m = await response.json();

  await Panels.findByIdAndUpdate(panelId, {
    panelChannelId,
    panelMessageId: m.id,
  });
  sendResponse(req, res, m);
});

exports.updatePanelById = catchAsync(async (req, res, next) => {
  const {
    params: { panelId },
    body,
  } = req;

  delete body.guildId;
  const doc = await Panels.findByIdAndUpdate(panelId, body, { new: true });

  if (doc.panelChannelId) {
    const b = generateMessageBody(doc.toJSON());

    await dealWithMessage(
      doc.panelChannelId,
      JSON.stringify(b),
      "PATCH",
      `messages/${doc.panelMessageId}`
    );
  }

  sendResponse(req, res, doc);
});

exports.deletePanelById = catchAsync(async (req, res, next) => {
  const {
    params: { panelId },
  } = req;

  const doc = await Panels.findById(panelId);

  if (!doc) throw new AppError("Panel already deleted", 400);

  if (doc.panelChannelId) {
    await dealWithMessage(
      doc.panelChannelId,
      null,
      "DELETE",
      `messages/${doc.panelMessageId}`
    );
  }

  await doc.deleteOne();

  res.status(204).json();
});

function generateMessageBody(doc) {
  const enums = { Primary: 1, Secondary: 2, Success: 3, Danger: 4 };

  doc.panelButton.style = enums[doc.panelButton.style];

  const body = {
    embeds: [doc.panelEmbed],
    components: [{ type: 1, components: [doc.panelButton] }],
  };

  return body;
}
