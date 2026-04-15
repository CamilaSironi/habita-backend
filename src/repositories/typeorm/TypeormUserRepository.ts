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
            password: user.password,
            rol: user.rol
        };
    }

    async create(input: CreateUserInput): Promise<User> {
        const userToSave = this.ormRepository.create({
            id: input.id,
            name: input.name,
            email: input.email,
            password: input.password,
            rol: input.rol
        });

        const saved = await this.ormRepository.save(userToSave);

        return {
            id: saved.id,
            name: saved.name,
            email: saved.email,
            password: saved.password,
            rol: saved.rol
        };
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
            password: saved.password,
            rol: saved.rol
        };
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}