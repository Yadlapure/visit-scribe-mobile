
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Visit, VisitStatus } from '@/types';
import { Check, Clock } from 'lucide-react';

interface VisitStatusCardProps {
  visit: Visit;
}

const VisitStatusCard: React.FC<VisitStatusCardProps> = ({ visit }) => {
  const getStatusInfo = () => {
    switch (visit.status) {
      case VisitStatus.PENDING:
        return {
          icon: <Clock className="h-6 w-6 text-healthcare-warning" />,
          title: 'Pending',
          description: 'Visit not yet started',
          color: 'bg-healthcare-warning/20 text-healthcare-warning'
        };
      case VisitStatus.IN:
        return {
          icon: <Check className="h-6 w-6 text-healthcare-success" />,
          title: 'Check In Complete',
          description: visit.startTime ? new Date(visit.startTime).toLocaleTimeString() : 'Time not recorded',
          color: 'bg-healthcare-success/20 text-healthcare-success'
        };
      case VisitStatus.OUT:
      case VisitStatus.COMPLETED:
        return {
          icon: <Check className="h-6 w-6 text-healthcare-success" />,
          title: 'Visit Complete',
          description: visit.endTime ? new Date(visit.endTime).toLocaleTimeString() : 'Time not recorded',
          color: 'bg-healthcare-success/20 text-healthcare-success'
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-healthcare-gray" />,
          title: 'Unknown Status',
          description: 'Status information unavailable',
          color: 'bg-healthcare-gray/20 text-healthcare-gray'
        };
    }
  };
  
  const info = getStatusInfo();
  
  return (
    <Card className="mb-4 border-healthcare-lightGray">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="mr-3">{info.icon}</div>
          <div>
            <h3 className="font-medium">{info.title}</h3>
            <p className="text-sm text-healthcare-gray">{info.description}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-sm px-2 py-1 rounded-full ${info.color}`}>
              {visit.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitStatusCard;
