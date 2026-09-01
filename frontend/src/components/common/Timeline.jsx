import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faClock,
  faSpinner,
  faTimesCircle,
  faUserTie,
  faUserGraduate,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from './StatusBadge';

const Timeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-indigo-400" />
        No timeline events recorded yet.
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING':
        return { icon: faClock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'IN PROGRESS':
        return { icon: faSpinner, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'RESOLVED':
        return { icon: faCheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'REJECTED':
        return { icon: faTimesCircle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      default:
        return { icon: faInfoCircle, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
      {events.map((event, idx) => {
        const config = getStatusIcon(event.status);
        return (
          <div key={idx} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-[27px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${config.color} text-xs shadow`}
            >
              <FontAwesomeIcon
                icon={config.icon}
                className={event.status === 'IN PROGRESS' ? 'animate-spin' : ''}
              />
            </div>

            {/* Event Card */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 hover:border-slate-600 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.status} size="sm" />
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={event.updatedByName?.includes('Admin') ? faUserTie : faUserGraduate}
                      className="text-slate-400 text-[11px]"
                    />
                    {event.updatedByName || 'System'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(event.timestamp)}
                </span>
              </div>

              {event.note && (
                <p className="mt-2 text-sm text-slate-300 leading-relaxed pl-1 border-l-2 border-slate-600">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
