export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  diversity: DiversityTag[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  founded?: number;
  employees?: string;
  revenue?: string;
  logo?: string;
  images?: string[];
  tags?: string[];
}

export type DiversityTag = 
  | "Black-owned"
  | "Female-founded" 
  | "Latino-owned"
  | "LGBTQIA+-owned"
  | "Asian-owned"
  | "Native American-owned"
  | "Veteran-owned"
  | "Disability-owned";

export type BusinessCategory = 
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Retail"
  | "Manufacturing"
  | "Construction"
  | "Professional Services"
  | "Food & Beverage"
  | "Education"
  | "Transportation"
  | "Real Estate"
  | "Media & Entertainment"
  | "Non-profit"
  | "Other";

export interface BusinessFilters {
  search?: string;
  location?: string;
  category?: BusinessCategory;
  diversity?: DiversityTag[];
  minRating?: number;
  verified?: boolean;
}