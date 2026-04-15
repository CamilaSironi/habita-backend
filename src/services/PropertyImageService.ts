import type { CreatePropertyImageInput, PropertyImage, UpdatePropertyImageInput } from "../domain/entities/propertyImage";
import type { PropertyImageRepository } from "../repositories/interfaces/PropertyImageRepository";
import { PropertyRepository } from "../repositories/interfaces/PropertyRepository";

export class PropertyImageService {
  constructor(
    private readonly propertyImageRepository: PropertyImageRepository,
    private readonly propertyRepository: PropertyRepository
  ) {}

  async getByPropertyId(propertyId: string): Promise<PropertyImage[]> {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(propertyId);

      if (!internalPropertyId) {
        throw new Error("Property not found");
      }

    return this.propertyImageRepository.findByPropertyId(internalPropertyId);
  }

  async getById(id: string): Promise<PropertyImage | null> {
    return this.propertyImageRepository.findById(id);
  }

  async create(input: CreatePropertyImageInput): Promise<PropertyImage> {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(input.propertyId);

    if (!internalPropertyId) {
      throw new Error("Property not found");
    }

    return this.propertyImageRepository.create({
      ...input,
      propertyId: internalPropertyId
    });
  }

  async update(id: string, input: UpdatePropertyImageInput): Promise<PropertyImage> {
    return this.propertyImageRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    return this.propertyImageRepository.delete(id);
  }

  async setCover(propertyId: string, imageId: string): Promise<void> {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(propertyId);

    if (!internalPropertyId) {
      throw new Error("Property not found");
    }

    return this.propertyImageRepository.setCover(internalPropertyId, imageId);
  }
}