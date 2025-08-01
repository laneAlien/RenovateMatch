import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">BuildConnect</h1>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                href="/browse-contractors" 
                className={`font-medium ${isActive('/browse-contractors') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
              >
                Find Contractors
              </Link>
              <Link 
                href="/post-project" 
                className={`font-medium ${isActive('/post-project') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
              >
                Post Project
              </Link>
              <Link 
                href="#" 
                className="text-secondary hover:text-primary font-medium"
              >
                How It Works
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-secondary hover:text-primary font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" className="text-secondary hover:text-primary font-medium">
                    Messages
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-secondary hover:text-primary font-medium"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=login">
                  <Button variant="ghost" className="text-secondary hover:text-primary font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button className="bg-primary text-white hover:bg-blue-700 font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
