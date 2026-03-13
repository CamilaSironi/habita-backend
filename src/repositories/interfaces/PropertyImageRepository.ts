import type { CreatePropertyImageInput, PropertyImage, UpdatePropertyImageInput } from "../../domain/entities/propertyImage";

export interface PropertyImageRepository {
    findByPropertyId(propertyId: string): Promise<PropertyImage[]>;
    findById(id: string): Promise<PropertyImage | null>;
    create(input: CreatePropertyImageInput): Promise<PropertyImage>;
    update(id: string, input: UpdatePropertyImageInput): Promise<PropertyImage>;
    delete(id: string): Promise<void>;
    setCover(propertyId: string, imageId: string): Promise<void>;
}