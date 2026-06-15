import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'agent') navigate('/agent');
      else navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark flex-col items-center justify-center p-12">
        <img src="/logo-dark.jpeg" alt="Find My Home BLR" className="w-64 mb-8 object-contain" />
        <h2 className="text-white text-2xl font-bold text-center mb-3">Welcome Back!</h2>
        <p className="text-white/60 text-center text-sm leading-relaxed max-w-xs">
          Sign in to access your saved properties, enquiries, and personalized dashboard.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {[
            { label: '5,000+', sub: 'Properties' },
            { label: '12,000+', sub: 'Happy Clients' },
            { label: '350+', sub: 'Expert Agents' },
            { label: '15+', sub: 'Localities' }
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-primary font-bold text-lg">{s.label}</p>
              <p className="text-white/60 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="/logo-light.jpeg" alt="Find My Home BLR" className="h-20 mx-auto object-contain" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-dark">Sign In</h1>
            <p className="text-text-sub mt-1">Enter your credentials to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
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

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-main">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPw ? 'text' : 'password'} placeholder="Enter your password" className="input-field pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
                    {showPw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-text-sub text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
