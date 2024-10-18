const express = require("express");
const {
  getGuildSettings,
  updateGuildSettings,
} = require("../controllers/guildController");

const router = express.Router();

router.get("/:guildId/settings", getGuildSettings);
router.patch("/:guildId/settings", updateGuildSettings);

module.exports = router;
