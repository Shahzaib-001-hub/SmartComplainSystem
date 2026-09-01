import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faUser,
  faBuilding,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faCommentDots,
  faClockRotateLeft,
  faEdit,
  faFileImage,
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import Timeline from '../common/Timeline';
import { useAuth } from '../../context/AuthContext';

const ComplaintDetailModal = ({
  isOpen,
  onClose,
  complaint,
  onOpenStatusUpdate,
}) => {
  const { isAdmin } = useAuth();

  if (!complaint) return null;

  const formattedDate = new Date(complaint.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faTicketAlt} className="text-indigo-400" />
          <span>Complaint Details - {complaint.ticketId}</span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="rounded-2xl bg-slate-800/80 p-5 border border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/30">
                {complaint.ticketId}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendarAlt} />
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} size="normal" />
            </div>
          </div>

          <div className="mt-3.5">
            <span className="inline-block text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded mb-2">
              Category: {complaint.category}
            </span>
            <h2 className="text-xl font-bold text-white">{complaint.title}</h2>
          </div>

          {/* Submitter & Location Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
            <div className="space-y-1.5">
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-slate-400 w-3.5" />
                <span className="font-semibold text-white">
                  {complaint.user?.name || 'User'}
                </span>
                {complaint.user?.studentId && (
                  <span className="text-slate-400">({complaint.user.studentId})</span>
                )}
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 w-3.5" />
                <span className="text-slate-300">{complaint.user?.email}</span>
              </p>
              {complaint.user?.phone && (
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-slate-400 w-3.5" />
                  <span className="text-slate-300">{complaint.user.phone}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              {(complaint.department || complaint.user?.department) && (
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-slate-400 w-3.5" />
                  <span className="text-slate-300">
                    Dept: {complaint.department || complaint.user?.department}
                  </span>
                </p>
              )}
              {complaint.location && (
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-rose-400 w-3.5" />
                  <span className="text-slate-300">Location: {complaint.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Complaint Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Description of Issue
          </h4>
          <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/60 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {complaint.description}
          </div>
        </div>

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faFileImage} />
              Attachments ({complaint.attachments.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-slate-700 bg-slate-800 hover:border-indigo-500 transition-colors"
                >
                  <img
                    src={att}
                    alt={`Attachment ${idx + 1}`}
                    className="h-32 w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                    View Full Image
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Admin Remarks */}
        {complaint.adminRemarks && (
          <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/30 p-4">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold mb-1.5">
              <FontAwesomeIcon icon={faCommentDots} />
              <span>Official Admin Remarks / Resolution Notes</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed pl-1 border-l-2 border-indigo-400">
              {complaint.adminRemarks}
            </p>
          </div>
        )}

        {/* Audit Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faClockRotateLeft} />
            Lifecycle Audit Trail
          </h4>
          <Timeline events={complaint.timeline} />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenStatusUpdate(complaint);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
            >
              <FontAwesomeIcon icon={faEdit} />
              Update Status & Add Remarks
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ComplaintDetailModal;
