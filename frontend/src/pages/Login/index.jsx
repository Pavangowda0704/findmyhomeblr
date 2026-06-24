import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding, FaUsers, FaHandshake, FaMapMarkerAlt } from 'react-icons/fa';

const STATS = [
  { label: '5,000+', sub: 'Properties', icon: FaBuilding },
  { label: '12,000+', sub: 'Happy Clients', icon: FaUsers },
  { label: '350+', sub: 'Expert Agents', icon: FaHandshake },
  { label: '15+', sub: 'Localities', icon: FaMapMarkerAlt }
];

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
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-dark flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #8ED600 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8ED600 0%, transparent 40%)' }} />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <Link to="/">
            <img
              src="/logo-light.jpeg"
              alt="Find My Home BLR"
              className="w-40 object-contain mb-2"
            />
          </Link>

          {/* Brand title */}
          {/* <div className="text-center mb-8">
            <p className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Find My Home <span className="text-primary">BLR</span>
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We Find. You Live.
            </p>
          </div> */}

          {/* Welcome text */}
          <div className="text-center mb-10">
            <h2 className="text-white text-2xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Sign in to access your saved properties, enquiries, and personalized dashboard.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 text-center border border-white/10">
                <s.icon className="text-primary text-lg mx-auto mb-2" />
                <p className="text-primary font-bold text-lg">{s.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Agent apply link */}
          <p className="text-white/40 text-xs mt-10 text-center">
            Are you a real estate agent?{' '}
            <Link to="/agent-apply" className="text-primary hover:underline">Apply to join →</Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo-light.jpeg" alt="Find My Home BLR" className="h-14 w-auto object-contain" />
              <div className="text-left">
                <p className="font-bold text-dark text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Find My Home <span className="text-primary">BLR</span>
                </p>
                <p className="text-text-sub text-[10px] uppercase tracking-widest">We Find. You Live.</p>
              </div>
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
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPw ? 'text' : 'password'} placeholder="Enter your password" className="input-field pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors">
                    {showPw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-base">
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