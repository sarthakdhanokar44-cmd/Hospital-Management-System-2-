import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { signInUser, signUpUser, signInWithGoogle } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  bookingIntentMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingIntentMessage
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAge, setSignupAge] = useState<number | ''>('');
  const [signupGender, setSignupGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [signupBloodGroup, setSignupBloodGroup] = useState('O+');
  const [signupAddress, setSignupAddress] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = signInUser(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your details.');
      return;
    }
    if (res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupAge || Number(signupAge) < 1) {
      setErrorMsg('Please provide a valid patient age.');
      return;
    }

    const res = signUpUser({
      name: fullName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword || 'password123',
      age: Number(signupAge),
      gender: signupGender,
      bloodGroup: signupBloodGroup,
      address: signupAddress
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to register account.');
      return;
    }
    if (res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  const handleDemoLogin = (demoEmail: string = 'eleanor@example.com') => {
    setErrorMsg('');
    const res = signInUser(demoEmail, 'password123');
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google Sign-In failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Auth Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              WeCare Patient Portal & Firebase
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to Your Patient Account' : 'Create Your Patient Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {bookingIntentMessage || 'Securely manage clinical appointments, review medical token slips, and access doctor consultations.'}
          </p>
        </div>

        {/* Firebase Google Auth Button */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google (Firebase Cloud Auth)'}</span>
          </button>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[11px] text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Or use one-click demo patient profile:</span>
            </div>
            <button
              type="button"
              onClick={() => handleDemoLogin('eleanor@example.com')}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
            >
              Demo Login
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Patient Registration
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. eleanor@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Default: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="Age"
                    value={signupAge}
                    onChange={(e) => setSignupAge(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender *
                  </label>
                  <select
                    value={signupGender}
                    onChange={(e) => setSignupGender(e.target.value as any)}
                    className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={signupBloodGroup}
                    onChange={(e) => setSignupBloodGroup(e.target.value)}
                    className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 font-medium"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Residential Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Street, City, Postal Code"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Account & Continue</span>
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <p>
                Don't have a patient account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account with WeCare?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(''); }}
                  className="font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
