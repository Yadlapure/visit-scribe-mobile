
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Visit, Patient } from '@/types';
import { StorageService } from '@/services/storage.service';
import { FaCalendarAlt, FaUserMd, FaPrescriptionBottleAlt, FaNotesMedical } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VisitCardProps {
  visit: Visit;
  practitionerName: string;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, practitionerName }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const patientData = await StorageService.getPatient(visit.patientId);
        if (patientData) {
          setPatient(patientData);
        }
      } catch (error) {
        console.error('Error loading patient:', error);
      }
    };
    
    loadPatient();
  }, [visit.patientId]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getStatusColor = () => {
    switch (visit.status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{patient?.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaCalendarAlt className="h-3 w-3 mr-1" />
                <span>{formatDate(visit.visitDate)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaUserMd className="h-3 w-3 mr-1" />
                <span>{practitionerName}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
                {visit.status}
              </span>
              
              {visit.status === 'COMPLETED' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-xs"
                  onClick={() => setShowDetails(true)}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient</h3>
              <p>{patient?.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Visit Date</h3>
              <p>{formatDate(visit.visitDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Practitioner</h3>
              <p>{practitionerName}</p>
            </div>
            
            {visit.vitals && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUserMd className="mr-1" /> Vitals
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p>{visit.vitals.bloodPressure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p>{visit.vitals.heartRate} BPM</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Sugar</p>
                    <p>{visit.vitals.bloodSugar} mg/dL</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Oxygen Saturation</p>
                    <p>{visit.vitals.oxygenSaturation}%</p>
                  </div>
                </div>
                {visit.vitals.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm">{visit.vitals.notes}</p>
                  </div>
                )}
              </div>
            )}
            
            {visit.prescription && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FaPrescriptionBottleAlt className="mr-1" /> Prescription
                </h3>
                <p className="text-sm whitespace-pre-line">{visit.prescription}</p>
                
                {visit.prescriptionImage && (
                  <div className="mt-2">
                    <img 
                      src={visit.prescriptionImage} 
                      alt="Prescription" 
                      className="border rounded max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
            )}
            
            {visit.reportDetails && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FaNotesMedical className="mr-1" /> Report Details
                </h3>
                <p className="text-sm whitespace-pre-line">{visit.reportDetails}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisitCard;
