import { Business } from "@/types/business";

export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "TechFlow Solutions",
    description: "Leading cloud infrastructure and AI solutions provider specializing in scalable enterprise applications and machine learning platforms.",
    category: "Technology",
    location: {
      city: "San Francisco",
      state: "CA",
      address: "123 Innovation Drive"
    },
    contact: {
      email: "contact@techflow.com",
      phone: "(415) 555-0123",
      website: "https://techflow.com"
    },
    diversity: ["Black-owned", "Female-founded"],
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
    name: "Verde Packaging Co",
    description: "Sustainable packaging solutions and eco-friendly business consulting for companies looking to reduce their environmental impact.",
    category: "Manufacturing",
    location: {
      city: "Austin",
      state: "TX",
      address: "456 Green Street"
    },
    contact: {
      email: "info@verdepackaging.com",
      phone: "(512) 555-0456",
      website: "https://verdepackaging.com"
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
    name: "Prism Creative Studio",
    description: "Award-winning branding and digital design agency specializing in inclusive design and multicultural marketing campaigns.",
    category: "Professional Services",
    location: {
      city: "New York",
      state: "NY",
      address: "789 Design Avenue"
    },
    contact: {
      email: "hello@prismcreative.com",
      phone: "(212) 555-0789",
      website: "https://prismcreative.com"
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
    name: "MedTech Innovations",
    description: "Healthcare technology solutions focusing on telemedicine platforms and medical device integration for underserved communities.",
    category: "Healthcare",
    location: {
      city: "Atlanta",
      state: "GA",
      address: "321 Health Plaza"
    },
    contact: {
      email: "contact@medtechinnovations.com",
      phone: "(404) 555-0321",
      website: "https://medtechinnovations.com"
    },
    diversity: ["Black-owned"],
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
    name: "Sakura Financial Advisors",
    description: "Comprehensive financial planning and investment advisory services with expertise in small business financing and retirement planning.",
    category: "Finance",
    location: {
      city: "Seattle",
      state: "WA",
      address: "654 Financial Center"
    },
    contact: {
      email: "advisors@sakurafinancial.com",
      phone: "(206) 555-0654",
      website: "https://sakurafinancial.com"
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
    name: "Urban Harvest Market",
    description: "Organic grocery store and community market featuring locally-sourced produce and products from minority-owned suppliers.",
    category: "Retail",
    location: {
      city: "Chicago",
      state: "IL",
      address: "987 Market Street"
    },
    contact: {
      email: "info@urbanharvest.com",
      phone: "(312) 555-0987",
      website: "https://urbanharvest.com"
    },
    diversity: ["Black-owned"],
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
    name: "Phoenix Construction Group",
    description: "Commercial and residential construction company specializing in sustainable building practices and LEED-certified projects.",
    category: "Construction",
    location: {
      city: "Phoenix",
      state: "AZ",
      address: "147 Builder's Way"
    },
    contact: {
      email: "projects@phoenixconstruction.com",
      phone: "(602) 555-0147",
      website: "https://phoenixconstruction.com"
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
    name: "Spice Route Catering",
    description: "Premium catering services specializing in fusion cuisine and corporate events with a focus on authentic international flavors.",
    category: "Food & Beverage",
    location: {
      city: "Miami",
      state: "FL",
      address: "258 Culinary Boulevard"
    },
    contact: {
      email: "events@spiceroute.com",
      phone: "(305) 555-0258",
      website: "https://spiceroute.com"
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