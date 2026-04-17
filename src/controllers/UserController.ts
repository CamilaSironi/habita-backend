import type { Request, Response } from "express";
import { z } from "zod";
import type { UserService } from "../services/UserService";

const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).optional(),
  rol: z.enum(["admin", "tenant", "owner"]).optional()
});

export class UserController {
  constructor(private readonly userService: UserService) {}

  getMe = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await this.userService.getMe(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  };

  update = async (request: Request, response: Response) => {
    const userId = (request as any).user?.id;
    
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const bodyResult = updateUserSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return response.status(400).json({
        error: "Invalid payload",
        details: bodyResult.error.flatten()
      });
    }

    try {
      const user = await this.userService.update(userId, bodyResult.data as any);

      return response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        rol: user.rol
      });
    } catch (error) {
        console.error("ERROR REAL:", error);
        return response.status(500).json({ error: "Internal error" });
    }
  };

  delete = async (request: Request, response: Response) => {
    const userId = (request as any).user?.id;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    await this.userService.delete(userId);
    return response.status(204).send();
  };
}