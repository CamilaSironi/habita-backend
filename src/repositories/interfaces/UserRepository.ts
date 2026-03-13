import type { CreateUserInput, UpdateUserInput, User } from "../../domain/entities/user";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    delete(id: string): Promise<void>;
}