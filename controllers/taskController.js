const Task = require("../models/Task");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

exports.createTask = async (req, res) => {
  const status = req.memberRole === "admin" ? "todo" : "pending-approval";
  const assignedTo = req.memberRole === "admin" ? req.body.assignedTo : null;

  let dueDate = req.body.dueDate;
  if (!dueDate) {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    dueDate = nextDay;
  }

  let subtasks = [];
  if (req.body.description) {
    subtasks = req.body.description
      .split("\n")
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line.length > 0)
      .map(title => ({ title, isCompleted: false }));
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    project: req.params.projectId,
    assignedTo: assignedTo,
    dueDate: dueDate,
    status: status,
    subtasks: subtasks
  });

  if (assignedTo) {
    await Notification.create({
      recipient: assignedTo,
      message: `You have been assigned a new task: ${req.body.title}`,
      link: `/project/${req.params.projectId}/task/${task._id}`
    });
  }

  res.json(task);
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate("assignedTo", "name email");
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

exports.getTasks = async (req, res) => {
  const query = { project: req.params.projectId };
  
  if (req.memberRole === "member") {
    query.assignedTo = req.user.id;
  }

  const tasks = await Task.find(query).populate("assignedTo", "name email");

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) return res.status(404).json({ message: "Task not found" });

  // Member can only update their own tasks
  if (
    req.memberRole === "member" &&
    task.assignedTo.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const oldStatus = task.status;

  if (req.body.status && req.body.status !== task.status) {
    if (req.body.status === "done") {
      req.body.completedAt = new Date();
    } else {
      req.body.completedAt = null;
    }
  }

  Object.assign(task, req.body);
  await task.save();

  if (oldStatus !== "done" && task.status === "done") {
    const project = await Project.findById(req.params.projectId);
    if (project) {
      const admins = project.members.filter(m => m.role === "admin");
      const notifications = admins.map(admin => ({
        recipient: admin.user,
        message: `Task completed: ${task.title}`,
        link: `/project/${req.params.projectId}/task/${task._id}`
      }));
      await Notification.insertMany(notifications);
    }
  }

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: "Task deleted" });
};

exports.toggleSubtask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const subtask = task.subtasks.id(req.params.subtaskId);
  if (!subtask) return res.status(404).json({ message: "Subtask not found" });

  subtask.isCompleted = !subtask.isCompleted;

  const allCompleted = task.subtasks.length > 0 && task.subtasks.every(st => st.isCompleted);
  
  if (allCompleted && task.status !== "done") {
    task.status = "done";
    task.completedAt = new Date();

    const project = await Project.findById(req.params.projectId);
    if (project) {
      const admins = project.members.filter(m => m.role === "admin");
      const notifications = admins.map(admin => ({
        recipient: admin.user,
        message: `Task completed via subtasks: ${task.title}`,
        link: `/project/${req.params.projectId}/task/${task._id}`
      }));
      await Notification.insertMany(notifications);
    }
  } else if (!allCompleted && task.status === "done") {
    task.status = "in-progress";
    task.completedAt = null;
  }

  await task.save();
  res.json(task);
};