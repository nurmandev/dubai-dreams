export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  category: "off-plan" | "secondary" | "rental";
  location: string;
  developer?: string;
  status: "off-plan" | "ready";
  image: string;
  images?: string[];
  amenities?: string[];
  yearBuilt?: number;
  kitchens?: number;
  garages?: number;
  garageSize?: number;
  floorsNo?: number;
  videoUrl?: string;
  floorPlans?: string[];
  featured?: boolean;
}

export const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Penthouse at Dubai Marina",
    price: 8500000,
    area: 4200,
    bedrooms: 4,
    bathrooms: 5,
    type: "penthouse",
    category: "secondary",
    location: "Dubai Marina",
    status: "ready",
    image: "/images/property-penthouse.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Modern Villa in Palm Jumeirah",
    price: 15000000,
    area: 7500,
    bedrooms: 6,
    bathrooms: 7,
    type: "villa",
    category: "secondary",
    location: "Palm Jumeirah",
    status: "ready",
    image: "/images/property-villa.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Elegant Apartment in Downtown",
    price: 3200000,
    area: 1800,
    bedrooms: 2,
    bathrooms: 3,
    type: "apartment",
    category: "off-plan",
    location: "Downtown Dubai",
    developer: "Emaar Properties",
    status: "off-plan",
    image: "/images/property-apartment.jpg",
    featured: true,
  },
  {
    id: "4",
    title: "Waterfront Townhouse at Dubai Creek",
    price: 4800000,
    area: 3200,
    bedrooms: 4,
    bathrooms: 4,
    type: "townhouse",
    category: "off-plan",
    location: "Dubai Creek Harbour",
    developer: "Emaar Properties",
    status: "off-plan",
    image: "/images/property-townhouse.jpg",
  },
  {
    id: "5",
    title: "Marina View Apartment",
    price: 120000,
    area: 1200,
    bedrooms: 1,
    bathrooms: 2,
    type: "apartment",
    category: "rental",
    location: "Dubai Marina",
    status: "ready",
    image: "/images/property-marina.jpg",
  },
  {
    id: "6",
    title: "Premium Off-Plan Tower Residence",
    price: 2800000,
    area: 1600,
    bedrooms: 2,
    bathrooms: 2,
    type: "apartment",
    category: "off-plan",
    location: "Business Bay",
    developer: "DAMAC Properties",
    status: "off-plan",
    image: "/images/property-offplan.jpg",
    featured: true,
  },
];

export const formatPrice = (price: number, category: string) => {
  if (category === "rental") {
    return `AED ${price.toLocaleString()} /yr`;
  }
  return `AED ${price.toLocaleString()}`;
};
