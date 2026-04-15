import type { CreateFavoritesInput, Favorites } from "../domain/entities/favorites";
import type { FavoritesRepository } from "../repositories/interfaces/FavoritesRepository";
import type { PropertyRepository } from "../repositories/interfaces/PropertyRepository";

export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly propertyRepository: PropertyRepository
  ) {}

  async addFavorite(input: CreateFavoritesInput): Promise<Favorites> {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(input.propertyId);

    if (!internalPropertyId) {
      throw new Error("Property not found");
    }
    return this.favoritesRepository.create({
      userId: input.userId,
      propertyId: internalPropertyId
    });
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(propertyId);

    if (!internalPropertyId) {
        throw new Error("Property not found");
      }

    return this.favoritesRepository.delete(userId, internalPropertyId);
  }

  async getUserFavorites(userId: string): Promise<Favorites[]> {
    return this.favoritesRepository.findManyByUserId(userId);
  }

  async isFavorited(userId: string, propertyId: string): Promise<boolean> {
    const favorites = await this.favoritesRepository.findManyByUserId(userId);
    return favorites.some(fav => fav.propertyId === propertyId);
  }
}