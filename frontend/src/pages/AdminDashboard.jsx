import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faListCheck,
  faUsers,
  faClock,
  faSpinner,
  faCheckCircle,
  faUserClock,
  faSyncAlt,
  faShieldHalved,
  faCheck,
  faTimes,
  faArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import ComplaintTable from '../components/complaints/ComplaintTable';
import ComplaintDetailModal from '../components/complaints/ComplaintDetailModal';
import StatusUpdateModal from '../components/complaints/StatusUpdateModal';
import UserTable from '../components/users/UserTable';
import { complaintAPI, userAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    complaints: { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 },
    users: { total: 0, pending: 0, active: 0, deactivated: 0 },
    categoryStats: [],
    priorityStats: [],
    recentComplaints: [],
    recentPendingUsers: [],
  });

  const [complaints, setComplaints] = useState([]);
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('all');
  const [complaintCategory, setComplaintCategory] = useState('all');
  const [complaintPriority, setComplaintPriority] = useState('all');

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userStatus, setUserStatus] = useState('all');
  const [userRole, setUserRole] = useState('all');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await statsAPI.getAdminStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await complaintAPI.getAllComplaints({
        search: complaintSearch,
        status: complaintStatus,
        category: complaintCategory,
        priority: complaintPriority,
      });
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  }, [complaintSearch, complaintStatus, complaintCategory, complaintPriority]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await userAPI.getAll({
        search: userSearch,
        status: userStatus,
        role: userRole,
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [userSearch, userStatus, userRole]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchComplaints(), fetchUsers()]);
    setLoading(false);
  }, [fetchComplaints, fetchUsers]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleApproveUser = async (targetUser) => {
    try {
      setErrorMessage('');
      const res = await userAPI.approve(targetUser._id);
      if (res.data.success) {
        setAlertMessage(`User ${targetUser.name} approved successfully!`);
        refreshAll();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleRejectUser = async (targetUser) => {
    try {
      setErrorMessage('');
      const res = await userAPI.reject(targetUser._id);
      if (res.data.success) {
        setAlertMessage(`User ${targetUser.name} registration rejected.`);
        refreshAll();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to reject user');
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    try {
      setErrorMessage('');
      const res = await userAPI.toggleStatus(targetUser._id);
      if (res.data.success) {
        setAlertMessage(`User status updated.`);
        refreshAll();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleUpdateUserRole = async (targetUser, newRole) => {
    try {
      setErrorMessage('');
      const isPromotingToAdmin = newRole === 'admin' && targetUser.role === 'user';
      const promptText = isPromotingToAdmin
        ? `Are you sure you want to promote ${targetUser.name} to Administrator?\n\nNOTE: Promoting an Admin will automatically grant you Super Admin authority.`
        : `Are you sure you want to change ${targetUser.name}'s role to ${newRole}?`;

      if (!window.confirm(promptText)) {
        return;
      }

      const res = await userAPI.updateRole(targetUser._id, { role: newRole });
      if (res.data.success) {
        setAlertMessage(res.data.message || `User role updated to ${newRole}.`);
        if (res.data.creatorElevated && refreshUser) {
          await refreshUser();
        }
        refreshAll();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const isTargetAdmin = targetUser.role === 'admin' || targetUser.role === 'super_admin';
    const confirmMsg = isTargetAdmin
      ? `CAUTION: Are you sure you want to permanently delete ADMINISTRATOR ${targetUser.name}?`
      : `Are you sure you want to delete user ${targetUser.name}?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setErrorMessage('');
      const res = await userAPI.delete(targetUser._id);
      if (res.data.success) {
        setAlertMessage(res.data.message || `User deleted.`);
        refreshAll();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleOpenDetail = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  const handleOpenStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdated = (updatedComplaint) => {
    setAlertMessage(`Complaint ${updatedComplaint.ticketId} status updated to ${updatedComplaint.status}`);
    refreshAll();
  };

  const handleDeleteComplaint = async (complaint) => {
    if (!window.confirm(`Are you sure you want to delete complaint ${complaint.ticketId}?`)) {
      return;
    }
    try {
      const res = await complaintAPI.delete(complaint._id);
      if (res.data.success) {
        setAlertMessage(`Complaint deleted.`);
        refreshAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar
        showSidebarToggle={true}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 p-6 sm:p-8 border border-rose-500/20 shadow-2xl text-white">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <span>Central Administration Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Admin Control Center
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                  Manage campus complaints, review pending student accounts, update ticket lifecycles, and monitor system metrics.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refreshAll}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh System Data</span>
                </button>
              </div>
            </div>
          </div>

          {alertMessage && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 animate-scale-in">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 dark:text-emerald-400" />
                <span>{alertMessage}</span>
              </div>
              <button
                onClick={() => setAlertMessage('')}
                className="text-emerald-600 dark:text-emerald-400 hover:opacity-75"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center justify-between rounded-2xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-800 dark:text-rose-300 animate-scale-in">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="text-rose-600 dark:text-rose-400 hover:opacity-75"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {stats.users?.pending > 0 && (
            <div className="rounded-2xl bg-amber-500/15 border border-amber-500/30 p-4 text-amber-900 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-lg">
                  <FontAwesomeIcon icon={faUserClock} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                    {stats.users.pending} Student Account{stats.users.pending > 1 ? 's' : ''} Awaiting Approval
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                    Students cannot access the system until an administrator verifies and activates their accounts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUserStatus('pending');
                  setActiveTab('users');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs hover:bg-amber-400 transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Review Pending Queue</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="All Complaints"
              value={stats.complaints?.total}
              subtitle="Registered campus tickets"
              icon={faListCheck}
              color="indigo"
              onClick={() => {
                setComplaintStatus('all');
                setActiveTab('complaints');
              }}
              active={activeTab === 'complaints' && complaintStatus === 'all'}
            />
            <StatCard
              title="Pending Complaints"
              value={stats.complaints?.pending}
              subtitle="Awaiting admin action"
              icon={faClock}
              color="amber"
              onClick={() => {
                setComplaintStatus('PENDING');
                setActiveTab('complaints');
              }}
              active={activeTab === 'complaints' && complaintStatus === 'PENDING'}
            />
            <StatCard
              title="In Progress"
              value={stats.complaints?.inProgress}
              subtitle="Under active investigation"
              icon={faSpinner}
              color="blue"
              onClick={() => {
                setComplaintStatus('IN PROGRESS');
                setActiveTab('complaints');
              }}
              active={activeTab === 'complaints' && complaintStatus === 'IN PROGRESS'}
            />
            <StatCard
              title="Pending User Approvals"
              value={stats.users?.pending}
              subtitle="Registrations in queue"
              icon={faUserClock}
              color="rose"
              onClick={() => {
                setUserStatus('pending');
                setActiveTab('users');
              }}
              active={activeTab === 'users' && userStatus === 'pending'}
            />
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Resolution Rate
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.complaints?.total > 0
                        ? Math.round(
                            (stats.complaints.resolved / stats.complaints.total) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.complaints?.total > 0
                            ? Math.round(
                                (stats.complaints.resolved / stats.complaints.total) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{stats.complaints?.resolved || 0} Resolved</span>
                    <span>{stats.complaints?.rejected || 0} Rejected</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Student Accounts
                    </h4>
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {stats.users?.active || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Active users ({stats.users?.total || 0} total enrolled)
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Urgent Complaints
                    </h4>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                    {complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'RESOLVED').length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Requiring immediate dispatch
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartPie} className="text-indigo-600 dark:text-indigo-400" />
                    Complaints by Category
                  </h4>
                  {stats.categoryStats?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No categories recorded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.categoryStats?.map((cat) => (
                        <div key={cat._id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{cat._id}</span>
                            <span className="text-slate-500 dark:text-slate-400">{cat.count} tickets</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{
                                width: `${
                                  stats.complaints?.total > 0
                                    ? Math.round((cat.count / stats.complaints.total) * 100)
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <FontAwesomeIcon icon={faUserClock} className="text-amber-500 dark:text-amber-400" />
                      Pending Approvals Queue
                    </h4>
                    <button
                      onClick={() => {
                        setUserStatus('pending');
                        setActiveTab('users');
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All ({stats.users?.pending || 0})
                    </button>
                  </div>

                  {stats.recentPendingUsers?.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-lg mb-2 block mx-auto" />
                      All user registrations have been approved!
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stats.recentPendingUsers?.map((u) => (
                        <div key={u._id} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.email} &bull; {u.department}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleApproveUser(u)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectUser(u)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ComplaintTable
                complaints={complaints.slice(0, 5)}
                loading={loading}
                searchTerm={complaintSearch}
                onSearchChange={setComplaintSearch}
                statusFilter={complaintStatus}
                onStatusFilterChange={setComplaintStatus}
                categoryFilter={complaintCategory}
                onCategoryFilterChange={setComplaintCategory}
                priorityFilter={complaintPriority}
                onPriorityFilterChange={setComplaintPriority}
                onViewComplaint={handleOpenDetail}
                onUpdateStatus={handleOpenStatusModal}
                onDeleteComplaint={handleDeleteComplaint}
                title="Recent Complaints Stream"
              />
            </div>
          )}

          {activeTab === 'complaints' && (
            <ComplaintTable
              complaints={complaints}
              loading={loading}
              searchTerm={complaintSearch}
              onSearchChange={setComplaintSearch}
              statusFilter={complaintStatus}
              onStatusFilterChange={setComplaintStatus}
              categoryFilter={complaintCategory}
              onCategoryFilterChange={setComplaintCategory}
              priorityFilter={complaintPriority}
              onPriorityFilterChange={setComplaintPriority}
              onViewComplaint={handleOpenDetail}
              onUpdateStatus={handleOpenStatusModal}
              onDeleteComplaint={handleDeleteComplaint}
              title="Central Complaints Registry"
            />
          )}

          {activeTab === 'users' && (
            <UserTable
              users={users}
              loading={loading}
              searchTerm={userSearch}
              onSearchChange={setUserSearch}
              statusFilter={userStatus}
              onStatusFilterChange={setUserStatus}
              roleFilter={userRole}
              onRoleFilterChange={setUserRole}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              onToggleStatus={handleToggleUserStatus}
              onUpdateRole={handleUpdateUserRole}
              onDelete={handleDeleteUser}
            />
          )}
        </main>
      </div>

      <ComplaintDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        complaint={selectedComplaint}
        onOpenStatusUpdate={handleOpenStatusModal}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        complaint={selectedComplaint}
        onUpdated={handleStatusUpdated}
      />
    </div>
  );
};

export default AdminDashboard;
