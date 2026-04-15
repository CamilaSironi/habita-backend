import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { PropertyImageController } from "../controllers/PropertyImageController";

export function createPropertyImageRoutes(propertyImageController: PropertyImageController) {
  const router = Router();

  router.get("/properties/:publicId/images", propertyImageController.listByProperty);
  router.post("/properties/:publicId/images", authMiddleware, propertyImageController.create); 
  router.put("/images/:id", authMiddleware, propertyImageController.update); 
  router.delete("/images/:id", authMiddleware, propertyImageController.delete);
  router.put("/properties/:publicId/images/:imageId/cover", authMiddleware, propertyImageController.setCover);

  return router;
}