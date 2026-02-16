import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { PropertyEntity } from "./PropertyEntity";

export type InquiryStatus = "new" | "contacted" | "closed" | "spam";

@Entity({ name: "inquiries" })
export class InquiryEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => PropertyEntity, (property) => property.inquiries, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "property_id" })
  property!: PropertyEntity;

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId!: string | null;

  @Column({ name: "contact_name", type: "text" })
  contactName!: string;

  @Column({ name: "contact_email", type: "text" })
  contactEmail!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({
    type: "enum",
    enum: ["new", "contacted", "closed", "spam"],
    enumName: "inquiry_status",
    default: "new"
  })
  status!: InquiryStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
