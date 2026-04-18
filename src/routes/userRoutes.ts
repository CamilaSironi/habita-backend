import { Handler, Router } from "express";
import type { UserController } from "../controllers/UserController";

export function createUserRoutes(userController: UserController, AuthMiddleware: Handler[]) {
  const router = Router();

  router.use(AuthMiddleware);

  router.get("/users/me", userController.getMe);
  router.put("/users/me", userController.update);
  router.delete("/users/me", userController.delete);

  return router;
}