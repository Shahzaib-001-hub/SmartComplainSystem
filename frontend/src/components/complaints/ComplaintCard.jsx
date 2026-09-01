import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faBuilding,
  faMapMarkerAlt,
  faEye,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const ComplaintCard = ({ complaint, onView }) => {
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 shadow-sm">
      <div>
        {/* Card Header: Ticket ID & Status */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
              {complaint.ticketId || 'CMP-TICKET'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px]" />
              {formattedDate}
            </span>
          </div>
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {/* Title & Category */}
        <div className="mt-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded">
              {complaint.category}
            </span>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
            {complaint.title}
          </h4>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Location / Department info */}
        {(complaint.location || complaint.department) && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/40">
            {complaint.location && (
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-rose-500 dark:text-rose-400 text-[10px]" />
                {complaint.location}
              </span>
            )}
            {complaint.department && (
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <FontAwesomeIcon icon={faBuilding} className="text-slate-400 text-[10px]" />
                {complaint.department}
              </span>
            )}
          </div>
        )}

        {/* Admin Remark Highlight if available */}
        {complaint.adminRemarks && (
          <div className="mt-3 rounded-xl bg-indigo-50/70 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-700/60 p-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
              <FontAwesomeIcon icon={faCommentDots} />
              <span>Admin Response:</span>
            </div>
            <p className="line-clamp-2 text-slate-600 dark:text-slate-300 text-[11px] italic">
              "{complaint.adminRemarks}"
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {complaint.timeline?.length || 1} status update{(complaint.timeline?.length || 1) > 1 ? 's' : ''}
        </span>
        <button
          onClick={() => onView(complaint)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white dark:hover:bg-indigo-600 transition-colors"
        >
          <FontAwesomeIcon icon={faEye} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ComplaintCard;
