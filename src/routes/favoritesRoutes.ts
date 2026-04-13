import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { FavoritesController } from "../controllers/FavoritesController";

export function createFavoritesRoutes(favoritesController: FavoritesController) {
  const router = Router();

  router.post("/favorites", authMiddleware, favoritesController.add);
  router.delete("/favorites/:userId/:propertyId", authMiddleware, favoritesController.remove);
  router.get("/favorites/:userId", authMiddleware, favoritesController.list);

  return router;
}