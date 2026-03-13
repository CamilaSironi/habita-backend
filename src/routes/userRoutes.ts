import { Router } from "express";
import type { UserController } from "../controllers/UserController";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/users", userController.create);
  router.get("/users/:id", userController.getById);
  router.put("/users/:id", userController.update);
  router.delete("/users/:id", userController.delete);

  return router;
}