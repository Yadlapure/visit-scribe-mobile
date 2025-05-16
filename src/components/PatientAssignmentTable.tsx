
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Patient, User } from '@/types';

export const PatientAssignmentTable = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock data - In a real app, these would come from your backend API
  const [patients, setPatients] = useState<Patient[]>([
    { 
      id: '1', 
      name: 'John Smith', 
      address: '123 Main St, Anytown, USA', 
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      assignedTo: '2',
      assignedDate: new Date().toISOString().split('T')[0]
    },
    { 
      id: '2', 
      name: 'Mary Johnson', 
      address: '456 Oak Ave, Somewhere, USA', 
      coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    { 
      id: '3', 
      name: 'Robert Williams', 
      address: '789 Pine Rd, Elsewhere, USA', 
      coordinates: { latitude: 41.8781, longitude: -87.6298 }
    },
    { 
      id: '4', 
      name: 'Patricia Brown', 
      address: '101 Cedar Ln, Nowhere, USA', 
      coordinates: { latitude: 37.7749, longitude: -122.4194 }
    },
    { 
      id: '5', 
      name: 'Michael Davis', 
      address: '202 Elm St, Anywhere, USA', 
      coordinates: { latitude: 39.9526, longitude: -75.1652 }
    },
  ]);

  // Practitioners data - only showing users with role "practitioner"
  const [practitioners, setPractitioners] = useState<User[]>([
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'practitioner', status: 'active' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'practitioner', status: 'inactive' },
  ]);

  const handleAssignPractitioner = async (patientId: string, practitionerId: string) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call to your backend
      // Example: await api.assignPractitionerToPatient(patientId, practitionerId)
      
      // For now, we'll update the local state to simulate the change
      const today = new Date().toISOString().split('T')[0];
      
      setPatients(patients.map(patient => 
        patient.id === patientId 
          ? { ...patient, assignedTo: practitionerId, assignedDate: today } 
          : patient
      ));
      
      toast({
        title: "Patient assigned",
        description: "Patient has been assigned to the practitioner successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not assign patient to practitioner",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignPatient = async (patientId: string) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call to your backend
      // Example: await api.unassignPatient(patientId)
      
      setPatients(patients.map(patient => 
        patient.id === patientId 
          ? { ...patient, assignedTo: undefined, assignedDate: undefined } 
          : patient
      ));
      
      toast({
        title: "Patient unassigned",
        description: "Patient has been unassigned successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not unassign patient",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssignedPractitioner = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient?.assignedTo) return null;
    
    return practitioners.find(p => p.id === patient.assignedTo);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Assignment Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => {
                const assignedPractitioner = getAssignedPractitioner(patient.id);
                
                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px]">{patient.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.assignedDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{patient.assignedDate}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {!patient.assignedTo ? (
                        <Select
                          onValueChange={(value) => handleAssignPractitioner(patient.id, value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign practitioner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {practitioners
                              .filter(p => p.status === 'active')
                              .map(practitioner => (
                                <SelectItem 
                                  key={practitioner.id} 
                                  value={practitioner.id}
                                >
                                  {practitioner.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="font-medium text-primary">
                          {assignedPractitioner?.name || "Unknown"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {patient.assignedTo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnassignPatient(patient.id)}
                          disabled={loading}
                        >
                          Unassign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
