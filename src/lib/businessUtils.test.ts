import {
  filterBusinesses,
  sortBusinesses,
  getUniqueCategories,
  getUniqueDiversityTags,
  formatLocation,
  formatEmployeeCount,
  formatRevenue,
} from './businessUtils';
import { Business, BusinessFilters } from "@/types/business";

const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Biz1',
    description: 'Desc1',
    category: 'Cat1' as const,
    location: { city: 'City1', state: 'State1' },
    diversity: ['Minority' as any],
    rating: 4.5,
    reviewCount: 10,
    founded: 2020,
    verified: true,
    tags: ['Tag1'],
    contact: { email: 'biz1@example.com', phone: '123-456-7890' }, // Example contact
  },
  {
    id: '2',
    name: 'Biz2',
    description: 'Desc2',
    category: 'Cat2' as const,
    location: { city: 'City2', state: 'State2' },
    diversity: ['Women' as any],
    rating: 3.5,
    reviewCount: 5,
    founded: 2021,
    verified: false,
    tags: ['Tag2'],
    contact: { email: 'biz2@example.com', phone: '987-654-3210' }, // Example contact
  },
];

describe('businessUtils error handling', () => {
  it('throws if businesses is not an array', () => {
    expect(() => filterBusinesses(null as any, {})).toThrow(TypeError);
    expect(() => sortBusinesses(null as any, 'name')).toThrow(TypeError);
    expect(() => getUniqueCategories(null as any)).toThrow(TypeError);
    expect(() => getUniqueDiversityTags(null as any)).toThrow(TypeError);
  });

  it('throws if filters is not an object', () => {
    expect(() => filterBusinesses([], null as any)).toThrow(TypeError);
  });

  it('filters businesses correctly', () => {
    const result = filterBusinesses(mockBusinesses, { search: 'Biz1' });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Biz1');
  });

  it('sorts businesses by name', () => {
    const result = sortBusinesses(mockBusinesses, 'name');
    expect(result[0].name).toBe('Biz1');
  });

  it('gets unique categories', () => {
    expect(getUniqueCategories(mockBusinesses)).toEqual(['Cat1', 'Cat2']);
  });

  it('gets unique diversity tags', () => {
    expect(getUniqueDiversityTags(mockBusinesses)).toEqual(['Minority', 'Women']);
  });

  it('formats location', () => {
    expect(formatLocation(mockBusinesses[0])).toBe('City1, State1');
  });

  it('formats employee count', () => {
    expect(formatEmployeeCount('10')).toBe('10 employees');
    expect(formatEmployeeCount()).toBe('Not specified');
  });

  it('formats revenue', () => {
    expect(formatRevenue('100k')).toBe('100k');
    expect(formatRevenue()).toBe('Not disclosed');
  });
});