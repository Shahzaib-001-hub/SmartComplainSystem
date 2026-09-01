import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faEnvelope,
  faLock,
  faCircleNotch,
  faExclamationTriangle,
  faClock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorStatus(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const status = err.response?.data?.status;
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';

      if (status === 'pending') {
        setErrorStatus('pending');
        setErrorMessage(
          'Your account has been registered but is currently PENDING ADMINISTRATOR APPROVAL. You will be able to log in once an admin activates your account.'
        );
      } else if (status === 'rejected') {
        setErrorStatus('rejected');
        setErrorMessage(
          'Access Denied: Your registration was rejected by an administrator. Please contact IT support.'
        );
      } else if (status === 'deactivated') {
        setErrorStatus('deactivated');
        setErrorMessage(
          'Access Denied: Your account has been deactivated. Please contact an administrator.'
        );
      } else {
        setErrorStatus('general');
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle showLabel={true} />
      </div>

      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/25 mb-4">
          <FontAwesomeIcon icon={faShieldHalved} className="text-3xl" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Complaint System
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Single Common Login for Students, Staff, and Administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-10 shadow-2xl shadow-slate-300/40 dark:shadow-black/80 rounded-3xl transition-colors">
          {errorStatus === 'pending' && (
            <div className="mb-6 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-4 text-amber-800 dark:text-amber-300 animate-scale-in">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="text-lg mt-0.5 text-amber-500 dark:text-amber-400" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900 dark:text-amber-200">Account Pending Admin Approval</p>
                  <p className="mt-1 leading-relaxed text-amber-800/90 dark:text-amber-300/90">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorStatus && errorStatus !== 'pending' && (
            <div className="mb-6 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-4 text-rose-800 dark:text-rose-300 animate-scale-in">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-lg mt-0.5 text-rose-500 dark:text-rose-400"
                />
                <div className="text-xs">
                  <p className="font-bold text-rose-900 dark:text-rose-200">Authentication Error</p>
                  <p className="mt-1 leading-relaxed text-rose-800/90 dark:text-rose-300/90">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                  Verifying Account...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              Register as Student / User &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
