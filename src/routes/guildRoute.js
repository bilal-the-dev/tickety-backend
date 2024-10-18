const express = require("express");
const {
  getGuildSettings,
  updateGuildSettings,
  getResponderById,
  createResponder,
} = require("../controllers/guildController");

const router = express.Router();

router.get("/:guildId/settings", getGuildSettings);
router.get("/:guildId/autoresponders/:responderId", getResponderById);

router.post("/:guildId/autoresponders", createResponder);

router.patch("/:guildId/settings", updateGuildSettings);
router.patch("/:guildId/autoresponders/:responderId", updateGuildSettings);

module.exports = router;
