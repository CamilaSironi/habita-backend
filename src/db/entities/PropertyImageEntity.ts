import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { PropertyEntity } from "./PropertyEntity";

@Entity({ name: "property_images" })
export class PropertyImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => PropertyEntity, (property) => property.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "property_id" })
  property!: PropertyEntity;

  @Column({ name: "image_url", type: "text" })
  imageUrl!: string;

  @Column({ name: "alt_text", type: "text", nullable: true })
  altText!: string | null;

  @Column({ type: "smallint", default: 0 })
  position!: number;

  @Column({ name: "is_cover", type: "boolean", default: false })
  isCover!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
