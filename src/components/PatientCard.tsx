
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, Visit, VisitStatus } from '@/types';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
  activeVisit?: Visit;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, activeVisit }) => {
  const navigate = useNavigate();
  
  const hasActiveVisit = activeVisit && 
    (activeVisit.status === VisitStatus.PENDING || 
     activeVisit.status === VisitStatus.IN);
  
  const visitStatus = activeVisit?.status || 'NONE';
  
  const handleVisitClick = () => {
    if (hasActiveVisit) {
      navigate(`/visit/${activeVisit.id}`);
    } else {
      navigate(`/patients/${patient.id}`);
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden border border-healthcare-lightGray">
      <CardHeader className="bg-healthcare-lightGray py-3 px-4">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{patient.name}</span>
          {hasActiveVisit && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              visitStatus === VisitStatus.PENDING ? 'bg-healthcare-warning/20 text-healthcare-warning' : 
              visitStatus === VisitStatus.IN ? 'bg-healthcare-success/20 text-healthcare-success' :
              'bg-healthcare-gray/20 text-healthcare-gray'
            }`}>
              {visitStatus}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-healthcare-gray mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{patient.address}</span>
        </div>
        
        <Button 
          onClick={handleVisitClick} 
          className={hasActiveVisit ? 'bg-healthcare-success hover:bg-healthcare-success/90 w-full' : 'bg-healthcare-primary hover:bg-healthcare-primary/90 w-full'}
        >
          {hasActiveVisit ? 'Continue Visit' : 'Start Visit'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
