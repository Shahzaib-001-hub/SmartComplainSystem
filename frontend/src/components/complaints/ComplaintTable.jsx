import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'All Categories',
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

const ComplaintTable = ({
  complaints = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  priorityFilter = 'all',
  onPriorityFilterChange,
  onViewComplaint,
  onUpdateStatus,
  onDeleteComplaint,
  title = 'Complaints Registry',
}) => {
  const { isAdmin } = useAuth();

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'IN PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {complaints.length} complaint record{complaints.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ticket, title, student..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Status Tabs & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {statusTabs.map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Ticket & Date</th>
              {isAdmin && <th className="px-5 py-3.5">Submitted By</th>}
              <th className="px-5 py-3.5">Complaint Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="px-5 py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl text-slate-300 dark:text-slate-600 mb-1" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No complaints found</p>
                    <p className="text-xs text-slate-500">
                      Try adjusting your search or filters to see results.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.ticketId}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>

                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col max-w-[160px]">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {item.user?.name || 'User'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.user?.email}
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="px-5 py-3.5 max-w-xs">
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <PriorityBadge priority={item.priority} />
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewComplaint(item)}
                        title="View Details"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {isAdmin && onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(item)}
                          title="Update Status"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}

                      {onDeleteComplaint && (
                        <button
                          onClick={() => onDeleteComplaint(item)}
                          title="Delete Complaint"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
