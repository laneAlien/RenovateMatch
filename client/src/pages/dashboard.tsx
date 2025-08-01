import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Plus, MessageSquare, Eye } from "lucide-react";
import ProjectCard from "@/components/project-card";
import BidCard from "@/components/bid-card";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('active-projects');

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects', user?.userType === 'homeowner' ? user.id : 'all'],
    queryFn: async () => {
      const params = user?.userType === 'homeowner' ? `?ownerId=${user.id}` : '';
      const response = await fetch(`/api/projects${params}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['/api/bids/contractor', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/bids/contractor/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch bids');
      return response.json();
    },
    enabled: !!user && user.userType === 'contractor',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-blue-700">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {user.userType === 'homeowner' ? 'Project Dashboard' : 'Contractor Dashboard'}
            </h2>
            <p className="mt-2 text-gray-600">
              {user.userType === 'homeowner' 
                ? 'Manage your projects and bids' 
                : 'Find projects and manage your bids'}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            {user.userType === 'homeowner' && (
              <Button 
                onClick={() => navigate('/post-project')}
                className="bg-primary hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
            {user.userType === 'contractor' && (
              <Button 
                onClick={() => navigate('/browse-contractors')}
                className="bg-primary hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Browse Projects
              </Button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {user.userType === 'homeowner' ? (
              <>
                <button 
                  onClick={() => setActiveTab('active-projects')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active-projects' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Active Projects
                </button>
                <button 
                  onClick={() => setActiveTab('bids-received')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bids-received' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Bids Received
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'completed' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completed
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('my-bids')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'my-bids' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Bids
                </button>
                <button 
                  onClick={() => setActiveTab('available-projects')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'available-projects' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Available Projects
                </button>
                <button 
                  onClick={() => setActiveTab('awarded')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'awarded' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Awarded Projects
                </button>
              </>
            )}
          </nav>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {user.userType === 'homeowner' ? (
            <>
              {activeTab === 'active-projects' && (
                <div className="space-y-6">
                  {projectsLoading ? (
                    <div className="text-center py-8">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-6">Get started by posting your first renovation project</p>
                      <Button 
                        onClick={() => navigate('/post-project')}
                        className="bg-primary hover:bg-blue-700"
                      >
                        Post Your First Project
                      </Button>
                    </div>
                  ) : (
                    projects.map((project: any) => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'bids-received' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bid Management Coming Soon</h3>
                  <p className="text-gray-600">This feature will allow you to review and manage bids from contractors</p>
                </div>
              )}
              
              {activeTab === 'completed' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed projects</h3>
                  <p className="text-gray-600">Completed projects will appear here</p>
                </div>
              )}
            </>
          ) : (
            <>
              {activeTab === 'my-bids' && (
                <div className="space-y-6">
                  {bidsLoading ? (
                    <div className="text-center py-8">Loading bids...</div>
                  ) : bids.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bids submitted</h3>
                      <p className="text-gray-600 mb-6">Start bidding on projects to grow your business</p>
                      <Button 
                        onClick={() => navigate('/browse-contractors')}
                        className="bg-primary hover:bg-blue-700"
                      >
                        Browse Projects
                      </Button>
                    </div>
                  ) : (
                    bids.map((bid: any) => (
                      <BidCard key={bid.id} bid={bid} />
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'available-projects' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Available Projects</h3>
                  <p className="text-gray-600 mb-6">Find projects that match your expertise</p>
                  <Button 
                    onClick={() => navigate('/browse-contractors')}
                    className="bg-primary hover:bg-blue-700"
                  >
                    View All Projects
                  </Button>
                </div>
              )}
              
              {activeTab === 'awarded' && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No awarded projects</h3>
                  <p className="text-gray-600">Projects you've won will appear here</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
