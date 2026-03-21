import { UserController } from "../../src/controllers/UserController";
import type { UserService } from "../../src/services/UserService";

describe("UserController", () => {
  let controller: UserController;
  let userServiceMock: jest.Mocked<UserService>;

  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    userServiceMock = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    controller = new UserController(userServiceMock);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  // CREATE
  describe("create", () => {
    it("should return 201 when user is created", async () => {
      mockRequest = {
        body: {
          name: "Test User",
          email: "test@test.com",
          password: "123456",
          rol: "tenant"
        }
      };

      const user = {
        id: "1",
        ...mockRequest.body
      };

      userServiceMock.create.mockResolvedValue(user);

      await controller.create(mockRequest, mockResponse);

      expect(userServiceMock.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it("should return 400 if payload is invalid", async () => {
      mockRequest = {
        body: {
          name: "inválido",
          email: "bad-email",
          password: "123",
          rol: "tenant"
        }
      };

      await controller.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid payload"
        })
      );
    });

    it("should return 500 if service throws", async () => {
      mockRequest = {
        body: {
          name: "Test User",
          email: "test@test.com",
          password: "123456",
          rol: "tenant"
        }
      };

      userServiceMock.create.mockRejectedValue(new Error("fail"));

      await controller.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  // GET BY ID
  describe("getById", () => {
    it("should return 400 if id is missing", async () => {
      mockRequest = { params: {} };

      await controller.getById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if user not found", async () => {
      mockRequest = { params: { id: "1" } };

      userServiceMock.findById.mockResolvedValue(null);

      await controller.getById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return user if found", async () => {
      mockRequest = { params: { id: "1" } };

      const user = {
        id: "1",
        name: "Test",
        email: "test@test.com",
        password: "123",
        rol: "tenant" as const
      };

      userServiceMock.findById.mockResolvedValue(user);

      await controller.getById(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        id: user.id,
        name: user.name,
        email: user.email,
        rol: user.rol
      });
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
        params: { id: "1" },
        body: { email: "bad-email" }
      };

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if service throws", async () => {
      mockRequest = {
        params: { id: "1" },
        body: { name: "Valid Name" }
      };

      userServiceMock.update.mockRejectedValue(new Error("not found"));

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should update user successfully", async () => {
      mockRequest = {
        params: { id: "1" },
        body: { name: "Updated Name" }
      };

      const updatedUser = {
        id: "1",
        name: "Updated Name",
        email: "test@test.com",
        password: "123",
        rol: "tenant" as const
      };

      userServiceMock.update.mockResolvedValue(updatedUser);

      await controller.update(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        rol: updatedUser.rol
      });
    });
  });

  // DELETE
  describe("delete", () => {
    it("should return 400 if id is missing", async () => {
      mockRequest = { params: {} };

      await controller.delete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should delete user and return 204", async () => {
      mockRequest = { params: { id: "1" } };

      userServiceMock.delete.mockResolvedValue();

      await controller.delete(mockRequest, mockResponse);

      expect(userServiceMock.delete).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });
});