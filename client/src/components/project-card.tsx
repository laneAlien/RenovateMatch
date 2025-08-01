import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, navigate] = useLocation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'bg-green-100 text-green-800';
      case 'bidding':
        return 'bg-blue-100 text-blue-800';
      case 'awarded':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'posted':
        return 'Open for Bids';
      case 'bidding':
        return 'Active Bidding';
      case 'awarded':
        return 'Awarded';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
              <Badge className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
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
            <Button 
              variant="outline"
              className="text-primary border-primary hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Bids
            </Button>
            <Button 
              onClick={() => navigate("/messages")}
              className="bg-primary hover:bg-blue-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
