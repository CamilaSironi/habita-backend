import type { CreatePropertyImageInput, PropertyImage, UpdatePropertyImageInput } from "../domain/entities/propertyImage";
import type { PropertyImageRepository } from "../repositories/interfaces/PropertyImageRepository";

export class PropertyImageService {
  constructor(private readonly propertyImageRepository: PropertyImageRepository) {}

  async getByPropertyId(propertyId: string): Promise<PropertyImage[]> {
    return this.propertyImageRepository.findByPropertyId(propertyId);
  }

  async getById(id: string): Promise<PropertyImage | null> {
    return this.propertyImageRepository.findById(id);
  }

  async create(input: CreatePropertyImageInput): Promise<PropertyImage> {
    return this.propertyImageRepository.create(input);
  }

  async update(id: string, input: UpdatePropertyImageInput): Promise<PropertyImage> {
    return this.propertyImageRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    return this.propertyImageRepository.delete(id);
  }

  async setCover(propertyId: string, imageId: string): Promise<void> {
    return this.propertyImageRepository.setCover(propertyId, imageId);
  }
}