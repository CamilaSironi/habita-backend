export type UserRol = "admin" | "tenant" | "owner";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    rol: UserRol;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    rol: UserRol;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    rol?: UserRol;
}