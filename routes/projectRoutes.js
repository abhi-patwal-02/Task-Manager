const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/projectRoleMiddleware");

const {
  createProject,
  getProjects,
  addMember,
  getProjectById,
  updateMemberRole,
  removeMember
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:projectId", auth, getProjectById);
router.post("/:projectId/members", auth, checkRole("admin"), addMember);
router.patch("/:projectId/members", auth, checkRole("admin"), updateMemberRole);
router.delete("/:projectId/members", auth, checkRole("admin"), removeMember);


module.exports = router;