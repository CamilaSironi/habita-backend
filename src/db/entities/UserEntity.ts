import {
  Column,
  Entity,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

export type UserRol = "admin" | "tenant" | "owner";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn({ type: "text" })
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", unique: true })
  @Index()
  email!: string;

  @Column({
    type: "enum",
    enum: ["admin", "tenant", "owner"],
    enumName: "user_role"
  })
  rol!: UserRol;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}