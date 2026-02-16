import type { Request, Response } from "express";
import { z } from "zod";
import type { InquiryService } from "../services/InquiryService";

const createInquirySchema = z.object({
  contactName: z.string().trim().min(2),
  contactEmail: z.string().trim().email(),
  message: z.string().trim().min(5),
  userId: z.string().uuid().optional()
});

export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  createByProperty = async (request: Request, response: Response) => {
    const { publicId } = request.params;

    if (!publicId || typeof publicId !== "string") {
      return response.status(400).json({ error: "publicId is required" });
    }

    const bodyResult = createInquirySchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    const inquiry = await this.inquiryService.createByPublicPropertyId(publicId, bodyResult.data);

    if (!inquiry) {
      return response.status(404).json({ error: "Property not found" });
    }

    return response.status(201).json({
      id: inquiry.id,
      status: inquiry.status,
      createdAt: inquiry.createdAt
    });
  };
}
