const Project = require("../models/Project");
const Notification = require("../models/Notification");

exports.createProject = async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user.id,
    members: [{ user: req.user.id, role: "admin" }]
  });

  res.json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({
    "members.user": req.user.id
  }).populate("members.user", "name email");

  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate("members.user", "name email");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

exports.addMember = async (req, res) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.projectId);

  // prevent duplicates
  const exists = project.members.find(
    (m) => m.user.toString() === userId
  );
  if (exists) {
    return res.status(400).json({ message: "User already in project" });
  }

  project.members.push({ user: userId, role });

  await project.save();
  const updatedProject = await Project.findById(project._id)
  .populate("members.user", "name email");

  await Notification.create({
    recipient: userId,
    message: `You have been added to the project: ${project.name}`,
    link: `/project/${project._id}`
  });

  res.json(updatedProject);
};

exports.updateMemberRole = async (req, res) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.projectId);

  const member = project.members.find(
    (m) => m.user.toString() === userId
  );

  if (req.user.id === userId && role !== "admin") {
    return res.status(400).json({ message: "You cannot remove your own admin role" });
  }

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  member.role = role;

  await project.save();
  const updatedProject = await Project.findById(project._id)
  .populate("members.user", "name email");

res.json(updatedProject);
};

exports.removeMember = async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.projectId);

  const admins = project.members.filter(m => m.role === "admin");

  if (admins.length === 1 && admins[0].user.toString() === userId) {
    return res.status(400).json({ message: "Cannot remove last admin" });
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== userId
  );

  await project.save();
  const updatedProject = await Project.findById(project._id)
  .populate("members.user", "name email");

res.json(updatedProject);
};