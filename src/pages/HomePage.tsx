import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Award, 
  Activity, 
  Users, 
  CheckCircle2, 
  Star, 
  ChevronRight,
  Ambulance,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { NavPage, Doctor, Department } from '../types';
import { DEPARTMENTS, DOCTORS, HOSPITAL_STATS, TESTIMONIALS, ACCREDITATIONS } from '../data/hospitalData';
import { DepartmentIcon } from '../components/DepartmentIcon';

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
  onViewDoctor: (doctor: Doctor) => void;
  onSelectDepartment: (deptId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onViewDoctor,
  onSelectDepartment
}) => {
  // Quick hero booking form state
  const [quickDept, setQuickDept] = useState('cardiology');
  const [quickDoctor, setQuickDoctor] = useState(DOCTORS.filter(d => d.departmentId === 'cardiology')[0]?.id || '');

  const handleQuickDeptChange = (deptId: string) => {
    setQuickDept(deptId);
    const docs = DOCTORS.filter(d => d.departmentId === deptId);
    if (docs.length > 0) {
      setQuickDoctor(docs[0].id);
    } else {
      setQuickDoctor('');
    }
  };

  const handleHeroBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(quickDept, quickDoctor);
  };

  const featuredDoctors = DOCTORS.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>JCI & NABH Accredited Tertiary Care Hospital</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Advanced Care with a <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  Human Touch
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>WeCare Hospitals</strong>. Combining internationally trained clinicians, robotic surgical precision, and empathetic patient care to deliver medical treatment that changes lives.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 transition-all transform active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Doctor Appointment</span>
                </button>

                <button
                  onClick={() => onNavigate('departments')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore 8+ Departments</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Emergency Banner Bar inside Hero */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-rose-500" />
                  <span>24/7 Level-1 Trauma Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Door-to-Cath Lab &lt; 30 Mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cashless Insurance TPA</span>
                </div>
              </div>
            </div>

            {/* Right Visual & Fast OPD Appointment Form */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Visual Hospital Imagery Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 relative">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                    alt="WeCare Hospitals Modern Campus"
                    className="w-full h-56 object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                        Patient-Centric Facility
                      </span>
                      <h4 className="text-base font-bold text-white">
                        650-Bed High-Acuity Medical Campus
                      </h4>
                      <p className="text-xs text-slate-300">
                        Metro Medical District • 24/7 Helipad & Mobile ICUs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant OPD Booking Form Card (overlapping) */}
                <div className="mt-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Fast OPD Appointment
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Select department & verified doctor
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      Instant Slot
                    </span>
                  </div>

                  <form onSubmit={handleHeroBookSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                        Clinical Department
                      </label>
                      <select
                        value={quickDept}
                        onChange={(e) => handleQuickDeptChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-600"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                        Select Specialist Doctor
                      </label>
                      <select
                        value={quickDoctor}
                        onChange={(e) => setQuickDoctor(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-600"
                      >
                        {DOCTORS.filter(d => d.departmentId === quickDept).map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.specialty.substring(0, 32)}...
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Proceed to Book Slot</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Metrics & Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {HOSPITAL_STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">
                  {stat.value}
                </span>
                <p className="text-xs font-medium text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Clinical Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Centers of Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Medical Departments
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Each department is led by distinguished clinicians and equipped with cutting-edge robotic, imaging, and therapeutic technologies.
            </p>
          </div>

          <button
            onClick={() => onNavigate('departments')}
            className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.slice(0, 8).map((dept) => {
            const doctorsCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer"
                onClick={() => {
                  onSelectDepartment(dept.id);
                  onNavigate('departments');
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DepartmentIcon name={dept.icon} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {doctorsCount} Doctors
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 group-hover:text-teal-700">
                    Explore Specialists
                  </span>
                  <ChevronRight className="w-4 h-4 text-teal-600 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Medical Specialists */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Expert Clinicians
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Meet Our Renowned Doctors
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Every department at WeCare Hospitals houses multiple board-certified specialists with decades of proven clinical mastery.
              </p>
            </div>

            <button
              onClick={() => onNavigate('doctors')}
              className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Browse All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating.toFixed(1)}</span>
                    </div>
                    {doctor.availableToday && (
                      <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Available Today
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">
                      {doctor.departmentName.split('&')[0]}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1">
                      {doctor.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doctor.qualifications}
                    </p>

                    <div className="pt-2 text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doctor.consultationDays.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-bold text-slate-900">${doctor.consultationFee}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewDoctor(doctor)}
                      className="py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center cursor-pointer transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                      className="py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg text-center shadow-xs transition-colors cursor-pointer"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose WeCare Hospitals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-teal-900 to-slate-900 rounded-3xl text-white p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Clinical Excellence
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Why Patients Trust WeCare Hospitals
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We bring together leading surgical faculties, sub-millimeter robotic precision, and patient safety systems that meet rigorous international benchmarks.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Learn About Our Heritage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Dual International Accreditation</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Certified by Joint Commission International (JCI) and NABH, adhering to the highest global patient safety standards.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Advanced Robotic Surgery</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mako orthopedic arm and robotic laparoscopic systems ensuring minimal tissue trauma and faster recovery.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Ambulance className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">24/7 Level-1 Trauma Hub</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct trauma resuscitation bays, bi-plane Cath Lab on 24/7 standby, and dedicated acute stroke intervention teams.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Transparent & Empathetic Care</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clear treatment planning, zero hidden costs, dedicated patient relationship managers, and 99.4% satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Patient Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Voices of Healing and Recovery
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Real stories from patients and families whose lives were touched by the dedicated clinical team at WeCare Hospitals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">{t.patientName}</h4>
                <p className="text-xs text-teal-700 font-semibold">{t.treatment}</p>
                <p className="text-[11px] text-slate-400">{t.doctorName} • {t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
