import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AWSLogo } from "@/components/AWSLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBrowse = () => {
    window.location.href = '/browse';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <AWSLogo className="h-6 text-foreground" />
            <div className="h-6 w-px bg-border" />
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CAMP
            </span>
            <span className="text-xs text-muted-foreground">
              Minority Businesses
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={handleBrowse}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Browse Businesses
          </button>
          <Link to="/founders" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            For Founders
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/founders">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={() => setAuthModalOpen(true)}>
                Get Started
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation - Slide-in Sheet */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <nav className="flex flex-col space-y-1">
                <button
                  onClick={() => { handleBrowse(); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-3 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  Browse Businesses
                </button>
                <Link
                  to="/founders"
                  className="px-3 py-3 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Founders
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-3 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>

              <div className="mt-6 pt-6 border-t border-border/40 flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <p className="px-3 text-sm text-muted-foreground">Signed in as {user?.username}</p>
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link to="/founders" onClick={() => setMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border/40">
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  );
};

export default Navigation;
