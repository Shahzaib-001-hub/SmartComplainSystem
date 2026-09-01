import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faListCheck,
  faClock,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faThLarge,
  faTableList,
  faSyncAlt,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import ComplaintCard from '../components/complaints/ComplaintCard';
import ComplaintTable from '../components/complaints/ComplaintTable';
import ComplaintFormModal from '../components/complaints/ComplaintFormModal';
import ComplaintDetailModal from '../components/complaints/ComplaintDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { complaintAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-complaints');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [compRes, statsRes] = await Promise.all([
        complaintAPI.getMyComplaints({
          search: searchTerm,
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
        }),
        statsAPI.getUserStats(),
      ]);

      if (compRes.data.success) {
        setComplaints(compRes.data.complaints);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenDetail = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  const handleComplaintCreated = () => {
    fetchDashboardData();
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
          onSelectTab={(tabId) => {
            if (tabId === 'submit') {
              setIsCreateModalOpen(true);
            } else {
              setActiveTab(tabId);
            }
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl text-white">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <FontAwesomeIcon icon={faUserGraduate} />
                  <span>Student Portal &bull; {user?.department || 'General'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {user?.name}!
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                  Lodge and track your complaints, report campus issues, and review administrative updates and resolution timelines.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="text-sm" />
                  <span>File New Complaint</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Lodged"
              value={stats.total}
              subtitle="All submissions"
              icon={faListCheck}
              color="indigo"
              onClick={() => setStatusFilter('all')}
              active={statusFilter === 'all'}
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              subtitle="Awaiting admin"
              icon={faClock}
              color="amber"
              onClick={() => setStatusFilter('PENDING')}
              active={statusFilter === 'PENDING'}
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              subtitle="Action underway"
              icon={faSpinner}
              color="blue"
              onClick={() => setStatusFilter('IN PROGRESS')}
              active={statusFilter === 'IN PROGRESS'}
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              subtitle="Successfully fixed"
              icon={faCheckCircle}
              color="emerald"
              onClick={() => setStatusFilter('RESOLVED')}
              active={statusFilter === 'RESOLVED'}
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              subtitle="Closed / Unresolved"
              icon={faTimesCircle}
              color="rose"
              onClick={() => setStatusFilter('REJECTED')}
              active={statusFilter === 'REJECTED'}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                My Complaints & Reports
              </h2>
              <button
                onClick={fetchDashboardData}
                title="Refresh"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faSyncAlt} className={`text-xs ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Card View"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <FontAwesomeIcon icon={faTableList} />
              </button>
            </div>
          </div>

          {loading && complaints.length === 0 ? (
            <div className="p-12">
              <LoadingSpinner text="Fetching your complaints..." />
            </div>
          ) : viewMode === 'table' ? (
            <ComplaintTable
              complaints={complaints}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              onViewComplaint={handleOpenDetail}
              title="My Complaints Register"
            />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your complaints by subject, ticket..."
                  className="w-full sm:w-80 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Hostel & Accommodation">Hostel & Accommodation</option>
                    <option value="Infrastructure & Maintenance">Infrastructure & Maintenance</option>
                    <option value="IT & Network">IT & Network</option>
                    <option value="Cafeteria & Mess">Cafeteria & Mess</option>
                    <option value="Transport">Transport</option>
                    <option value="Library">Library</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {complaints.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-12 text-center shadow-sm">
                  <FontAwesomeIcon icon={faListCheck} className="text-4xl text-slate-300 dark:text-slate-600 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">No complaints found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    You haven't submitted any complaints under the selected criteria, or no matching records exist.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                    File a Complaint Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaints.map((item) => (
                    <ComplaintCard
                      key={item._id}
                      complaint={item}
                      onView={handleOpenDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ComplaintFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleComplaintCreated}
      />

      <ComplaintDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        complaint={selectedComplaint}
      />
    </div>
  );
};

export default UserDashboard;
