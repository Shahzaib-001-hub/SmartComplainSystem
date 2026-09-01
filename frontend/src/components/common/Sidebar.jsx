import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faListCheck,
  faUsers,
  faUserTie,
  faUserGraduate,
  faFileCirclePlus,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, onSelectTab, isOpen, onClose }) => {
  const { isAdmin, isSuperAdmin, user } = useAuth();

  const adminNavItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: faChartPie },
    { id: 'complaints', label: 'Manage Complaints', icon: faListCheck },
    { id: 'users', label: 'Manage Users & Approvals', icon: faUsers },
  ];

  const userNavItems = [
    { id: 'my-complaints', label: 'My Complaints', icon: faListCheck },
    { id: 'submit', label: 'File New Complaint', icon: faFileCirclePlus },
  ];

  const userHasAdminRights =
    isAdmin || isSuperAdmin || user?.role === 'admin' || user?.role === 'super_admin';
  const navItems = userHasAdminRights ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>{userHasAdminRights ? 'Administration Portal' : 'Student Portal'}</span>
              {isSuperAdmin && (
                <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-1">
                  <FontAwesomeIcon icon={faCrown} /> SUPER
                </span>
              )}
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? isSuperAdmin
                        ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 shadow-sm'
                        : userHasAdminRights
                        ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shadow-sm'
                        : 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-base ${
                      isActive
                        ? isSuperAdmin
                          ? 'text-amber-600 dark:text-amber-400'
                          : userHasAdminRights
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Mini Footer */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
                  isSuperAdmin
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                    : userHasAdminRights
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                    : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    isSuperAdmin
                      ? faCrown
                      : userHasAdminRights
                      ? faUserTie
                      : faUserGraduate
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1">
                  {user?.name}
                </p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {isSuperAdmin
                    ? 'Super Administrator'
                    : user?.department || (userHasAdminRights ? 'Admin' : 'Student')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
