import type { CreateInquiryInput, Inquiry } from "../../domain/entities/inquiry";

export interface InquiryRepository {
  create(input: CreateInquiryInput): Promise<Inquiry>;
}
