import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiLogin({ email, password });
      login(response.access_token, response.user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await apiLogin({ email: demoEmail, password: 'password123' });
      login(response.access_token, response.user);
      navigate('/');
    } catch (err) {
      setError('Backend unavailable. Start the API server first.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-serif font-bold text-xl">A</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            AGRIFLOW
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 uppercase tracking-widest font-semibold">
            Enterprise Operating System
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-slate-900 focus:border-slate-900 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border bg-slate-50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-slate-900 focus:border-slate-900 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border bg-slate-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 text-[11px] uppercase tracking-wider font-medium">
                  Quick Demo
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('admin@agriflow.com')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors text-[12px] font-medium disabled:opacity-50"
              >
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleDemoLogin('farmer@agriflow.com')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors text-[12px] font-medium disabled:opacity-50"
              >
                <span>Farmer</span>
              </button>
              <button
                onClick={() => handleDemoLogin('buyer@agriflow.com')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-[12px] font-medium disabled:opacity-50"
              >
                <span>Buyer</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
