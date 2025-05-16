
import { Preferences } from '@capacitor/preferences';
import { Patient, Visit, VisitStatus } from '../types';

export class StorageService {
  private static async getData(key: string): Promise<any> {
    const { value } = await Preferences.get({ key });
    try {
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error parsing data for key ${key}:`, error);
      return null;
    }
  }

  private static async setData(key: string, data: any): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(data) });
  }

  // Patient management
  static async getPatients(): Promise<Patient[]> {
    const patients = await this.getData('patients');
    return patients || [];
  }

  static async savePatient(patient: Patient): Promise<void> {
    const patients = await this.getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);

    if (existingIndex > -1) {
      patients[existingIndex] = patient;
    } else {
      patients.push(patient);
    }

    await this.setData('patients', patients);
  }

  static async getPatient(id: string): Promise<Patient | null> {
    const patients = await this.getPatients();
    return patients.find(patient => patient.id === id) || null;
  }

  // Visit management
  static async getVisits(): Promise<Visit[]> {
    const visits = await this.getData('visits');
    return visits || [];
  }

  static async saveVisit(visit: Visit): Promise<void> {
    const visits = await this.getVisits();
    const existingIndex = visits.findIndex(v => v.id === visit.id);

    if (existingIndex > -1) {
      visits[existingIndex] = visit;
    } else {
      visits.push(visit);
    }

    await this.setData('visits', visits);
  }

  static async getVisit(id: string): Promise<Visit | null> {
    const visits = await this.getVisits();
    return visits.find(visit => visit.id === id) || null;
  }

  // User management
  static async getUsers(): Promise<any[]> {
    const users = await this.getData('users');
    return users || [];
  }

  static async getCurrentUser(): Promise<any | null> {
    const currentUser = await this.getData('currentUser');
    return currentUser || null;
  }

  static async setCurrentUser(user: any): Promise<void> {
    await this.setData('currentUser', user);
  }

  static async clearCurrentUser(): Promise<void> {
    await this.setData('currentUser', null);
  }

  // Demo data initialization
  static async initializeDemoData(): Promise<void> {
    // Initialize demo patients if they don't exist
    let patients = await this.getPatients();
    if (!patients || patients.length === 0) {
      const demoPatients: Patient[] = [
        {
          id: "patient-1",
          name: "John Doe",
          address: "123 Main St, Anytown",
          coordinates: { latitude: 34.0522, longitude: -118.2437 },
          assignedTo: "user-2",
          assignedDate: new Date().toISOString().split('T')[0]
        },
        {
          id: "patient-2",
          name: "Jane Smith",
          address: "456 Elm St, Anytown",
          coordinates: { latitude: 34.0522, longitude: -118.2437 },
          assignedTo: "user-2",
          assignedDate: new Date().toISOString().split('T')[0]
        }
      ];
      await this.setData('patients', demoPatients);
      patients = demoPatients;
    }

    // Initialize demo visits if they don't exist
    let visits = await this.getVisits();
    if (!visits || visits.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const demoVisits: Visit[] = [
        {
          id: "visit-1",
          patientId: patients[0].id,
          visitDate: today,
          status: VisitStatus.PENDING
        }
      ];
      await this.setData('visits', demoVisits);
    }

    // Initialize demo users if they don't exist
    const users = await this.getUsers();
    if (!users || users.length === 0) {
      const demoUsers = [
        {
          id: "user-1",
          name: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          role: "admin"
        },
        {
          id: "user-2",
          name: "Dr. Smith",
          email: "doctor@example.com",
          password: "doctor123",
          role: "practitioner"
        },
        {
          id: "user-3",
          name: "Patient User",
          email: "patient@example.com",
          password: "patient123",
          role: "client"
        }
      ];
      await this.setData('users', demoUsers);
    }
  }
}
