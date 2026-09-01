import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-3xl mx-auto">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <p className="text-sm text-slate-400">
          The page you are looking for does not exist or you do not have permission to view it.
        </p>
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-colors"
          >
            <FontAwesomeIcon icon={faHome} />
            Back to Home / Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
