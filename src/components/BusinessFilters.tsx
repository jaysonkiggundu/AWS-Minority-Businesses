import { useState } from "react";
import { BusinessFilters as Filters, DiversityTag, BusinessCategory } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, MapPin, Filter, X, Star } from "lucide-react";

interface BusinessFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableCategories: BusinessCategory[];
  availableDiversityTags: DiversityTag[];
}

export function BusinessFilters({ 
  filters, 
  onFiltersChange, 
  availableCategories, 
  availableDiversityTags 
}: BusinessFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleDiversityTag = (tag: DiversityTag) => {
    const currentTags = filters.diversity || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateFilters({ diversity: newTags.length > 0 ? newTags : undefined });
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof Filters];
    return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <div className="space-y-4">
      {/* Search and Location */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search businesses, categories, or tags..."
            className="pl-12 h-12"
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
          />
        </div>
        <div className="relative md:w-64">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="City, State"
            className="pl-12 h-12"
            value={filters.location || ''}
            onChange={(e) => updateFilters({ location: e.target.value || undefined })}
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="lg" variant="outline" className="relative">
              <Filter className="mr-2 h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Businesses</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select 
                  value={filters.category || ''} 
                  onValueChange={(value) => updateFilters({ category: value as BusinessCategory || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Diversity Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Diversity & Ownership</label>
                <div className="space-y-2">
                  {availableDiversityTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={filters.diversity?.includes(tag) || false}
                        onCheckedChange={() => toggleDiversityTag(tag)}
                      />
                      <label htmlFor={tag} className="text-sm">
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select 
                  value={filters.minRating?.toString() || ''} 
                  onValueChange={(value) => updateFilters({ minRating: value ? parseFloat(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="4.5">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        4.5+
                      </div>
                    </SelectItem>
                    <SelectItem value="4.0">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        4.0+
                      </div>
                    </SelectItem>
                    <SelectItem value="3.5">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        3.5+
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verified Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verified || false}
                  onCheckedChange={(checked) => updateFilters({ verified: checked || undefined })}
                />
                <label htmlFor="verified" className="text-sm">
                  Verified businesses only
                </label>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ category: undefined })}
              />
            </Badge>
          )}
          {filters.diversity?.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleDiversityTag(tag)}
              />
            </Badge>
          ))}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ stars
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ minRating: undefined })}
              />
            </Badge>
          )}
          {filters.verified && (
            <Badge variant="secondary" className="gap-1">
              Verified only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ verified: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}