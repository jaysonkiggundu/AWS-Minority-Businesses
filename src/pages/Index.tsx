import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Users, Award, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AWSLogo } from "@/components/AWSLogo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="mb-6 inline-block">
              <div className="text-sm font-semibold text-primary mb-2">AWS CAMP</div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Empowering{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Minority-Owned Businesses
                </span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your Campus. Your Marketplace. Your Connection. Discover and support diverse-owned businesses 
              through AWS's platform for Black, female, Latino, and LGBTQIA+ founders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8">
                  Discover Businesses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/founders">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  I'm a Founder
                </Button>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by business name, category, or location..."
                  className="pl-12 h-14 text-lg border-2 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "$300B", label: "Supplier Diversity Gap" },
              { value: "<2%", label: "VC Funding for Diverse Founders" },
              { value: "AWS", label: "Powered Platform" },
              { value: "CAMP", label: "Campus • Marketplace • Connection" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How AWS CAMP Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive AWS-powered platform connecting diverse businesses with opportunities for growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "For Customers",
                description: "Discover and support diverse-owned businesses through advanced search, reviews, and personalized recommendations.",
                features: ["Smart search with voice & image", "Ratings & reviews", "Social sharing", "Fraud detection"]
              },
              {
                icon: TrendingUp,
                title: "For Founders",
                description: "Access AWS accelerator programs, manage your business profile, and connect with customers and investors.",
                features: ["AWS accelerator programs", "Profile management", "Analytics dashboard", "Investor connections"]
              },
              {
                icon: Award,
                title: "For Buyers & Investors",
                description: "Meet supplier diversity goals and discover high-potential diverse-owned businesses to support and invest in.",
                features: ["Verified suppliers", "Impact metrics", "Direct communication", "Investment opportunities"]
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-2 text-primary fill-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary-glow/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of diverse-owned businesses and supporters making a difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8">
                  Start Exploring
                </Button>
              </Link>
              <Link to="/founders">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Register Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <AWSLogo className="h-5 text-foreground" />
                  <div className="h-5 w-px bg-border" />
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                    C
                  </div>
                </div>
                <span className="font-bold">CAMP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering diverse-owned businesses to reach their full potential through AWS technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/browse" className="hover:text-foreground">Browse Businesses</Link></li>
                <li><Link to="/founders" className="hover:text-foreground">For Founders</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">AWS Accelerators</a></li>
                <li><a href="#" className="hover:text-foreground">Success Stories</a></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2025 AWS CAMP for Minority Businesses. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
