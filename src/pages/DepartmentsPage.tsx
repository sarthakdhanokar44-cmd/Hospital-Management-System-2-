import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowRight, 
  Users, 
  Bed, 
  Cpu, 
  CheckCircle2, 
  Star, 
  Clock, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { Department, Doctor, NavPage } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { DepartmentIcon } from '../components/DepartmentIcon';

interface DepartmentsPageProps {
  selectedDeptId?: string;
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
  onViewDoctor: (doctor: Doctor) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  selectedDeptId = 'cardiology',
  onSelectDepartment,
  onOpenBooking,
  onViewDoctor
}) => {
  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const doctorsInDept = DOCTORS.filter(doc => doc.departmentId === currentDept.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
          Centers of Excellence
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Clinical Departments at WeCare Hospitals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore our multidisciplinary departments. Each specialty features advanced medical technologies, dedicated care units, and a team of renowned doctors available for consultation.
        </p>
      </div>

      {/* Department Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {DEPARTMENTS.map((dept) => {
          const isSelected = dept.id === currentDept.id;
          return (
            <button
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <DepartmentIcon name={dept.icon} className="w-4 h-4" />
              <span>{dept.name.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Department Spotlight */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner Area */}
        <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
          <img
            src={currentDept.imageUrl}
            alt={currentDept.name}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500 text-white">
                  <DepartmentIcon name={currentDept.icon} className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Specialized Center
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {currentDept.name}
              </h2>
              <p className="text-sm sm:text-base text-teal-100 font-medium">
                {currentDept.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Department Info & Stats Strip */}
        <div className="p-6 sm:p-10 border-b border-slate-200 bg-slate-50/70">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Head of Department
              </span>
              <p className="font-bold text-slate-900 text-sm">{currentDept.headOfDepartment}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Dedicated Bed Capacity
              </span>
              <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bed className="w-4 h-4 text-teal-600" />
                <span>{currentDept.bedCapacity} In-Patient & ICU Beds</span>
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Clinical Faculty
              </span>
              <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>{doctorsInDept.length} Specialist Doctors</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mt-6">
            {currentDept.description}
          </p>
        </div>

        {/* Procedures & Technologies Split */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>Key Clinical Procedures & Surgeries</span>
            </h3>
            <ul className="space-y-2.5">
              {currentDept.featuredProcedures.map((proc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{proc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600" />
              <span>Diagnostic & Surgical Technologies</span>
            </h3>
            <ul className="space-y-2.5">
              {currentDept.technologies.map((tech, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Doctors in This Department Section */}
        <div className="p-6 sm:p-10 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Specialist Doctors in {currentDept.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every department has multiple renowned physicians with dedicated outpatient consulting hours.
              </p>
            </div>

            <button
              onClick={() => onOpenBooking(currentDept.id)}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book in this Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorsInDept.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-slate-700">{doctor.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({doctor.reviewCount})</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">{doctor.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">{doctor.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {doctor.bio}
                  </p>

                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doctor.consultationDays.join(', ')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">
                      {doctor.consultationTimings} ({doctor.room})
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-bold text-slate-900">${doctor.consultationFee}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewDoctor(doctor)}
                      className="py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                      className="py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg text-center shadow-xs cursor-pointer"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of All Departments for Quick Access */}
      <div className="pt-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          All WeCare Clinical Specialties
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENTS.map((dept) => {
            const isCurrent = dept.id === currentDept.id;
            const docCount = DOCTORS.filter(d => d.departmentId === dept.id).length;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  onSelectDepartment(dept.id);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                    <DepartmentIcon name={dept.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {docCount} Doctors
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-2 truncate">
                  {dept.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {dept.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
