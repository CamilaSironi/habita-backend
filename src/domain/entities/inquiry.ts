export interface CreateInquiryInput {
  propertyId: string;
  userId?: string | undefined;
  contactName: string;
  contactEmail: string;
  message: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  userId: string | null;
  contactName: string;
  contactEmail: string;
  message: string;
  status: "new" | "contacted" | "closed" | "spam";
  createdAt: Date;
  updatedAt: Date;
}
