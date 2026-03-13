import type { Request, Response } from "express";
import { z } from "zod";
import type { FavoritesService } from "../services/FavoritesService";

const addFavoriteSchema = z.object({
  propertyId: z.string().uuid()
});

export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  add = async (request: Request, response: Response) => {
    const userId = (request as any).user?.id; // Assuming auth middleware sets req.user
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const bodyResult = addFavoriteSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    try {
      const favorite = await this.favoritesService.addFavorite({
        userId,
        propertyId: bodyResult.data.propertyId
      });
      return response.status(201).json(favorite);
    } catch (error) {
      return response.status(409).json({ error: "Already favorited" });
    }
  };

  remove = async (request: Request, response: Response) => {
    const userId = (request as any).user?.id;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const { propertyId } = request.params;
    if (!propertyId || typeof propertyId !== "string") {
      return response.status(400).json({ error: "propertyId is required" });
    }

    await this.favoritesService.removeFavorite(userId, propertyId);
    return response.status(204).send();
  };

  list = async (request: Request, response: Response) => {
    const userId = (request as any).user?.id;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const favorites = await this.favoritesService.getUserFavorites(userId);
    return response.json(favorites);
  };
}