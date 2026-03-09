import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  ExternalLink,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { mockBusinesses } from '@/data/mockBusinesses';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

const BusinessProfile = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Find business by ID (in production, this would be an API call)
  const business = mockBusinesses.find(b => b.id === businessId);

  useEffect(() => {
    if (businessId) {
      logger.logUserAction('Business Profile Viewed', { 
        businessId,
        businessName: business?.name 
      });
    }
  }, [businessId, business]);

  const handleContactBusiness = () => {
    logger.logUserAction('Contact Business Clicked', { 
      businessId,
      businessName: business?.name 
    });
    toast.success('Contact form opened! (Feature coming soon)');
  };

  const handleSaveToFavorites = () => {
    setIsSaved(!isSaved);
    logger.logUserAction(isSaved ? 'Removed from Favorites' : 'Saved to Favorites', { 
      businessId,
      businessName: business?.name 
    });
    toast.success(isSaved ? 'Removed from favorites' : 'Saved to favorites!');
  };

  const handleShareProfile = async () => {
    logger.logUserAction('Share Profile Clicked', { 
      businessId,
      businessName: business?.name 
    });

    // Try to use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.name,
          text: `Check out ${business?.name} on AWS CAMP`,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handlePhoneClick = () => {
    logger.logUserAction('Phone Number Clicked', { 
      businessId,
      phone: business?.contact.phone 
    });
    toast.info('Opening phone dialer...');
  };

  const handleEmailClick = () => {
    logger.logUserAction('Email Clicked', { 
      businessId,
      email: business?.contact.email 
    });
    toast.info('Opening email client...');
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The business you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/browse')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl">{business.name}</CardTitle>
                      {business.verified && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold">{business.rating}</span>
                        <span className="text-sm">({business.reviewCount} reviews)</span>
                      </div>
                      <Badge variant="outline">{business.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{business.description}</p>
              </CardContent>
            </Card>

            {/* Diversity Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Diversity & Inclusion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {business.diversity.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Tags */}
            {business.tags && business.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About This Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.founded && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Founded</div>
                      <div className="text-sm text-muted-foreground">{business.founded}</div>
                    </div>
                  </div>
                )}
                
                {business.employees && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Team Size</div>
                      <div className="text-sm text-muted-foreground">{business.employees} employees</div>
                    </div>
                  </div>
                )}

                {business.revenue && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Annual Revenue</div>
                      <div className="text-sm text-muted-foreground">{business.revenue}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {business.location.address && <div>{business.location.address}</div>}
                        <div>{business.location.city}, {business.location.state}</div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {business.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a 
                        href={`tel:${business.contact.phone}`}
                        onClick={handlePhoneClick}
                        className="text-sm text-primary hover:underline"
                      >
                        {business.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a 
                        href={`mailto:${business.contact.email}`}
                        onClick={handleEmailClick}
                        className="text-sm text-primary hover:underline"
                      >
                        {business.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {business.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a 
                        href={business.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                        onClick={() => logger.logUserAction('Business Website Clicked', { 
                          businessId: business.id,
                          website: business.contact.website 
                        })}
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleContactBusiness}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Business
                </Button>
                <Button 
                  variant={isSaved ? "default" : "outline"}
                  className="w-full" 
                  size="lg"
                  onClick={handleSaveToFavorites}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={handleShareProfile}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{business.rating}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="font-semibold">{business.reviewCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verified</span>
                  <span className="font-semibold">
                    {business.verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
