import { useMemo } from 'react';
import { useBusinesses } from './useBusinesses';
import { mockBusinesses } from '@/data/mockBusinesses';
import { getUniqueCategories, getUniqueDiversityTags } from '@/lib/businessUtils';

/**
 * Custom hook for managing business data fetching with fallback logic.
 * Encapsulates API data fetching, mock data fallback, and metadata extraction.
 * 
 * @returns Business data, loading state, error state, and metadata
 */
export function useBusinessData() {
  const { data: apiBusinesses, isLoading, error } = useBusinesses();

  // Use API data if available, otherwise fall back to mock data
  const businesses = useMemo(() => {
    if (apiBusinesses && apiBusinesses.length > 0) {
      return apiBusinesses;
    }
    return mockBusinesses;
  }, [apiBusinesses]);

  const isUsingMockData = !apiBusinesses || apiBusinesses.length === 0;

  // Extract metadata for filters
  const availableCategories = useMemo(
    () => getUniqueCategories(businesses),
    [businesses]
  );

  const availableDiversityTags = useMemo(
    () => getUniqueDiversityTags(businesses),
    [businesses]
  );

  return {
    businesses,
    isLoading,
    error,
    isUsingMockData,
    availableCategories,
    availableDiversityTags,
  };
}
