import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/auth/authService';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Change Password</h1>
        <p className="text-text-sub mt-1">Keep your account secure with a strong password</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <FaShieldAlt className="text-primary text-xl flex-shrink-0" />
            <p className="text-sm text-text-sub">Use a strong password with at least 8 characters, including numbers and special characters.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Current Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  {...register('currentPassword', { required: 'Current password is required' })}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="input-field pl-9 pr-10"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
                  {showCurrent ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="input-field pl-9 pr-10"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
                  {showNew ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: v => v === newPassword || 'Passwords do not match'
                  })}
                  type="password"
                  placeholder="Confirm new password"
                  className="input-field pl-9"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Updating...
                </span>
              ) : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
