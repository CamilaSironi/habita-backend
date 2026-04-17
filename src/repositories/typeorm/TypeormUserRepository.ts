import { Repository } from "typeorm";
import type { CreateUserInput, UpdateUserInput, User } from "../../domain/entities/user";
import type { UserRepository } from "../interfaces/UserRepository";
import { UserEntity } from "../../db/entities/UserEntity";

export class TypeormUserRepository implements UserRepository {
    constructor(private readonly ormRepository: Repository<UserEntity>) {}

    async getMe(id: string): Promise<User | null> {
        const user = await this.ormRepository.findOne({ where: { id } });
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol
        };
    }

    async create(input: CreateUserInput & { id: string }): Promise<User> {
        const userToSave = this.ormRepository.create({
            id: input.id,
            name: input.name,
            email: input.email,
            rol: input.rol
        });

        const saved = await this.ormRepository.save(userToSave);

        return {
            id: saved.id,
            name: saved.name,
            email: saved.email,
            rol: saved.rol
        };
    }

    async findOrCreate(input: {
        id: string;
        email?: string;
        name?: string;
        }): Promise<User> {
        let user = await this.getMe(input.id);

        if (!user) {
            user = await this.create({
                id: input.id,
                email: input.email ?? "",
                name: input.name ?? "User",
                rol: "tenant"
            });
        }

        return user;
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const user = await this.ormRepository.findOne({ where: { id } });

        if (!user) {
            console.log("USUARIO CON ID:", id);
            throw new Error("User not found");
        }

        Object.assign(user, input);

        const saved = await this.ormRepository.save(user);

        return {
            id: saved.id,
            name: saved.name,
            email: saved.email,
            rol: saved.rol
        };
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}