import { FavoritesController } from "../../src/controllers/FavoritesController";
import type { FavoritesService } from "../../src/services/FavoritesService";

describe("FavoritesController", () => {
  let controller: FavoritesController;
  let service: jest.Mocked<FavoritesService>;

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    service = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getUserFavorites: jest.fn()
    } as any;

    controller = new FavoritesController(service);
  });

  // ADD FAVORITE

  describe("add", () => {
    it("should return 201 when favorite is created", async () => {
      const req: any = {
        body: {
            userId: "550e8400-e29b-41d4-a716-446655440000",
            propertyId: "550e8400-e29b-41d4-a716-446655440001"
        }
      };
      const res = mockResponse();

      service.addFavorite.mockResolvedValue(req.body);

      await controller.add(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("should return 400 if payload is invalid", async () => {
      const req: any = {
        body: {
          userId: "invalid", // no uuid
          propertyId: "test"
        }
      };
      const res = mockResponse();

      await controller.add(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 409 if service throws", async () => {
      const req: any = {
        body: {
          userId: "550e8400-e29b-41d4-a716-446655440000",
          propertyId: "550e8400-e29b-41d4-a716-446655440001"
        }
      };
      const res = mockResponse();

      service.addFavorite.mockRejectedValue(new Error());

      await controller.add(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  // LIST

  describe("list", () => {
    it("should return 400 if userId is missing", async () => {
      const req: any = {
        params: {}
      };
      const res = mockResponse();

      await controller.list(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return favorites list", async () => {
      const req: any = {
        params: {
          userId: "uuid-user"
        }
      };
      const res = mockResponse();

      const mockFavorites = [
        { userId: "uuid-user", propertyId: "uuid-property" }
      ];

      service.getUserFavorites.mockResolvedValue(mockFavorites);

      await controller.list(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFavorites);
    });
  });

  // REMOVE FAVORITE

  describe("remove", () => {
    it("should return 401 if userId is missing", async () => {
      const req: any = {
        params: {
          propertyId: "uuid-property"
        }
      };
      const res = mockResponse();

      await controller.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if propertyId is missing", async () => {
      const req: any = {
        params: {
          userId: "uuid-user"
        }
      };
      const res = mockResponse();

      await controller.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should delete favorite and return 204", async () => {
      const req: any = {
        params: {
          userId: "uuid-user",
          propertyId: "uuid-property"
        }
      };
      const res = mockResponse();

      service.removeFavorite.mockResolvedValue(undefined);

      await controller.remove(req, res);

      expect(service.removeFavorite).toHaveBeenCalledWith(
        "uuid-user",
        "uuid-property"
      );
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});