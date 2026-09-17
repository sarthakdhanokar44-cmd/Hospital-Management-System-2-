import React from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  Languages, 
  CheckCircle2, 
  DollarSign,
  Stethoscope
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBook
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-white/30 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30 rounded-full mb-1.5">
                {doctor.departmentName}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {doctor.name}
              </h3>
              <p className="text-sm font-medium text-teal-100 mt-0.5">
                {doctor.title}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {doctor.qualifications}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span className="font-bold">{doctor.rating.toFixed(2)}</span>
                  <span className="text-slate-300">({doctor.reviewCount} reviews)</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-slate-200 font-medium">
                  {doctor.experienceYears} Years Clinical Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Biography */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Clinical Biography & Practice
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Key Specialization */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Primary Area of Expertise
            </h5>
            <p className="text-sm font-semibold text-slate-900">
              {doctor.specialty}
            </p>
          </div>

          {/* Schedule & Consultation Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Consultation Days</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {doctor.consultationDays.join(', ')}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Daily OPD Hours</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {doctor.consultationTimings}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Location in Hospital</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {doctor.room}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Languages className="w-4 h-4 text-teal-600" />
                <span>Languages Spoken</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {doctor.languages.join(', ')}
              </p>
            </div>
          </div>

          {/* Awards & Distinctions */}
          {doctor.awards && doctor.awards.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Honors & Clinical Accolades
              </h4>
              <div className="space-y-1.5">
                {doctor.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Outpatient Consultation Fee</span>
            <span className="text-xl font-black text-slate-900">
              ${doctor.consultationFee}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
