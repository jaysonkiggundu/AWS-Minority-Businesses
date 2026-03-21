import { Business } from "@/types/business";

export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Apex Cloud Labs",
    description: "Fictional cloud infrastructure and AI solutions provider specializing in scalable enterprise applications and machine learning platforms.",
    category: "Technology",
    location: {
      city: "San Francisco",
      state: "CA",
      address: "100 Placeholder Drive"
    },
    contact: {
      email: "contact@example-apexcloudlabs.fake",
      phone: "(415) 555-0101",
      website: "https://example.com"
    },
    diversity: ["Minority-owned", "Female-founded"],
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    founded: 2018,
    employees: "50-100",
    revenue: "$5M-$10M",
    tags: ["Cloud Computing", "AI/ML", "Enterprise Software"]
  },
  {
    id: "2",
    name: "Greenleaf Packaging Co",
    description: "Fictional sustainable packaging solutions and eco-friendly business consulting for companies looking to reduce their environmental impact.",
    category: "Manufacturing",
    location: {
      city: "Austin",
      state: "TX",
      address: "200 Placeholder Street"
    },
    contact: {
      email: "info@example-greenleafpkg.fake",
      phone: "(512) 555-0202",
      website: "https://example.com"
    },
    diversity: ["Latino-owned"],
    rating: 4.9,
    reviewCount: 89,
    verified: true,
    founded: 2020,
    employees: "25-50",
    revenue: "$1M-$5M",
    tags: ["Sustainability", "Packaging", "Consulting"]
  },
  {
    id: "3",
    name: "Mosaic Creative Studio",
    description: "Fictional branding and digital design agency specializing in inclusive design and multicultural marketing campaigns.",
    category: "Professional Services",
    location: {
      city: "New York",
      state: "NY",
      address: "300 Placeholder Avenue"
    },
    contact: {
      email: "hello@example-mosaiccreative.fake",
      phone: "(212) 555-0303",
      website: "https://example.com"
    },
    diversity: ["LGBTQIA+-owned", "Female-founded"],
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    founded: 2016,
    employees: "10-25",
    revenue: "$2M-$5M",
    tags: ["Branding", "Digital Design", "Marketing"]
  },
  {
    id: "4",
    name: "CareLink Health Tech",
    description: "Fictional healthcare technology solutions focusing on telemedicine platforms and medical device integration for underserved communities.",
    category: "Healthcare",
    location: {
      city: "Atlanta",
      state: "GA",
      address: "400 Placeholder Plaza"
    },
    contact: {
      email: "contact@example-carelinkhealth.fake",
      phone: "(404) 555-0404",
      website: "https://example.com"
    },
    diversity: ["Minority-owned"],
    rating: 4.6,
    reviewCount: 78,
    verified: true,
    founded: 2019,
    employees: "25-50",
    revenue: "$3M-$5M",
    tags: ["Telemedicine", "Medical Devices", "Healthcare IT"]
  },
  {
    id: "5",
    name: "Horizon Financial Group",
    description: "Fictional comprehensive financial planning and investment advisory services with expertise in small business financing and retirement planning.",
    category: "Finance",
    location: {
      city: "Seattle",
      state: "WA",
      address: "500 Placeholder Center"
    },
    contact: {
      email: "advisors@example-horizonfinancial.fake",
      phone: "(206) 555-0505",
      website: "https://example.com"
    },
    diversity: ["Asian-owned", "Female-founded"],
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    founded: 2015,
    employees: "10-25",
    revenue: "$2M-$5M",
    tags: ["Financial Planning", "Investment Advisory", "Small Business"]
  },
  {
    id: "6",
    name: "Roots Community Market",
    description: "Fictional organic grocery store and community market featuring locally-sourced produce and products from minority-owned suppliers.",
    category: "Retail",
    location: {
      city: "Chicago",
      state: "IL",
      address: "600 Placeholder Market"
    },
    contact: {
      email: "info@example-rootsmarket.fake",
      phone: "(312) 555-0606",
      website: "https://example.com"
    },
    diversity: ["Minority-owned"],
    rating: 4.5,
    reviewCount: 342,
    verified: true,
    founded: 2017,
    employees: "50-100",
    revenue: "$5M-$10M",
    tags: ["Organic", "Local Sourcing", "Community Market"]
  },
  {
    id: "7",
    name: "Ironwood Construction Group",
    description: "Fictional commercial and residential construction company specializing in sustainable building practices and LEED-certified projects.",
    category: "Construction",
    location: {
      city: "Phoenix",
      state: "AZ",
      address: "700 Placeholder Way"
    },
    contact: {
      email: "projects@example-ironwoodconstruction.fake",
      phone: "(602) 555-0707",
      website: "https://example.com"
    },
    diversity: ["Latino-owned", "Veteran-owned"],
    rating: 4.8,
    reviewCount: 95,
    verified: true,
    founded: 2012,
    employees: "100-250",
    revenue: "$10M-$25M",
    tags: ["Sustainable Building", "LEED Certified", "Commercial"]
  },
  {
    id: "8",
    name: "Saffron Table Catering",
    description: "Fictional premium catering services specializing in fusion cuisine and corporate events with a focus on authentic international flavors.",
    category: "Food & Beverage",
    location: {
      city: "Miami",
      state: "FL",
      address: "800 Placeholder Boulevard"
    },
    contact: {
      email: "events@example-saffroncatering.fake",
      phone: "(305) 555-0808",
      website: "https://example.com"
    },
    diversity: ["Asian-owned", "Female-founded"],
    rating: 4.7,
    reviewCount: 167,
    verified: true,
    founded: 2019,
    employees: "25-50",
    revenue: "$1M-$2M",
    tags: ["Fusion Cuisine", "Corporate Catering", "International"]
  }
];
