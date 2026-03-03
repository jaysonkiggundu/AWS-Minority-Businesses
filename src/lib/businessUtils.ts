import { Business, BusinessFilters } from "@/types/business";

/**
 * Filters businesses based on provided filters.
 * @throws {TypeError} If businesses is not an array or filters is not an object.
 */
export function filterBusinesses(businesses: Business[], filters: BusinessFilters): Business[] {
  if (!Array.isArray(businesses)) {
    throw new TypeError("Expected businesses to be an array.");
  }
  if (typeof filters !== "object" || filters === null) {
    throw new TypeError("Expected filters to be an object.");
  }

  return businesses.filter(business => {
    // Defensive checks for required business fields
    if (!business.name || !business.description || !business.category || !business.location || !business.diversity) {
      return false;
    }

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
        business.location.city?.toLowerCase().includes(locationTerm) ||
        business.location.state?.toLowerCase().includes(locationTerm);
      
      if (!matchesLocation) return false;
    }

    // Category filter
    if (filters.category && business.category !== filters.category) {
      return false;
    }

    // Diversity filter
    if (filters.diversity && Array.isArray(filters.diversity) && filters.diversity.length > 0) {
      const hasMatchingDiversity = filters.diversity.some(tag => 
        business.diversity.includes(tag)
      );
      if (!hasMatchingDiversity) return false;
    }

    // Rating filter
    if (filters.minRating && typeof business.rating === "number" && business.rating < filters.minRating) {
      return false;
    }

    // Verified filter
    if (filters.verified !== undefined && business.verified !== filters.verified) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts businesses by the specified field.
 * @throws {TypeError} If businesses is not an array or sortBy is not a valid string.
 */
export function sortBusinesses(businesses: Business[], sortBy: 'name' | 'rating' | 'reviews' | 'newest'): Business[] {
  if (!Array.isArray(businesses)) {
    throw new TypeError("Expected businesses to be an array.");
  }
  if (!['name', 'rating', 'reviews', 'newest'].includes(sortBy)) {
    throw new TypeError("Invalid sortBy value.");
  }

  return [...businesses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'newest':
        return (b.founded || 0) - (a.founded || 0);
      default:
        return 0;
    }
  });
}

/**
 * Gets unique categories from businesses.
 * @throws {TypeError} If businesses is not an array.
 */
export function getUniqueCategories(businesses: Business[]): string[] {
  if (!Array.isArray(businesses)) {
    throw new TypeError("Expected businesses to be an array.");
  }
  const categories = businesses.map(b => b.category).filter(Boolean);
  return Array.from(new Set(categories)).sort();
}

/**
 * Gets unique diversity tags from businesses.
 * @throws {TypeError} If businesses is not an array.
 */
export function getUniqueDiversityTags(businesses: Business[]): string[] {
  if (!Array.isArray(businesses)) {
    throw new TypeError("Expected businesses to be an array.");
  }
  const tags = businesses.flatMap(b => Array.isArray(b.diversity) ? b.diversity : []);
  return Array.from(new Set(tags)).sort();
}

/**
 * Formats the location of a business.
 * @throws {TypeError} If business.location is missing or invalid.
 */
export function formatLocation(business: Business): string {
  if (!business.location || !business.location.city || !business.location.state) {
    throw new TypeError("Business location is incomplete.");
  }
  return `${business.location.city}, ${business.location.state}`;
}

/**
 * Formats the employee count.
 */
export function formatEmployeeCount(employees?: string): string {
  if (!employees) return 'Not specified';
  return `${employees} employees`;
}

/**
 * Formats the revenue.
 */
export function formatRevenue(revenue?: string): string {
  if (!revenue) return 'Not disclosed';
  return revenue;
}