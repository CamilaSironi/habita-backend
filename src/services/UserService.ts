import type { UpdateUserInput, User } from "../domain/entities/user";
import type { UserRepository } from "../repositories/interfaces/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreate(input: {
    id: string;
    email?: string;
    name?: string;
  }): Promise<User> {
    return this.userRepository.findOrCreate(input);
  }
  
  async getMe(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    return this.userRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}