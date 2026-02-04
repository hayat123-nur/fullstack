import { Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth.middleware";

// ================= CREATE POST =================
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.userId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET POSTS =================
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts =
      req.user.role === "admin"
        ? await Post.find().populate("author", "name email role")
        : await Post.find({ author: req.user.userId }).populate(
            "author",
            "name email",
          );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE POST =================
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const post = await Post.findById(id).populate("author", "name email role");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      req.user.role !== "admin" &&
      (post.author as any)._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE POST =================
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE POST =================
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
