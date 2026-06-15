import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { leadService } from '../../services/lead/leadService';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaUser } from 'react-icons/fa';

const EnquiryForm = ({ propertyId, agentName }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await leadService.createLead({ ...data, propertyId });
      toast.success('Enquiry sent successfully! Agent will contact you soon.');
      reset({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="font-bold text-text-main text-lg mb-1">Contact Agent</h3>
      {agentName && <p className="text-text-sub text-sm mb-5">Send enquiry to <span className="text-primary font-medium">{agentName}</span></p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Your Name"
              className="input-field pl-9"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              placeholder="Email Address"
              className="input-field pl-9"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
            <input
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' }
              })}
              placeholder="Mobile Number"
              className="input-field pl-9"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <textarea
            {...register('message')}
            placeholder="I'm interested in this property. Please contact me."
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary justify-center">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending...
            </span>
          ) : 'Send Enquiry'}
        </button>

        <p className="text-text-sub text-xs text-center">By submitting, you agree to our terms & privacy policy.</p>
      </form>
    </div>
  );
};

export default EnquiryForm;
