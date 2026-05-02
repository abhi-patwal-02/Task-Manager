const Task = require("../models/Task");

exports.getDashboard = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "done").length,
    pending: tasks.filter(t => t.status !== "done").length,
    overdue: tasks.filter(t => t.dueDate < new Date()).length
  };

  res.json(stats);
};