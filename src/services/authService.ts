import { User } from '../types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  FirebaseUser
} from './firebase';
import { getUserProfile, saveUserProfile } from './firestoreService';

const USERS_STORAGE_KEY = 'wecare_hospital_registered_users_v2';
const CURRENT_USER_KEY = 'wecare_hospital_active_user_v2';

export const ADMIN_EMAIL = 'sarthakdhanokar2@gmail.com';
export const ADMIN_PASSWORD = '1234567';

export const ADMIN_USER_RECORD: User & { password?: string } = {
  id: 'usr-admin-system-01',
  name: 'Hospital Administrator (Sarthak Dhanokar)',
  email: 'sarthakdhanokar2@gmail.com',
  phone: '+1 (555) 019-9000',
  age: 38,
  gender: 'Male',
  bloodGroup: 'O+',
  emergencyContact: '+1 (555) 019-9999',
  address: 'Executive Administration Office, Suite 400, WeCare Hospital',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'admin',
  password: '1234567'
};

const DEFAULT_USERS: (User & { password?: string })[] = [
  ADMIN_USER_RECORD,
  {
    id: 'usr-demo-001',
    name: 'Eleanor Vance',
    email: 'eleanor@example.com',
    phone: '+1 (555) 234-8901',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 892-1100',
    address: '142 Elmhurst Way, Metro City',
    createdAt: '2026-01-15T09:00:00.000Z',
    role: 'patient',
    password: 'password123'
  },
  {
    id: 'usr-demo-002',
    name: 'Marcus Sterling',
    email: 'marcus@example.com',
    phone: '+1 (555) 472-9182',
    age: 48,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: '+1 (555) 301-4499',
    address: '88 Oakridge Blvd, Metro City',
    createdAt: '2026-02-10T14:30:00.000Z',
    role: 'patient',
    password: 'password123'
  }
];

export function isUserAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || user.role === 'admin';
}

export function getStoredUsers(): (User & { password?: string })[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const list: (User & { password?: string })[] = JSON.parse(raw);
      // Ensure admin user is always up-to-date
      const adminIdx = list.findIndex(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      if (adminIdx === -1) {
        list.unshift(ADMIN_USER_RECORD);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
      } else {
        // Guarantee password & role
        list[adminIdx].password = ADMIN_PASSWORD;
        list[adminIdx].role = 'admin';
      }
      return list;
    }
  } catch (e) {
    console.error('Failed to load registered users from localStorage', e);
  }
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  } catch (e) {
    console.error('Failed to save default users', e);
  }
  return DEFAULT_USERS;
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load current user from localStorage', e);
  }
  return null;
}

export function saveCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

/**
 * Firebase Google Sign-In with popup
 */
export async function signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser: FirebaseUser = result.user;

    // Check if user already exists in Firestore
    let existingProfile: User | null = null;
    try {
      existingProfile = await getUserProfile(fbUser.uid);
    } catch {
      // Non-blocking fallback
    }

    const patientUser: User = {
      id: fbUser.uid,
      name: existingProfile?.name || fbUser.displayName || 'Verified Patient',
      email: fbUser.email || '',
      phone: existingProfile?.phone || fbUser.phoneNumber || '',
      age: existingProfile?.age || 32,
      gender: existingProfile?.gender || 'Male',
      bloodGroup: existingProfile?.bloodGroup || 'B+',
      emergencyContact: existingProfile?.emergencyContact || '',
      address: existingProfile?.address || '',
      createdAt: existingProfile?.createdAt || new Date().toISOString()
    };

    // Save profile to Firestore
    try {
      await saveUserProfile(patientUser);
    } catch (err) {
      console.warn('Could not sync user profile to Firestore immediately:', err);
    }

    saveCurrentUser(patientUser);
    return { success: true, user: patientUser };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in window closed before completion.' };
    }
    if (code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Sign-in cancelled.' };
    }
    return {
      success: false,
      error: error?.message || 'Google Sign-In could not be completed. Please try again.'
    };
  }
}

