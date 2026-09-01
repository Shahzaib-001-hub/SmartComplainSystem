import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faSignOutAlt,
  faUserTie,
  faUserGraduate,
  faBars,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleSidebar, showSidebarToggle = false }) => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Brand & Left Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {showSidebarToggle && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}

        <Link
          to={isAdmin ? '/admin' : '/dashboard'}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              Smart Complaint <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              MERN Resolution Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Dark / Light Theme Toggle Button */}
        <ThemeToggle />

        {/* Role Pill */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          {isSuperAdmin ? (
            <>
              <FontAwesomeIcon icon={faCrown} className="text-amber-500 dark:text-amber-400 text-xs" />
              <span className="text-amber-600 dark:text-amber-400 font-extrabold tracking-wide">
                SUPER ADMIN
              </span>
            </>
          ) : isAdmin ? (
            <>
              <FontAwesomeIcon icon={faUserTie} className="text-rose-600 dark:text-rose-400" />
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                ADMINISTRATOR
              </span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUserGraduate} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                STUDENT / USER
              </span>
            </>
          )}
        </div>

        {/* User Info & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm border ${
                isSuperAdmin
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                  : isAdmin
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                  : 'bg-indigo-600/15 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400 border-indigo-500/30'
              }`}
            >
              {isSuperAdmin ? (
                <FontAwesomeIcon icon={faCrown} className="text-xs text-amber-500" />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                'U'
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                {user?.name || 'User'}
                {isSuperAdmin && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1 rounded font-bold">
                    Super
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">{user?.email}</p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/20 dark:shadow-black/50 py-2 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    {user?.name}
                    {isSuperAdmin && (
                      <FontAwesomeIcon icon={faCrown} className="text-amber-500 text-[11px]" />
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold uppercase">
                    Role: {user?.role === 'super_admin' ? 'Super Admin' : user?.role || 'User'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 dark:hover:border-rose-500/30 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
