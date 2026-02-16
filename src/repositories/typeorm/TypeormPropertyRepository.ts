import { Repository } from "typeorm";
import type { Property, PropertyFilters } from "../../domain/entities/property";
import type { PropertyRepository } from "../interfaces/PropertyRepository";
import { PropertyEntity } from "../../db/entities/PropertyEntity";

export class TypeormPropertyRepository implements PropertyRepository {
  constructor(private readonly ormRepository: Repository<PropertyEntity>) {}

  async findMany(filters: PropertyFilters): Promise<Property[]> {
    const qb = this.ormRepository
      .createQueryBuilder("property")
      .leftJoinAndSelect("property.images", "image")
      .where("property.isPublished = :isPublished", { isPublished: true });

    if (filters.city) {
      qb.andWhere("property.city = :city", { city: filters.city });
    }

    if (filters.type) {
      qb.andWhere("property.propertyType = :type", { type: filters.type });
    }

    if (typeof filters.maxPrice === "number") {
      qb.andWhere("property.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    if (filters.search) {
      qb.andWhere("(LOWER(property.title) LIKE :search OR LOWER(property.city) LIKE :search)", {
        search: `%${filters.search.toLowerCase()}%`
      });
    }

    if (filters.sort === "price-asc") {
      qb.orderBy("property.price", "ASC");
    } else if (filters.sort === "price-desc") {
      qb.orderBy("property.price", "DESC");
    } else {
      qb.orderBy("property.createdAt", "DESC");
    }

    const entities = await qb.getMany();
    return entities.map((entity) => this.mapEntity(entity));
  }

  async findByPublicId(publicId: string): Promise<Property | null> {
    const entity = await this.ormRepository.findOne({
      where: { publicId, isPublished: true },
      relations: { images: true }
    });

    return entity ? this.mapEntity(entity) : null;
  }

  async getInternalIdByPublicId(publicId: string): Promise<string | null> {
    const entity = await this.ormRepository.findOne({
      where: { publicId, isPublished: true },
      select: { id: true }
    });

    return entity?.id ?? null;
  }

  private mapEntity(entity: PropertyEntity): Property {
    const sortedImages = [...(entity.images ?? [])].sort((a, b) => {
      if (a.isCover === b.isCover) {
        return a.position - b.position;
      }

      return a.isCover ? -1 : 1;
    });

    const coverImage = sortedImages[0]?.imageUrl ?? null;

    return {
      id: entity.publicId,
      title: entity.title,
      location: {
        city: entity.city,
        country: entity.country,
        lat: Number(entity.latitude),
        lng: Number(entity.longitude)
      },
      price: Number(entity.price),
      currency: entity.currency,
      type: entity.propertyType,
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      area: Number(entity.areaM2),
      image: coverImage,
      description: entity.description
    };
  }
}
