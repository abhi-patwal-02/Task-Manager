const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/read-all", auth, markAllAsRead);
router.patch("/:id/read", auth, markAsRead);

module.exports = router;
