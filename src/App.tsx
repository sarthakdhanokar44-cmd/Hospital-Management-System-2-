/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage, Doctor, Department, Appointment, User } from './types';
import { getCurrentUser, signOutUser, onAuthChange, isUserAdmin } from './services/authService';
import { testConnection } from './services/firebase';
import {
  saveAppointmentToFirestore,
  updateAppointmentStatusInFirestore,
  updateAppointmentDetailsInFirestore,
  deleteAppointmentFromFirestore,
  subscribeToUserAppointments,
  subscribeToAllAppointments
} from './services/firestoreService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BookingPage } from './pages/BookingPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { BookingModal } from './components/BookingModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { INITIAL_APPOINTMENTS } from './data/hospitalData';
import { CheckCircle2, X } from 'lucide-react';

const STORAGE_KEY = 'wecare_hospital_appointments_v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('cardiology');

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntentMessage, setAuthIntentMessage] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Appointments state with LocalStorage persistence
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load appointments from localStorage', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDeptId, setBookingDeptId] = useState<string>('cardiology');
  const [bookingDoctorId, setBookingDoctorId] = useState<string>('');

  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to save appointments to localStorage', e);
    }
  }, [appointments]);

  // Test Firebase connection and listen to Auth state
  useEffect(() => {
    testConnection();

    const unsubscribeAuth = onAuthChange((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Listen to Firestore appointments: All appointments for Admin, or User appointments for Patient
  useEffect(() => {
    const isAdmin = isUserAdmin(currentUser);

    if (isAdmin || currentPage === 'admin') {
      const unsubscribeAdmin = subscribeToAllAppointments(
        (allFirestoreApts) => {
          if (allFirestoreApts.length > 0) {
            setAppointments(prev => {
              const firestoreIds = new Set(allFirestoreApts.map(a => a.id));
              const localExtras = prev.filter(a => !firestoreIds.has(a.id));
              return [...allFirestoreApts, ...localExtras];
            });
          }
        },
        (err) => {
          console.warn('Admin appointments subscription note:', err);
        }
      );

      return () => {
        unsubscribeAdmin();
      };
    }

    if (currentUser?.id) {
      const unsubscribeFirestore = subscribeToUserAppointments(
        currentUser.id,
        (firestoreApts) => {
          if (firestoreApts.length > 0) {
            setAppointments(prev => {
              const firestoreIds = new Set(firestoreApts.map(a => a.id));
              const remaining = prev.filter(a => !firestoreIds.has(a.id));
              return [...firestoreApts, ...remaining];
            });
          }
        },
        (err) => {
          console.warn('Firestore real-time subscription note:', err);
        }
      );

      return () => {
        unsubscribeFirestore();
      };
    }
  }, [currentUser, currentPage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRequireAuth = (intentMsg?: string) => {
    setAuthIntentMessage(intentMsg || 'Please sign in or create an account to book an appointment.');
    setIsAuthModalOpen(true);
  };

  const handleSignInSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setAuthIntentMessage(null);
    showToast(`Welcome, ${user.name}!`);
  };

  const handleSignOut = () => {
    signOutUser();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    showToast('You have been signed out.');
  };

  const handleUpdateProfile = (updated: User) => {
    setCurrentUser(updated);
    showToast('Profile updated successfully.');
  };

  const handleSaveAppointment = async (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    showToast(`Appointment confirmed! Token: ${newAppointment.tokenNumber}`);

    // If user is authenticated, sync to Firestore
    if (currentUser?.id) {
      try {
        await saveAppointmentToFirestore(newAppointment);
      } catch (error) {
        console.warn('Could not sync appointment to Firestore:', error);
      }
    }
  };

  // Administrative update handler
  const handleAdminUpdateAppointment = async (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    try {
      await updateAppointmentDetailsInFirestore(updated.id, updated);
    } catch (error) {
      console.warn('Admin Firestore update note:', error);
    }
  };

  // Administrative delete handler
  const handleAdminDeleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    try {
      await deleteAppointmentFromFirestore(id);
    } catch (error) {
      console.warn('Admin Firestore delete note:', error);
    }
  };

  // Administrative add booking handler
  const handleAdminAddBooking = async (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    try {
      await saveAppointmentToFirestore(newAppointment);
    } catch (error) {
      console.warn('Admin Firestore add booking note:', error);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    setAppointments(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'Cancelled' as const } : item)
    );
    showToast('Appointment has been cancelled.');

    // If user is authenticated, sync to Firestore
    if (currentUser?.id) {
      try {
        await updateAppointmentStatusInFirestore(id, 'Cancelled');
      } catch (error) {
        console.warn('Could not sync status update to Firestore:', error);
      }
    }
  };

  const handleOpenBooking = (deptId?: string, doctorId?: string) => {
    if (deptId) setBookingDeptId(deptId);
    if (doctorId) setBookingDoctorId(doctorId);
    setIsBookingModalOpen(true);
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDeptId(deptId);
    setCurrentPage('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctorForModal(doctor);
  };

  // Active user's confirmed appointments count
  const activeUserAppointmentsCount = currentUser
    ? appointments.filter(a => 
        (a.userId === currentUser.id || a.patientEmail.toLowerCase() === currentUser.email.toLowerCase()) && 
        a.status === 'Confirmed'
      ).length
    : appointments.filter(a => a.status === 'Confirmed').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Hospital Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        appointmentsCount={activeUserAppointmentsCount}
        onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
        onOpenBookingModal={() => handleOpenBooking()}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthIntentMessage(null);
          setIsAuthModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onOpenBooking={handleOpenBooking}
            onViewDoctor={handleViewDoctor}
            onSelectDepartment={handleSelectDepartment}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={setCurrentPage}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            selectedDeptId={selectedDeptId}
            onSelectDepartment={setSelectedDeptId}
            onOpenBooking={handleOpenBooking}
            onViewDoctor={handleViewDoctor}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onOpenBooking={handleOpenBooking}
            onViewDoctor={handleViewDoctor}
          />
        )}

        {currentPage === 'book' && (
          <BookingPage
            initialDeptId={selectedDeptId}
            initialDoctorId={bookingDoctorId}
            onSaveAppointment={handleSaveAppointment}
            onNavigate={setCurrentPage}
            onOpenAppointmentsModal={() => setIsAppointmentsModalOpen(true)}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortalPage
            currentUser={currentUser}
            onAdminLoginSuccess={(adminUser) => {
              setCurrentUser(adminUser);
              showToast(`Administrator logged in: ${adminUser.email}`);
            }}
            onSignOut={handleSignOut}
            appointments={appointments}
            onUpdateAppointment={handleAdminUpdateAppointment}
            onCancelAppointment={handleCancelAppointment}
            onDeleteAppointment={handleAdminDeleteAppointment}
            onAddBooking={handleAdminAddBooking}
            onNavigate={setCurrentPage}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onSelectDepartment={handleSelectDepartment}
        onOpenBookingModal={() => handleOpenBooking()}
        currentUser={currentUser}
      />

      {/* Quick Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDeptId={bookingDeptId}
        preselectedDoctorId={bookingDoctorId}
        onSaveAppointment={handleSaveAppointment}
        onViewAllAppointments={() => setIsAppointmentsModalOpen(true)}
        currentUser={currentUser}
        onRequireAuth={handleRequireAuth}
      />

      {/* My Appointments Drawer / Modal */}
      <MyAppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onBookNew={() => handleOpenBooking()}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthIntentMessage('Sign in to view and manage your hospital appointments');
          setIsAppointmentsModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Doctor Bio Modal */}
      <DoctorDetailModal
        doctor={selectedDoctorForModal}
        onClose={() => setSelectedDoctorForModal(null)}
        onBook={(doc) => handleOpenBooking(doc.departmentId, doc.id)}
      />

      {/* Patient Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSignInSuccess}
        bookingIntentMessage={authIntentMessage}
      />

      {/* Patient Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateProfile}
          onSignOut={handleSignOut}
          appointments={appointments}
          onOpenAppointments={() => {
            setIsProfileModalOpen(false);
            setIsAppointmentsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
