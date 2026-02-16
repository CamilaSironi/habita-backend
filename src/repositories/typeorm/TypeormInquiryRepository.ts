import { Repository } from "typeorm";
import type { CreateInquiryInput, Inquiry } from "../../domain/entities/inquiry";
import type { InquiryRepository } from "../interfaces/InquiryRepository";
import { InquiryEntity } from "../../db/entities/InquiryEntity";
import { PropertyEntity } from "../../db/entities/PropertyEntity";

export class TypeormInquiryRepository implements InquiryRepository {
  constructor(private readonly ormRepository: Repository<InquiryEntity>) {}

  async create(input: CreateInquiryInput): Promise<Inquiry> {
    const inquiryToSave = this.ormRepository.create({
      property: { id: input.propertyId } as PropertyEntity,
      userId: input.userId ?? null,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      message: input.message
    });

    const saved = await this.ormRepository.save(inquiryToSave);

    return {
      id: saved.id,
      propertyId: input.propertyId,
      userId: saved.userId,
      contactName: saved.contactName,
      contactEmail: saved.contactEmail,
      message: saved.message,
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    };
  }
}
