import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`flex items-center gap-2 rounded-xl p-2 text-xs font-semibold transition-all duration-200 ${
        isDark
          ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 border border-slate-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-indigo-600 border border-slate-200 shadow-sm'
      } ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <FontAwesomeIcon
          icon={isDark ? faSun : faMoon}
          className={`text-sm transition-transform duration-300 ${
            isDark ? 'rotate-0 text-amber-400' : 'rotate-12 text-indigo-600'
          }`}
        />
      </div>
      {showLabel && (
        <span className="hidden sm:inline-block">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

