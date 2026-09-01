import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'indigo',
  onClick,
  active = false,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 hover:bg-indigo-500/15',
      border: 'border-indigo-500/20',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30',
      iconBg: 'bg-indigo-600 text-white',
      textColor: 'text-indigo-400',
    },
    amber: {
      bg: 'bg-amber-500/10 hover:bg-amber-500/15',
      border: 'border-amber-500/20',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
      iconBg: 'bg-amber-600 text-white',
      textColor: 'text-amber-400',
    },
    blue: {
      bg: 'bg-blue-500/10 hover:bg-blue-500/15',
      border: 'border-blue-500/20',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30',
      iconBg: 'bg-blue-600 text-white',
      textColor: 'text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
      border: 'border-emerald-500/20',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      iconBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-500/10 hover:bg-rose-500/15',
      border: 'border-rose-500/20',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30',
      iconBg: 'bg-rose-600 text-white',
      textColor: 'text-rose-400',
    },
    purple: {
      bg: 'bg-purple-500/10 hover:bg-purple-500/15',
      border: 'border-purple-500/20',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      iconBg: 'bg-purple-600 text-white',
      textColor: 'text-purple-400',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 backdrop-blur-sm ${
        scheme.bg
      } ${active ? scheme.activeBorder : scheme.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">{value ?? 0}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-md ${scheme.iconBg}`}
        >
          <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
