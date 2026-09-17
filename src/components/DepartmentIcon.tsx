import React from 'react';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Flower2,
  Stethoscope,
  ShieldAlert,
  Plus
} from 'lucide-react';

interface DepartmentIconProps {
  name: string;
  className?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({ name, className = "w-6 h-6" }) => {
  switch (name) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Bone':
      return <Bone className={className} />;
    case 'Baby':
      return <Baby className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Flower2':
      return <Flower2 className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    default:
      return <Plus className={className} />;
  }
};
