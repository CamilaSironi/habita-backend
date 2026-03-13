import type { Request, Response } from "express";
import { z } from "zod";
import type { UserService } from "../services/UserService";

const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
  rol: z.enum(["admin", "tenant", "owner"])
});

const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).optional(),
  rol: z.enum(["admin", "tenant", "owner"]).optional()
});

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (request: Request, response: Response) => {
    const bodyResult = createUserSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    try {
      const user = await this.userService.create(bodyResult.data);
      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        rol: user.rol
      });
    } catch (error) {
      // Assuming unique email error
      return response.status(409).json({ error: "Email already exists" });
    }
  };

  getById = async (request: Request, response: Response) => {
    const { id } = request.params;
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "id is required" });
    }

    const user = await this.userService.findById(id);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      rol: user.rol
    });
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "id is required" });
    }

    const bodyResult = updateUserSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    try {
      const user = await this.userService.update(id, bodyResult.data as any);
      return response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        rol: user.rol
      });
    } catch (error) {
      return response.status(404).json({ error: "User not found" });
    }
  };

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "id is required" });
    }

    await this.userService.delete(id);
    return response.status(204).send();
  };
}