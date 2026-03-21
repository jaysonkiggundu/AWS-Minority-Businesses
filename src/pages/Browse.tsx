import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { BusinessList } from "@/components/BusinessList";
import { BusinessListSkeleton } from "@/components/BusinessCardSkeleton";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { BusinessFilters } from "@/components/BusinessFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Business, BusinessFilters as Filters } from "@/types/business";
import { mockBusinesses } from "@/data/mockBusinesses";
import { filterBusinesses, sortBusinesses, getUniqueCategories, getUniqueDiversityTags } from "@/lib/businessUtils";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpDown, Grid, List, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'newest'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch businesses from API
  const { data: apiBusinesses, isLoading, error } = useBusinesses();

  // Log page view and check for search query from URL
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      logger.logUserAction('Browse Page Viewed with Search', { query: searchQuery });
      // Set the search filter from URL parameter
      setFilters({ search: searchQuery });
    } else {
      logger.logUserAction('Browse Page Viewed');
      // Reset all filters when no search query in URL
      setFilters({});
    }
  }, [searchParams]);

  // Use API data if available, otherwise fall back to mock data
  const businesses = useMemo(() => {
    if (apiBusinesses && apiBusinesses.length > 0) {
      logger.info('Using API data', { count: apiBusinesses.length });
      return apiBusinesses;
    }
    logger.info('Using mock data', { count: mockBusinesses.length });
    return mockBusinesses;
  }, [apiBusinesses]);

  const isUsingMockData = !apiBusinesses || apiBusinesses.length === 0;

  // Get unique values for filter options
  const availableCategories = useMemo(() => getUniqueCategories(businesses), [businesses]);
  const availableDiversityTags = useMemo(() => getUniqueDiversityTags(businesses), [businesses]);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    const startTime = performance.now();
    const filtered = filterBusinesses(businesses, filters);
    const sorted = sortBusinesses(filtered, sortBy);
    const duration = performance.now() - startTime;
    
    logger.logPerformance('Filter and Sort', duration);
    logger.debug('Filtered businesses', { 
      total: businesses.length, 
      filtered: sorted.length,
      filters,
      sortBy 
    });
    
    return sorted;
  }, [businesses, filters, sortBy]);

  const handleViewProfile = (business: Business) => {
    logger.logUserAction('View Business Profile', { businessId: business.id, businessName: business.name });
    navigate(`/business/${business.id}`);
  };

  const handleAddBusiness = () => {
    logger.logUserAction('Add Business Button Clicked', { isAuthenticated });
    if (!isAuthenticated) {
      toast.error('Please sign in to add a business');
      return;
    }
    navigate('/add-business');
  };

  const handleClearFilters = () => {
    logger.logUserAction('Clear Filters');
    setFilters({});
    toast.success('Filters cleared');
  };

  const handleSortChange = (value: string) => {
    logger.logUserAction('Sort Changed', { sortBy: value });
    setSortBy(value as any);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    logger.logUserAction('View Mode Changed', { viewMode: mode });
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <AppBreadcrumb crumbs={[{ label: "Browse Businesses" }]} />
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Discover Diverse Businesses</h1>
            <p className="text-lg text-muted-foreground">
              Find and support minority-owned businesses across all industries. 
              Showing {filteredBusinesses.length} of {businesses.length} businesses.
            </p>
          </div>
          <Button onClick={handleAddBusiness}>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && <BusinessListSkeleton count={6} viewMode={viewMode} />}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading businesses</AlertTitle>
            <AlertDescription>
              {error.message}. Showing sample data instead.
            </AlertDescription>
          </Alert>
        )}

        {/* Mock Data Notice */}
        {isUsingMockData && !isLoading && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Viewing Sample Data</AlertTitle>
            <AlertDescription>
              No businesses found in the database. Showing sample data for demonstration.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="mb-8">
          <BusinessFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableCategories}
            availableDiversityTags={availableDiversityTags}
          />
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {!isLoading && <BusinessList
          businesses={filteredBusinesses}
          viewMode={viewMode}
          onViewProfile={handleViewProfile}
          onClearFilters={handleClearFilters}
        />}

        {/* Load More (for future pagination) */}
        {filteredBusinesses.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredBusinesses.length} businesses
            </p>
            {/* Future: Add pagination or load more functionality */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
