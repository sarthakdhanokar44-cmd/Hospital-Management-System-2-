import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Doctor, Department } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';

interface DoctorsPageProps {
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
  onViewDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onOpenBooking,
  onViewDoctor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Dept filter
      if (selectedDeptFilter !== 'all' && doc.departmentId !== selectedDeptFilter) {
        return false;
      }
      // Available today filter
      if (onlyAvailableToday && !doc.availableToday) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(q);
        const matchesDept = doc.departmentName.toLowerCase().includes(q);
        const matchesQual = doc.qualifications.toLowerCase().includes(q);
        if (!matchesName && !matchesSpecialty && !matchesDept && !matchesQual) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return 0;
    });
  }, [searchQuery, selectedDeptFilter, onlyAvailableToday, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
          Medical Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Your Specialist at WeCare Hospitals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Search over 180+ board-certified medical specialists across all clinical departments. Book in-person consultations or second opinions directly online.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by doctor name, condition, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-3 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Select */}
          <div className="md:col-span-3">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium text-slate-700"
            >
              <option value="all">All Departments ({DOCTORS.length} Doctors)</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium text-slate-700"
            >
              <option value="rating">Sort by Highest Patient Rating</option>
              <option value="experience">Sort by Years of Experience</option>
              <option value="fee">Sort by Consultation Fee (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Department Pills & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDeptFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties
            </button>
            {DEPARTMENTS.slice(0, 6).map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedDeptFilter === dept.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name.split('&')[0]}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Show Only Available Today</span>
          </label>
        </div>
      </div>

      {/* Results Count & Current Filter State */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredDoctors.length}</strong> matching doctors</span>
        {selectedDeptFilter !== 'all' && (
          <span className="text-teal-700 font-semibold">
            Filtered by: {DEPARTMENTS.find(d => d.id === selectedDeptFilter)?.name}
          </span>
        )}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Specialists Match Your Search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing keywords, or selecting a different clinical department.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDeptFilter('all');
              setOnlyAvailableToday(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Head Area */}
                <div className="p-5 pb-0 flex items-start gap-4">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60 rounded-md">
                      {doctor.departmentName.split('&')[0]}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-800 line-clamp-1">
                      {doctor.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-slate-700 ml-1">{doctor.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <span>{doctor.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">Focus Specialization:</span>
                    <p className="text-slate-600 font-medium">{doctor.specialty}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.consultationDays.join(', ')} ({doctor.consultationTimings})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.room}</span>
                    </div>
                  </div>

                  {doctor.availableToday && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Doctor is on-duty today for consultations</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                  <span className="text-slate-500">OPD Consultation Fee</span>
                  <span className="text-base font-bold text-slate-900">${doctor.consultationFee}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewDoctor(doctor)}
                    className="py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors cursor-pointer"
                  >
                    View Biography
                  </button>
                  <button
                    onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                    className="py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl text-center shadow-xs shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
