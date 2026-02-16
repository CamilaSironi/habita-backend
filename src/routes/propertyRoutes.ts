import { Router } from "express";
import type { PropertyController } from "../controllers/PropertyController";
import type { InquiryController } from "../controllers/InquiryController";

export function createPropertyRoutes(propertyController: PropertyController, inquiryController: InquiryController) {
  const router = Router();

  router.get("/properties", propertyController.list);
  router.get("/properties/:publicId", propertyController.getByPublicId);
  router.post("/properties/:publicId/inquiries", inquiryController.createByProperty);

  return router;
}
