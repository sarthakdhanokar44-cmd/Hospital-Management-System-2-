import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  FileText,
  Ambulance,
  Heart,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { NavPage, User } from '../types';
import { isUserAdmin } from '../services/authService';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  appointmentsCount: number;
  onOpenAppointments: () => void;
  onOpenBookingModal: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  appointmentsCount,
  onOpenAppointments,
  onOpenBookingModal,
  currentUser,
  onOpenAuth,
  onOpenProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = isUserAdmin(currentUser);

  const navItems: { id: NavPage; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    ...(!isAdmin ? [{ id: 'book' as NavPage, label: 'Book Appointment' }] : []),
    { id: 'admin', label: 'Admin Portal', badge: isAdmin ? 'Admin' : 'Restricted' }
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Clinical Utility / Emergency Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a 
              href="tel:18009322731" 
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            >
              <Ambulance className="w-4 h-4" />
              <span>24/7 Emergency & Ambulance: <strong>+1 (800) 932-2731</strong></span>
            </a>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>450 Healthcare Blvd, Metro Medical District</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>OPD Consultations: 8:00 AM – 8:00 PM</span>
            </span>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAppointments}
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="View my scheduled appointments"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>My Appointments</span>
              {appointmentsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-teal-500 text-white rounded-full">
                  {appointmentsCount}
                </span>
              )}
            </button>
            <span className="text-slate-600">|</span>
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 transition-colors font-semibold cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="truncate max-w-[120px]">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 text-teal-300 hover:text-teal-200 transition-colors font-semibold cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Patient Login</span>
              </button>
            )}
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold px-2 py-0.5 rounded-md ${
                currentPage === 'admin'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
              title="Hospital Administrative Portal (Staff Only)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
              {isAdmin && (
                <span className="px-1 py-0.2 text-[9px] bg-amber-500 text-slate-950 rounded font-black">
                  ADMIN
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="relative">
                <Heart className="w-6 h-6 fill-white/20 stroke-white stroke-2" />
                <div className="absolute inset-0 flex items-center justify-center font-black text-[13px] text-white">
                  +
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                  WeCare
                </span>
                <span className="text-2xl font-light tracking-tight text-teal-600">
                  Hospitals
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Excellence in Healing • Compassion in Care
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      item.id === 'admin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center gap-2 cursor-pointer border border-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
                  <span className={`text-[10px] block font-semibold ${isAdmin ? 'text-amber-600' : 'text-teal-700'}`}>
                    {isAdmin ? 'Admin Portal' : 'Patient Portal'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-teal-200/60"
              >
                <UserIcon className="w-4 h-4 text-teal-700" />
                <span>Sign In / Register</span>
              </button>
            )}

            <button
              onClick={onOpenAppointments}
              className="relative px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>{isAdmin ? 'All Records' : 'My Bookings'}</span>
              {appointmentsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-600 text-white rounded-full">
                  {appointmentsCount}
                </span>
              )}
            </button>

            {!isAdmin && (
              <button
                onClick={onOpenBookingModal}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                {currentUser.name.charAt(0)}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 rounded-lg border border-teal-200 cursor-pointer"
              >
                Sign In
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={onOpenBookingModal}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-md"
              >
                Book
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {currentUser ? (
            <div 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{currentUser.name}</h5>
                  <p className="text-xs text-teal-700">{currentUser.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-800">Profile &rarr;</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / Create Patient Account</span>
            </button>
          )}

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 text-base font-semibold rounded-lg flex items-center justify-between ${
                  isActive
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                    item.id === 'admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointments();
              }}
              className="w-full py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>My Appointments</span>
              </span>
              <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-bold">
                {appointmentsCount}
              </span>
            </button>

            {!isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3 text-center text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
              >
                Book Appointment Now
              </button>
            )}

            <a
              href="tel:18009322731"
              className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Emergency: +1 (800) 932-2731</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
