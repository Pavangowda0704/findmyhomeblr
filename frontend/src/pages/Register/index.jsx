import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await authRegister({ name: data.name, email: data.email, phone: data.phone, password: data.password, role: data.role });
      toast.success(`Welcome to Find My Home BLR, ${user.name}!`);
      if (user.role === 'agent') navigate('/agent');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark flex-col items-center justify-center p-12">
        <img src="/logo-dark.jpeg" alt="Find My Home BLR" className="w-64 mb-8 object-contain" />
        <h2 className="text-white text-2xl font-bold text-center mb-3">Join Find My Home BLR</h2>
        <p className="text-white/60 text-center text-sm leading-relaxed max-w-xs">
          Create your account and start exploring thousands of verified properties in Bangalore.
        </p>
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-xs">
          <p className="text-primary font-semibold mb-1">WE FIND. YOU LIVE.</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Trusted by over 12,000 families across Bangalore to find their perfect home.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="/logo-light.jpeg" alt="Find My Home BLR" className="h-20 mx-auto object-contain" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-dark">Create Account</h1>
            <p className="text-text-sub mt-1">Join thousands of happy homebuyers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} placeholder="Your full name" className="input-field pl-9" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} type="email" placeholder="you@example.com" className="input-field pl-9" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Mobile Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' } })} type="tel" placeholder="10-digit mobile number" className="input-field pl-9" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Register As</label>
                <select {...register('role')} className="input-field">
                  <option value="user">Home Buyer / Renter</option>
                  <option value="agent">Real Estate Agent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" className="input-field pl-9 pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub">
                    {showPw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === password || 'Passwords do not match' })} type="password" placeholder="Repeat your password" className="input-field pl-9" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-text-sub text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
