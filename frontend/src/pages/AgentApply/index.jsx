import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';
import { BANGALORE_LOCALITIES } from '../../constants';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaIdCard, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'];

export default function AgentApply() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const toggleLocality = (loc) => {
    setSelectedLocalities(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/agent-applications', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        reraNumber: data.reraNumber,
        agencyName: data.agencyName,
        experience: data.experience,
        localities: selectedLocalities,
        about: data.about
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">Application Submitted!</h2>
          <p className="text-text-sub mb-6">Thank you for applying. Our team will review your application and contact you within 2-3 business days.</p>
          <Link to="/" className="btn-primary justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo-light.jpeg" alt="Find My Home BLR" className="h-16 mx-auto object-contain mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-dark">Apply as an Agent</h1>
          <p className="text-text-sub mt-2">Join our network of verified real estate professionals in Bangalore</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Personal Info */}
            <h3 className="font-bold text-dark border-b border-border pb-2">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    placeholder="Your full name" className="input-field pl-9" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Mobile Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                    type="tel" placeholder="10-digit mobile number" className="input-field pl-9" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                  type="email" placeholder="you@example.com" className="input-field pl-9" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                    type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" className="input-field pl-9 pr-10" />
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
                  <input {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === password || 'Passwords do not match' })}
                    type="password" placeholder="Repeat password" className="input-field pl-9" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Professional Info */}
            <h3 className="font-bold text-dark border-b border-border pb-2 pt-2">Professional Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">RERA Registration Number</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('reraNumber', { required: 'RERA number is required' })}
                    placeholder="e.g. PRM/KA/RERA/..." className="input-field pl-9" />
                </div>
                {errors.reraNumber && <p className="text-red-500 text-xs mt-1">{errors.reraNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Agency / Company Name</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                  <input {...register('agencyName', { required: 'Agency name is required' })}
                    placeholder="Your agency name" className="input-field pl-9" />
                </div>
                {errors.agencyName && <p className="text-red-500 text-xs mt-1">{errors.agencyName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Years of Experience</label>
              <select {...register('experience', { required: 'Please select experience' })} className="input-field">
                <option value="">Select experience</option>
                {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Areas You Operate In <span className="text-text-sub font-normal">(select all that apply)</span></label>
              <div className="flex flex-wrap gap-2">
                {BANGALORE_LOCALITIES.map(loc => (
                  <button
                    key={loc} type="button"
                    onClick={() => toggleLocality(loc)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedLocalities.includes(loc) ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}
                  >{loc}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">About You <span className="text-text-sub font-normal">(optional)</span></label>
              <textarea {...register('about')}
                placeholder="Tell us about your experience, specializations, and why you'd like to join Find My Home BLR..."
                rows={4} className="input-field resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting Application...
                </span>
              ) : 'Submit Application'}
            </button>
          </form>

          <p className="text-center text-text-sub text-sm mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}