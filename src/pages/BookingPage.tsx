import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  Stethoscope,
  MapPin,
  FileText,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { Department, Doctor, Appointment, NavPage, User as UserType } from '../types';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data/hospitalData';

interface BookingPageProps {
  onSaveAppointment: (appointment: Appointment) => void;
  onNavigate: (page: NavPage) => void;
  onOpenAppointmentsModal: () => void;
  initialDeptId?: string;
  initialDoctorId?: string;
  currentUser: UserType | null;
  onRequireAuth: (intentMsg?: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onSaveAppointment,
  onNavigate,
  onOpenAppointmentsModal,
  initialDeptId = 'cardiology',
  initialDoctorId = '',
  currentUser,
  onRequireAuth
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || DOCTORS.filter(d => d.departmentId === initialDeptId)[0]?.id || DOCTORS[0].id
  );

  // Generate tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');

  const [selectedDate, setSelectedDate] = useState<string>(`${yyyy}-${mm}-${dd}`);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [appointmentType, setAppointmentType] = useState<'In-Person Consultation' | 'Video Follow-up' | 'Second Opinion'>('In-Person Consultation');

  // Patient Fields
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientAge, setPatientAge] = useState<number | ''>(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');
  const [reason, setReason] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Sync patient info if user logs in
  React.useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name);
      setPatientPhone(currentUser.phone);
      setPatientEmail(currentUser.email);
      setPatientAge(currentUser.age);
      setPatientGender(currentUser.gender);
    }
  }, [currentUser]);

  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId);
  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId);
  const availableDocs = DOCTORS.filter(d => d.departmentId === selectedDeptId);

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docs = DOCTORS.filter(d => d.departmentId === deptId);
    if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorMsg('Please sign in or create a patient account before confirming your appointment.');
      onRequireAuth('Please sign in or register to book your clinical consultation.');
      return;
    }

    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor for your appointment.');
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg('Please provide the patient full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 7) {
      setErrorMsg('Please provide a valid phone number.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!patientAge || Number(patientAge) <= 0) {
      setErrorMsg('Please provide a valid patient age.');
      return;
    }

    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `WCH-2026-${randomSuffix}`;
    const tokenPrefix = currentDept ? currentDept.name.substring(0, 4).toUpperCase() : 'WCH';
    const tokenNumber = `${tokenPrefix}-${Math.floor(10 + Math.random() * 90)}`;

    const newApt: Appointment = {
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

    onSaveAppointment(newApt);
    setConfirmedBooking(newApt);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
          Online Outpatient Department (OPD)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Book an Appointment at WeCare Hospitals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Skip the reception queue. Select your preferred clinical department, choose an expert doctor, and lock in your consultation slot in just a few clicks.
        </p>
      </div>

      {confirmedBooking ? (
        /* Confirmed Ticket Display */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Consultation Confirmed!
            </h2>
            <p className="text-xs text-slate-500">
              We look forward to welcoming you at WeCare Hospitals. Your digital appointment slip is ready below.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmation Number
                </span>
                <p className="font-mono font-bold text-teal-700 text-lg">{confirmedBooking.id}</p>
              </div>
              <div className="bg-teal-600 text-white px-3 py-1 rounded-lg text-center">
                <span className="text-[9px] uppercase tracking-wider block">OPD Token</span>
                <span className="text-sm font-black font-mono">{confirmedBooking.tokenNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 block mb-0.5">Doctor</span>
                <p className="font-bold text-slate-900 text-sm">{confirmedBooking.doctorName}</p>
                <p className="text-teal-700">{confirmedBooking.doctorTitle}</p>
                <p className="text-slate-500">{confirmedBooking.departmentName}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Scheduled Slot</span>
                <p className="font-bold text-slate-900 text-sm">{confirmedBooking.date}</p>
                <p className="text-teal-700 font-semibold">{confirmedBooking.timeSlot}</p>
                <p className="text-slate-600 mt-1">{confirmedBooking.room}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Patient Details</span>
                <p className="font-bold text-slate-900">{confirmedBooking.patientName}</p>
                <p className="text-slate-600">Age: {confirmedBooking.patientAge} • {confirmedBooking.patientGender}</p>
                <p className="text-slate-600">{confirmedBooking.patientPhone}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Visit Format</span>
                <p className="font-bold text-slate-900">{confirmedBooking.appointmentType}</p>
                <p className="text-slate-500 italic mt-0.5">"{confirmedBooking.reason}"</p>
              </div>
            </div>

            <div className="pt-4 text-xs text-slate-500 space-y-1">
              <p>• <strong>Location:</strong> 450 Healthcare Blvd, Metro Medical District</p>
              <p>• <strong>Reporting Time:</strong> Please arrive 15 minutes prior to your slot.</p>
              <p>• Consultation fee is settled at the OPD reception upon token call.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print OPD Slip</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAppointmentsModal}
                className="px-4 py-2.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl"
              >
                View in My Appointments
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Booking Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* Step 1: Department Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Select Clinical Specialty
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    const docCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
                    return (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => handleDeptChange(dept.id)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50 shadow-xs ring-2 ring-teal-600/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`block text-xs font-bold truncate ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                          {dept.name.split('&')[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {docCount} Specialists
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Doctor Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Choose Doctor in {currentDept?.name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {availableDocs.length} Specialists available
                  </span>
                </div>

                <div className="space-y-3">
                  {availableDocs.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-2 ring-teal-600/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
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
                                  Today
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-teal-700 font-semibold">{doc.specialty}</p>
                            <p className="text-[11px] text-slate-500">
                              {doc.qualifications} • {doc.experienceYears} yrs experience
                            </p>
                            <p className="text-[11px] text-slate-600 mt-1">
                              Consulting: <strong>{doc.consultationDays.join(', ')}</strong> ({doc.consultationTimings})
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="text-sm font-bold text-slate-900">${doc.consultationFee}</span>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-md mt-1.5 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isSelected ? 'Selected' : 'Choose'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Slot Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Appointment Date & Time Slot
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Consultation Format
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value as any)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium text-slate-800"
                    >
                      <option value="In-Person Consultation">In-Person Clinic Visit</option>
                      <option value="Video Follow-up">Video Tele-Consultation</option>
                      <option value="Second Opinion">Second Opinion Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-600/20'
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

              {/* Step 4: Patient Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Details
                  </h3>
                </div>

                {/* Account Status Card */}
                {currentUser ? (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between gap-2 text-xs text-teal-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Booking as: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-200/70 text-teal-800 rounded-md">
                      Verified Patient Profile
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="text-amber-900">
                      <strong className="block">Patient Account Required to Reserve Slot</strong>
                      <span>Sign in or create an account to store and access your consultation history.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRequireAuth('Please sign in or create an account before reserving your appointment.')}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
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
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                    />
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
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Gender *
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
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
                    Symptoms or Clinical History (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what brings you to WeCare Hospitals today..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm & Generate OPD Appointment Pass</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Doctor Selected Summary Card */}
            {currentDoctor && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Consultation Summary
                </span>

                <div className="flex items-center gap-3.5">
                  <img
                    src={currentDoctor.avatarUrl}
                    alt={currentDoctor.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{currentDoctor.name}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{currentDoctor.specialty}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{currentDept?.name}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Consultation Date:</span>
                    <span className="font-bold text-slate-900">{selectedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Slot:</span>
                    <span className="font-bold text-teal-700">{selectedSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consultation Chamber:</span>
                    <span className="font-bold text-slate-900">{currentDoctor.room}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-bold text-slate-900 text-sm">${currentDoctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Hospital Visit Instructions */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Patient Visit Instructions</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• Arrive 15 minutes prior to registration counter in the main lobby.</li>
                <li>• Carry previous diagnostic reports, scans, and current prescriptions.</li>
                <li>• Free valet parking is available at the OPD Entrance.</li>
                <li>• Fast-track assistance available for senior citizens & differently-abled patients.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
