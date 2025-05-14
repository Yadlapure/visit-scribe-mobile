
import React, { useState } from 'react';
import { Vitals } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VitalsFormProps {
  initialVitals?: Vitals;
  onSave: (vitals: Vitals) => void;
  disabled?: boolean;
}

const defaultVitals: Vitals = {
  bloodPressure: '',
  bloodSugar: '',
  heartRate: '',
  oxygenSaturation: '',
  notes: '',
};

const VitalsForm: React.FC<VitalsFormProps> = ({ 
  initialVitals = defaultVitals,
  onSave,
  disabled = false
}) => {
  const [vitals, setVitals] = useState<Vitals>(initialVitals);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(vitals);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="bg-healthcare-lightGray py-3 px-4">
        <CardTitle className="text-lg">Patient Vitals</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium mb-1">
                Blood Pressure
              </label>
              <Input
                id="bloodPressure"
                name="bloodPressure"
                placeholder="e.g., 120/80 mmHg"
                value={vitals.bloodPressure}
                onChange={handleChange}
                disabled={disabled}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="bloodSugar" className="block text-sm font-medium mb-1">
                Blood Sugar (mg/dL)
              </label>
              <Input
                id="bloodSugar"
                name="bloodSugar"
                placeholder="e.g., 100 mg/dL"
                value={vitals.bloodSugar}
                onChange={handleChange}
                disabled={disabled}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium mb-1">
                Heart Rate (BPM)
              </label>
              <Input
                id="heartRate"
                name="heartRate"
                placeholder="e.g., 72 BPM"
                value={vitals.heartRate}
                onChange={handleChange}
                disabled={disabled}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="oxygenSaturation" className="block text-sm font-medium mb-1">
                Oxygen Saturation (%)
              </label>
              <Input
                id="oxygenSaturation"
                name="oxygenSaturation"
                placeholder="e.g., 98%"
                value={vitals.oxygenSaturation}
                onChange={handleChange}
                disabled={disabled}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any observations or concerns..."
                value={vitals.notes}
                onChange={handleChange}
                disabled={disabled}
                className="w-full min-h-[100px]"
              />
            </div>
            
            {!disabled && (
              <Button 
                type="submit" 
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
              >
                Save Vitals
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VitalsForm;
