import { Router } from "express";
import type { PropertyController } from "../controllers/PropertyController";

export function createPropertyRoutes(propertyController: PropertyController) {
  const router = Router();

  router.get("/properties", propertyController.list);
  router.get("/properties/:publicId", propertyController.getByPublicId);

  return router;
}
