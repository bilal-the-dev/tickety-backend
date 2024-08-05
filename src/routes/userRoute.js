const express = require("express");
const {
  getCurrentUser,
  getCurrentUserGuilds,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", getCurrentUser);
router.get("/me/guilds", getCurrentUserGuilds);

module.exports = router;
