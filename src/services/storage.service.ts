
import { Preferences } from '@capacitor/preferences';
import { Visit, Patient, User } from '../types';

export class StorageService {
  private static readonly VISITS_KEY = 'visits';
  private static readonly PATIENTS_KEY = 'patients';
  private static readonly CURRENT_USER_KEY = 'currentUser';

  // Visits
  static async getVisits(): Promise<Visit[]> {
    const { value } = await Preferences.get({ key: this.VISITS_KEY });
    return value ? JSON.parse(value) : [];
  }

  static async saveVisits(visits: Visit[]): Promise<void> {
    await Preferences.set({
      key: this.VISITS_KEY,
      value: JSON.stringify(visits)
    });
  }

  static async getVisit(id: string): Promise<Visit | undefined> {
    const visits = await this.getVisits();
    return visits.find(visit => visit.id === id);
  }

  static async saveVisit(visit: Visit): Promise<void> {
    const visits = await this.getVisits();
    const index = visits.findIndex(v => v.id === visit.id);
    
    if (index !== -1) {
      visits[index] = visit;
    } else {
      visits.push(visit);
    }
    
    await this.saveVisits(visits);
  }

  // Patients
  static async getPatients(): Promise<Patient[]> {
    const { value } = await Preferences.get({ key: this.PATIENTS_KEY });
    return value ? JSON.parse(value) : [];
  }

  static async savePatients(patients: Patient[]): Promise<void> {
    await Preferences.set({
      key: this.PATIENTS_KEY,
      value: JSON.stringify(patients)
    });
  }

  static async getPatient(id: string): Promise<Patient | undefined> {
    const patients = await this.getPatients();
    return patients.find(patient => patient.id === id);
  }

  // User
  static async getCurrentUser(): Promise<User | null> {
    const { value } = await Preferences.get({ key: this.CURRENT_USER_KEY });
    return value ? JSON.parse(value) : null;
  }

  static async saveCurrentUser(user: User): Promise<void> {
    await Preferences.set({
      key: this.CURRENT_USER_KEY,
      value: JSON.stringify(user)
    });
  }

  // Initialize demo data
  static async initializeDemoData(): Promise<void> {
    // Check if patients already exist
    const existingPatients = await this.getPatients();
    if (existingPatients.length === 0) {
      // Sample patients
      const patients: Patient[] = [
        {
          id: '1',
          name: 'Jane Smith',
          address: '123 Main St, Anytown',
          coordinates: { latitude: 37.7749, longitude: -122.4194 }
        },
        {
          id: '2',
          name: 'Robert Johnson',
          address: '456 Oak Ave, Somewhere',
          coordinates: { latitude: 37.7831, longitude: -122.4039 }
        },
        {
          id: '3',
          name: 'Maria Garcia',
          address: '789 Pine St, Elsewhere',
          coordinates: { latitude: 37.7694, longitude: -122.4269 }
        }
      ];
      await this.savePatients(patients);
    }

    // Create a default user if it doesn't exist
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      const user: User = {
        id: '1',
        name: 'Dr. Thomas Walker',
        role: 'practitioner'
      };
      await this.saveCurrentUser(user);
    }
  }
}
