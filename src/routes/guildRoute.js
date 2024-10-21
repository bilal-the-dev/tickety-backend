const express = require("express");
const {
  getGuildSettings,
  updateGuildSettings,
  getResponderById,
  createResponder,
  deleteResponderById,
  updateResponderById,
  addCacheIfInQuery,
  isAdmin,
} = require("../controllers/guildController");

const router = express.Router();

router.use(addCacheIfInQuery);

router.get("/:guildId/settings", isAdmin, addCacheIfInQuery, getGuildSettings);
router.get(
  "/:guildId/autoresponders/:responderId",
  isAdmin,
  addCacheIfInQuery,
  getResponderById
);

router.post("/:guildId", isAdmin, createResponder);

router.patch("/:guildId/settings", isAdmin, updateGuildSettings);
router.patch(
  "/:guildId/autoresponders/:responderId",
  isAdmin,
  updateResponderById
);

router.delete(
  "/:guildId/autoresponders/:responderId",
  isAdmin,
  deleteResponderById
);

module.exports = router;
