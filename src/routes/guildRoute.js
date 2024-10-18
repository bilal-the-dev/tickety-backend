const express = require("express");
const { getGuildSettings } = require("../controllers/guildController");

const router = express.Router();

router.get("/:guildId/settings", getGuildSettings);

module.exports = router;
