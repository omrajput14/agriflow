import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import { Lock, Mail, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// Client-side password strength meter (UX only — server is source of truth)
function getPasswordStrength(password: string, email: string, fullName: string): { score: number; label: string; color: string; feedback: string[] } {
  if (!password) return { score: 0, label: '', color: '', feedback: [] };

  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 10) score += 1; else feedback.push('At least 10 characters');
  if (password.length >= 14) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1; else feedback.push('Mix of upper and lowercase');
  if (/\d/.test(password)) score += 1; else feedback.push('Include a number');
  if (/[^A-Za-z0-9]/.test(password)) score += 1; else feedback.push('Include a special character');

  // Penalize if password matches email or name
  if (email && password.toLowerCase() === email.toLowerCase()) { score = 0; feedback.unshift('Cannot be your email'); }
  if (fullName && password.toLowerCase() === fullName.toLowerCase()) { score = 0; feedback.unshift('Cannot be your name'); }

  const levels = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500' },
    { label: 'Good', color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
    { label: 'Very Strong', color: 'bg-emerald-600' },
  ];
  const level = levels[Math.min(score, levels.length - 1)];
  return { score, label: level.label, color: level.color, feedback };
}

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(
    () => getPasswordStrength(formData.password, formData.email, formData.full_name),
    [formData.password, formData.email, formData.full_name]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await apiRegister(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            Create an Account
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.full_name}
                  onChange={handleChange}
                  className="focus:ring-slate-900 focus:border-slate-900 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border bg-slate-50"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  minLength={10}
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-slate-900 focus:border-slate-900 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border bg-slate-50"
                  placeholder="Min. 10 characters"
                />
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strength.score ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${
                      strength.score >= 4 ? 'text-emerald-600' : strength.score >= 2 ? 'text-amber-600' : 'text-red-500'
                    }`}>
                      {strength.label}
                    </span>
                    {strength.score >= 4 && <CheckCircle2 size={12} className="text-emerald-500" />}
                  </div>
                  {strength.feedback.length > 0 && strength.score < 4 && (
                    <ul className="mt-1 space-y-0.5">
                      {strength.feedback.map((tip, i) => (
                        <li key={i} className="text-[11px] text-slate-500">• {tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || formData.password.length < 10}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
