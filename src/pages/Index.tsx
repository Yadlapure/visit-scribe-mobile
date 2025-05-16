
import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage.service';
import { Patient, Visit, VisitStatus } from '@/types';
import Header from '@/components/Header';
import TodayPatientCard from '@/components/TodayPatientCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaUser, FaCalendar, FaShieldAlt } from 'react-icons/fa';
import AdminLink from '@/components/AdminLink';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const [todayPatient, setTodayPatient] = useState<Patient | null>(null);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize demo data
        await StorageService.initializeDemoData();
        
        // Load patients and visits
        const patientsData = await StorageService.getPatients();
        const visitsData = await StorageService.getVisits();
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        if (user && user.role === 'practitioner') {
          // Find today's assigned patient for current practitioner
          const todaysPatient = patientsData.find(patient => 
            patient.assignedDate === today && 
            patient.assignedTo === user.id
          );
          
          if (todaysPatient) {
            setTodayPatient(todaysPatient);
            
            // Find active visit for this patient
            const patientVisit = visitsData.find(visit => 
              visit.patientId === todaysPatient.id && 
              visit.visitDate === today && 
              (visit.status === VisitStatus.PENDING || visit.status === VisitStatus.IN)
            );
            
            if (patientVisit) {
              setActiveVisit(patientVisit);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header 
        title="Home Visits" 
        rightContent={
          <div className="flex items-center gap-2">
            <AdminLink className="hidden md:flex" />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')}
            >
              <FaUser className="h-5 w-5" />
            </Button>
          </div>
        } 
      />
      
      <div className="p-4 max-w-md mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading patient data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Today's Visit</h2>
              <div className="flex items-center text-sm text-healthcare-gray">
                <FaCalendar className="h-4 w-4 mr-1" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {todayPatient ? (
              <TodayPatientCard 
                patient={todayPatient}
                activeVisit={activeVisit}
              />
            ) : user?.role === 'practitioner' ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-healthcare-lightGray">
                <div className="mb-4 text-healthcare-gray">
                  <FaCalendar className="mx-auto h-12 w-12 text-healthcare-primary opacity-70" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Patient Assigned Today</h3>
                <p className="text-healthcare-gray mb-6">
                  You don't have any patients assigned for today's visits.
                </p>
              </div>
            ) : user?.role === 'admin' ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-healthcare-lightGray">
                <div className="mb-4 text-healthcare-gray">
                  <FaShieldAlt className="mx-auto h-12 w-12 text-healthcare-primary opacity-70" />
                </div>
                <h3 className="text-lg font-medium mb-2">Admin Dashboard</h3>
                <p className="text-healthcare-gray mb-6">
                  Access the admin panel to manage users and assignments.
                </p>
                <Button onClick={() => navigate('/admin')} className="bg-healthcare-primary hover:bg-healthcare-primary/90">
                  Go to Admin Dashboard
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-healthcare-gray">No patients assigned yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
