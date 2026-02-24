import { Business, BusinessFilters } from "@/types/business";

export function filterBusinesses(businesses: Business[], filters: BusinessFilters): Business[] {
  return businesses.filter(business => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        business.name.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm) ||
        business.category.toLowerCase().includes(searchTerm) ||
        business.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        business.diversity.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      const matchesLocation = 
        business.location.city.toLowerCase().includes(locationTerm) ||
        business.location.state.toLowerCase().includes(locationTerm);
      
      if (!matchesLocation) return false;
    }

    // Category filter
    if (filters.category && business.category !== filters.category) {
      return false;
    }

    // Diversity filter
    if (filters.diversity && filters.diversity.length > 0) {
      const hasMatchingDiversity = filters.diversity.some(tag => 
        business.diversity.includes(tag)
      );
      if (!hasMatchingDiversity) return false;
    }

    // Rating filter
    if (filters.minRating && business.rating < filters.minRating) {
      return false;
    }

    // Verified filter
    if (filters.verified !== undefined && business.verified !== filters.verified) {
      return false;
    }

    return true;
  });
}

export function sortBusinesses(businesses: Business[], sortBy: 'name' | 'rating' | 'reviews' | 'newest'): Business[] {
  return [...businesses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'newest':
        return (b.founded || 0) - (a.founded || 0);
      default:
        return 0;
    }
  });
}

export function getUniqueCategories(businesses: Business[]): string[] {
  const categories = businesses.map(b => b.category);
  return Array.from(new Set(categories)).sort();
}

export function getUniqueDiversityTags(businesses: Business[]): string[] {
  const tags = businesses.flatMap(b => b.diversity);
  return Array.from(new Set(tags)).sort();
}

export function formatLocation(business: Business): string {
  return `${business.location.city}, ${business.location.state}`;
}

export function formatEmployeeCount(employees?: string): string {
  if (!employees) return 'Not specified';
  return `${employees} employees`;
}

export function formatRevenue(revenue?: string): string {
  if (!revenue) return 'Not disclosed';
  return revenue;
}