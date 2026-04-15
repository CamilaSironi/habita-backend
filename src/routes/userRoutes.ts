import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { UserController } from "../controllers/UserController";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/users", authMiddleware, userController.create);
  router.get("/users/me", authMiddleware, userController.getMe);
  router.put("/users/me", authMiddleware, userController.update);
  router.delete("/users/me", authMiddleware, userController.delete);

  return router;
}