import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Settings() {
  const { user, login: setAuthUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage('');
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMessage('');
      const updated = await updateProfile({
        full_name: profileData.full_name,
        email: profileData.email,
      });
      // Update auth context with new data
      const token = localStorage.getItem('token');
      if (token) {
        setAuthUser(token, updated);
      }
      showSuccess('Profile updated successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showError('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      showError('New password must be at least 6 characters');
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage('');
      await updateProfile({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      showSuccess('Password changed successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-auto p-6 absolute inset-0 bg-[#F8FAFC]"
    >
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Manage your account preferences and security.</p>
        </div>

        {/* Success/Error Banners */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-[13px] font-medium text-emerald-700"
          >
            <CheckCircle2 size={16} />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] font-medium text-red-700"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-md transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={14} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-md transition-all ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield size={14} />
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-[15px] font-semibold text-slate-900">Profile Information</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Update your account details below.</p>
            </div>

            <form onSubmit={handleProfileSave} className="p-6 space-y-5">
              {/* Avatar & Role Display */}
              <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {user?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">{user?.full_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {user?.role}
                    </span>
                    <span className="text-[11px] text-slate-400">ID: {user?.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <User size={12} />
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <Mail size={12} />
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-[15px] font-semibold text-slate-900">Change Password</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handlePasswordSave} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock size={12} />
                  Current Password
                </label>
                <input
                  required
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock size={12} />
                  New Password
                </label>
                <input
                  required
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock size={12} />
                  Confirm New Password
                </label>
                <input
                  required
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                  Change Password
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
