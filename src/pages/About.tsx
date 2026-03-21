import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, TrendingUp, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16">
            Bridging the $300 billion supplier diversity gap by connecting diverse-owned businesses with opportunities to scale
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: "The Challenge",
                description: "Diverse-owned businesses receive less than 2% of venture capital, and fewer than 100 minority-owned businesses generate over $100M annually. This creates a massive gap between corporate supplier diversity goals and available capacity.",
              },
              {
                icon: Heart,
                title: "Our Solution",
                description: "We connect diverse founders with the three Cs: Customers who want to support them, Capital to fuel their growth, and Catalysts like AWS accelerators to help them scale.",
              },
              {
                icon: TrendingUp,
                title: "The Impact",
                description: "By leveraging technology and AWS's infrastructure, we help diverse-owned businesses accelerate their journey from startup to $100M+ in revenue, reducing wealth gaps and creating economic opportunity.",
              },
              {
                icon: Globe,
                title: "Our Vision",
                description: "A world where diverse-owned businesses have equal access to resources, networks, and opportunities—where talent and innovation drive success, not systemic barriers.",
              },
            ].map((item, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-secondary/50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-4">Who We Serve</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Diverse-Owned Businesses</h3>
                <p className="text-muted-foreground">
                  Black, female, Latino, and LGBTQIA+ founders building innovative businesses across all industries. We help you get discovered, connect with customers, access capital, and participate in AWS accelerator programs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customers & Supporters</h3>
                <p className="text-muted-foreground">
                  Individuals and organizations committed to supporting diverse businesses. Our platform makes it easy to discover, review, and connect with minority-owned companies in your area.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Corporate Buyers & Investors</h3>
                <p className="text-muted-foreground">
                  Companies seeking to meet supplier diversity goals and investors looking for high-potential diverse-owned businesses. We provide verified suppliers, impact metrics, and direct connection tools.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">By the Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                  $300B
                </div>
                <p className="text-sm text-muted-foreground">Supplier diversity gap we're working to close</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                  &lt;2%
                </div>
                <p className="text-sm text-muted-foreground">Current VC funding for diverse founders</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <p className="text-sm text-muted-foreground">Our goal for minority-owned $100M+ businesses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
