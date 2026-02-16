import type { Request, Response } from "express";
import { z } from "zod";
import type { PropertyService } from "../services/PropertyService";

const listFiltersSchema = z.object({
  city: z.string().trim().min(1).optional(),
  type: z.enum(["house", "apartment", "loft", "villa"]).optional(),
  maxPrice: z
    .string()
    .trim()
    .transform((value) => Number(value))
    .pipe(z.number().finite().nonnegative())
    .optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(["price-asc", "price-desc"]).optional()
});

export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  list = async (request: Request, response: Response) => {
    const parsedFilters = listFiltersSchema.safeParse(request.query);

    if (!parsedFilters.success) {
      return response.status(400).json({
        error: "Invalid query params",
        details: parsedFilters.error.flatten()
      });
    }

    const properties = await this.propertyService.findMany(parsedFilters.data);

    return response.json(properties);
  };

  getByPublicId = async (request: Request, response: Response) => {
    const { publicId } = request.params;

    if (!publicId || typeof publicId !== "string") {
      return response.status(400).json({ error: "publicId is required" });
    }

    const property = await this.propertyService.findByPublicId(publicId);

    if (!property) {
      return response.status(404).json({ error: "Property not found" });
    }

    return response.json(property);
  };
}
