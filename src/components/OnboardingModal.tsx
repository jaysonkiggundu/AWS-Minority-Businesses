import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Users, TrendingUp, ArrowRight } from "lucide-react";

const ONBOARDING_KEY = "aws-camp-onboarded";

const steps = [
  {
    icon: Search,
    title: "Discover Businesses",
    description: "Search and filter thousands of minority-owned businesses by category, location, and diversity tags.",
  },
  {
    icon: Users,
    title: "Connect with Founders",
    description: "View detailed profiles, contact businesses directly, and save your favorites for later.",
  },
  {
    icon: TrendingUp,
    title: "Support & Grow",
    description: "Help close the supplier diversity gap by choosing to work with diverse-owned businesses.",
  },
];

export function OnboardingModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOpen(false);
  };

  const handleBrowse = () => {
    handleFinish();
    navigate("/browse");
  };

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleFinish(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Welcome to AWS CAMP</DialogTitle>
          <DialogDescription className="text-center">
            Your platform for discovering minority-owned businesses
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{current.title}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{current.description}</p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1" onClick={handleFinish}>
            Skip
          </Button>
          {isLast ? (
            <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={handleBrowse}>
              Start Exploring
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" className="flex-1" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
