import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faCircleNotch,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import { complaintAPI } from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'PENDING - Awaiting administrative review', color: 'text-amber-400' },
  { value: 'IN PROGRESS', label: 'IN PROGRESS - Investigation / Action underway', color: 'text-blue-400' },
  { value: 'RESOLVED', label: 'RESOLVED - Issue fixed and verified', color: 'text-emerald-400' },
  { value: 'REJECTED', label: 'REJECTED - Cannot be serviced / Invalid request', color: 'text-rose-400' },
];

const StatusUpdateModal = ({ isOpen, onClose, complaint, onUpdated }) => {
  const [status, setStatus] = useState('IN PROGRESS');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'IN PROGRESS');
      setAdminRemarks(complaint.adminRemarks || '');
      setError('');
    }
  }, [complaint]);

  if (!complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await complaintAPI.updateStatus(complaint._id, {
        status,
        adminRemarks,
      });

      if (res.data.success) {
        onUpdated(res.data.complaint);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update complaint status'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEdit} className="text-rose-400" />
          <span>Update Status: {complaint.ticketId}</span>
        </div>
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-300">
          <p className="font-bold text-white mb-0.5">{complaint.title}</p>
          <p className="text-slate-400">
            Submitted by: <span className="text-indigo-300">{complaint.user?.name}</span> ({complaint.user?.email})
          </p>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            New Lifecycle Status <span className="text-rose-400">*</span>
          </label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  status === opt.value
                    ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={status === opt.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className={`text-xs font-semibold ${opt.color}`}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Admin Remarks */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Official Admin Remarks & Action Notes
          </label>
          <textarea
            rows="3"
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            placeholder="Add explanation for resolution, action taken, technician dispatch details, or reason for rejection..."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} />
                Save & Update Timeline
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StatusUpdateModal;
