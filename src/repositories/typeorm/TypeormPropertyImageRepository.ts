import { Repository } from "typeorm";
import type { CreatePropertyImageInput, PropertyImage, UpdatePropertyImageInput } from "../../domain/entities/propertyImage";
import type { PropertyImageRepository } from "../interfaces/PropertyImageRepository";
import { PropertyImageEntity } from "../../db/entities/PropertyImageEntity";
import { PropertyEntity } from "../../db/entities/PropertyEntity";

export class TypeormPropertyImageRepository implements PropertyImageRepository {
    constructor(private readonly ormRepository: Repository<PropertyImageEntity>) {}

    async findByPropertyId(propertyId: string): Promise<PropertyImage[]> {
        const images = await this.ormRepository.find({
            where:  { propertyId },
            order: { position: "ASC" }
        });

        return images.map(img => ({
            id: img.id,
            propertyId: img.propertyId,
            imageUrl: img.imageUrl,
            altText: img.altText,
            position: img.position,
            isCover: img.isCover,
            created: img.createdAt
        }));
    }

    async findById(id: string): Promise<PropertyImage | null> {
        const image = await this.ormRepository.findOne({
            where: { id },
            relations: ["property"]
        });
        if (!image) return null;

        return {
            id: image.id,
            propertyId: image.property.publicId,
            imageUrl: image.imageUrl,
            altText: image.altText,
            position: image.position,
            isCover: image.isCover,
            created: image.createdAt
        };
    }

    async create(input: CreatePropertyImageInput): Promise<PropertyImage> {
        let position = input.position ?? 0;

        if (input.position === undefined) {
            const existingImages = await this.ormRepository.find({
                where: { propertyId: input.propertyId },
                select: ['position']
            });
            const maxPos = existingImages.length > 0 ? Math.max(...existingImages.map(img => img.position)) : -1;
            position = maxPos + 1;
        }

        const imageToSave = this.ormRepository.create({
            propertyId: input.propertyId,
            imageUrl: input.imageUrl,
            altText: input.altText || null,
            position,
            isCover: input.isCover ?? false
        });

        const saved = await this.ormRepository.save(imageToSave);

        return {
            id: saved.id,
            propertyId: saved.propertyId,
            imageUrl: saved.imageUrl,
            altText: saved.altText,
            position: saved.position,
            isCover: saved.isCover,
            created: saved.createdAt
        };
    }

    async update(id: string, input: UpdatePropertyImageInput): Promise<PropertyImage> {
        await this.ormRepository.update(id, {
            ...(input.imageUrl && { imageUrl: input.imageUrl }),
            ...(input.altText !== undefined && { altText: input.altText }),
            ...(input.position !== undefined && { position: input.position }),
            ...(input.isCover !== undefined && { isCover: input.isCover })
        });

        const updated = await this.ormRepository.findOne({
            where: { id },
            relations: ["property"]
        });
        if (!updated) throw new Error("Image not found after update");

        return {
            id: updated.id,
            propertyId: updated.property.publicId,
            imageUrl: updated.imageUrl,
            altText: updated.altText,
            position: updated.position,
            isCover: updated.isCover,
            created: updated.createdAt
        };
    }

    async delete(id: string): Promise<void> {
        const image = await this.ormRepository.findOne({
            where: { id }
        });

        if (!image) {
            throw new Error("Image not found");
        }

        const wasCover = image.isCover;
        const propertyId = image.propertyId;

        await this.ormRepository.delete(id);

        if (wasCover) {
            const nextImage = await this.ormRepository.findOne({
                where: { propertyId },
                order: { position: "ASC" }
            });     
        if (nextImage) {
            await this.ormRepository.update(nextImage.id, { isCover: true });
        }
        }
    }

    async setCover(propertyId: string, imageId: string): Promise<void> {
        await this.ormRepository.manager.transaction(async manager => {
            
            // Unset all covers for the property
            await manager.createQueryBuilder()
                .update(PropertyImageEntity)
                .set({ isCover: false })
                .where("property_id = :propertyId", { propertyId })
                .execute();
            // Set the new cover
            await manager.update(PropertyImageEntity, { id: imageId }, { isCover: true });
        });
    }
}