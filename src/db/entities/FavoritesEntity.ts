import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { PropertyEntity } from "./PropertyEntity";

@Entity({ name: "favorites" })
@Index(["userId", "propertyId"], { unique: true })
export class FavoritesEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "property_id", type: "uuid" })
  propertyId!: string;

  @ManyToOne(() => PropertyEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "property_id" })
  property!: PropertyEntity;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;
}