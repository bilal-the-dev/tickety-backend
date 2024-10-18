const express = require("express");
const {
  getGuildSettings,
  getGuildRoles,
} = require("../controllers/guildController");

const router = express.Router();

router.get("/:guildId/settings", getGuildSettings);
router.get("/:guildId/roles", getGuildRoles);

module.exports = router;
