import { Handler, Router } from "express";
import type { FavoritesController } from "../controllers/FavoritesController";

export function createFavoritesRoutes(favoritesController: FavoritesController, AuthMiddleware: Handler[]) {
  const router = Router();

  router.use(AuthMiddleware);

  router.post("/favorites", favoritesController.add);
  router.delete("/favorites/:propertyId", favoritesController.remove);
  router.get("/favorites", favoritesController.list);

  return router;
}