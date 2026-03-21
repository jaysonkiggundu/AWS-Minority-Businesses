import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, DollarSign, Users, BarChart, ArrowRight, CheckCircle } from "lucide-react";

const Founders = () => {
  const programs = [
    {
      name: "Minority Business Accelerator",
      description: "Dedicated program for minority-owned businesses with access to AWS credits, mentorship, and investor networks.",
      benefits: ["$100K AWS credits", "1:1 mentorship", "Investor introductions", "Technical workshops"],
      icon: Rocket,
    },
    {
      name: "AWS Impact Accelerator",
      description: "Supporting underrepresented founders building innovative solutions with AWS technology.",
      benefits: ["$225K AWS credits", "Go-to-market strategy", "Partner network", "Demo day access"],
      icon: DollarSign,
    },
    {
      name: "Think Big for Small Business",
      description: "Helping small businesses scale through AWS technology and business development resources.",
      benefits: ["$25K AWS credits", "Business training", "AWS technical support", "Community access"],
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Scale Your Business with{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                AWS Accelerators
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Access capital, mentorship, and technology to grow from startup to $100M+ revenue
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Rocket, value: "1,000+", label: "Businesses Accelerated" },
              { icon: DollarSign, value: "$50M+", label: "AWS Credits Awarded" },
              { icon: BarChart, value: "3x", label: "Average Revenue Growth" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AWS Accelerator Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the program that best fits your business stage and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <program.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{program.description}</p>
                  <ul className="space-y-3">
                    {program.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beyond accelerator programs, get tools to manage and grow your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Business Profile Management",
                description: "Create and manage your company profile, showcase your products, and track your performance metrics.",
              },
              {
                title: "Customer Reviews & Ratings",
                description: "Build trust with potential customers through verified reviews and ratings from your satisfied clients.",
              },
              {
                title: "Analytics Dashboard",
                description: "Track profile views, customer engagement, and business growth with comprehensive analytics.",
              },
              {
                title: "Investor Connections",
                description: "Get discovered by investors and corporate buyers actively seeking diverse suppliers.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
              Ready to Take Your Business to the Next Level?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of diverse founders who have scaled their businesses through AWS accelerators
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founders;
