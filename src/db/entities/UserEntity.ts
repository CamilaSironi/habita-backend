import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index
} from "typeorm";

export type UserRol = "admin" | "tenant" | "owner";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", unique: true })
  @Index()
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @Column({
    type: "enum",
    enum: ["admin", "tenant", "owner"],
    enumName: "user_rol"
  })
  rol!: UserRol;
}