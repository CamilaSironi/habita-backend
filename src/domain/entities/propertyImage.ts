export interface PropertyImage {
    id: string;
    propertyId: string;
    imageUrl: string;
    altText?: string | null;
    position: number;
    isCover: boolean;
    created: Date;
}

export interface CreatePropertyImageInput {
    propertyId: string;
    imageUrl: string;
    altText?: string | null;
    position?: number;
    isCover?: boolean;
}

export interface UpdatePropertyImageInput {
    imageUrl?: string;
    altText?: string | null;
    position?: number;
    isCover?: boolean;
}