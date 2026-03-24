import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { FavoritesController } from "../controllers/FavoritesController";

export function createFavoritesRoutes(favoritesController: FavoritesController) {
  const router = Router();

  router.post("/favorites", authMiddleware, favoritesController.add);
  router.delete("/favorites/:propertyId", authMiddleware, favoritesController.remove);
  router.get("/favorites", authMiddleware, favoritesController.list);

  return router;
}