import { describe, it, expect } from 'vitest';
import {
  filterBusinesses,
  sortBusinesses,
  getUniqueCategories,
  getUniqueDiversityTags,
  formatLocation,
  formatEmployeeCount,
  formatRevenue,
} from './businessUtils';
import { Business } from '@/types/business';

const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    description: 'Cloud infrastructure',
    category: 'Technology',
    location: { city: 'San Francisco', state: 'CA' },
    contact: {},
    diversity: ['Black-owned', 'Female-founded'],
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    founded: 2018,
  },
  {
    id: '2',
    name: 'Verde Packaging',
    description: 'Sustainable packaging',
    category: 'Manufacturing',
    location: { city: 'Austin', state: 'TX' },
    contact: {},
    diversity: ['Latino-owned'],
    rating: 4.9,
    reviewCount: 89,
    verified: true,
    founded: 2020,
  },
  {
    id: '3',
    name: 'Prism Creative',
    description: 'Digital design',
    category: 'Professional Services',
    location: { city: 'New York', state: 'NY' },
    contact: {},
    diversity: ['LGBTQIA+-owned'],
    rating: 4.7,
    reviewCount: 156,
    verified: false,
    founded: 2016,
  },
];

describe('filterBusinesses', () => {
  it('returns all businesses when no filters applied', () => {
    const result = filterBusinesses(mockBusinesses, {});
    expect(result).toHaveLength(3);
  });

  it('filters by category', () => {
    const result = filterBusinesses(mockBusinesses, { category: 'Technology' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('TechFlow Solutions');
  });

  it('filters by search term in name', () => {
    const result = filterBusinesses(mockBusinesses, { search: 'cloud' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('TechFlow Solutions');
  });

  it('filters by search term in description', () => {
    const result = filterBusinesses(mockBusinesses, { search: 'sustainable' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Verde Packaging');
  });

  it('filters by location city', () => {
    const result = filterBusinesses(mockBusinesses, { location: 'Austin' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Verde Packaging');
  });

  it('filters by location state', () => {
    const result = filterBusinesses(mockBusinesses, { location: 'CA' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('TechFlow Solutions');
  });

  it('filters by diversity tag', () => {
    const result = filterBusinesses(mockBusinesses, { diversity: ['Latino-owned'] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Verde Packaging');
  });

  it('filters by multiple diversity tags', () => {
    const result = filterBusinesses(mockBusinesses, { 
      diversity: ['Black-owned', 'Latino-owned'] 
    });
    expect(result).toHaveLength(2);
  });

  it('filters by minimum rating', () => {
    const result = filterBusinesses(mockBusinesses, { minRating: 4.85 });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Verde Packaging');
  });

  it('filters by verified status true', () => {
    const result = filterBusinesses(mockBusinesses, { verified: true });
    expect(result).toHaveLength(2);
  });

  it('filters by verified status false', () => {
    const result = filterBusinesses(mockBusinesses, { verified: false });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Prism Creative');
  });

  it('combines multiple filters', () => {
    const result = filterBusinesses(mockBusinesses, {
      category: 'Technology',
      minRating: 4.5,
      verified: true,
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('TechFlow Solutions');
  });

  it('returns empty array when no matches', () => {
    const result = filterBusinesses(mockBusinesses, { category: 'Nonexistent' });
    expect(result).toHaveLength(0);
  });
});

describe('sortBusinesses', () => {
  it('sorts by name alphabetically', () => {
    const result = sortBusinesses(mockBusinesses, 'name');
    expect(result[0].name).toBe('Prism Creative');
    expect(result[1].name).toBe('TechFlow Solutions');
    expect(result[2].name).toBe('Verde Packaging');
  });

  it('sorts by rating descending', () => {
    const result = sortBusinesses(mockBusinesses, 'rating');
    expect(result[0].rating).toBe(4.9);
    expect(result[1].rating).toBe(4.8);
    expect(result[2].rating).toBe(4.7);
  });

  it('sorts by review count descending', () => {
    const result = sortBusinesses(mockBusinesses, 'reviews');
    expect(result[0].reviewCount).toBe(156);
    expect(result[1].reviewCount).toBe(124);
    expect(result[2].reviewCount).toBe(89);
  });

  it('sorts by founded year descending (newest first)', () => {
    const result = sortBusinesses(mockBusinesses, 'newest');
    expect(result[0].founded).toBe(2020);
    expect(result[1].founded).toBe(2018);
    expect(result[2].founded).toBe(2016);
  });

  it('does not mutate original array', () => {
    const original = [...mockBusinesses];
    sortBusinesses(mockBusinesses, 'name');
    expect(mockBusinesses).toEqual(original);
  });

  it('handles empty array', () => {
    const result = sortBusinesses([], 'name');
    expect(result).toEqual([]);
  });
});

describe('getUniqueCategories', () => {
  it('returns unique categories sorted alphabetically', () => {
    const result = getUniqueCategories(mockBusinesses);
    expect(result).toEqual(['Manufacturing', 'Professional Services', 'Technology']);
  });

  it('handles empty array', () => {
    const result = getUniqueCategories([]);
    expect(result).toEqual([]);
  });

  it('removes duplicates', () => {
    const duplicates = [...mockBusinesses, mockBusinesses[0]];
    const result = getUniqueCategories(duplicates);
    expect(result).toHaveLength(3);
  });
});

describe('getUniqueDiversityTags', () => {
  it('returns unique diversity tags sorted alphabetically', () => {
    const result = getUniqueDiversityTags(mockBusinesses);
    expect(result).toEqual(['Black-owned', 'Female-founded', 'LGBTQIA+-owned', 'Latino-owned']);
  });

  it('handles empty array', () => {
    const result = getUniqueDiversityTags([]);
    expect(result).toEqual([]);
  });

  it('flattens multiple tags from multiple businesses', () => {
    const result = getUniqueDiversityTags(mockBusinesses);
    expect(result).toHaveLength(4);
  });
});

describe('formatLocation', () => {
  it('formats location correctly', () => {
    const result = formatLocation(mockBusinesses[0]);
    expect(result).toBe('San Francisco, CA');
  });

  it('formats different locations', () => {
    const result1 = formatLocation(mockBusinesses[1]);
    expect(result1).toBe('Austin, TX');
    
    const result2 = formatLocation(mockBusinesses[2]);
    expect(result2).toBe('New York, NY');
  });
});

describe('formatEmployeeCount', () => {
  it('formats employee count correctly', () => {
    const result = formatEmployeeCount('50-100');
    expect(result).toBe('50-100 employees');
  });

  it('handles undefined gracefully', () => {
    const result = formatEmployeeCount(undefined);
    expect(result).toBe('Not specified');
  });

  it('handles empty string', () => {
    const result = formatEmployeeCount('');
    expect(result).toBe('Not specified');
  });
});

describe('formatRevenue', () => {
  it('formats revenue correctly', () => {
    const result = formatRevenue('$5M-$10M');
    expect(result).toBe('$5M-$10M');
  });

  it('handles undefined gracefully', () => {
    const result = formatRevenue(undefined);
    expect(result).toBe('Not disclosed');
  });

  it('handles empty string', () => {
    const result = formatRevenue('');
    expect(result).toBe('Not disclosed');
  });
});
