import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { UserController } from "../controllers/UserController";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/users", authMiddleware, userController.create);
  router.get("/users/:id", authMiddleware, userController.getById);
  router.put("/users/:id", authMiddleware, userController.update);
  router.delete("/users/:id", authMiddleware, userController.delete);

  return router;
}