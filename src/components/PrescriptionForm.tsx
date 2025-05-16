
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CameraService } from '@/services/camera.service';
import { Camera, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface PrescriptionFormProps {
  initialPrescription?: string;
  initialImage?: string;
  initialReportDetails?: string;
  onPrescriptionSave: (prescription: string, image?: string) => void;
  onReportDetailsSave: (report: string) => void;
  disabled?: boolean;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialPrescription = '',
  initialImage,
  initialReportDetails = '',
  onPrescriptionSave,
  onReportDetailsSave,
  disabled = false
}) => {
  const [prescription, setPrescription] = useState(initialPrescription);
  const [prescriptionImage, setPrescriptionImage] = useState<string | undefined>(initialImage);
  const [reportDetails, setReportDetails] = useState(initialReportDetails);
  const [loading, setLoading] = useState(false);
  
  const handleCapturePrescriptionImage = async () => {
    try {
      setLoading(true);
      const imageData = await CameraService.takeSelfie();
      setPrescriptionImage(imageData);
      toast.success('Prescription image captured successfully!');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Failed to capture image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPrescriptionImage(undefined);
  };
  
  const handleSavePrescription = () => {
    onPrescriptionSave(prescription, prescriptionImage);
  };
  
  const handleSaveReport = () => {
    onReportDetailsSave(reportDetails);
  };
  
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-healthcare-lightGray py-3 px-4">
          <CardTitle className="text-lg">Prescription</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prescription" className="mb-2 block">Prescription Details</Label>
              <Textarea
                id="prescription"
                placeholder="Enter prescription details..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="min-h-[120px]"
                disabled={disabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="block">Prescription Image</Label>
              {prescriptionImage ? (
                <div className="relative">
                  <img 
                    src={prescriptionImage} 
                    alt="Prescription" 
                    className="w-full h-[200px] object-cover rounded-md" 
                  />
                  {!disabled && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-2 right-2 rounded-full w-8 h-8"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={handleCapturePrescriptionImage} 
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90 h-[100px] flex flex-col items-center justify-center"
                  disabled={loading || disabled}
                >
                  <Camera className="h-6 w-6 mb-2" />
                  {loading ? 'Capturing...' : 'Capture Prescription Image'}
                </Button>
              )}
            </div>
            
            {!disabled && (
              <Button 
                onClick={handleSavePrescription} 
                className="w-full bg-healthcare-success hover:bg-healthcare-success/90"
                disabled={(!prescription && !prescriptionImage) || disabled}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Prescription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-healthcare-lightGray py-3 px-4">
          <CardTitle className="text-lg">Visit Report</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="report" className="mb-2 block">Additional Report Details</Label>
              <Textarea
                id="report"
                placeholder="Enter additional report details, observations, or follow-up notes..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="min-h-[150px]"
                disabled={disabled}
              />
            </div>
            
            {!disabled && (
              <Button 
                onClick={handleSaveReport} 
                className="w-full bg-healthcare-success hover:bg-healthcare-success/90"
                disabled={!reportDetails || disabled}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionForm;
