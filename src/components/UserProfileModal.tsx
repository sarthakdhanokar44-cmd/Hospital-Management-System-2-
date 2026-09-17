import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Edit3, 
  Save, 
  LogOut,
  FileText
} from 'lucide-react';
import { User, Appointment } from '../types';
import { updateUserProfile } from '../services/authService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onSignOut: () => void;
  appointments: Appointment[];
  onOpenAppointments: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSignOut,
  appointments,
  onOpenAppointments
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [age, setAge] = useState<number>(user.age);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(user.gender);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '');
  const [address, setAddress] = useState(user.address || '');

  if (!isOpen) return null;

  const userAppointments = appointments.filter(a => a.userId === user.id || a.patientEmail.toLowerCase() === user.email.toLowerCase());
  const confirmedCount = userAppointments.filter(a => a.status === 'Confirmed').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile(user.id, {
      name,
      phone,
      age,
      gender,
      bloodGroup,
      emergencyContact,
      address
    });
    if (updated) {
      onUpdateUser(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Profile Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold border-2 border-teal-400/40">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-teal-300 font-medium">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-md">
                Verified Patient Account
              </span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 text-center text-xs">
          <div className="border-r border-slate-200">
            <span className="block text-xl font-black text-slate-900">{userAppointments.length}</span>
            <span className="text-slate-500 font-medium">Total Bookings</span>
          </div>
          <div>
            <span className="block text-xl font-black text-teal-600">{confirmedCount}</span>
            <span className="text-slate-500 font-medium">Upcoming OPD Visits</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 font-bold rounded-xl text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            /* View Details Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Phone Number</span>
                  <span className="font-bold text-slate-900">{user.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Age & Gender</span>
                  <span className="font-bold text-slate-900">{user.age} yrs • {user.gender}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Blood Group</span>
                  <span className="font-bold text-rose-700">{user.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Emergency Contact</span>
                  <span className="font-bold text-slate-900">{user.emergencyContact || 'None listed'}</span>
                </div>
              </div>

              {user.address && (
                <div className="bg-slate-50 p-3 rounded-xl text-xs">
                  <span className="text-slate-500 block mb-0.5">Address</span>
                  <span className="font-semibold text-slate-800">{user.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenAppointments();
                  }}
                  className="flex-1 py-2.5 bg-teal-50 hover:bg-teal-100 font-bold text-xs rounded-xl text-teal-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View My Bookings</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Patient Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
