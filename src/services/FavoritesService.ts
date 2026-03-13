import type { CreateFavoritesInput, Favorites } from "../domain/entities/favorites";
import type { FavoritesRepository } from "../repositories/interfaces/FavoritesRepository";

export class FavoritesService {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async addFavorite(input: CreateFavoritesInput): Promise<Favorites> {
    return this.favoritesRepository.create(input);
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    return this.favoritesRepository.delete(userId, propertyId);
  }

  async getUserFavorites(userId: string): Promise<Favorites[]> {
    return this.favoritesRepository.findManyByUserId(userId);
  }

  async isFavorited(userId: string, propertyId: string): Promise<boolean> {
    const favorites = await this.favoritesRepository.findManyByUserId(userId);
    return favorites.some(fav => fav.propertyId === propertyId);
  }
}