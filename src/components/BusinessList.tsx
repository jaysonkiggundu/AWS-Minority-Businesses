import { Business } from '@/types/business';
import { BusinessCard } from './BusinessCard';
import { Button } from './ui/button';
import { logger } from '@/lib/logger';

interface BusinessListProps {
  businesses: Business[];
  viewMode: 'grid' | 'list';
  onViewProfile: (business: Business) => void;
  onClearFilters?: () => void;
}

/**
 * Simplified BusinessList component (TR-3: Reduce complexity)
 * Handles display logic only, no business logic
 */
export function BusinessList({ 
  businesses, 
  viewMode, 
  onViewProfile,
  onClearFilters 
}: BusinessListProps) {
  
  // Log when list is rendered
  logger.debug('BusinessList rendered', { 
    count: businesses.length, 
    viewMode 
  });

  // Empty state
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or search terms to find more businesses.
        </p>
        {onClearFilters && (
          <Button onClick={onClearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  // Grid or list view
  return (
    <div className={
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
    }>
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
}
