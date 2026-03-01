import { useState, useMemo } from 'react';
import { Business, BusinessFilters } from '@/types/business';
import { filterBusinesses, sortBusinesses } from '@/lib/businessUtils';

/**
 * Custom hook for managing business filtering and sorting logic.
 * Separates data transformation concerns from UI rendering.
 * 
 * @param businesses - Array of businesses to filter and sort
 * @returns Filtered/sorted businesses and control functions
 */
export function useBusinessFiltering(businesses: Business[]) {
  const [filters, setFilters] = useState<BusinessFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'newest'>('rating');

  const filteredAndSortedBusinesses = useMemo(() => {
    const filtered = filterBusinesses(businesses, filters);
    return sortBusinesses(filtered, sortBy);
  }, [businesses, filters, sortBy]);

  const clearFilters = () => setFilters({});

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredBusinesses: filteredAndSortedBusinesses,
    clearFilters,
    totalCount: businesses.length,
    filteredCount: filteredAndSortedBusinesses.length,
  };
}
