import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessFilters } from "@/components/BusinessFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Business, BusinessFilters as Filters } from "@/types/business";
import { mockBusinesses } from "@/data/mockBusinesses";
import { filterBusinesses, sortBusinesses, getUniqueCategories, getUniqueDiversityTags } from "@/lib/businessUtils";
import { useBusinesses } from "@/hooks/useBusinesses";
import { ArrowUpDown, Grid, List, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Browse = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'newest'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch businesses from API
  const { data: apiBusinesses, isLoading, error } = useBusinesses();

  // Use API data if available, otherwise fall back to mock data
  const businesses = useMemo(() => {
    if (apiBusinesses && apiBusinesses.length > 0) {
      return apiBusinesses;
    }
    return mockBusinesses;
  }, [apiBusinesses]);

  const isUsingMockData = !apiBusinesses || apiBusinesses.length === 0;

  // Get unique values for filter options
  const availableCategories = useMemo(() => getUniqueCategories(businesses), [businesses]);
  const availableDiversityTags = useMemo(() => getUniqueDiversityTags(businesses), [businesses]);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    const filtered = filterBusinesses(businesses, filters);
    return sortBusinesses(filtered, sortBy);
  }, [businesses, filters, sortBy]);

  const handleViewProfile = (business: Business) => {
    // TODO: Navigate to business profile page
    console.log('View profile for:', business.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Discover Diverse Businesses</h1>
            <p className="text-lg text-muted-foreground">
              Find and support minority-owned businesses across all industries. 
              Showing {filteredBusinesses.length} of {businesses.length} businesses.
            </p>
          </div>
          <Link to="/add-business">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

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
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find more businesses.
            </p>
            <Button onClick={() => setFilters({})}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}

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
