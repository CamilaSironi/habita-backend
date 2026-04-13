import { PropertyController } from "../../src/controllers/PropertyController";
import type { PropertyService } from "../../src/services/PropertyService";
import { makeProperty } from "../factories/property.factory";

describe("PropertyController", () => {
  let controller: PropertyController;
  let propertyServiceMock: jest.Mocked<PropertyService>;

  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    propertyServiceMock = {
      findMany: jest.fn(),
      findByPublicId: jest.fn()
    } as any;

    controller = new PropertyController(propertyServiceMock);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // LIST
  describe("list", () => {
    it("should return properties with valid filters", async () => {
      mockRequest = {
        query: {
          city: "Buzios",
          type: "house",
          maxPrice: "1000",
          sort: "price-asc"
        }
      };

      const properties = [makeProperty()];

      propertyServiceMock.findMany.mockResolvedValue(properties);

      await controller.list(mockRequest, mockResponse);

      expect(propertyServiceMock.findMany).toHaveBeenCalledWith({
        city: "Buzios",
        type: "house",
        maxPrice: 1000,
        sort: "price-asc"
      });

      expect(mockResponse.json).toHaveBeenCalledWith(properties);
    });

    it("should return 400 if query params are invalid", async () => {
      mockRequest = {
        query: {
          maxPrice: "invalid-number"
        }
      };

      await controller.list(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid query params"
        })
      );
    });

    it("should work with empty filters", async () => {
      mockRequest = { query: {} };

      const properties = [makeProperty()];

      propertyServiceMock.findMany.mockResolvedValue(properties);

      await controller.list(mockRequest, mockResponse);

      expect(propertyServiceMock.findMany).toHaveBeenCalledWith({});
      expect(mockResponse.json).toHaveBeenCalledWith(properties);
    });
  });

  // GET BY PUBLIC ID
  describe("getByPublicId", () => {
    it("should return 400 if publicId is missing", async () => {
      mockRequest = { params: {} };

      await controller.getByPublicId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if property not found", async () => {
      mockRequest = { params: { publicId: "abc123" } };

      propertyServiceMock.findByPublicId.mockResolvedValue(null);

      await controller.getByPublicId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return property if found", async () => {
      mockRequest = { params: { publicId: "abc123" } };

      const property = makeProperty();

      propertyServiceMock.findByPublicId.mockResolvedValue(property);

      await controller.getByPublicId(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(property);
    });
  });
});