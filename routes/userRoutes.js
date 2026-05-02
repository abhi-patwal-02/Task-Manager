const express = require("express");
const auth = require("../middleware/authMiddleware");
const { searchUsers, getMe, getUserById } = require("../controllers/userController");

const router = express.Router();

// GET /api/users/search?query=abc
router.get("/search", auth, searchUsers);
router.get("/me", auth, getMe);
router.get("/:id", auth, getUserById);

module.exports = router;