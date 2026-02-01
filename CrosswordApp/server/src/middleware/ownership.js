const mongoose = require("mongoose");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function requirePostOwner(req, res, next) {
  const postId = req.params.id;
  if (!isValidObjectId(postId)) {
    return res.status(404).json({ message: "Not found" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Not found" });
  }

  if (String(post.author) !== String(req.user.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.post = post;
  return next();
}

async function requireCommentOwner(req, res, next) {
  const commentId = req.params.commentId;
  const postId = req.params.id;

  if (!isValidObjectId(commentId) || !isValidObjectId(postId)) {
    return res.status(404).json({ message: "Not found" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Not found" });
  }

  if (String(comment.post) !== String(postId)) {
    return res.status(404).json({ message: "Not found" });
  }

  if (String(comment.author) !== String(req.user.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.comment = comment;
  return next();
}

async function requireCommentOwnerById(req, res, next) {
  const commentId = req.params.id;

  if (!isValidObjectId(commentId)) {
    return res.status(404).json({ message: "Not found" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Not found" });
  }

  if (String(comment.author) !== String(req.user.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.comment = comment;
  return next();
}

module.exports = { requirePostOwner, requireCommentOwner, requireCommentOwnerById, isValidObjectId };
