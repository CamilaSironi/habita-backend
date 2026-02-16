import type { CreateInquiryInput } from "../domain/entities/inquiry";
import type { InquiryRepository } from "../repositories/interfaces/InquiryRepository";
import type { PropertyRepository } from "../repositories/interfaces/PropertyRepository";

export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly propertyRepository: PropertyRepository
  ) {}

  async createByPublicPropertyId(publicId: string, payload: Omit<CreateInquiryInput, "propertyId">) {
    const internalPropertyId = await this.propertyRepository.getInternalIdByPublicId(publicId);

    if (!internalPropertyId) {
      return null;
    }

    return this.inquiryRepository.create({
      propertyId: internalPropertyId,
      ...payload
    });
  }
}
