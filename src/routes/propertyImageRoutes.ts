import { Handler, Router } from "express";
import type { PropertyImageController } from "../controllers/PropertyImageController";

export function createPropertyImageRoutes(propertyImageController: PropertyImageController, AuthMiddleware: Handler[]) {
  const router = Router();

  router.get("/properties/:publicId/images", propertyImageController.listByProperty);
  router.post("/properties/:publicId/images", AuthMiddleware, propertyImageController.create); 
  router.put("/images/:id", AuthMiddleware, propertyImageController.update); 
  router.delete("/images/:id", AuthMiddleware, propertyImageController.delete);
  router.put("/properties/:publicId/images/:imageId/cover", AuthMiddleware, propertyImageController.setCover);

  return router;
}