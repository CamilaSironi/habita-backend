import type { Request, Response } from "express";
import { z } from "zod";
import type { PropertyImageService } from "../services/PropertyImageService";

const createImageSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().optional(),
  position: z.number().int().min(0).optional(),
  isCover: z.boolean().optional()
});

const updateImageSchema = z.object({
  imageUrl: z.string().url().optional(),
  altText: z.string().optional(),
  position: z.number().int().min(0).optional(),
  isCover: z.boolean().optional()
});

export class PropertyImageController {
  constructor(private readonly propertyImageService: PropertyImageService) {}

  listByProperty = async (request: Request, response: Response) => {
    const { publicId } = request.params;

    if (!publicId || typeof publicId !== "string") {
      return response.status(400).json({ error: "publicId is required" });
    }

    const images = await this.propertyImageService.getByPropertyId(publicId);
    return response.json(images);
  };

  create = async (request: Request, response: Response) => {
    const { publicId } = request.params;

    if (!publicId || typeof publicId !== "string") {
      return response.status(400).json({ error: "publicId is required" });
    }

    const bodyResult = createImageSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    const image = await this.propertyImageService.create({
      propertyId: publicId,
      ...bodyResult.data
    } as any);
    return response.status(201).json(image);
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "id is required" });
    }

    const bodyResult = updateImageSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    try {
      const image = await this.propertyImageService.update(id, bodyResult.data as any);
      return response.json(image);
    } catch (error) {
      return response.status(404).json({ error: "Image not found" });
    }
  };

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "id is required" });
    }

    await this.propertyImageService.delete(id);
    return response.status(204).send();
  };

  setCover = async (request: Request, response: Response) => {
    const { publicId, imageId } = request.params;
    
    if (!publicId || typeof publicId !== "string") {
      return response.status(400).json({ error: "publicId is required" });
    }
    if (!imageId || typeof imageId !== "string") {
      return response.status(400).json({ error: "imageId is required" });
    }

    await this.propertyImageService.setCover(publicId, imageId);
    return response.status(204).send();
  };
}