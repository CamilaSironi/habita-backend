import { PropertyImageController } from "../../src/controllers/PropertyImageController";
import type { PropertyImageService } from "../../src/services/PropertyImageService";

describe("PropertyImageController", () => {
  let controller: PropertyImageController;
  let serviceMock: jest.Mocked<PropertyImageService>;

  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    serviceMock = {
      getByPropertyId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      setCover: jest.fn()
    } as any;

    controller = new PropertyImageController(serviceMock);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  // LIST
  describe("listByProperty", () => {
    it("should return 400 if propertyId is missing", async () => {
      mockRequest = { params: {} };

      await controller.listByProperty(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return images", async () => {
      mockRequest = { params: { propertyId: "prop-1" } };

      const images = [{ id: "img-1" }];

      serviceMock.getByPropertyId.mockResolvedValue(images as any);

      await controller.listByProperty(mockRequest, mockResponse);

      expect(serviceMock.getByPropertyId).toHaveBeenCalledWith("prop-1");
      expect(mockResponse.json).toHaveBeenCalledWith(images);
    });
  });

  // CREATE
  describe("create", () => {
    it("should return 400 if propertyId is missing", async () => {
      mockRequest = { params: {}, body: {} };

      await controller.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if payload is invalid", async () => {
      mockRequest = {
        params: { propertyId: "prop-1" },
        body: { imageUrl: "not-a-url" }
      };

      await controller.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should create image and return 201", async () => {
      mockRequest = {
        params: { propertyId: "prop-1" },
        body: {
          imageUrl: "https://image.com/img.jpg",
          altText: "Nice image",
          position: 0,
          isCover: true
        }
      };

      const image = {
        id: "img-1",
        propertyId: "prop-1",
        ...mockRequest.body,
        created: new Date()
      };

      serviceMock.create.mockResolvedValue(image as any);

      await controller.create(mockRequest, mockResponse);

      expect(serviceMock.create).toHaveBeenCalledWith({
        propertyId: "prop-1",
        ...mockRequest.body
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(image);
    });
  });

  // UPDATE
  describe("update", () => {
    it("should return 400 if id is missing", async () => {
      mockRequest = { params: {}, body: {} };

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if payload is invalid", async () => {
      mockRequest = {
        params: { id: "img-1" },
        body: { imageUrl: "bad-url" }
      };

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if image not found", async () => {
      mockRequest = {
        params: { id: "img-1" },
        body: { altText: "Updated" }
      };

      serviceMock.update.mockRejectedValue(new Error("not found"));

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should update image successfully", async () => {
      mockRequest = {
        params: { id: "img-1" },
        body: { altText: "Updated" }
      };

      const updatedImage = {
        id: "img-1",
        propertyId: "prop-1",
        imageUrl: "https://image.com/img.jpg",
        altText: "Updated",
        position: 0,
        isCover: false,
        created: new Date()
      };

      serviceMock.update.mockResolvedValue(updatedImage as any);

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(updatedImage);
    });
  });

  // DELETE
  describe("delete", () => {
    it("should return 400 if id is missing", async () => {
      mockRequest = { params: {} };

      await controller.delete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should delete image and return 204", async () => {
      mockRequest = { params: { id: "img-1" } };

      serviceMock.delete.mockResolvedValue();

      await controller.delete(mockRequest, mockResponse);

      expect(serviceMock.delete).toHaveBeenCalledWith("img-1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });

  // SET COVER
  describe("setCover", () => {
    it("should return 400 if propertyId is missing", async () => {
      mockRequest = { params: { imageId: "img-1" } };

      await controller.setCover(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if imageId is missing", async () => {
      mockRequest = { params: { propertyId: "prop-1" } };

      await controller.setCover(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should set cover and return 204", async () => {
      mockRequest = {
        params: { propertyId: "prop-1", imageId: "img-1" }
      };

      serviceMock.setCover.mockResolvedValue();

      await controller.setCover(mockRequest, mockResponse);

      expect(serviceMock.setCover).toHaveBeenCalledWith("prop-1", "img-1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });
});