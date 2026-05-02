const User = require("../models/User");

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) return res.json([]);

    const users = await User.find({
      email: { $regex: query, $options: "i" }
    }).select("name email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};