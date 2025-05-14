
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage.service';
import { Patient, Visit, VisitStatus } from '@/types';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import { v4 as uuidv4 } from 'uuid';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  
  // Load patient data
  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const patientData = await StorageService.getPatient(id);
        const visitsData = await StorageService.getVisits();
        
        if (patientData) {
          setPatient(patientData);
          // Filter visits for this patient
          const patientVisits = visitsData.filter(v => v.patientId === id);
          setVisits(patientVisits);
        }
      } catch (error) {
        console.error('Error loading patient:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatient();
  }, [id]);
  
  // Create new visit
  const handleStartVisit = async () => {
    if (!patient) return;
    
    const newVisit: Visit = {
      id: uuidv4(),
      patientId: patient.id,
      status: VisitStatus.PENDING
    };
    
    await StorageService.saveVisit(newVisit);
    navigate(`/visit/${newVisit.id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Patient Details" showBack={true} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading patient details...</div>
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Patient Not Found" showBack={true} />
        <div className="p-4 text-center">
          <p className="mb-4">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/')}>Return to Patients</Button>
        </div>
      </div>
    );
  }
  
  // Check if there's an active visit
  const activeVisit = visits.find(visit => 
    visit.status === VisitStatus.PENDING || visit.status === VisitStatus.IN
  );
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Patient Details" showBack={true} />
      
      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-4">
          <CardHeader className="bg-healthcare-lightGray py-3 px-4">
            <CardTitle className="text-lg">{patient.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center text-healthcare-gray mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{patient.address}</span>
            </div>
            
            {activeVisit ? (
              <Button 
                onClick={() => navigate(`/visit/${activeVisit.id}`)}
                className="w-full bg-healthcare-success hover:bg-healthcare-success/90"
              >
                Continue Active Visit
              </Button>
            ) : (
              <Button 
                onClick={handleStartVisit}
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
              >
                Start New Visit
              </Button>
            )}
          </CardContent>
        </Card>
        
        <LocationMap 
          patientLocation={patient.coordinates}
          onLocationCapture={() => {}}
          disabled={true}
        />
        
        {visits.length > 0 && (
          <Card>
            <CardHeader className="bg-healthcare-lightGray py-3 px-4">
              <CardTitle className="text-lg">Visit History</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {visits.map(visit => (
                <div 
                  key={visit.id}
                  className="flex items-center justify-between border-b py-3 last:border-0"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-healthcare-gray" />
                    <div>
                      <div className="text-sm">
                        {visit.startTime 
                          ? new Date(visit.startTime).toLocaleDateString()
                          : 'Pending'
                        }
                      </div>
                      <div className="text-xs text-healthcare-gray">
                        Status: {visit.status}
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate(`/visit/${visit.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
