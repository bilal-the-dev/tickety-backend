const express = require("express");
const {
  getGuildSettings,
  updateGuildSettings,
  getResponderById,
  createResponder,
  deleteResponderById,
  updateResponderById,
  addCacheIfInQuery,
} = require("../controllers/guildController");

const router = express.Router();

router.use(addCacheIfInQuery);

router.get("/:guildId/settings", addCacheIfInQuery, getGuildSettings);
router.get(
  "/:guildId/autoresponders/:responderId",
  addCacheIfInQuery,
  getResponderById
);

router.post("/:guildId", createResponder);

router.patch("/:guildId/settings", updateGuildSettings);
router.patch("/:guildId/autoresponders/:responderId", updateResponderById);

router.delete("/:guildId/autoresponders/:responderId", deleteResponderById);

module.exports = router;
