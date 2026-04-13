import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { PropertyImageController } from "../controllers/PropertyImageController";

export function createPropertyImageRoutes(propertyImageController: PropertyImageController) {
  const router = Router();

  router.get("/properties/:propertyId/images", authMiddleware, propertyImageController.listByProperty);
  router.post("/properties/:propertyId/images", authMiddleware, propertyImageController.create);
  router.put("/images/:id", authMiddleware, propertyImageController.update);
  router.delete("/images/:id", authMiddleware, propertyImageController.delete);
  router.put("/properties/:propertyId/images/:imageId/cover", authMiddleware, propertyImageController.setCover);

  return router;
}