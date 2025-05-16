
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, Visit, VisitStatus } from '@/types';
import { MapPin, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '@/services/storage.service';

interface TodayPatientCardProps {
  patient: Patient;
  activeVisit?: Visit | null;
}

const TodayPatientCard: React.FC<TodayPatientCardProps> = ({ patient, activeVisit }) => {
  const navigate = useNavigate();
  
  const hasActiveVisit = activeVisit && 
    (activeVisit.status === VisitStatus.PENDING || 
     activeVisit.status === VisitStatus.IN);
  
  const visitStatus = activeVisit?.status || 'NONE';
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const handleVisitClick = async () => {
    if (hasActiveVisit) {
      navigate(`/visit/${activeVisit!.id}`);
    } else {
      // Create a new visit for today
      const newVisit: Visit = {
        id: uuidv4(),
        patientId: patient.id,
        status: VisitStatus.PENDING,
        visitDate: today
      };
      
      await StorageService.saveVisit(newVisit);
      navigate(`/visit/${newVisit.id}`);
    }
  };
  
  const getStatusIcon = () => {
    switch (visitStatus) {
      case VisitStatus.PENDING:
        return <Clock className="h-5 w-5 text-healthcare-warning" />;
      case VisitStatus.IN:
      case VisitStatus.OUT:
        return <Check className="h-5 w-5 text-healthcare-success" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden border border-healthcare-lightGray hover:shadow-md transition-shadow">
      <CardHeader className="bg-healthcare-lightGray py-4 px-5">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{patient.name}</span>
          {hasActiveVisit && (
            <span className={`text-sm px-2 py-1 rounded-full flex items-center ${
              visitStatus === VisitStatus.PENDING ? 'bg-healthcare-warning/20 text-healthcare-warning' : 
              visitStatus === VisitStatus.IN ? 'bg-healthcare-success/20 text-healthcare-success' :
              'bg-healthcare-gray/20 text-healthcare-gray'
            }`}>
              {getStatusIcon()}
              <span className="ml-1">{visitStatus}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex items-center text-healthcare-gray mb-6">
          <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{patient.address}</span>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleVisitClick} 
            className={`w-full text-base py-6 ${hasActiveVisit ? 
              'bg-healthcare-success hover:bg-healthcare-success/90' : 
              'bg-healthcare-primary hover:bg-healthcare-primary/90'}`}
          >
            {hasActiveVisit ? 'Continue Visit' : 'Start Visit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayPatientCard;
