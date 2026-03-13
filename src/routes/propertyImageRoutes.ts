import { Router } from "express";
import type { PropertyImageController } from "../controllers/PropertyImageController";

export function createPropertyImageRoutes(propertyImageController: PropertyImageController) {
  const router = Router();

  router.get("/properties/:propertyId/images", propertyImageController.listByProperty);
  router.post("/properties/:propertyId/images", propertyImageController.create);
  router.put("/images/:id", propertyImageController.update);
  router.delete("/images/:id", propertyImageController.delete);
  router.put("/properties/:propertyId/images/:imageId/cover", propertyImageController.setCover);

  return router;
}