import { Business, BusinessFilters } from "@/types/business";

/**
 * Filters an array of businesses based on provided filter criteria.
 * Implements defensive programming to handle null/undefined values gracefully.
 * 
 * @param businesses - Array of businesses to filter (can be null/undefined)
 * @param filters - Filter criteria to apply (can be null/undefined)
 * @returns Filtered array of businesses, or empty array if inputs are invalid
 * 
 * @example
 * const filtered = filterBusinesses(businesses, { category: 'Technology', minRating: 4.5 });
 * 
 * @example
 * // Handles null safely
 * const result = filterBusinesses(null, filters); // Returns []
 */
export function filterBusinesses(
  businesses: Business[] | null | undefined,
  filters: BusinessFilters | null | undefined
): Business[] {
  // Input validation - fail fast with clear feedback
  if (!businesses || !Array.isArray(businesses)) {
    console.warn('[filterBusinesses] Invalid businesses array provided:', businesses);
    return [];
  }

  // No filters means return all businesses
  if (!filters) {
    return businesses;
  }

  return businesses.filter((business) => {
    // Validate business object has required fields
    if (!business || typeof business !== 'object') {
      console.warn('[filterBusinesses] Invalid business object encountered:', business);
      return false;
    }

    // Search filter - defensive null checks on all string operations
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        (business.name?.toLowerCase() ?? '').includes(searchTerm) ||
        (business.description?.toLowerCase() ?? '').includes(searchTerm) ||
        (business.category?.toLowerCase() ?? '').includes(searchTerm) ||
        (business.tags?.some((tag) => tag?.toLowerCase().includes(searchTerm)) ?? false) ||
        (business.diversity?.some((tag) => tag?.toLowerCase().includes(searchTerm)) ?? false);

      if (!matchesSearch) return false;
    }

    // Location filter - guard against missing location object
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      const city = business.location?.city?.toLowerCase() ?? '';
      const state = business.location?.state?.toLowerCase() ?? '';
      const matchesLocation = city.includes(locationTerm) || state.includes(locationTerm);

      if (!matchesLocation) return false;
    }

    // Category filter - exact match with null safety
    if (filters.category && business.category !== filters.category) {
      return false;
    }

    // Diversity filter - handle empty arrays and null values
    if (filters.diversity && filters.diversity.length > 0) {
      const businessDiversity = business.diversity ?? [];
      const hasMatchingDiversity = filters.diversity.some((tag) =>
        businessDiversity.includes(tag)
      );
      if (!hasMatchingDiversity) return false;
    }

    // Rating filter - validate rating is a number
    if (filters.minRating !== undefined && filters.minRating !== null) {
      const rating = business.rating ?? 0;
      if (typeof rating !== 'number' || rating < filters.minRating) {
        return false;
      }
    }

    // Verified filter - explicit boolean check
    if (filters.verified !== undefined && business.verified !== filters.verified) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts an array of businesses by the specified criteria.
 * Creates a new array to avoid mutating the original.
 * 
 * @param businesses - Array of businesses to sort (can be null/undefined)
 * @param sortBy - Sort criteria: 'name', 'rating', 'reviews', or 'newest'
 * @returns Sorted array of businesses, or empty array if input is invalid
 * 
 * @example
 * const sorted = sortBusinesses(businesses, 'rating');
 */
export function sortBusinesses(
  businesses: Business[] | null | undefined,
  sortBy: 'name' | 'rating' | 'reviews' | 'newest'
): Business[] {
  // Input validation
  if (!businesses || !Array.isArray(businesses)) {
    console.warn('[sortBusinesses] Invalid businesses array provided:', businesses);
    return [];
  }

  if (!sortBy) {
    console.warn('[sortBusinesses] No sort criteria provided');
    return [...businesses];
  }

  // Create a copy to avoid mutating original array
  return [...businesses].sort((a, b) => {
    // Validate both items are valid business objects
    if (!a || !b) return 0;

    switch (sortBy) {
      case 'name': {
        const nameA = a.name ?? '';
        const nameB = b.name ?? '';
        return nameA.localeCompare(nameB);
      }
      case 'rating': {
        const ratingA = typeof a.rating === 'number' ? a.rating : 0;
        const ratingB = typeof b.rating === 'number' ? b.rating : 0;
        return ratingB - ratingA;
      }
      case 'reviews': {
        const reviewsA = typeof a.reviewCount === 'number' ? a.reviewCount : 0;
        const reviewsB = typeof b.reviewCount === 'number' ? b.reviewCount : 0;
        return reviewsB - reviewsA;
      }
      case 'newest': {
        const foundedA = typeof a.founded === 'number' ? a.founded : 0;
        const foundedB = typeof b.founded === 'number' ? b.founded : 0;
        return foundedB - foundedA;
      }
      default:
        console.warn('[sortBusinesses] Unknown sort criteria:', sortBy);
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
 * 
 * @example
 * const categories = getUniqueCategories(businesses);
 * // Returns: ['Finance', 'Healthcare', 'Technology']
 */
export function getUniqueCategories(businesses: Business[] | null | undefined): string[] {
  if (!businesses || !Array.isArray(businesses)) {
    console.warn('[getUniqueCategories] Invalid businesses array provided');
    return [];
  }

  const categories = businesses
    .map((b) => b?.category)
    .filter((category): category is string => typeof category === 'string' && category.length > 0);

  return Array.from(new Set(categories)).sort();
}

/**
 * Extracts unique diversity tags from all businesses.
 * Returns sorted array of diversity tag names.
 * 
 * @param businesses - Array of businesses (can be null/undefined)
 * @returns Sorted array of unique diversity tags
 * 
 * @example
 * const tags = getUniqueDiversityTags(businesses);
 * // Returns: ['Black-owned', 'Female-founded', 'Latino-owned']
 */
export function getUniqueDiversityTags(businesses: Business[] | null | undefined): string[] {
  if (!businesses || !Array.isArray(businesses)) {
    console.warn('[getUniqueDiversityTags] Invalid businesses array provided');
    return [];
  }

  const tags = businesses
    .flatMap((b) => b?.diversity ?? [])
    .filter((tag): tag is string => typeof tag === 'string' && tag.length > 0);

  return Array.from(new Set(tags)).sort();
}

/**
 * Formats a business location as "City, State".
 * Handles missing location data gracefully.
 * 
 * @param business - Business object (can be null/undefined)
 * @returns Formatted location string or fallback message
 * 
 * @example
 * formatLocation(business); // "San Francisco, CA"
 * formatLocation(null); // "Location not specified"
 */
export function formatLocation(business: Business | null | undefined): string {
  if (!business || !business.location) {
    return 'Location not specified';
  }

  const city = business.location.city ?? 'Unknown';
  const state = business.location.state ?? 'Unknown';

  return `${city}, ${state}`;
}

/**
 * Formats employee count for display.
 * 
 * @param employees - Employee count string (e.g., "50-100")
 * @returns Formatted employee count string
 * 
 * @example
 * formatEmployeeCount("50-100"); // "50-100 employees"
 * formatEmployeeCount(null); // "Not specified"
 */
export function formatEmployeeCount(employees?: string | null): string {
  if (!employees || typeof employees !== 'string') {
    return 'Not specified';
  }
  return `${employees} employees`;
}

/**
 * Formats revenue for display.
 * 
 * @param revenue - Revenue string (e.g., "$5M-$10M")
 * @returns Formatted revenue string
 * 
 * @example
 * formatRevenue("$5M-$10M"); // "$5M-$10M"
 * formatRevenue(null); // "Not disclosed"
 */
export function formatRevenue(revenue?: string | null): string {
  if (!revenue || typeof revenue !== 'string') {
    return 'Not disclosed';
  }
  return revenue;
}