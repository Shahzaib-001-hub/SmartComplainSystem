import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCheck,
  faTimes,
  faUserSlash,
  faUserCheck,
  faShieldAlt,
  faTrash,
  faUserGraduate,
  faUserTie,
  faCrown,
  faLock,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const UserTable = ({
  users = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  roleFilter = 'all',
  onRoleFilterChange,
  onApprove,
  onReject,
  onToggleStatus,
  onUpdateRole,
  onDelete,
}) => {
  const { user: currentUser, isSuperAdmin } = useAuth();

  const statusTabs = [
    { id: 'all', label: 'All Users' },
    { id: 'pending', label: 'Pending Approvals' },
    { id: 'active', label: 'Active' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'deactivated', label: 'Deactivated' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>User Directory & Approvals</span>
              {isSuperAdmin && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <FontAwesomeIcon icon={faCrown} /> Super Admin Control
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage student accounts, registrations, admin roles, and RBAC permissions
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
              placeholder="Search by name, email, roll no..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {statusTabs.map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Students / Users</option>
            <option value="admin">All Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Department / Roll No</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Account Status</th>
              <th className="px-5 py-3.5">Registered</th>
              <th className="px-5 py-3.5 text-right">Access Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl text-slate-300 dark:text-slate-600 mb-1" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No users found</p>
                    <p className="text-xs text-slate-500">
                      No user accounts match your search or filter criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isPending = u.status === 'pending';
                const isActive = u.status === 'active';
                const isTargetSuperAdmin = u.role === 'super_admin';
                const isTargetAdmin = u.role === 'admin';
                const isTargetUser = u.role === 'user';
                const isSelf = currentUser?._id === u._id;

                // Can current logged-in admin change target user's role?
                const canChangeRole =
                  !isTargetSuperAdmin &&
                  (isTargetUser || (isTargetAdmin && isSuperAdmin));

                // Can current logged-in admin delete target user?
                const canDelete =
                  !isTargetSuperAdmin &&
                  !isSelf &&
                  (isTargetUser || (isTargetAdmin && isSuperAdmin));

                // Can current logged-in admin toggle status?
                const canToggleStatus =
                  !isTargetSuperAdmin &&
                  !isSelf &&
                  (isTargetUser || (isTargetAdmin && isSuperAdmin));

                return (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* User Name & Email */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
                            isTargetSuperAdmin
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40 shadow-sm'
                              : isTargetAdmin
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                              : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              isTargetSuperAdmin
                                ? faCrown
                                : isTargetAdmin
                                ? faUserTie
                                : faUserGraduate
                            }
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-normal">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department / ID */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div>
                        <p className="text-xs text-slate-800 dark:text-slate-200">{u.department || 'General'}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {u.studentId || 'No ID'}
                        </p>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {isTargetSuperAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40">
                          <FontAwesomeIcon icon={faCrown} className="text-amber-500 text-[10px]" />
                          SUPER ADMIN
                        </span>
                      ) : isTargetAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                          <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          STUDENT
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={u.status} size="sm" />
                    </td>

                    {/* Registered Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <button
                              onClick={() => onApprove(u)}
                              title="Approve & Activate User"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(u)}
                              title="Reject Registration"
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2.5 py-1 text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                              Reject
                            </button>
                          </>
                        )}

                        {!isPending && (
                          <>
                            {canToggleStatus ? (
                              <button
                                onClick={() => onToggleStatus(u)}
                                title={isActive ? 'Deactivate User' : 'Activate User'}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400'
                                    : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white'
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={isActive ? faUserSlash : faUserCheck}
                                  className="text-xs"
                                />
                              </button>
                            ) : isTargetSuperAdmin ? (
                              <span
                                title="Super Admin cannot be deactivated"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed"
                              >
                                <FontAwesomeIcon icon={faLock} className="text-xs" />
                              </span>
                            ) : null}
                          </>
                        )}

                        {/* Role Change Button */}
                        {isTargetSuperAdmin ? (
                          <span
                            title="Protected: Super Admin cannot be demoted"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-500/40 cursor-not-allowed"
                          >
                            <FontAwesomeIcon icon={faCrown} className="text-xs" />
                          </span>
                        ) : canChangeRole ? (
                          <button
                            onClick={() =>
                              onUpdateRole(u, isTargetAdmin ? 'user' : 'admin')
                            }
                            title={
                              isTargetAdmin
                                ? 'Demote Admin back to Student/User'
                                : 'Promote Student to Admin (Auto Elevates Creator to Super Admin)'
                            }
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              isTargetAdmin
                                ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400'
                            }`}
                          >
                            <FontAwesomeIcon icon={faShieldAlt} className="text-xs" />
                          </button>
                        ) : isTargetAdmin && !isSuperAdmin ? (
                          <span
                            title="Protected: Only Super Admin can demote other Admins"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          >
                            <FontAwesomeIcon icon={faLock} className="text-xs" />
                          </span>
                        ) : null}

                        {/* Delete Button */}
                        {isTargetSuperAdmin ? (
                          <span
                            title="Protected: Super Admin cannot be deleted"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          >
                            <FontAwesomeIcon icon={faLock} className="text-xs" />
                          </span>
                        ) : canDelete ? (
                          <button
                            onClick={() => onDelete(u)}
                            title={
                              isTargetAdmin
                                ? 'Delete Administrator Account'
                                : 'Delete User Account'
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        ) : isTargetAdmin && !isSuperAdmin ? (
                          <span
                            title="Protected: Only Super Admin can delete other Admins"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          >
                            <FontAwesomeIcon icon={faLock} className="text-xs" />
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
