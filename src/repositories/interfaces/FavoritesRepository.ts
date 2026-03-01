import type { Favorites } from "../../domain/entities/favorites";

export interface FavoritesRepository {  
    findManyByUserId(userId: string): Promise<Favorites[]>;
    create(userId: string, propertyId: string): Promise<Favorites>;
    delete(userId: string, propertyId: string): Promise<void>;
}