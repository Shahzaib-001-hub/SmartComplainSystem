import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faBolt,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

const PriorityBadge = ({ priority }) => {
  const norm = (priority || 'Medium').toLowerCase();

  let badge = {
    bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: faArrowUp,
    label: priority || 'Medium',
  };

  switch (norm) {
    case 'urgent':
      badge = {
        bg: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
        icon: faBolt,
        label: 'Urgent',
      };
      break;
    case 'high':
      badge = {
        bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        icon: faExclamationTriangle,
        label: 'High',
      };
      break;
    case 'medium':
      badge = {
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: faArrowUp,
        label: 'Medium',
      };
      break;
    case 'low':
      badge = {
        bg: 'bg-slate-700/60 text-slate-300 border-slate-600',
        icon: faArrowDown,
        label: 'Low',
      };
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${badge.bg}`}
    >
      <FontAwesomeIcon icon={badge.icon} className="text-[10px]" />
      {badge.label}
    </span>
  );
};

export default PriorityBadge;
