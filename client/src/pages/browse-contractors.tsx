import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import ContractorCard from "@/components/contractor-card";

export default function BrowseContractors() {
  const [filters, setFilters] = useState({
    serviceType: "",
    location: "",
    rating: "",
  });

  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ['/api/contractor-profiles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.serviceType) params.append('specialties', filters.serviceType);
      if (filters.location) params.append('location', filters.location);
      
      const response = await fetch(`/api/contractor-profiles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch contractors');
      return response.json();
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  return (
    <>
      {/* Browse contractors or show available projects for contractors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Find Qualified Contractors</h2>
            <p className="mt-4 text-lg text-gray-600">Browse verified contractors in your area</p>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <Select 
                  value={filters.serviceType} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Services</SelectItem>
                    <SelectItem value="Kitchen Remodel">Kitchen Remodel</SelectItem>
                    <SelectItem value="Bathroom">Bathroom Renovation</SelectItem>
                    <SelectItem value="Flooring">Flooring</SelectItem>
                    <SelectItem value="Roofing">Roofing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input 
                  placeholder="Enter zip code" 
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <Select 
                  value={filters.rating} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-blue-700">
                  <i className="fas fa-search mr-2"></i>Search
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-lg text-gray-600">Loading contractors...</div>
              </div>
            ) : contractors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              contractors.map((contractor: any) => (
                <ContractorCard key={contractor.id} contractor={contractor} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Available Projects Section for Contractors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Available Projects</h2>
            <p className="mt-4 text-lg text-gray-600">Find projects that match your expertise</p>
          </div>
          
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
                <p className="text-gray-600">Check back later for new renovation projects</p>
              </div>
            ) : (
              projects.slice(0, 5).map((project: any) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            project.status === 'posted' ? 'bg-green-100 text-green-800' :
                            project.status === 'bidding' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'posted' ? 'Open for Bids' : 
                             project.status === 'bidding' ? 'Active Bidding' : 
                             project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Budget:</span>
                            <span className="ml-1 font-medium">{project.budgetRange}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Timeline:</span>
                            <span className="ml-1 font-medium">{project.timeline}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-1 font-medium">{project.projectType}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Posted:</span>
                            <span className="ml-1 font-medium">
                              {new Date(project.createdAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                        <Button variant="outline" className="text-primary border-primary hover:bg-blue-50">
                          View Details
                        </Button>
                        <Button className="bg-primary hover:bg-blue-700">
                          Submit Bid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
