import type { UpdateUserInput, User } from "../domain/entities/user";
import type { UserRepository } from "../repositories/interfaces/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreate(input: {
    id: string;
    email?: string;
    name?: string;
  }): Promise<User> {
    let user = await this.userRepository.getMe(input.id);

    if (!user) {
      user = await this.userRepository.create({
        id: input.id,
        email: input.email ?? "",
        name: input.name ?? "User",
        password: "",
        rol: "tenant"
      });
    }

    return user;
  }
  
  async getMe(id: string): Promise<User | null> {
    return this.userRepository.getMe(id);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    // TODO: Hash password if updating
    return this.userRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}