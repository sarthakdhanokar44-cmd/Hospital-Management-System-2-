import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Appointment, User } from '../types';

/**
 * Persist or update patient profile in Firestore
 */
export async function saveUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      age: typeof user.age === 'number' ? user.age : 30,
      gender: user.gender || 'Male',
      bloodGroup: user.bloodGroup || '',
      registeredAt: user.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch patient profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as User;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Create or save an appointment in Firestore
 */
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<void> {
  const path = `appointments/${appointment.id}`;
  try {
    const docRef = doc(db, 'appointments', appointment.id);
    await setDoc(docRef, {
      id: appointment.id,
      userId: appointment.userId || '',
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      doctorTitle: appointment.doctorTitle || '',
      doctorAvatar: appointment.doctorAvatar || '',
      departmentId: appointment.departmentId,
      departmentName: appointment.departmentName,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      appointmentType: appointment.appointmentType || 'In-Person Consultation',
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone || '',
      patientEmail: appointment.patientEmail || '',
      patientAge: typeof appointment.patientAge === 'number' ? appointment.patientAge : 0,
      patientGender: appointment.patientGender || 'Male',
      reason: appointment.reason || '',
      tokenNumber: appointment.tokenNumber,
      roomNumber: appointment.room || '',
      room: appointment.room || '',
      status: appointment.status,
      createdAt: appointment.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update an appointment status in Firestore
 */
export async function updateAppointmentStatusInFirestore(
  appointmentId: string,
  newStatus: 'Confirmed' | 'Completed' | 'Cancelled'
): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, {
      status: newStatus
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete an appointment from Firestore
 */
export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Update appointment details (e.g. status, date, timeSlot, room) in Firestore
 */
export async function updateAppointmentDetailsInFirestore(
  appointmentId: string,
  updates: Partial<Appointment>
): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, updates as any);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Real-time listener for ALL appointments (Admin portal)
 */
export function subscribeToAllAppointments(
  onAppointmentsChange: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'appointments';
  const q = collection(db, 'appointments');

  return onSnapshot(
    q,
    (snapshot) => {
      const apts: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        apts.push(docSnap.data() as Appointment);
      });
      // Sort newest first
      apts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onAppointmentsChange(apts);
    },
    (error) => {
      console.error('Snapshot error for all appointments (Admin):', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Fetch all appointments once from Firestore (Admin)
 */
export async function getAllAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const snap = await getDocs(collection(db, 'appointments'));
    const apts: Appointment[] = [];
    snap.forEach(docSnap => {
      apts.push(docSnap.data() as Appointment);
    });
    apts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return apts;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Real-time listener for current user's appointments
 */
export function subscribeToUserAppointments(
  userId: string,
  onAppointmentsChange: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'appointments';
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const apts: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        apts.push(docSnap.data() as Appointment);
      });
      // Sort newest first
      apts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onAppointmentsChange(apts);
    },
    (error) => {
      console.error('Snapshot error for appointments:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
