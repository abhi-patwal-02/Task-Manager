const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/projectRoleMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleSubtask
} = require("../controllers/taskController");

const router = express.Router({ mergeParams: true });

router.post("/", auth, checkRole(), createTask);
router.get("/", auth, checkRole(), getTasks);
router.get("/:taskId", auth, checkRole(), getTaskById);

router.patch("/:taskId", auth, checkRole(), updateTask);
router.delete("/:taskId", auth, checkRole("admin"), deleteTask);

router.patch("/:taskId/subtasks/:subtaskId", auth, checkRole(), toggleSubtask);

module.exports = router;