const express = require("express");

const {
  createPanel,
  deletePanelById,
  getPanelById,
  getPanelsForGuild,
  updatePanelById,
  publishPanel,
  getAllTickets,
} = require("../controllers/panelController");
const {
  addCacheIfInQuery,
  isAdmin,
} = require("../controllers/guildController");

const router = express.Router();

router.use(addCacheIfInQuery);

router.get("/guild/:guildId/", isAdmin, getPanelsForGuild);
router.get("/tickets/:guildId/", isAdmin, getAllTickets);
router.get("/:panelId", getPanelById);

router.post("/:guildId/", isAdmin, createPanel);
router.post("/:panelId/publish/:channelId", publishPanel);

router.patch("/:panelId/", updatePanelById);

router.delete("/:panelId", deletePanelById);

module.exports = router;
