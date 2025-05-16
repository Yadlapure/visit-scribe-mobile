
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageService } from '@/services/storage.service';
import { Visit, Patient } from '@/types';
import { FaCalendarCheck, FaStethoscope, FaNotesMedical, FaUserMd } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VisitCard from '@/components/VisitCard';
import { Button } from '@/components/ui/button';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all visits and patients
        const allVisits = await StorageService.getVisits();
        const allPatients = await StorageService.getPatients();
        
        // Filter patients that match the current user ID
        const userPatients = allPatients.filter(patient => 
          // In a real app, patients would have a userId field
          // This is a simplified implementation for demo purposes
          patient.name === user?.name
        );
        
        // Filter visits related to the user's patients
        const userVisits = allVisits.filter(visit => 
          userPatients.some(patient => patient.id === visit.patientId)
        );
        
        setVisits(userVisits);
        setPatients(userPatients);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user]);

  // Find a practitioner assigned to the patient
  const getPractitionerName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.assignedTo ? "Dr. Smith" : "No practitioner assigned";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Header title="My Healthcare" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading your healthcare information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header 
        title="My Healthcare" 
        rightContent={
          <Button 
            variant="ghost"
            size="icon" 
            onClick={() => window.location.href = '/profile'}
          >
            <FaUserMd className="h-5 w-5" />
          </Button>
        }
      />
      
      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Welcome, {user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Here you can view your upcoming and past visits with healthcare practitioners.</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <FaCalendarCheck className="h-4 w-4" />
              <span>All Visits</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-1">
              <FaStethoscope className="h-4 w-4" />
              <span>Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <FaNotesMedical className="h-4 w-4" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {visits.length > 0 ? (
              visits.map(visit => (
                <VisitCard 
                  key={visit.id} 
                  visit={visit} 
                  practitionerName={getPractitionerName(visit.patientId)}
                />
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-healthcare-gray">No visits found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {visits.filter(v => v.status === 'PENDING' || v.status === 'IN').length > 0 ? (
              visits
                .filter(v => v.status === 'PENDING' || v.status === 'IN')
                .map(visit => (
                  <VisitCard 
                    key={visit.id} 
                    visit={visit} 
                    practitionerName={getPractitionerName(visit.patientId)}
                  />
                ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-healthcare-gray">No upcoming visits.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4 space-y-4">
            {visits.filter(v => v.status === 'COMPLETED').length > 0 ? (
              visits
                .filter(v => v.status === 'COMPLETED')
                .map(visit => (
                  <VisitCard 
                    key={visit.id} 
                    visit={visit} 
                    practitionerName={getPractitionerName(visit.patientId)}
                  />
                ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-healthcare-gray">No completed visits.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
