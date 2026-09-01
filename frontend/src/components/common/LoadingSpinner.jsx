import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = ({ text = 'Loading...', size = 'text-3xl', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <FontAwesomeIcon icon={faCircleNotch} className={`animate-spin text-indigo-500 ${size}`} />
      {text && <p className="text-slate-400 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
