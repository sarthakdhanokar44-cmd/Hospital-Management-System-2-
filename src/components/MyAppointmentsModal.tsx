import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Printer, 
  FileText,
  Plus
} from 'lucide-react';
import { Appointment, User as UserType } from '../types';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onBookNew: () => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
  onBookNew,
  currentUser,
  onOpenAuth
}) => {
  const [selectedSlipAppointment, setSelectedSlipAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  // Filter appointments if currentUser is logged in (match either userId or user's email)
  const displayedAppointments = currentUser 
    ? appointments.filter(a => a.userId === currentUser.id || a.patientEmail.toLowerCase() === currentUser.email.toLowerCase())
    : appointments;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:px-8 sm:py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                My Hospital Appointments
              </h3>
              <p className="text-xs text-slate-400">
                Manage, review, or print your scheduled consultations at WeCare
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Status Banner */}
        <div className="px-6 sm:px-8 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Signed in as: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.email})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Guest session: Local bookings on this device</span>
            </div>
          )}

          {!currentUser && (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
            >
              Sign in to sync your medical history &rarr;
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4">
          {displayedAppointments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                No Appointments Scheduled
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {currentUser 
                  ? `No upcoming clinical consultations recorded for ${currentUser.name}.`
                  : 'You currently have no upcoming clinical appointments booked with WeCare Hospitals.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNew();
                }}
                className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Your Consultation</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    apt.status === 'Cancelled'
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {apt.id}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        Token: {apt.tokenNumber}
                      </span>
                    </div>

                    <div>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 text-xs">
                    {/* Doctor Info */}
                    <div className="flex items-start gap-3">
                      <img
                        src={apt.doctorAvatar}
                        alt={apt.doctorName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{apt.doctorName}</p>
                        <p className="text-teal-700 font-medium">{apt.departmentName}</p>
                        <p className="text-slate-500 mt-0.5">{apt.room}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 mt-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <p className="text-slate-500 mt-1">{apt.appointmentType}</p>
                    </div>

                    {/* Patient & Actions */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-slate-500 block">Patient:</span>
                        <p className="font-bold text-slate-900">{apt.patientName}</p>
                        <p className="text-slate-500">{apt.patientPhone}</p>
                      </div>

                      {apt.status === 'Confirmed' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setSelectedSlipAppointment(apt);
                              setTimeout(() => window.print(), 100);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onBookNew();
            }}
            className="px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Another Appointment</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
