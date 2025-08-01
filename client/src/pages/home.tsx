import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Connect with 
                <span className="text-primary"> Trusted Contractors</span>
                for Your Home Projects
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-8">
                Post your renovation project and receive competitive bids from verified contractors. 
                Professional, reliable, and secure platform for homeowners and property managers.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href={user ? "/post-project" : "/auth?mode=register&type=homeowner"}>
                  <Button size="lg" className="bg-primary text-white hover:bg-blue-700 font-semibold text-lg px-8 py-4">
                    I'm a Homeowner
                  </Button>
                </Link>
                <Link href={user ? "/contractor-profile" : "/auth?mode=register&type=contractor"}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-lg px-8 py-4"
                  >
                    I'm a Contractor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <img 
                src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern home renovation workspace" 
                className="w-full rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How BuildConnect Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple, secure, and professional process for all your renovation needs</p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl">
                  <i className="fas fa-plus-circle"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Post Your Project</h3>
              <p className="mt-4 text-gray-600">Describe your renovation project with photos, requirements, and timeline. It's free to post!</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-white text-2xl">
                  <i className="fas fa-handshake"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Receive Bids</h3>
              <p className="mt-4 text-gray-600">Qualified contractors submit competitive bids with detailed proposals and timelines.</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl">
                  <i className="fas fa-trophy"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Choose & Complete</h3>
              <p className="mt-4 text-gray-600">Review proposals, chat directly with contractors, and award your project to the best fit.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
