const Project = require("../models/Project");

const checkProjectRole = (requiredRole) => {
  return async (req, res, next) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const member = project.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!member) {
      return res.status(403).json({ message: "Not part of project" });
    }

    if (requiredRole === "admin" && member.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.project = project;
    req.memberRole = member.role;

    next();
  };
};

module.exports = checkProjectRole;