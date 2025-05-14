
import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage.service';
import { Patient, Visit, VisitStatus } from '@/types';
import Header from '@/components/Header';
import PatientCard from '@/components/PatientCard';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize demo data
        await StorageService.initializeDemoData();
        
        // Load patients, visits and user
        const patientsData = await StorageService.getPatients();
        const visitsData = await StorageService.getVisits();
        const userData = await StorageService.getCurrentUser();
        
        setPatients(patientsData);
        setVisits(visitsData);
        setUser(userData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Find active visit for each patient
  const getActiveVisit = (patientId: string) => {
    return visits.find(visit => 
      visit.patientId === patientId && 
      (visit.status === VisitStatus.PENDING || visit.status === VisitStatus.IN)
    );
  };

  // Create new visit
  const handleCreateVisit = async (patient: Patient) => {
    const newVisit: Visit = {
      id: uuidv4(),
      patientId: patient.id,
      status: VisitStatus.PENDING
    };
    
    await StorageService.saveVisit(newVisit);
    navigate(`/visit/${newVisit.id}`);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Home Visits" 
        rightContent={
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
        } 
      />
      
      <div className="p-4 max-w-md mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading patients...</div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-medium mb-4">Your Patients</h2>
            {patients.length > 0 ? (
              patients.map(patient => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient}
                  activeVisit={getActiveVisit(patient.id)}
                />
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-healthcare-gray">No patients assigned yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
