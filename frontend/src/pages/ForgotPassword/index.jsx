import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/auth/authService';
import toast from 'react-hot-toast';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo-light.jpeg" alt="Find My Home BLR" className="h-20 mx-auto object-contain mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-dark">Forgot Password</h1>
          <p className="text-text-sub mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          {sent ? (
            <div className="text-center py-4">
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-text-main text-lg mb-2">Email Sent!</h3>
              <p className="text-text-sub text-sm mb-6">Check your inbox for the password reset link. It expires in 10 minutes.</p>
              <Link to="/login" className="btn-primary w-full justify-center">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email" placeholder="you@example.com" className="input-field pl-9"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <p className="text-center text-text-sub text-sm mt-5">
            <Link to="/login" className="text-primary font-medium hover:underline">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
