import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faPaperclip,
  faTimes,
  faCircleNotch,
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import { complaintAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'Academic',
  'Hostel & Accommodation',
  'Infrastructure & Maintenance',
  'IT & Network',
  'Cafeteria & Mess',
  'Transport',
  'Library',
  'Administration & Accounts',
  'Other',
];

const ComplaintFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'IT & Network',
    priority: 'Medium',
    department: user?.department || '',
    location: '',
    description: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 3) {
      setError('You can upload a maximum of 3 attachments.');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB per image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide both a title and detailed description.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        attachments,
      };

      const res = await complaintAPI.create(payload);
      if (res.data.success) {
        setSuccessMsg('Complaint lodged successfully! Initial status set to PENDING.');
        setTimeout(() => {
          setFormData({
            title: '',
            category: 'IT & Network',
            priority: 'Medium',
            department: user?.department || '',
            location: '',
            description: '',
          });
          setAttachments([]);
          setSuccessMsg('');
          onSuccess(res.data.complaint);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit complaint. Please try again.'
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
          <FontAwesomeIcon icon={faPlusCircle} className="text-indigo-400" />
          <span>File a New Complaint</span>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Complaint Subject / Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Broken AC in Classroom 402 / Slow Library Wi-Fi"
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Priority Level <span className="text-rose-400">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Low">Low - Minor inconvenience</option>
              <option value="Medium">Medium - Regular attention</option>
              <option value="High">High - Impeding daily work</option>
              <option value="Urgent">Urgent - Critical issue / hazard</option>
            </select>
          </div>
        </div>

        {/* Location & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Location / Room / Building
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Block C, Room 204"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Detailed Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please provide full details of the issue, when it started, and any troubleshooting attempts..."
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Photo Attachments (Optional - Max 3)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 group"
              >
                <img src={att} alt="upload preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="absolute inset-0 flex items-center justify-center bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}

            {attachments.length < 3 && (
              <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/40 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                <FontAwesomeIcon icon={faPaperclip} className="text-base mb-1" />
                <span className="text-[10px] font-semibold">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlusCircle} />
                Submit Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ComplaintFormModal;
