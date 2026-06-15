import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user/userService';
import toast from 'react-hot-toast';
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaSave } from 'react-icons/fa';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.phone) formData.append('phone', data.phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await userService.updateProfile(formData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">My Profile</h1>
        <p className="text-text-sub mt-1">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-border p-8">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-dark font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-dark text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
                <FaCamera className="text-xs" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <p className="font-bold text-text-main text-lg">{user?.name}</p>
              <p className="text-text-sub text-sm capitalize">{user?.role}</p>
              <p className="text-text-sub text-xs mt-1">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  placeholder="Your full name" className="input-field pl-9"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  value={user?.email} disabled
                  className="input-field pl-9 bg-background cursor-not-allowed text-text-sub"
                />
              </div>
              <p className="text-text-sub text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Mobile Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
                <input
                  {...register('phone', {
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' }
                  })}
                  placeholder="Mobile number" className="input-field pl-9"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3 px-6">
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
