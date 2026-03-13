import { Repository } from "typeorm";
import type { CreateUserInput, UpdateUserInput, User } from "../../domain/entities/user";
import type { UserRepository } from "../interfaces/UserRepository";
import { UserEntity } from "../../db/entities/UserEntity";

export class TypeormUserRepository implements UserRepository {
    constructor(private readonly ormRepository: Repository<UserEntity>) {}

    async findById(id: string): Promise<User | null> {
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
        await this.ormRepository.update(id, input);
        const updated = await this.ormRepository.findOne({ where: { id } });
        if (!updated) throw new Error("User not found after update");
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            password: updated.password,
            rol: updated.rol
        };
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}