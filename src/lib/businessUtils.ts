import { Business, BusinessFilters, BusinessCategory, DiversityTag } from "@/types/business";

export type BusinessSortOption = 'name' | 'rating' | 'reviews' | 'newest';

/**
 * Filters businesses based on search, location, category, diversity, rating, and verification status.
 * Returns businesses that match ALL specified filter criteria.
 * 
 * @param businesses - Array of businesses to filter (can be null/undefined)
 * @param filters - Filter criteria to apply
 * @returns Filtered array of businesses matching all criteria
 * @throws {TypeError} If businesses is not an array (returns empty array instead of throwing)
 * 
 * @example
 * const filtered = filterBusinesses(businesses, {
 *   search: 'tech',
 *   category: 'Technology',
 *   minRating: 4.0
 * });
 * // Returns: businesses matching all criteria
 */
export function filterBusinesses(businesses: Business[], filters: BusinessFilters): Business[] {
  if (!Array.isArray(businesses)) {
    console.warn('filterBusinesses: businesses must be an array');
    return [];
  }
  if (businesses.length === 0) return [];
  if (!filters || typeof filters !== 'object' || Object.keys(filters).length === 0) {
    return businesses;
  }

  return businesses.filter(business => {
    if (!business?.id || !business?.name) return false;

    // Search filter - matches name, description, category, tags, diversity
    if (filters.search?.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      const matchesSearch = 
        business.name?.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.category?.toLowerCase().includes(searchTerm) ||
        business.tags?.some(tag => tag?.toLowerCase().includes(searchTerm)) ||
        business.diversity?.some(tag => tag?.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Location filter - matches city or state
    if (filters.location?.trim()) {
      const locationTerm = filters.location.toLowerCase().trim();
      const matchesLocation = 
        business.location?.city?.toLowerCase().includes(locationTerm) ||
        business.location?.state?.toLowerCase().includes(locationTerm);
      
      if (!matchesLocation) return false;
    }

    // Category filter - exact match
    if (filters.category && business.category !== filters.category) {
      return false;
    }

    // Diversity filter - must have at least one matching tag
    if (filters.diversity && filters.diversity.length > 0) {
      const hasMatchingDiversity = filters.diversity.some(tag => 
        business.diversity?.includes(tag)
      );
      if (!hasMatchingDiversity) return false;
    }

    // Rating filter - must meet minimum
    if (typeof filters.minRating === 'number' && (business.rating ?? 0) < filters.minRating) {
      return false;
    }

    // Verified filter - exact boolean match
    if (typeof filters.verified === 'boolean' && business.verified !== filters.verified) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts businesses by the specified criteria.
 * Returns a new array (does not mutate the original).
 * 
 * @param businesses - Array of businesses to sort (can be null/undefined)
 * @param sortBy - Sort criteria: 'name', 'rating', 'reviews', or 'newest'
 * @returns New sorted array of businesses
 * @throws {TypeError} If businesses is not an array (returns empty array instead of throwing)
 * 
 * @example
 * const sorted = sortBusinesses(businesses, 'rating');
 * // Returns: businesses sorted by rating (highest first)
 */
export function sortBusinesses(businesses: Business[], sortBy: BusinessSortOption): Business[] {
  if (!Array.isArray(businesses)) {
    console.warn('sortBusinesses: businesses must be an array');
    return [];
  }
  if (businesses.length === 0) return [];

  return [...businesses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a?.name ?? '').localeCompare(b?.name ?? '');
      case 'rating':
        return (b?.rating ?? 0) - (a?.rating ?? 0);
      case 'reviews':
        return (b?.reviewCount ?? 0) - (a?.reviewCount ?? 0);
      case 'newest':
        return (b?.founded ?? 0) - (a?.founded ?? 0);
      default:
        console.warn(`sortBusinesses: unknown sort option "${sortBy}"`);
        return 0;
    }
  });
}

/**
 * Extracts unique categories from an array of businesses.
 * Returns sorted array of category names.
 * 
 * @param businesses - Array of businesses (can be null/undefined)
 * @returns Sorted array of unique category names
 * @throws {TypeError} If businesses is not an array (returns empty array instead of throwing)
 * 
 * @example
 * const categories = getUniqueCategories(businesses);
 * // Returns: ['Finance', 'Healthcare', 'Technology']
 */
export function getUniqueCategories(businesses: Business[]): BusinessCategory[] {
  if (!Array.isArray(businesses)) {
    console.warn('getUniqueCategories: businesses must be an array');
    return [];
  }
  if (businesses.length === 0) return [];

  const categories = businesses
    .map(b => b?.category)
    .filter((c): c is BusinessCategory => Boolean(c));

  return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
}

/**
 * Extracts unique diversity tags from an array of businesses.
 * Returns sorted array of diversity tag names.
 * 
 * @param businesses - Array of businesses (can be null/undefined)
 * @returns Sorted array of unique diversity tags
 * @throws {TypeError} If businesses is not an array (returns empty array instead of throwing)
 * 
 * @example
 * const tags = getUniqueDiversityTags(businesses);
 * // Returns: ['Asian-owned', 'Black-owned', 'Female-founded']
 */
export function getUniqueDiversityTags(businesses: Business[]): DiversityTag[] {
  if (!Array.isArray(businesses)) {
    console.warn('getUniqueDiversityTags: businesses must be an array');
    return [];
  }
  if (businesses.length === 0) return [];

  const tags = businesses
    .flatMap(b => b?.diversity ?? [])
    .filter((t): t is DiversityTag => Boolean(t));

  return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
}

/**
 * Formats a business location as "City, State".
 * Handles missing or incomplete location data gracefully.
 * 
 * @param business - The business containing location data (can be null/undefined)
 * @returns Formatted location string, or "Location unavailable" if missing
 * 
 * @example
 * const location = formatLocation(business);
 * // Returns: 'Austin, TX'
 */
export function formatLocation(business: Business | null | undefined): string {
  if (!business?.location) {
    return 'Location unavailable';
  }

  const city = business.location.city?.trim() ?? '';
  const state = business.location.state?.trim() ?? '';

  if (!city && !state) return 'Location unavailable';
  if (!city) return state;
  if (!state) return city;

  return `${city}, ${state}`;
}

/**
 * Formats employee count for display.
 * Appends "employees" suffix to the count string.
 * 
 * @param employees - Employee count string (can be null/undefined)
 * @returns Formatted string with "employees" suffix, or "Not specified" if empty
 * 
 * @example
 * const count = formatEmployeeCount('50-100');
 * // Returns: '50-100 employees'
 */
export function formatEmployeeCount(employees: string | null | undefined): string {
  const trimmed = employees?.trim();
  if (!trimmed) return 'Not specified';
  return `${trimmed} employees`;
}

/**
 * Formats revenue for display.
 * Returns the revenue string or a placeholder if not available.
 * 
 * @param revenue - Revenue string (can be null/undefined)
 * @returns Revenue string, or "Not disclosed" if empty
 * 
 * @example
 * const revenue = formatRevenue('$1M - $5M');
 * // Returns: '$1M - $5M'
 */
export function formatRevenue(revenue: string | null | undefined): string {
  const trimmed = revenue?.trim();
  return trimmed || 'Not disclosed';
}
