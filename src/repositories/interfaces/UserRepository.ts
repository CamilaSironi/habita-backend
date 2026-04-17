import type { CreateUserInput, UpdateUserInput, User } from "../../domain/entities/user";

export interface UserRepository {
    getMe(id: string): Promise<User | null>;
    create(input: CreateUserInput & { id: string }): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    delete(id: string): Promise<void>;
}