export function signInUser(
  email: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email address.' };
  }

  const users = getStoredUsers();
  const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matched) {
    return {
      success: false,
      error: 'No account found with this email. Please check your spelling or sign up.'
    };
  }

  if (password && matched.password && matched.password !== password) {
    return {
      success: false,
      error: 'Invalid password. Please try again or use the demo login.'
    };
  }

  const { password: _, ...safeUser } = matched;
  saveCurrentUser(safeUser);
  return { success: true, user: safeUser };
}

/**
 * Direct administrator login function
 */
export function signInAdmin(
  email: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'Unauthorized access. Only authorized hospital administrators can log in here.'
    };
  }

  if (!password || password !== ADMIN_PASSWORD) {
    return {
      success: false,
      error: 'Invalid administrator password. Please try again.'
    };
  }

  const adminUser: User = {
    id: ADMIN_USER_RECORD.id,
    name: ADMIN_USER_RECORD.name,
    email: ADMIN_USER_RECORD.email,
    phone: ADMIN_USER_RECORD.phone,
    age: ADMIN_USER_RECORD.age,
    gender: ADMIN_USER_RECORD.gender,
    bloodGroup: ADMIN_USER_RECORD.bloodGroup,
    emergencyContact: ADMIN_USER_RECORD.emergencyContact,
    address: ADMIN_USER_RECORD.address,
    createdAt: ADMIN_USER_RECORD.createdAt,
    role: 'admin'
  };

  saveCurrentUser(adminUser);
  return { success: true, user: adminUser };
}

export function signUpUser(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
}): { success: boolean; user?: User; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.name.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!data.phone || data.phone.trim().length < 7) {
    return { success: false, error: 'Please enter a valid contact phone number.' };
  }
  if (!data.age || data.age < 1 || data.age > 120) {
    return { success: false, error: 'Please enter a valid age between 1 and 120.' };
  }

  const users = getStoredUsers();
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in instead.'
    };
  }

  const newId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newUserRecord: User & { password?: string } = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    phone: data.phone.trim(),
    age: Number(data.age),
    gender: data.gender,
    bloodGroup: data.bloodGroup || 'Not specified',
    address: data.address?.trim() || '',
    createdAt: new Date().toISOString(),
    password: data.password || 'password123'
  };

  const updatedUsers = [...users, newUserRecord];
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (e) {
    console.error('Failed to save updated users list', e);
  }

  const { password: _, ...safeUser } = newUserRecord;
  saveCurrentUser(safeUser);
  return { success: true, user: safeUser };
}

export async function signOutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout error:', err);
  }
  saveCurrentUser(null);
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  let safeUser: User;

  if (index !== -1) {
    const current = users[index];
    const updatedRecord = {
      ...current,
      ...updates,
      id: current.id,
      email: current.email
    };
    users[index] = updatedRecord;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to update user profile in localStorage', e);
    }
    const { password: _, ...rest } = updatedRecord;
    safeUser = rest;
  } else {
    // Check current user
    const current = getCurrentUser();
    safeUser = {
      ...(current || {}),
      ...updates,
      id: userId
    } as User;
  }

  // Update in Firestore as well
  try {
    await saveUserProfile(safeUser);
  } catch (e) {
    console.warn('Could not sync profile update to Firestore:', e);
  }

  saveCurrentUser(safeUser);
  return safeUser;
}

/**
 * Setup listener for Firebase auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      // Fetch user profile from Firestore if available
      let profile: User | null = null;
      try {
        profile = await getUserProfile(fbUser.uid);
      } catch {
        // Fallback
      }

      const patientUser: User = {
        id: fbUser.uid,
        name: profile?.name || fbUser.displayName || 'Verified Patient',
        email: fbUser.email || '',
        phone: profile?.phone || fbUser.phoneNumber || '',
        age: profile?.age || 32,
        gender: profile?.gender || 'Male',
        bloodGroup: profile?.bloodGroup || 'B+',
        emergencyContact: profile?.emergencyContact || '',
        address: profile?.address || '',
        createdAt: profile?.createdAt || new Date().toISOString()
      };
      saveCurrentUser(patientUser);
      callback(patientUser);
    } else {
      // If no firebase user, check local storage
      const local = getCurrentUser();
      // If local user was a firebase user, sign them out
      if (local && !local.id.startsWith('usr-demo-')) {
        saveCurrentUser(null);
        callback(null);
      } else {
        callback(local);
      }
    }
  });
}
