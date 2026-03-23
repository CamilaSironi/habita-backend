import { InquiryController } from "../../src/controllers/InquiryController";
import type { InquiryService } from "../../src/services/InquiryService";

describe("InquiryController", () => {
  let controller: InquiryController;
  let inquiryServiceMock: jest.Mocked<InquiryService>;

  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    inquiryServiceMock = {
      createByPublicPropertyId: jest.fn()
    } as any;

    controller = new InquiryController(inquiryServiceMock);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // CREATE BY PROPERTY
  describe("createByProperty", () => {
    it("should return 400 if publicId is missing", async () => {
      mockRequest = {
        params: {},
        body: {}
      };

      await controller.createByProperty(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if payload is invalid", async () => {
      mockRequest = {
        params: { publicId: "abc123" },
        body: {
          contactName: "invalid",
          contactEmail: "bad-email",
          message: "123"
        }
      };

      await controller.createByProperty(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid payload"
        })
      );
    });

    it("should return 404 if property not found", async () => {
      mockRequest = {
        params: { publicId: "abc123" },
        body: {
          contactName: "John Doe",
          contactEmail: "john@test.com",
          message: "Hello, I'm interested"
        }
      };

      inquiryServiceMock.createByPublicPropertyId.mockResolvedValue(null);

      await controller.createByProperty(mockRequest, mockResponse);

      expect(inquiryServiceMock.createByPublicPropertyId).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should create inquiry and return 201", async () => {
      mockRequest = {
        params: { publicId: "abc123" },
        body: {
          contactName: "John Doe",
          contactEmail: "john@test.com",
          message: "Hello, I'm interested"
        }
      };

      const inquiry = {
        id: "inq-1",
        propertyId: "prop-1",
        userId: null,
        contactName: "John Doe",
        contactEmail: "john@test.com",
        message: "Hello, I'm interested",
        status: "new" as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inquiryServiceMock.createByPublicPropertyId.mockResolvedValue(inquiry);

      await controller.createByProperty(mockRequest, mockResponse);

      expect(inquiryServiceMock.createByPublicPropertyId).toHaveBeenCalledWith(
        "abc123",
        {
          contactName: "John Doe",
          contactEmail: "john@test.com",
          message: "Hello, I'm interested"
        }
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      });
    });

    it("should pass userId if provided", async () => {
      mockRequest = {
        params: { publicId: "abc123" },
        body: {
          contactName: "John Doe",
          contactEmail: "john@test.com",
          message: "Hello",
          userId: "550e8400-e29b-41d4-a716-446655440000"
        }
      };

      const inquiry = {
        id: "inq-1",
        propertyId: "prop-1",
        userId: mockRequest.body.userId,
        contactName: "John Doe",
        contactEmail: "john@test.com",
        message: "Hello",
        status: "new" as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inquiryServiceMock.createByPublicPropertyId.mockResolvedValue(inquiry);

      await controller.createByProperty(mockRequest, mockResponse);

      expect(inquiryServiceMock.createByPublicPropertyId).toHaveBeenCalledWith(
        "abc123",
        expect.objectContaining({
          userId: mockRequest.body.userId
        })
      );
    });
  });
});