import type { CreateUserInput, UpdateUserInput, User } from "../domain/entities/user";
import type { UserRepository } from "../repositories/interfaces/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    // TODO: Hash password before saving
    return this.userRepository.create(input);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    // TODO: Hash password if updating
    return this.userRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}