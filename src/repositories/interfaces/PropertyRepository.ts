import type { Property, PropertyFilters } from "../../domain/entities/property";

export interface PropertyRepository {
  findMany(filters: PropertyFilters): Promise<Property[]>;
  findByPublicId(publicId: string): Promise<Property | null>;
  getInternalIdByPublicId(publicId: string): Promise<string | null>;
}
