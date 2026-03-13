import { Repository } from "typeorm";
import type { CreateFavoritesInput, Favorites } from "../../domain/entities/favorites";
import type { FavoritesRepository } from "../interfaces/FavoritesRepository";
import { FavoritesEntity } from "../../db/entities/FavoritesEntity";

export class TypeormFavoritesRepository implements FavoritesRepository {
    constructor(private readonly ormRepository: Repository<FavoritesEntity>) {}

    async findManyByUserId(userId: string): Promise<Favorites[]> {
        const favorites = await this.ormRepository.find({
            where: { userId }
        });

        return favorites.map(fav => ({
            userId: fav.userId,
            propertyId: fav.propertyId
        }));
    }

    async create(input: CreateFavoritesInput): Promise<Favorites> {
        const favoriteToSave = this.ormRepository.create({
            propertyId: input.propertyId,
            userId: input.userId,
        });

        const saved = await this.ormRepository.save(favoriteToSave);

        return {
            propertyId: saved.propertyId,
            userId: saved.userId
        };
    }

    async delete(userId: string, propertyId: string): Promise<void> {
        await this.ormRepository.delete({ userId, propertyId });
    }
}