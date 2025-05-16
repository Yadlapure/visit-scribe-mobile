
export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Patient {
  id: string;
  name: string;
  address: string;
  coordinates: LatLng;
  assignedDate?: string; // Date when patient is assigned to practitioner
  assignedTo?: string; // ID of practitioner assigned to this patient
}

export interface Vitals {
  bloodPressure: string;
  bloodSugar: string; // mg/dL
  heartRate: string;  // BPM
  oxygenSaturation: string; // %
  notes: string;
}

export enum VisitStatus {
  PENDING = 'PENDING',
  IN = 'IN',
  OUT = 'OUT',
  COMPLETED = 'COMPLETED'
}

export interface Visit {
  id: string;
  patientId: string;
  startTime?: string;
  endTime?: string;
  status: VisitStatus;
  inSelfie?: string; // Base64 string
  outSelfie?: string; // Base64 string
  inLocation?: LatLng;
  outLocation?: LatLng;
  vitals?: Vitals;
  prescription?: string; // Text prescription
  prescriptionImage?: string; // Base64 string of prescription image
  reportDetails?: string; // Additional report details
  visitDate: string; // Date of the visit
}

export interface User {
  id: string;
  name: string;
  role: 'client' | 'practitioner' | 'admin';
  email?: string;
  status?: 'active' | 'inactive';
}
