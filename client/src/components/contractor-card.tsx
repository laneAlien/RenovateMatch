import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Shield } from "lucide-react";
import type { ContractorProfile } from "@shared/schema";

interface ContractorCardProps {
  contractor: ContractorProfile;
}

export default function ContractorCard({ contractor }: ContractorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Photo</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{contractor.businessName}</h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < (contractor.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {contractor.rating || 'New'} ({contractor.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{contractor.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contractor.serviceRadius || 'Service area not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contractor.yearsExperience || 'Experience not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contractor.isVerified ? 'Verified' : 'Licensed & Insured'}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {contractor.specialties?.length ? (
              contractor.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-800">
                  {specialty}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No specialties listed</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button className="flex-1 bg-primary hover:bg-blue-700">
            View Profile
          </Button>
          <Button variant="outline" className="text-primary border-primary hover:bg-blue-50">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
