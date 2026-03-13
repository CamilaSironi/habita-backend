import { Router } from "express";
import type { InquiryController } from "../controllers/InquiryController";

export function createInquiryRoutes(inquiryController: InquiryController) {
  const router = Router();

  router.post("/properties/:publicId/inquiries", inquiryController.createByProperty);

  return router;
}