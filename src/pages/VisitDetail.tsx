
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage.service';
import { Visit, Patient, VisitStatus, Vitals, LatLng } from '@/types';
import Header from '@/components/Header';
import VisitStatusCard from '@/components/VisitStatusCard';
import LocationMap from '@/components/LocationMap';
import SelfieCapture from '@/components/SelfieCapture';
import VitalsForm from '@/components/VitalsForm';
import PrescriptionForm from '@/components/PrescriptionForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { FaClock, FaUserAlt, FaStethoscope, FaFileAlt } from 'react-icons/fa';

const VisitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [inLocationCaptured, setInLocationCaptured] = useState(false);
  const [outLocationCaptured, setOutLocationCaptured] = useState(false);
  const [inSelfieCaptured, setInSelfieCaptured] = useState(false);
  const [outSelfieCaptured, setOutSelfieCaptured] = useState(false);
  const [vitalsCaptured, setVitalsCaptured] = useState(false);
  const [prescriptionCaptured, setPrescriptionCaptured] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [endVisitDialogOpen, setEndVisitDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('check-in');
  
  // Load visit data
  useEffect(() => {
    const loadVisitData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get visit data
        const visitData = await StorageService.getVisit(id);
        if (!visitData) {
          toast.error('Visit not found');
          navigate('/');
          return;
        }
        
        setVisit(visitData);
        
        // Check what steps have been completed
        if (visitData.inLocation) setInLocationCaptured(true);
        if (visitData.inSelfie) setInSelfieCaptured(true);
        if (visitData.vitals) setVitalsCaptured(true);
        if (visitData.outLocation) setOutLocationCaptured(true);
        if (visitData.outSelfie) setOutSelfieCaptured(true);
        if (visitData.prescription || visitData.prescriptionImage) setPrescriptionCaptured(true);
        
        // Set active tab based on visit status
        if (visitData.status === VisitStatus.IN) {
          setActiveTab('assessment');
        } else if (visitData.status === VisitStatus.PENDING) {
          setActiveTab('check-in');
        } else if (visitData.status === VisitStatus.COMPLETED) {
          setActiveTab('check-out');
        }
        
        // Get patient data
        const patientData = await StorageService.getPatient(visitData.patientId);
        if (patientData) {
          setPatient(patientData);
        }
        
      } catch (error) {
        console.error('Error loading visit:', error);
        toast.error('Failed to load visit data');
      } finally {
        setLoading(false);
      }
    };
    
    loadVisitData();
  }, [id, navigate]);
  
  // Handle location capture for check-in
  const handleInLocationCapture = async (location: LatLng) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        inLocation: location
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setInLocationCaptured(true);
      
      toast.success('Check-in location captured');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };
  
  // Handle selfie capture for check-in
  const handleInSelfieCapture = async (imageData: string) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        inSelfie: imageData
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setInSelfieCaptured(true);
      
      toast.success('Check-in selfie captured');
    } catch (error) {
      console.error('Error saving selfie:', error);
      toast.error('Failed to save selfie');
    }
  };
  
  // Handle vitals capture
  const handleVitalsSave = async (vitals: Vitals) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        vitals: vitals
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setVitalsCaptured(true);
      
      toast.success('Patient vitals saved');
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast.error('Failed to save vitals');
    }
  };
  
  // Handle prescription save
  const handlePrescriptionSave = async (prescriptionText: string, prescriptionImage?: string) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        prescription: prescriptionText,
        prescriptionImage: prescriptionImage || visit.prescriptionImage
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setPrescriptionCaptured(true);
      
      toast.success('Prescription information saved');
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    }
  };
  
  // Handle report details save
  const handleReportDetailsSave = async (reportDetails: string) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        reportDetails: reportDetails
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      
      toast.success('Report details saved');
    } catch (error) {
      console.error('Error saving report details:', error);
      toast.error('Failed to save report details');
    }
  };
  
  // Handle location capture for check-out
  const handleOutLocationCapture = async (location: LatLng) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        outLocation: location
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setOutLocationCaptured(true);
      
      toast.success('Check-out location captured');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };
  
  // Handle selfie capture for check-out
  const handleOutSelfieCapture = async (imageData: string) => {
    if (!visit || !id) return;
    
    try {
      const updatedVisit: Visit = {
        ...visit,
        outSelfie: imageData
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setOutSelfieCaptured(true);
      
      toast.success('Check-out selfie captured');
    } catch (error) {
      console.error('Error saving selfie:', error);
      toast.error('Failed to save selfie');
    }
  };
  
  // Handle check-in completion
  const handleCompleteCheckIn = async () => {
    if (!visit || !id) return;
    
    try {
      // Update visit status to IN
      const updatedVisit: Visit = {
        ...visit,
        status: VisitStatus.IN,
        startTime: new Date().toISOString()
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      setActiveTab('assessment');
      
      toast.success('Check-in completed successfully!');
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error completing check-in:', error);
      toast.error('Failed to complete check-in');
    }
  };
  
  // Handle check-out completion
  const handleCompleteCheckOut = async () => {
    if (!visit || !id) return;
    
    try {
      // Update visit status to COMPLETED
      const updatedVisit: Visit = {
        ...visit,
        status: VisitStatus.COMPLETED,
        endTime: new Date().toISOString()
      };
      
      await StorageService.saveVisit(updatedVisit);
      setVisit(updatedVisit);
      
      toast.success('Visit completed successfully!');
      setEndVisitDialogOpen(false);
      
      // Navigate back to home after a delay
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error completing check-out:', error);
      toast.error('Failed to complete check-out');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Header title="Visit Details" showBack={true} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading visit details...</div>
        </div>
      </div>
    );
  }
  
  if (!visit || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Header title="Visit Not Found" showBack={true} />
        <div className="p-4 text-center">
          <p className="mb-4">The requested visit could not be found.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  // Check if check-in is ready
  const isCheckInReady = inLocationCaptured && inSelfieCaptured && visit.status === VisitStatus.PENDING;
  
  // Check if check-out is ready
  const isCheckOutReady = visit.status === VisitStatus.IN && outLocationCaptured && outSelfieCaptured;
  
  // Check visit status to show appropriate content
  const showCheckInContent = true; // Always show
  const showVitalsContent = visit.status === VisitStatus.IN || visit.status === VisitStatus.COMPLETED;
  const showCheckOutContent = visit.status === VisitStatus.IN || visit.status === VisitStatus.COMPLETED;
  const isVisitComplete = visit.status === VisitStatus.COMPLETED;
  
  // Determine which tabs are enabled
  const isAssessmentTabEnabled = inLocationCaptured && inSelfieCaptured && 
    (visit.status === VisitStatus.IN || visit.status === VisitStatus.COMPLETED);
  const isCheckOutTabEnabled = isAssessmentTabEnabled && vitalsCaptured && 
    (visit.status === VisitStatus.IN || visit.status === VisitStatus.COMPLETED);

  const handleTabChange = (value: string) => {
    // Only allow tab changes if the conditions are met
    if (value === 'assessment' && !isAssessmentTabEnabled) {
      toast.error('Complete check-in first');
      return;
    }
    if (value === 'check-out' && !isCheckOutTabEnabled) {
      toast.error('Complete assessment first');
      return;
    }
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-20">
      <Header title={`Visit: ${patient.name}`} showBack={true} />
      
      <div className="p-4 max-w-md mx-auto">
        <VisitStatusCard visit={visit} />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="check-in" className="flex items-center gap-1">
              <FaClock className="h-4 w-4" />
              <span className="hidden sm:inline">Check In</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assessment" 
              className="flex items-center gap-1"
              disabled={!isAssessmentTabEnabled}
            >
              <FaStethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Assessment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="check-out" 
              className="flex items-center gap-1"
              disabled={!isCheckOutTabEnabled}
            >
              <FaFileAlt className="h-4 w-4" />
              <span className="hidden sm:inline">Check Out</span>
            </TabsTrigger>
          </TabsList>

          {/* Check In Tab */}
          <TabsContent value="check-in" className="mt-4">
            {(showCheckInContent) && (
              <div className="space-y-4">
                <LocationMap 
                  patientLocation={patient.coordinates}
                  userLocation={visit.inLocation}
                  onLocationCapture={handleInLocationCapture}
                  disabled={visit.status !== VisitStatus.PENDING}
                />
                
                {inLocationCaptured && (
                  <SelfieCapture 
                    title="Check-In Verification"
                    onCapture={handleInSelfieCapture}
                    existingImage={visit.inSelfie}
                    disabled={visit.status !== VisitStatus.PENDING}
                  />
                )}
                
                {isCheckInReady && (
                  <Button 
                    className="w-full bg-healthcare-success hover:bg-healthcare-success/90 py-6"
                    onClick={() => setConfirmDialogOpen(true)}
                  >
                    Complete Check In
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="mt-4">
            {(showVitalsContent) && (
              <div className="space-y-4">
                <VitalsForm 
                  initialVitals={visit.vitals}
                  onSave={handleVitalsSave}
                  disabled={isVisitComplete}
                />
                
                <PrescriptionForm
                  initialPrescription={visit.prescription}
                  initialImage={visit.prescriptionImage}
                  initialReportDetails={visit.reportDetails}
                  onPrescriptionSave={handlePrescriptionSave}
                  onReportDetailsSave={handleReportDetailsSave}
                  disabled={isVisitComplete}
                />
              </div>
            )}
          </TabsContent>

          {/* Check Out Tab */}
          <TabsContent value="check-out" className="mt-4">
            {(showCheckOutContent) && (
              <div className="space-y-4">
                <LocationMap 
                  patientLocation={patient.coordinates}
                  userLocation={visit.outLocation}
                  onLocationCapture={handleOutLocationCapture}
                  disabled={isVisitComplete}
                />
                
                {outLocationCaptured && (
                  <SelfieCapture 
                    title="Check-Out Verification"
                    onCapture={handleOutSelfieCapture}
                    existingImage={visit.outSelfie}
                    disabled={isVisitComplete}
                  />
                )}
                
                {isCheckOutReady && !isVisitComplete && (
                  <Button 
                    className="w-full bg-healthcare-success hover:bg-healthcare-success/90 py-6"
                    onClick={() => setEndVisitDialogOpen(true)}
                  >
                    Complete Visit
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Confirm Check In Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Check In?</DialogTitle>
          </DialogHeader>
          <p>
            This will mark you as present at the patient's location. Are you ready to start the visit?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-healthcare-success hover:bg-healthcare-success/90"
              onClick={handleCompleteCheckIn}
            >
              Confirm Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* End Visit Dialog */}
      <Dialog open={endVisitDialogOpen} onOpenChange={setEndVisitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Visit?</DialogTitle>
          </DialogHeader>
          <p>
            This will mark the visit as completed. You won't be able to make further changes. Continue?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEndVisitDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-healthcare-success hover:bg-healthcare-success/90"
              onClick={handleCompleteCheckOut}
            >
              Complete Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitDetail;
