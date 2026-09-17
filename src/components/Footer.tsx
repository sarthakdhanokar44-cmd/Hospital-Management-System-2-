import React from 'react';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Ambulance
} from 'lucide-react';
import { NavPage, User } from '../types';
import { DEPARTMENTS, ACCREDITATIONS } from '../data/hospitalData';
import { isUserAdmin } from '../services/authService';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onSelectDepartment: (deptId: string) => void;
  onOpenBookingModal: () => void;
  currentUser?: User | null;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectDepartment,
  onOpenBookingModal,
  currentUser
}) => {
  const isAdmin = isUserAdmin(currentUser ?? null);
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Emergency & Quick CTA Strip */}
      <div className="bg-teal-900/60 border-b border-teal-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Ambulance className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">
                Medical Emergency or Trauma?
              </h4>
              <p className="text-sm text-teal-200/80">
                Our 24/7 Level-1 Trauma response team and mobile ICUs are on standby.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
            <a
              href="tel:18009322731"
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-transform active:scale-98"
            >
              <Phone className="w-4 h-4" />
              <span>Call Emergency: +1 (800) 932-2731</span>
            </a>
            {!isAdmin ? (
              <button
                onClick={onOpenBookingModal}
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-98 flex items-center gap-2"
              >
                <span>Schedule OPD Visit</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('admin')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-98 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Open Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About WeCare */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white/20 stroke-white stroke-2" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                WeCare <span className="text-teal-400 font-light">Hospitals</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              WeCare Hospitals is a premier multi-specialty healthcare institution dedicated to patient-centric clinical excellence, revolutionary medical technologies, and ethical medical care across every life stage.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>450 Healthcare Blvd, Metro Medical District, Metropolis 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Appointments: +1 (800) 932-2730</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>care@wecarehospitals.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Outpatient Clinics: Mon – Sat (8:00 AM – 8:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-2">
              Hospital Navigation
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors"
                >
                  About Our Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Clinical Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Find a Doctor
                </button>
              </li>
              {!isAdmin && (
                <li>
                  <button
                    onClick={() => onNavigate('book')}
                    className="hover:text-teal-400 transition-colors"
                  >
                    Online Booking Portal
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal (Staff)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Specialties */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-2">
              Key Specialties
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              {DEPARTMENTS.slice(0, 5).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      onNavigate('departments');
                      onSelectDepartment(dept.id);
                    }}
                    className="hover:text-teal-400 text-left transition-colors truncate block max-w-[200px]"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quality & Accreditations */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-800 pb-2">
              Accreditations
            </h5>
            <div className="space-y-3">
              {ACCREDITATIONS.map((acc, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">{acc.name}</span>
                    <span className="text-slate-400">{acc.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WeCare Hospitals Group. All clinical rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Patient Rights & Privacy</span>
            <span className="text-slate-400">Clinical Governance</span>
            <span className="text-slate-400">Infection Control</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
