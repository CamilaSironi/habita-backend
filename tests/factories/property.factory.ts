import type { Property } from "../../src/domain/entities/property";

export const makeProperty = (overrides: Partial<Property> = {}): Property => ({
  id: "1",
  title: "Nice house for testing",
  location: {
    city: "Buzios",
    country: "Brazil",
    lat: -22.75,
    lng: -41.88
  },
  price: 1000,
  currency: "USD",
  type: "house",
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  image: null,
  description: "Beautiful property",
  ...overrides
});