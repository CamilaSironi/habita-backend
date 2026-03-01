import { Repository } from "typeorm";
import type { Favorites } from "../../domain/entities/favorites";
import type { FavoritesRepository } from "../interfaces/FavoritesRepository";
import { FavoritesEntity } from "../../db/entities/FavoritesEntity";

export class TypeormFavoritesRepository implements FavoritesRepository {
    constructor(private readonly ormRepository: Repository<FavoritesEntity>) {}

    async findManyByUserId(userId: string): Promise<Favorites[]> {
        const qb = this.ormRepository
            .createQueryBuilder("favorites")
            .leftJoinAndSelect("favorites.userId", "property")
            .where("favorites.userId = :userId", { userId });
            
        const favorites = await qb.getMany();

        return favorites;
    }

    async create(userId: string, propertyId: string): Promise<Favorites> {

    }

    async delete(userId: string, propertyId: string): Promise<void> {

    }
}