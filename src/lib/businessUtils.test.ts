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

const createBusiness = (overrides: Partial<Business> = {}): Business => ({
  id: '1',
  name: 'Test Business',
  description: 'A test business description',
  category: 'Technology',
  location: { city: 'Austin', state: 'TX' },
  contact: { email: 'test@test.com' },
  diversity: ['Black-owned'],
  rating: 4.5,
  reviewCount: 100,
  verified: true,
  ...overrides,
});

const mockBusinesses: Business[] = [
  createBusiness({ id: '1', name: 'Alpha Tech', category: 'Technology', rating: 4.5, reviewCount: 100, founded: 2020 }),
  createBusiness({ id: '2', name: 'Beta Health', category: 'Healthcare', rating: 4.0, reviewCount: 50, founded: 2018, diversity: ['Female-founded'] }),
  createBusiness({ id: '3', name: 'Gamma Finance', category: 'Finance', rating: 4.8, reviewCount: 200, founded: 2022, location: { city: 'New York', state: 'NY' } }),
  createBusiness({ id: '4', name: 'Delta Retail', category: 'Retail', rating: 3.5, reviewCount: 25, founded: 2015, verified: false }),
];

describe('filterBusinesses', () => {
  describe('input validation', () => {
    it('returns empty array for null input', () => {
      expect(filterBusinesses(null as any, {})).toEqual([]);
    });

    it('returns empty array for undefined input', () => {
      expect(filterBusinesses(undefined as any, {})).toEqual([]);
    });

    it('returns empty array for non-array input', () => {
      expect(filterBusinesses('not an array' as any, {})).toEqual([]);
    });

    it('returns empty array for empty businesses array', () => {
      expect(filterBusinesses([], {})).toEqual([]);
    });

    it('returns all businesses when filters are empty', () => {
      expect(filterBusinesses(mockBusinesses, {})).toEqual(mockBusinesses);
    });

    it('returns all businesses when filters is null', () => {
      expect(filterBusinesses(mockBusinesses, null as any)).toEqual(mockBusinesses);
    });
  });

  describe('search filter', () => {
    it('filters by name (case-insensitive)', () => {
      const result = filterBusinesses(mockBusinesses, { search: 'alpha' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alpha Tech');
    });

    it('filters by category', () => {
      const result = filterBusinesses(mockBusinesses, { search: 'healthcare' });
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Healthcare');
    });

    it('filters by description', () => {
      const result = filterBusinesses(mockBusinesses, { search: 'test business' });
      expect(result).toHaveLength(4);
    });

    it('ignores whitespace-only search', () => {
      const result = filterBusinesses(mockBusinesses, { search: '   ' });
      expect(result).toHaveLength(4);
    });
  });

  describe('location filter', () => {
    it('filters by city', () => {
      const result = filterBusinesses(mockBusinesses, { location: 'Austin' });
      expect(result).toHaveLength(3);
    });

    it('filters by state', () => {
      const result = filterBusinesses(mockBusinesses, { location: 'NY' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Gamma Finance');
    });

    it('is case-insensitive', () => {
      const result = filterBusinesses(mockBusinesses, { location: 'new york' });
      expect(result).toHaveLength(1);
    });
  });

  describe('category filter', () => {
    it('filters by exact category match', () => {
      const result = filterBusinesses(mockBusinesses, { category: 'Technology' });
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Technology');
    });

    it('returns empty for non-matching category', () => {
      const result = filterBusinesses(mockBusinesses, { category: 'Non-profit' });
      expect(result).toHaveLength(0);
    });
  });

  describe('diversity filter', () => {
    it('filters by single diversity tag', () => {
      const result = filterBusinesses(mockBusinesses, { diversity: ['Female-founded'] });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Beta Health');
    });

    it('filters by multiple diversity tags (OR logic)', () => {
      const result = filterBusinesses(mockBusinesses, { diversity: ['Black-owned', 'Female-founded'] });
      expect(result).toHaveLength(4);
    });
  });

  describe('rating filter', () => {
    it('filters by minimum rating', () => {
      const result = filterBusinesses(mockBusinesses, { minRating: 4.5 });
      expect(result).toHaveLength(2);
    });

    it('excludes businesses below minimum rating', () => {
      const result = filterBusinesses(mockBusinesses, { minRating: 5.0 });
      expect(result).toHaveLength(0);
    });
  });

  describe('verified filter', () => {
    it('filters for verified businesses only', () => {
      const result = filterBusinesses(mockBusinesses, { verified: true });
      expect(result).toHaveLength(3);
    });

    it('filters for unverified businesses only', () => {
      const result = filterBusinesses(mockBusinesses, { verified: false });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Delta Retail');
    });
  });

  describe('combined filters', () => {
    it('applies multiple filters (AND logic)', () => {
      const result = filterBusinesses(mockBusinesses, {
        category: 'Technology',
        minRating: 4.0,
        verified: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alpha Tech');
    });
  });
});

describe('sortBusinesses', () => {
  describe('input validation', () => {
    it('returns empty array for null input', () => {
      expect(sortBusinesses(null as any, 'name')).toEqual([]);
    });

    it('returns empty array for empty array', () => {
      expect(sortBusinesses([], 'name')).toEqual([]);
    });
  });

  describe('sort by name', () => {
    it('sorts alphabetically A-Z', () => {
      const result = sortBusinesses(mockBusinesses, 'name');
      expect(result[0].name).toBe('Alpha Tech');
      expect(result[3].name).toBe('Gamma Finance');
    });

    it('does not mutate original array', () => {
      const original = [...mockBusinesses];
      sortBusinesses(mockBusinesses, 'name');
      expect(mockBusinesses).toEqual(original);
    });
  });

  describe('sort by rating', () => {
    it('sorts by rating descending (highest first)', () => {
      const result = sortBusinesses(mockBusinesses, 'rating');
      expect(result[0].name).toBe('Gamma Finance');
      expect(result[0].rating).toBe(4.8);
      expect(result[3].rating).toBe(3.5);
    });
  });

  describe('sort by reviews', () => {
    it('sorts by review count descending (most first)', () => {
      const result = sortBusinesses(mockBusinesses, 'reviews');
      expect(result[0].reviewCount).toBe(200);
      expect(result[3].reviewCount).toBe(25);
    });
  });

  describe('sort by newest', () => {
    it('sorts by founded year descending (newest first)', () => {
      const result = sortBusinesses(mockBusinesses, 'newest');
      expect(result[0].founded).toBe(2022);
      expect(result[3].founded).toBe(2015);
    });
  });
});

describe('getUniqueCategories', () => {
  it('returns empty array for null input', () => {
    expect(getUniqueCategories(null as any)).toEqual([]);
  });

  it('returns empty array for empty array', () => {
    expect(getUniqueCategories([])).toEqual([]);
  });

  it('returns unique categories sorted alphabetically', () => {
    const result = getUniqueCategories(mockBusinesses);
    expect(result).toEqual(['Finance', 'Healthcare', 'Retail', 'Technology']);
  });

  it('removes duplicates', () => {
    const businesses = [
      createBusiness({ category: 'Technology' }),
      createBusiness({ category: 'Technology' }),
      createBusiness({ category: 'Healthcare' }),
    ];
    const result = getUniqueCategories(businesses);
    expect(result).toEqual(['Healthcare', 'Technology']);
  });
});

describe('getUniqueDiversityTags', () => {
  it('returns empty array for null input', () => {
    expect(getUniqueDiversityTags(null as any)).toEqual([]);
  });

  it('returns empty array for empty array', () => {
    expect(getUniqueDiversityTags([])).toEqual([]);
  });

  it('returns unique diversity tags sorted alphabetically', () => {
    const result = getUniqueDiversityTags(mockBusinesses);
    expect(result).toEqual(['Black-owned', 'Female-founded']);
  });

  it('handles businesses with no diversity tags', () => {
    const businesses = [
      createBusiness({ diversity: [] }),
      createBusiness({ diversity: ['Black-owned'] }),
    ];
    const result = getUniqueDiversityTags(businesses);
    expect(result).toEqual(['Black-owned']);
  });
});

// =============================================================================
// formatLocation Tests
// =============================================================================

describe('formatLocation', () => {
  it('returns "Location unavailable" for null business', () => {
    expect(formatLocation(null)).toBe('Location unavailable');
  });

  it('returns "Location unavailable" for undefined business', () => {
    expect(formatLocation(undefined)).toBe('Location unavailable');
  });

  it('returns "Location unavailable" for missing location', () => {
    const business = createBusiness();
    (business as any).location = undefined;
    expect(formatLocation(business)).toBe('Location unavailable');
  });

  it('formats city and state correctly', () => {
    const business = createBusiness({ location: { city: 'Austin', state: 'TX' } });
    expect(formatLocation(business)).toBe('Austin, TX');
  });

  it('returns only city if state is missing', () => {
    const business = createBusiness({ location: { city: 'Austin', state: '' } });
    expect(formatLocation(business)).toBe('Austin');
  });

  it('returns only state if city is missing', () => {
    const business = createBusiness({ location: { city: '', state: 'TX' } });
    expect(formatLocation(business)).toBe('TX');
  });

  it('trims whitespace from city and state', () => {
    const business = createBusiness({ location: { city: '  Austin  ', state: '  TX  ' } });
    expect(formatLocation(business)).toBe('Austin, TX');
  });
});


describe('formatEmployeeCount', () => {
  it('returns "Not specified" for null', () => {
    expect(formatEmployeeCount(null)).toBe('Not specified');
  });

  it('returns "Not specified" for undefined', () => {
    expect(formatEmployeeCount(undefined)).toBe('Not specified');
  });

  it('returns "Not specified" for empty string', () => {
    expect(formatEmployeeCount('')).toBe('Not specified');
  });

  it('returns "Not specified" for whitespace-only string', () => {
    expect(formatEmployeeCount('   ')).toBe('Not specified');
  });

  it('formats employee count with suffix', () => {
    expect(formatEmployeeCount('50-100')).toBe('50-100 employees');
  });

  it('trims whitespace', () => {
    expect(formatEmployeeCount('  50-100  ')).toBe('50-100 employees');
  });
});

describe('formatRevenue', () => {
  it('returns "Not disclosed" for null', () => {
    expect(formatRevenue(null)).toBe('Not disclosed');
  });

  it('returns "Not disclosed" for undefined', () => {
    expect(formatRevenue(undefined)).toBe('Not disclosed');
  });

  it('returns "Not disclosed" for empty string', () => {
    expect(formatRevenue('')).toBe('Not disclosed');
  });

  it('returns the revenue string as-is', () => {
    expect(formatRevenue('$1M - $5M')).toBe('$1M - $5M');
  });

  it('trims whitespace', () => {
    expect(formatRevenue('  $1M - $5M  ')).toBe('$1M - $5M');
  });
});
