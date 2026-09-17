import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Printer,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Department, Doctor, Appointment, User as UserType } from '../types';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data/hospitalData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDeptId?: string;
  preselectedDoctorId?: string;
  onSaveAppointment: (appointment: Appointment) => void;
  onViewAllAppointments: () => void;
  currentUser: UserType | null;
  onRequireAuth: (intentMsg?: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedDeptId,
  preselectedDoctorId,
  onSaveAppointment,
  onViewAllAppointments,
  currentUser,
  onRequireAuth
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Dept & Doctor, 2: Date & Slot, 3: Patient Info, 4: Confirmed

  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDeptId || 'cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'In-Person Consultation' | 'Video Follow-up' | 'Second Opinion'>('In-Person Consultation');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reason, setReason] = useState('');

  const [formError, setFormError] = useState('');
  const [completedAppointment, setCompletedAppointment] = useState<Appointment | null>(null);

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      if (preselectedDeptId) {
        setSelectedDeptId(preselectedDeptId);
      }
      if (preselectedDoctorId) {
        setSelectedDoctorId(preselectedDoctorId);
        const doc = DOCTORS.find(d => d.id === preselectedDoctorId);
        if (doc) {
          setSelectedDeptId(doc.departmentId);
        }
      } else {
        // Pick first doctor of department if none selected
        const deptDocs = DOCTORS.filter(d => d.departmentId === (preselectedDeptId || 'cardiology'));
        if (deptDocs.length > 0) {
          setSelectedDoctorId(deptDocs[0].id);
        }
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
      setSelectedSlot(TIME_SLOTS[1]);
      setStep(1);
      setCompletedAppointment(null);
      setFormError('');

      if (currentUser) {
        setPatientName(currentUser.name);
        setPatientPhone(currentUser.phone);
        setPatientEmail(currentUser.email);
        setPatientAge(currentUser.age);
        setPatientGender(currentUser.gender);
      }
    }
  }, [isOpen, preselectedDeptId, preselectedDoctorId, currentUser]);

  // When department changes, update doctor if current doctor is not in that department
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docsInDept = DOCTORS.filter(d => d.departmentId === deptId);
    if (docsInDept.length > 0) {
      setSelectedDoctorId(docsInDept[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  if (!isOpen) return null;

  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId);
  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId);
  const doctorsInSelectedDept = DOCTORS.filter(d => d.departmentId === selectedDeptId);

  // Calculate upcoming 7 days
  const upcomingDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();
    return {
      iso: `${yyyy}-${mm}-${dd}`,
      dayName,
      monthName,
      dayNumber,
      fullDateText: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  });

  const handleNextToStep2 = () => {
    if (!selectedDoctorId) {
      setFormError('Please select a doctor to proceed.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!selectedDate || !selectedSlot) {
      setFormError('Please choose both an appointment date and a time slot.');
      return;
    }
    setFormError('');
    setStep(3);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setFormError('Please sign in or create a patient account to confirm your appointment booking.');
      onRequireAuth('Please sign in or register to complete your appointment booking.');
      return;
    }

    if (!patientName.trim()) {
      setFormError('Please enter the patient full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 7) {
      setFormError('Please enter a valid contact phone number.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      setFormError('Please enter a valid patient age.');
      return;
    }

    setFormError('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `WCH-2026-${randomSuffix}`;
    const tokenPrefix = currentDept ? currentDept.name.substring(0, 4).toUpperCase() : 'WCH';
    const tokenNumber = `${tokenPrefix}-${Math.floor(10 + Math.random() * 90)}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      userId: currentUser.id,
      doctorId: currentDoctor?.id || '',
      doctorName: currentDoctor?.name || 'Dr. Medical Specialist',
      doctorTitle: currentDoctor?.title || 'Specialist Consultant',
      doctorAvatar: currentDoctor?.avatarUrl || '',
      departmentId: selectedDeptId,
      departmentName: currentDept?.name || 'General Medicine',
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      patientAge: Number(patientAge),
      patientGender: patientGender,
      date: selectedDate,
      timeSlot: selectedSlot,
      reason: reason.trim() || 'General Consultation / Clinical Evaluation',
      appointmentType: appointmentType,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      tokenNumber: tokenNumber,
      room: currentDoctor?.room || 'OPD Consulting Chamber'
    };

    onSaveAppointment(newAppointment);
    setCompletedAppointment(newAppointment);
    setStep(4);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:px-8 sm:py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                WeCare Hospitals OPD Booking Portal
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {step === 4 ? 'Appointment Confirmed' : 'Schedule Doctor Consultation'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar (if not completed) */}
        {step < 4 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 py-3.5">
            <div className="flex items-center justify-between max-w-md mx-auto text-xs font-semibold">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>
                  1
                </span>
                <span>Doctor & Dept</span>
              </div>
              <div className={`h-0.5 w-10 sm:w-16 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>
                  2
                </span>
                <span>Date & Slot</span>
              </div>
              <div className={`h-0.5 w-10 sm:w-16 ${step >= 3 ? 'bg-teal-600' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>
                  3
                </span>
                <span>Patient Info</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {formError && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Step 1: Department & Doctor Selection */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Department selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Clinical Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  const docCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
                  return (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => handleDepartmentChange(dept.id)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`block text-xs font-bold truncate ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                        {dept.name.split('&')[0]}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {docCount} Specialists
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctors in this department */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Choose Specialist Doctor in {currentDept?.name}
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {doctorsInSelectedDept.length} Doctors available
                </span>
              </div>

              <div className="space-y-3">
                {doctorsInSelectedDept.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/60 shadow-xs ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                            {doc.availableToday && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                                Available Today
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-teal-700">{doc.specialty}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {doc.qualifications} • {doc.experienceYears} yrs exp
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Days: <strong>{doc.consultationDays.join(', ')}</strong> ({doc.consultationTimings})
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-slate-500 block">Consultation Fee</span>
                          <span className="text-base font-bold text-slate-900">${doc.consultationFee}</span>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-md mt-2 ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Consultation Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['In-Person Consultation', 'Video Follow-up', 'Second Opinion'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAppointmentType(type)}
                    className={`p-3 text-center text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      appointmentType === type
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Slot Selection */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Selected Doctor Summary Card */}
            {currentDoctor && (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentDoctor.avatarUrl}
                    alt={currentDoctor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{currentDoctor.name}</h5>
                    <p className="text-xs text-teal-800">{currentDoctor.specialty}</p>
                    <p className="text-[11px] text-slate-600">{currentDoctor.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Consulting Days</span>
                  <span className="text-xs font-bold text-slate-800">{currentDoctor.consultationDays.join(', ')}</span>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Appointment Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {upcomingDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      type="button"
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-3 text-center rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs font-bold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className={`block text-[11px] uppercase ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-black block mt-0.5">
                        {d.dayNumber}
                      </span>
                      <span className={`block text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Available Consultation Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Patient Information Form */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Consultation Summary Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">{currentDoctor?.name}</span>
                <span className="text-slate-500"> ({currentDept?.name})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-teal-700">{selectedDate}</span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-teal-700">{selectedSlot}</span>
              </div>
            </div>

            {/* Account Status Notice */}
            {currentUser ? (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between gap-2 text-xs text-teal-900">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span>Booking as registered patient: <strong>{currentUser.name}</strong></span>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                  Verified Patient
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="text-amber-900">
                  <span className="font-bold block">Patient Sign-In Required:</span>
                  <span>Please sign in or create an account to store and verify your appointment.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRequireAuth('Please sign in or create an account before booking your appointment.')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
                >
                  Sign In / Register
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robert Langdon"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 234-5678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. robert@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="Age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reason for Consultation / Medical Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe symptoms, ongoing medical concerns, or referral purpose..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Prepayment Required:</strong> Consultation fee of ${currentDoctor?.consultationFee || 70} will be settled at the hospital OPD desk upon check-in.
              </span>
            </div>
          </form>
        )}

        {/* Step 4: Booking Confirmation & Digital Slip */}
        {step === 4 && completedAppointment && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Consultation Successfully Scheduled!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                A confirmation SMS and email have been dispatched with your hospital gate pass.
              </p>
            </div>

            {/* Pass Slip Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xs">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    Hospital Booking ID
                  </span>
                  <p className="text-lg font-mono font-bold text-teal-700">
                    {completedAppointment.id}
                  </p>
                </div>
                <div className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-center">
                  <span className="text-[10px] uppercase tracking-wider block font-medium">OPD Token</span>
                  <span className="text-sm font-black font-mono">{completedAppointment.tokenNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Doctor & Specialty</span>
                  <p className="font-bold text-slate-900 text-sm">{completedAppointment.doctorName}</p>
                  <p className="text-teal-700">{completedAppointment.doctorTitle}</p>
                  <p className="text-slate-500">{completedAppointment.departmentName}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Date & Scheduled Time</span>
                  <p className="font-bold text-slate-900 text-sm">{completedAppointment.date}</p>
                  <p className="text-teal-700 font-semibold">{completedAppointment.timeSlot}</p>
                  <p className="text-slate-600 mt-0.5">{completedAppointment.room}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Patient Details</span>
                  <p className="font-bold text-slate-900">{completedAppointment.patientName}</p>
                  <p className="text-slate-600">Age: {completedAppointment.patientAge} • {completedAppointment.patientGender}</p>
                  <p className="text-slate-600">{completedAppointment.patientPhone}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Consultation Type</span>
                  <p className="font-bold text-slate-900">{completedAppointment.appointmentType}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                    Status: {completedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="pt-3 text-[11px] text-slate-500 space-y-1">
                <p>• Please report to <strong>{completedAppointment.room}</strong> at least 15 minutes prior to your slot.</p>
                <p>• Please bring previous prescriptions, lab reports, or imaging scans.</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-8 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextToStep2}
                className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Select Date & Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextToStep3}
                className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Patient Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm Appointment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 4 && (
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewAllAppointments();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl"
                >
                  View My Appointments
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
