import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  User as UserIcon, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  X, 
  UserPlus, 
  Printer, 
  Phone, 
  Mail, 
  FileText, 
  Check, 
  Building, 
  Stethoscope, 
  LogOut,
  ArrowRight,
  Sparkles,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { Appointment, AppointmentStatus, Doctor, NavPage, User } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { signInAdmin, isUserAdmin } from '../services/authService';

interface AdminPortalPageProps {
  currentUser: User | null;
  onAdminLoginSuccess: (user: User) => void;
  onSignOut: () => void;
  appointments: Appointment[];
  onUpdateAppointment: (updated: Appointment) => Promise<void> | void;
  onCancelAppointment: (id: string) => Promise<void> | void;
  onDeleteAppointment: (id: string) => Promise<void> | void;
  onAddBooking: (newAppointment: Appointment) => Promise<void> | void;
  onNavigate: (page: NavPage) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  currentUser,
  onAdminLoginSuccess,
  onSignOut,
  appointments,
  onUpdateAppointment,
  onCancelAppointment,
  onDeleteAppointment,
  onAddBooking,
  onNavigate,
  onShowToast
}) => {
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'patient-name'>('date-desc');

  // Modals inside Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingSlipAppointment, setViewingSlipAppointment] = useState<Appointment | null>(null);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);

  // New Booking Form State (Admin End)
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number | ''>(32);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientBloodGroup, setNewPatientBloodGroup] = useState('O+');
  const [newDeptId, setNewDeptId] = useState<string>('cardiology');
  const [newDoctorId, setNewDoctorId] = useState<string>('doc-arthur-vance');
  const [newDate, setNewDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newTimeSlot, setNewTimeSlot] = useState<string>('09:30 AM – 10:00 AM');
  const [newRoom, setNewRoom] = useState<string>('Room 402, Executive Wing');
  const [newAppointmentType, setNewAppointmentType] = useState<'In-Person Consultation' | 'Video Follow-up' | 'Second Opinion'>('In-Person Consultation');
  const [newReason, setNewReason] = useState('Comprehensive outpatient clinical consultation');
  const [newCustomToken, setNewCustomToken] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newBookingError, setNewBookingError] = useState<string | null>(null);

  // Edit Booking Form State
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editStatus, setEditStatus] = useState<AppointmentStatus>('Confirmed');
  const [editReason, setEditReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdminAuthenticated = isUserAdmin(currentUser);

  // Handle Admin Login submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const result = signInAdmin(loginEmail, loginPassword);
      setIsLoggingIn(false);
      if (result.success && result.user) {
        onAdminLoginSuccess(result.user);
        onShowToast('Welcome to WeCare Hospital Administrative Console.');
      } else {
        setLoginError(result.error || 'Authentication failed. Please verify admin credentials.');
      }
    }, 400);
  };

  // Doctors for the selected department in Add Modal
  const availableDoctors = useMemo(() => {
    return DOCTORS.filter(d => d.departmentId === newDeptId);
  }, [newDeptId]);

  // When newDeptId changes, update doctor and room defaults
  const handleDeptChange = (deptId: string) => {
    setNewDeptId(deptId);
    const docs = DOCTORS.filter(d => d.departmentId === deptId);
    if (docs.length > 0) {
      setNewDoctorId(docs[0].id);
      setNewRoom(docs[0].room);
    }
  };

  const handleDoctorChange = (docId: string) => {
    setNewDoctorId(docId);
    const doc = DOCTORS.find(d => d.id === docId);
    if (doc) {
      setNewRoom(doc.room);
    }
  };

  // Reset Add Form
  const resetAddForm = () => {
    setNewPatientName('');
    setNewPatientPhone('');
    setNewPatientEmail('');
    setNewPatientAge(32);
    setNewPatientGender('Male');
    setNewPatientBloodGroup('O+');
    setNewDeptId('cardiology');
    setNewDoctorId('doc-arthur-vance');
    setNewRoom('Room 402, Executive Wing');
    setNewTimeSlot('09:30 AM – 10:00 AM');
    setNewReason('Comprehensive outpatient clinical consultation');
    setNewCustomToken('');
    setNewBookingError(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setEditDate(apt.date);
    setEditTimeSlot(apt.timeSlot);
    setEditDoctorId(apt.doctorId);
    setEditRoom(apt.room);
    setEditStatus(apt.status);
    setEditReason(apt.reason);
  };

  // Save Edited Appointment
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    setIsUpdating(true);
    const assignedDoc = DOCTORS.find(d => d.id === editDoctorId);

    const updatedApt: Appointment = {
      ...editingAppointment,
      date: editDate,
      timeSlot: editTimeSlot,
      doctorId: assignedDoc ? assignedDoc.id : editingAppointment.doctorId,
      doctorName: assignedDoc ? assignedDoc.name : editingAppointment.doctorName,
      doctorTitle: assignedDoc ? assignedDoc.title : editingAppointment.doctorTitle,
      doctorAvatar: assignedDoc ? assignedDoc.avatarUrl : editingAppointment.doctorAvatar,
      departmentId: assignedDoc ? assignedDoc.departmentId : editingAppointment.departmentId,
      departmentName: assignedDoc ? assignedDoc.departmentName : editingAppointment.departmentName,
      room: editRoom || (assignedDoc ? assignedDoc.room : editingAppointment.room),
      status: editStatus,
      reason: editReason
    };

    try {
      await onUpdateAppointment(updatedApt);
      onShowToast(`Appointment #${updatedApt.tokenNumber} updated successfully.`);
      setEditingAppointment(null);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to update appointment. Please check connection.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Submit New Booking (Admin End)
  const handleSubmitNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewBookingError(null);

    if (!newPatientName.trim()) {
      setNewBookingError('Please enter patient full name.');
      return;
    }
    if (!newPatientPhone.trim()) {
      setNewBookingError('Please enter contact phone number.');
      return;
    }
    if (!newDate) {
      setNewBookingError('Please select appointment date.');
      return;
    }

    setIsSubmittingNew(true);

    const selectedDoc = DOCTORS.find(d => d.id === newDoctorId) || DOCTORS[0];
    const selectedDept = DEPARTMENTS.find(d => d.id === newDeptId) || DEPARTMENTS[0];
    const token = newCustomToken.trim() || `OPD-ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const appointmentId = `apt-admin-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      userId: currentUser?.id || 'usr-admin-system-01',
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      doctorTitle: selectedDoc.title,
      doctorAvatar: selectedDoc.avatarUrl,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      patientName: newPatientName.trim(),
      patientPhone: newPatientPhone.trim(),
      patientEmail: newPatientEmail.trim() || `${newPatientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@patient.wecare.org`,
      patientAge: Number(newPatientAge) || 30,
      patientGender: newPatientGender,
      date: newDate,
      timeSlot: newTimeSlot,
      reason: newReason.trim() || 'Clinical outpatient consultation',
      appointmentType: newAppointmentType,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      tokenNumber: token,
      room: newRoom || selectedDoc.room
    };

    try {
      await onAddBooking(newAppointment);
      onShowToast(`New booking created! OPD Token: ${newAppointment.tokenNumber}`);
      setIsAddModalOpen(false);
      resetAddForm();
    } catch (error) {
      console.error(error);
      setNewBookingError('Could not save booking. Please try again.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Quick Status change
  const handleQuickStatusChange = async (apt: Appointment, newStatus: AppointmentStatus) => {
    const updated = { ...apt, status: newStatus };
    try {
      await onUpdateAppointment(updated);
      onShowToast(`Appointment #${apt.tokenNumber} marked as ${newStatus}.`);
    } catch (error) {
      console.error(error);
      onShowToast('Could not update appointment status.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingAppointmentId) return;
    try {
      await onDeleteAppointment(deletingAppointmentId);
      onShowToast('Appointment record deleted from hospital database.');
      setDeletingAppointmentId(null);
    } catch (err) {
      console.error(err);
      onShowToast('Could not delete appointment.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      onShowToast('No bookings to export.');
      return;
    }

    const headers = [
      'Token Number',
      'Status',
      'Date',
      'Time Slot',
      'Patient Name',
      'Patient Phone',
      'Patient Email',
      'Patient Age',
      'Patient Gender',
      'Doctor Name',
      'Department',
      'Room',
      'Modality',
      'Reason'
    ];

    const rows = appointments.map(a => [
      `"${a.tokenNumber}"`,
      `"${a.status}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.patientName}"`,
      `"${a.patientPhone}"`,
      `"${a.patientEmail}"`,
      `"${a.patientAge}"`,
      `"${a.patientGender}"`,
      `"${a.doctorName}"`,
      `"${a.departmentName}"`,
      `"${a.room}"`,
      `"${a.appointmentType}"`,
      `"${(a.reason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wecare_hospital_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Hospital bookings exported to CSV.');
  };

  // Filtered and Sorted Appointments
  const filteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return appointments.filter(apt => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesPatient = apt.patientName.toLowerCase().includes(query);
        const matchesEmail = apt.patientEmail.toLowerCase().includes(query);
        const matchesPhone = apt.patientPhone.toLowerCase().includes(query);
        const matchesDoctor = apt.doctorName.toLowerCase().includes(query);
        const matchesToken = apt.tokenNumber.toLowerCase().includes(query);
        const matchesDept = apt.departmentName.toLowerCase().includes(query);
        const matchesRoom = (apt.room || '').toLowerCase().includes(query);
        if (!matchesPatient && !matchesEmail && !matchesPhone && !matchesDoctor && !matchesToken && !matchesDept && !matchesRoom) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'All' && apt.status !== statusFilter) {
        return false;
      }

      // Department
      if (departmentFilter !== 'All' && apt.departmentId !== departmentFilter) {
        return false;
      }

      // Date preset
      if (dateFilter === 'today' && apt.date !== todayStr) {
        return false;
      }
      if (dateFilter === 'upcoming' && apt.date < todayStr) {
        return false;
      }
      if (dateFilter === 'past' && apt.date >= todayStr) {
        return false;
      }

      // Custom date
      if (customDate && apt.date !== customDate) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date + ' ' + (b.timeSlot || '')).getTime() - new Date(a.date + ' ' + (a.timeSlot || '')).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date + ' ' + (a.timeSlot || '')).getTime() - new Date(b.date + ' ' + (b.timeSlot || '')).getTime();
      }
      if (sortBy === 'patient-name') {
        return a.patientName.localeCompare(b.patientName);
      }
      return 0;
    });
  }, [appointments, searchTerm, statusFilter, departmentFilter, dateFilter, customDate, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = appointments.length;
    const todayCount = appointments.filter(a => a.date === todayStr).length;
    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

    return { total, todayCount, confirmed, completed, cancelled };
  }, [appointments]);

  // --------------------------------------------------------------------------
  // RENDER 1: SECURITY GATE (When not authenticated as Admin)
  // --------------------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-400 shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
              <Lock className="w-3.5 h-3.5" />
              Restricted Area • Admin Only
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Hospital Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Please authenticate with verified administrator credentials to view and manage hospital bookings.
            </p>
          </div>

          {/* If user is currently logged in as a normal patient */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-200">Current Session Notice</p>
                  <p className="text-slate-300 mt-0.5">
                    Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}).
                    Patient accounts cannot access hospital administration.
                  </p>
                  <button
                    onClick={onSignOut}
                    className="mt-2 text-xs text-amber-400 underline hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Sign out and switch to Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@hospital.org"
                  autoComplete="username"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Admin Security Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="•••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Administrator Token...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Administration Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>Return to Public Hospital Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 2: FULL ADMIN PORTAL (When authenticated as sarthakdhanokar2@gmail.com)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Brand / Admin Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    WeCare Admin Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500 text-slate-950 uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Central OPD & Consultation Management</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Cloud Sync (Firestore)
                  </span>
                </p>
              </div>
            </div>

            {/* Right Admin Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Admin Profile Pill */}
              <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-left hidden sm:block">
                <span className="block text-[10px] text-slate-400 font-medium">Logged in as</span>
                <span className="block text-xs font-semibold text-teal-300 font-mono">
                  {currentUser?.email}
                </span>
              </div>

              {/* Add Booking Button */}
              <button
                onClick={() => {
                  resetAddForm();
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ New Booking (Admin)</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download CSV report"
              >
                <Download className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onSignOut}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI / Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.total}</span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Lifetime registered</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              Today's Schedule
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-teal-700">{stats.todayCount}</span>
              <Clock className="w-5 h-5 text-teal-500" />
            </div>
            <span className="text-[11px] text-teal-600 mt-1 block">Scheduled for today</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Confirmed / Active
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-700">{stats.confirmed}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[11px] text-emerald-600 mt-1 block">Queue ready</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Completed
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-blue-700">{stats.completed}</span>
              <Check className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[11px] text-blue-600 mt-1 block">Consultation done</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Cancelled
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-600">{stats.cancelled}</span>
              <X className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Slots released</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Patient Name, Phone, Email, Doctor, Token #, Room..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="date-desc">Appointment Date (Newest first)</option>
                <option value="date-asc">Appointment Date (Oldest first)</option>
                <option value="patient-name">Patient Name (A to Z)</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters: Status Tabs + Dept + Date */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {st === 'All' ? `All (${appointments.length})` : `${st} (${appointments.filter(a => a.status === st).length})`}
                </button>
              ))}
            </div>

            {/* Department Filter & Date Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value as any);
                  setCustomDate('');
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
              >
                <option value="all">All Dates</option>
                <option value="today">Today's OPD</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Records</option>
              </select>

              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDateFilter('all');
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                title="Filter by exact date"
              />

              {(searchTerm || statusFilter !== 'All' || departmentFilter !== 'All' || dateFilter !== 'all' || customDate) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setDepartmentFilter('All');
                    setDateFilter('all');
                    setCustomDate('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Count Summary Bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredAppointments.length}</strong> of{' '}
            <strong>{appointments.length}</strong> total hospital appointments
          </p>
          <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/50">
            Real-Time Admin Management Mode
          </span>
        </div>

        {/* Bookings Table / List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              No hospital bookings match your current search or filter criteria.
            </p>
            <button
              onClick={() => {
                resetAddForm();
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Booking Now</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Token & Status</th>
                    <th className="py-3.5 px-4">Patient Details</th>
                    <th className="py-3.5 px-4">Consultant & Dept</th>
                    <th className="py-3.5 px-4">Date & Slot</th>
                    <th className="py-3.5 px-4">Room / Type</th>
                    <th className="py-3.5 px-4">Chief Complaint</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredAppointments.map((apt) => {
                    const isToday = apt.date === new Date().toISOString().split('T')[0];

                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Token & Status */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-mono font-bold text-slate-900 text-xs">
                            {apt.tokenNumber}
                          </div>
                          <div className="mt-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          {isToday && (
                            <span className="inline-block mt-1 px-1.5 py-0.2 bg-teal-600 text-white rounded text-[9px] font-bold">
                              TODAY
                            </span>
                          )}
                        </td>

                        {/* Patient Details */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <p className="font-bold text-slate-900">{apt.patientName}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{apt.patientPhone}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {apt.patientEmail}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Age: {apt.patientAge} • {apt.patientGender}
                          </p>
                        </td>

                        {/* Doctor & Dept */}
                        <td className="py-4 px-4 align-top max-w-[210px]">
                          <div className="flex items-center gap-2">
                            <img
                              src={apt.doctorAvatar}
                              alt={apt.doctorName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {apt.doctorName}
                              </p>
                              <p className="text-[11px] text-teal-700 font-medium">
                                {apt.departmentName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date & Slot */}
                        <td className="py-4 px-4 align-top whitespace-nowrap">
                          <p className="font-semibold text-slate-900 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.date}</span>
                          </p>
                          <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{apt.timeSlot}</span>
                          </p>
                        </td>

                        {/* Room & Modality */}
                        <td className="py-4 px-4 align-top">
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{apt.room || 'Room assigned on arrival'}</span>
                          </p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                            {apt.appointmentType}
                          </span>
                        </td>

                        {/* Chief Complaint */}
                        <td className="py-4 px-4 align-top max-w-[220px]">
                          <p className="text-slate-600 line-clamp-2 italic text-[11px]">
                            "{apt.reason || 'Routine consultation'}"
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick Status Toggles */}
                            {apt.status !== 'Completed' && (
                              <button
                                onClick={() => handleQuickStatusChange(apt, 'Completed')}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                                title="Mark Completed"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {apt.status === 'Cancelled' ? (
                              <button
                                onClick={() => handleQuickStatusChange(apt, 'Confirmed')}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                                title="Re-confirm / Restore"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickStatusChange(apt, 'Cancelled')}
                                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                                title="Cancel Booking"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit / Reschedule Modal */}
                            <button
                              onClick={() => handleOpenEdit(apt)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Edit / Reschedule"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* View / Print OPD Slip */}
                            <button
                              onClick={() => setViewingSlipAppointment(apt)}
                              className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors cursor-pointer"
                              title="Print OPD Consultation Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeletingAppointmentId(apt.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 1: ADD NEW BOOKING (ADMIN END)                                        */}
      {/* -------------------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register New Booking (Admin End)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create a direct outpatient consultation or walk-in appointment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newBookingError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{newBookingError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewBooking} className="space-y-4 text-xs">
              {/* Patient Demographics */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  1. Patient Demographics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="e.g. Jonathan Reynolds"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={newPatientAge}
                      onChange={(e) => setNewPatientAge(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={newPatientGender}
                      onChange={(e) => setNewPatientGender(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Department & Doctor */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  2. Clinical Department & Consultant
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Specialty Department *
                    </label>
                    <select
                      value={newDeptId}
                      onChange={(e) => handleDeptChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Attending Consultant *
                    </label>
                    <select
                      value={newDoctorId}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
                    >
                      {availableDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.title.split('&')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule, Room & Modality */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  3. Schedule & OPD Room
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
                    >
                      <option value="08:30 AM – 09:00 AM">08:30 AM – 09:00 AM</option>
                      <option value="09:00 AM – 09:30 AM">09:00 AM – 09:30 AM</option>
                      <option value="09:30 AM – 10:00 AM">09:30 AM – 10:00 AM</option>
                      <option value="10:00 AM – 10:30 AM">10:00 AM – 10:30 AM</option>
                      <option value="10:30 AM – 11:00 AM">10:30 AM – 11:00 AM</option>
                      <option value="11:30 AM – 12:00 PM">11:30 AM – 12:00 PM</option>
                      <option value="02:00 PM – 02:30 PM">02:00 PM – 02:30 PM</option>
                      <option value="03:00 PM – 03:30 PM">03:00 PM – 03:30 PM</option>
                      <option value="04:30 PM – 05:00 PM">04:30 PM – 05:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Clinical Room
                    </label>
                    <input
                      type="text"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      placeholder="e.g. Room 402, Executive Wing"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Consultation Modality
                    </label>
                    <select
                      value={newAppointmentType}
                      onChange={(e) => setNewAppointmentType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
                    >
                      <option value="In-Person Consultation">In-Person Consultation</option>
                      <option value="Video Follow-up">Video Follow-up</option>
                      <option value="Second Opinion">Second Opinion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Custom Token # (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCustomToken}
                      onChange={(e) => setNewCustomToken(e.target.value)}
                      placeholder="Auto-generated if blank (e.g. OPD-ADM-4821)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chief Complaint / Clinical Reason
                  </label>
                  <textarea
                    rows={2}
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Describe patient's symptoms or purpose of consultation..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingNew ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Hospital DB...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Register Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 2: EDIT / RESCHEDULE APPOINTMENT                                      */}
      {/* -------------------------------------------------------------------------- */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manage Booking #{editingAppointment.tokenNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong>{editingAppointment.patientName}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingAppointment(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  >
                    <option value="08:30 AM – 09:00 AM">08:30 AM – 09:00 AM</option>
                    <option value="09:00 AM – 09:30 AM">09:00 AM – 09:30 AM</option>
                    <option value="09:30 AM – 10:00 AM">09:30 AM – 10:00 AM</option>
                    <option value="10:00 AM – 10:30 AM">10:00 AM – 10:30 AM</option>
                    <option value="10:30 AM – 11:00 AM">10:30 AM – 11:00 AM</option>
                    <option value="11:30 AM – 12:00 PM">11:30 AM – 12:00 PM</option>
                    <option value="02:00 PM – 02:30 PM">02:00 PM – 02:30 PM</option>
                    <option value="03:00 PM – 03:30 PM">03:00 PM – 03:30 PM</option>
                    <option value="04:30 PM – 05:00 PM">04:30 PM – 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Consultant
                </label>
                <select
                  value={editDoctorId}
                  onChange={(e) => {
                    setEditDoctorId(e.target.value);
                    const doc = DOCTORS.find(d => d.id === e.target.value);
                    if (doc) setEditRoom(doc.room);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                >
                  {DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Room / Station
                  </label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AppointmentStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Notes / Reason
                </label>
                <textarea
                  rows={2}
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? 'Saving...' : 'Update Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 3: PRINTABLE OPD CONSULTATION SLIP                                    */}
      {/* -------------------------------------------------------------------------- */}
      {viewingSlipAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Official OPD Consultation Pass
                </h3>
              </div>
              <button
                onClick={() => setViewingSlipAppointment(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Area */}
            <div className="p-5 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    WeCare Super-Speciality Hospital
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    450 Healthcare Blvd, Metro Medical District • 24/7 Helpline: +1 (800) 932-2731
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    OUTPATIENT SLIP
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Queue Token
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {viewingSlipAppointment.tokenNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Status
                  </span>
                  <span className="font-bold text-emerald-700">
                    {viewingSlipAppointment.status}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Patient Name
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingSlipAppointment.patientName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Contact Phone
                  </span>
                  <span className="font-medium text-slate-800">
                    {viewingSlipAppointment.patientPhone}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Attending Doctor
                  </span>
                  <span className="font-bold text-teal-800">
                    {viewingSlipAppointment.doctorName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Department
                  </span>
                  <span className="font-medium text-slate-800">
                    {viewingSlipAppointment.departmentName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Date & Slot
                  </span>
                  <span className="font-semibold text-slate-900">
                    {viewingSlipAppointment.date} ({viewingSlipAppointment.timeSlot})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Consultation Room
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingSlipAppointment.room || 'Room 101'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic text-center">
                Please present this token at the OPD desk 10 minutes prior to scheduled slot.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setViewingSlipAppointment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 4: DELETE CONFIRMATION                                               */}
      {/* -------------------------------------------------------------------------- */}
      {deletingAppointmentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Delete Hospital Booking?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This action will permanently purge the booking from Firestore database and release the OPD slot.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingAppointmentId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
