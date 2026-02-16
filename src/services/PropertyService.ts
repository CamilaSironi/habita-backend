import type { PropertyFilters } from "../domain/entities/property";
import type { PropertyRepository } from "../repositories/interfaces/PropertyRepository";

export class PropertyService {
  constructor(private readonly repository: PropertyRepository) {}

  findMany(filters: PropertyFilters) {
    return this.repository.findMany(filters);
  }

  findByPublicId(publicId: string) {
    return this.repository.findByPublicId(publicId);
  }

  getInternalIdByPublicId(publicId: string) {
    return this.repository.getInternalIdByPublicId(publicId);
  }
}
