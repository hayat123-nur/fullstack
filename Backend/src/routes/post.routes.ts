import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import {
  authenticate,
  authorizeRoles,
  AuthRequest,
} from "../middleware/auth.middleware";

const router = express.Router();

// All routes require login
router.use(authenticate);

// Create post (user/admin)
router.post("/", createPost);

// Get posts (user sees own, admin sees all)
router.get("/", getPosts);

// Get single post
router.get("/:id", getPostById);

// Update post
router.put("/:id", updatePost);

// Delete post
router.delete("/:id", deletePost);

export default router;
