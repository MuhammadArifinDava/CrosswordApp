const { User } = require("../models/User");

async function getMe(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  delete user.passwordHash;
  
  return res.json({ user });
}

async function updateMyAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Field required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const avatarPath = req.file.path && req.file.path.startsWith("http") 
    ? req.file.path 
    : `/uploads/${req.file.filename}`;

  user.avatarPath = avatarPath;
  await user.save();

  return res.json({ user: user.toJSON() });
}

async function getUserById(req, res) {
  const { id } = req.params;
  const user = await User.findById(id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  delete user.passwordHash;
  delete user.email; // Don't expose email publicly

  return res.json({ user });
}

module.exports = {
  getMe,
  updateMyAvatar,
  getUserById,
};
