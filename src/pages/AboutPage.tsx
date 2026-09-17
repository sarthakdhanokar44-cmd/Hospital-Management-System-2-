import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Microscope,
  Stethoscope,
  Activity,
  ArrowRight
} from 'lucide-react';
import { NavPage } from '../types';
import { ACCREDITATIONS } from '../data/hospitalData';

interface AboutPageProps {
  onNavigate: (page: NavPage) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBooking }) => {
  const leadership = [
    {
      name: 'Dr. Arthur Vance, MD, DM, FACC',
      role: 'Chief Medical Director & Head of Cardiology',
      experience: '24+ Years',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      bio: 'Leading clinical governance and international academic medical exchanges across all hospital specialties.'
    },
    {
      name: 'Dr. Evelyn Morales, MD, MCh, FAANS',
      role: 'Director of Surgical Services & Neurosciences',
      experience: '22+ Years',
      image: 'https://images.unsplash.com/photo-1594824813576-788b77d612ec?auto=format&fit=crop&w=600&q=80',
      bio: 'Oversees 24 advanced operating theatres, robotic surgery protocols, and minimally invasive innovations.'
    },
    {
      name: 'Dr. Priya Sundaram, MD, FAAP',
      role: 'Chief of Pediatrics & Maternal Health',
      experience: '21+ Years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      bio: 'Championing high-risk obstetrics, extreme pre-term neonatal care, and family-centered pediatric clinical programs.'
    },
    {
      name: 'Dr. Gregory Thorne, MD, FACEP',
      role: 'Director of Emergency & Disaster Medicine',
      experience: '25+ Years',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      bio: 'Standardized our Level-1 Trauma response and coordinates regional aeromedical and ambulance disaster networks.'
    }
  ];

  const milestones = [
    { year: '1988', title: 'Founding of WeCare', desc: 'Inaugurated as a specialized 50-bed cardiovascular hospital with one catheterization lab.' },
    { year: '2001', title: 'Neurosciences & Trauma Expansion', desc: 'Added dedicated Level-1 Trauma wing, 24/7 stroke response team, and 6 modular surgical theatres.' },
    { year: '2012', title: 'Robotic Surgery Suite', desc: 'Introduced computer-navigated robotic joint replacements and minimally invasive oncological robotics.' },
    { year: '2019', title: 'JCI Gold Seal Accreditation', desc: 'Awarded Joint Commission International certification for benchmarked safety and healthcare standards.' },
    { year: '2026', title: '650-Bed High-Acuity Campus', desc: 'Inaugurated state-of-the-art hybrid OR suites, automated medication dispensaries, and digital care portals.' }
  ];

  const facilities = [
    { title: '650 In-Patient Beds', desc: 'Includes 150 critical care & ICU beds with negative pressure isolation suites.' },
    { title: '24 Modular Operating Rooms', desc: 'Equipped with Ultra-Clean Laminar Air Flow and robotic surgical towers.' },
    { title: 'Bi-Plane Digital Cath Lab', desc: 'Round-the-clock primary angioplasty with door-to-balloon time under 30 minutes.' },
    { title: 'Advanced Diagnostic Imaging', desc: '3-Tesla MRI, 128-Slice Dual-Source Cardiac CT, and PET-CT scan facilities.' },
    { title: 'Level-III Neonatal ICU', desc: 'Preterm nursery equipped with continuous micro-environmental incubators and nitric oxide.' },
    { title: 'Automated Blood Center', desc: 'Component separation, apheresis, and 24/7 emergency cross-matching reserve.' }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 py-6 sm:py-10">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 text-white rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider rounded-full">
              About WeCare Hospitals
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              A Legacy of Compassion, Innovation, and Clinical Trust
            </h1>
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
              For almost four decades, WeCare Hospitals has remained at the vanguard of modern medicine, bringing world-class diagnostics, internationally accredited clinical protocols, and deeply compassionate patient care together under one roof.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <Stethoscope className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver accessible, high-precision healthcare by blending cutting-edge scientific technology with empathetic human understanding, upholding patient dignity above all else.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be the most respected healthcare sanctuary in the region, recognized globally for groundbreaking clinical outcomes, medical research, and zero-compromise patient safety.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Core Values</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span><strong>Empathy:</strong> Treating every patient like family.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span><strong>Integrity:</strong> Evidence-based, transparent clinical ethics.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span><strong>Excellence:</strong> Continuous training and surgical precision.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hospital Campus Facilities */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              State-of-the-Art Medical Facilities
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Engineered to meet the highest safety, hygiene, and technological standards for modern tertiary care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                  0{i + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Clinical Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Clinical Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Executive Medical Leadership
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Our governance board ensures uncompromising adherence to global safety protocols and clinical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-56 object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">{leader.name}</h4>
                <p className="text-xs font-semibold text-teal-700">{leader.role}</p>
                <p className="text-[11px] text-slate-400 font-medium">Experience: {leader.experience}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Our Journey of Healing (1988 – Present)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative space-y-2 border-l-2 md:border-l-0 md:border-t-2 border-teal-500 pl-4 md:pl-0 md:pt-4">
                <span className="text-xl font-black text-teal-700 font-mono block">{m.year}</span>
                <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">
              Ready to Consult with Our Specialists?
            </h3>
            <p className="text-sm text-teal-100">
              Schedule your outpatient visit or book a second opinion with WeCare doctors today.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3.5 bg-white text-teal-800 font-bold text-sm rounded-xl shadow-md hover:bg-teal-50 transition-all cursor-pointer shrink-0"
          >
            Book Appointment Now
          </button>
        </div>
      </section>
    </div>
  );
};
