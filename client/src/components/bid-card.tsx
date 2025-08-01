import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bid } from "@shared/schema";

interface BidCardProps {
  bid: Bid;
}

export default function BidCard({ bid }: BidCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Project #{bid.projectId.slice(0, 8)}
              </h3>
              <Badge className={getStatusColor(bid.status)}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{bid.proposal}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Bid Amount:</span>
                <span className="ml-1 font-medium">${bid.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Timeline:</span>
                <span className="ml-1 font-medium">{bid.timeline}</span>
              </div>
              <div>
                <span className="text-gray-500">Submitted:</span>
                <span className="ml-1 font-medium">
                  {new Date(bid.createdAt!).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
            <Button variant="outline">
              View Project
            </Button>
            <Button className="bg-primary hover:bg-blue-700">
              Message Client
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
