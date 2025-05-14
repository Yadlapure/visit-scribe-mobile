
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraService } from '@/services/camera.service';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

interface SelfieCaptureProps {
  title: string;
  onCapture: (imageData: string) => void;
  existingImage?: string;
  disabled?: boolean;
}

const SelfieCapture: React.FC<SelfieCaptureProps> = ({
  title,
  onCapture,
  existingImage,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | undefined>(existingImage);
  
  const handleTakeSelfie = async () => {
    try {
      setLoading(true);
      const imageData = await CameraService.takeSelfie();
      setSelfieImage(imageData);
      onCapture(imageData);
      toast.success('Selfie captured successfully!');
    } catch (error) {
      console.error('Error capturing selfie:', error);
      toast.error('Failed to capture selfie. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="bg-healthcare-lightGray py-3 px-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {selfieImage ? (
          <div className="space-y-4">
            <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-slate-50">
              <img 
                src={selfieImage} 
                alt="Selfie" 
                className="h-full w-full object-cover" 
              />
            </div>
            
            {!disabled && (
              <Button 
                onClick={handleTakeSelfie} 
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                Retake Selfie
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-[250px] w-full bg-slate-50 rounded-lg">
              <Camera className="h-16 w-16 text-slate-300" />
            </div>
            
            <Button 
              onClick={handleTakeSelfie} 
              className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
              disabled={loading || disabled}
            >
              {loading ? 'Capturing...' : 'Take Selfie'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelfieCapture;
