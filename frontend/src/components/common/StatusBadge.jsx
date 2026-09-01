import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faUserCheck,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

const StatusBadge = ({ status, size = 'normal', showIcon = true }) => {
  const normalized = (status || '').toUpperCase();

  let config = {
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: faClock,
    label: status || 'Unknown',
  };

  switch (normalized) {
    case 'PENDING':
      config = {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: faClock,
        label: 'PENDING',
      };
      break;
    case 'IN PROGRESS':
      config = {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        icon: faSpinner,
        label: 'IN PROGRESS',
      };
      break;
    case 'RESOLVED':
      config = {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: faCheckCircle,
        label: 'RESOLVED',
      };
      break;
    case 'REJECTED':
      config = {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: faTimesCircle,
        label: 'REJECTED',
      };
      break;
    case 'ACTIVE':
      config = {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: faUserCheck,
        label: 'ACTIVE',
      };
      break;
    case 'DEACTIVATED':
      config = {
        bg: 'bg-slate-700/50 text-slate-400 border-slate-600',
        icon: faUserSlash,
        label: 'DEACTIVATED',
      };
      break;
    default:
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-semibold'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} tracking-wide transition-colors`}
    >
      {showIcon && (
        <FontAwesomeIcon
          icon={config.icon}
          className={`${normalized === 'IN PROGRESS' ? 'animate-spin' : ''} text-[11px]`}
        />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
