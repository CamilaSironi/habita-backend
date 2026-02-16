export type PropertyType = "house" | "apartment" | "loft" | "villa";

export interface Property {
  id: string;
  title: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  price: number;
  currency: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string | null;
  description: string;
}

export interface PropertyFilters {
  city?: string | undefined;
  type?: PropertyType | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
  sort?: "price-asc" | "price-desc" | undefined;
}
