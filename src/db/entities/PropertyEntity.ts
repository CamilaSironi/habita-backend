import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { PropertyImageEntity } from "./PropertyImageEntity";
import { InquiryEntity } from "./InquiryEntity";

export type PropertyType = "house" | "apartment" | "loft" | "villa";

@Entity({ name: "properties" })
export class PropertyEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "public_id", type: "text", unique: true })
  publicId!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", default: "" })
  description!: string;

  @Column({ name: "property_type", type: "text" })
  propertyType!: PropertyType;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  price!: string;

  @Column({ type: "char", length: 3, default: "USD" })
  currency!: string;

  @Column({ type: "smallint", default: 0 })
  bedrooms!: number;

  @Column({ type: "smallint", default: 0 })
  bathrooms!: number;

  @Column({ name: "area_m2", type: "numeric", precision: 10, scale: 2 })
  areaM2!: string;

  @Column({ type: "text" })
  city!: string;

  @Column({ type: "text" })
  country!: string;

  @Column({ type: "numeric", precision: 9, scale: 6 })
  latitude!: string;

  @Column({ type: "numeric", precision: 9, scale: 6 })
  longitude!: string;

  @Column({ name: "is_published", type: "boolean", default: true })
  isPublished!: boolean;

  @Column({ name: "owner_id", type: "uuid", nullable: true })
  ownerId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => PropertyImageEntity, (image) => image.property)
  images!: PropertyImageEntity[];

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.property)
  inquiries!: InquiryEntity[];
}
