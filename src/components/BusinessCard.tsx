import { Business } from "@/types/business";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Calendar, ExternalLink, Verified } from "lucide-react";
import { formatLocation, formatEmployeeCount } from "@/lib/businessUtils";

interface BusinessCardProps {
  business: Business;
  onViewProfile?: (business: Business) => void;
}

export function BusinessCard({ business, onViewProfile }: BusinessCardProps) {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(business);
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.contact.website) {
      window.open(business.contact.website, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={handleViewProfile}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {business.name.charAt(0)}
              </span>
            </div>
            {business.verified && (
              <Verified className="h-5 w-5 text-blue-500" title="Verified Business" />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{business.rating}</span>
            <span className="text-muted-foreground">({business.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {business.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            {formatLocation(business)}
          </div>
          
          {business.employees && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              {formatEmployeeCount(business.employees)}
            </div>
          )}
          
          {business.founded && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              Founded {business.founded}
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {business.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{business.category}</Badge>
          {business.diversity.slice(0, 2).map((tag, i) => (
            <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20">
              {tag}
            </Badge>
          ))}
          {business.diversity.length > 2 && (
            <Badge variant="outline">
              +{business.diversity.length - 2} more
            </Badge>
          )}
        </div>

        {business.tags && business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button className="flex-1" onClick={handleViewProfile}>
          View Profile
        </Button>
        {business.contact.website && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleWebsiteClick}
            title="Visit Website"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}