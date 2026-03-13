import type { CreateFavoritesInput, Favorites } from "../../domain/entities/favorites";

export interface FavoritesRepository {  
    findManyByUserId(userId: string): Promise<Favorites[]>;
    create(input: CreateFavoritesInput): Promise<Favorites>;
    delete(userId: string, propertyId: string): Promise<void>;
}