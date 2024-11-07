import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from "express";
import * as userController from "../controllers/auth.controller";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/list", authMiddleware, userController.listUsers);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/profile", authMiddleware, userController.getProfile);

export default router;
