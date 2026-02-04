import express, { Response } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import {
  authenticate,
  authorizeRoles,
  AuthRequest,
} from "../middleware/auth.middleware";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Logout
router.post("/logout", authenticate, (req: AuthRequest, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true in production
  });
  res.json({ message: "Logged out successfully" });
});

// ✅ THIS IS THE ROUTE YOUR FRONTEND NEEDS
router.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Any authenticated user
router.get("/protected", authenticate, (req: AuthRequest, res: Response) => {
  res.json({ message: "Authenticated", user: req.user });
});

// Admin only
router.get(
  "/admin-only",
  authenticate,
  authorizeRoles("admin"),
  (req: AuthRequest, res: Response) => {
    res.json({ message: "Welcome Admin", user: req.user });
  },
);

export default router;
