import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

const TermsOfService = () => {
  useEffect(() => {
    logger.logUserAction('Terms of Service Viewed');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                By accessing or using AWS CAMP for Minority Businesses ("the Platform"), you agree to be 
                bound by these Terms of Service. If you do not agree to these terms, please do not use 
                the Platform.
              </p>
              <p className="text-sm text-muted-foreground">
                Last Updated: March 2025
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use of the Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Use</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Browse and search for minority-owned businesses</li>
                  <li>Create and manage your business profile</li>
                  <li>Connect with other users and businesses</li>
                  <li>Access AWS accelerator programs (if eligible)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Prohibited Use</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Posting false or misleading information</li>
                  <li>Harassing or discriminating against other users</li>
                  <li>Attempting to gain unauthorized access</li>
                  <li>Scraping or automated data collection</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person or business per account</li>
                <li>We reserve the right to suspend or terminate accounts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Listings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Business owners who create listings on the Platform agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Provide accurate business information</li>
                <li>Update information when it changes</li>
                <li>Respond to inquiries in a timely manner</li>
                <li>Comply with all applicable business laws</li>
                <li>Not misrepresent diversity status</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may verify business information and diversity certifications. Verified status 
                indicates that we have confirmed certain information, but does not constitute an 
                endorsement or guarantee of quality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Platform Content</h3>
                <p className="text-sm text-muted-foreground">
                  The Platform and its content (excluding user-generated content) are owned by 
                  AWS CAMP and protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Content</h3>
                <p className="text-sm text-muted-foreground">
                  You retain ownership of content you post, but grant us a license to use, display, 
                  and distribute it on the Platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE 
                THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE ARE NOT RESPONSIBLE 
                FOR THE ACCURACY OF USER-GENERATED CONTENT.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, AWS CAMP SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes. Continued use of the Platform after changes constitutes acceptance 
                of the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These Terms are governed by the laws of the United States and the State of Washington, 
                without regard to conflict of law principles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                For questions about these Terms, contact us at:
              </p>
              <p className="text-sm font-medium mt-2">
                legal@awscamp.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
