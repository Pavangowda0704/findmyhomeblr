import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { propertyService } from '../../services/property/propertyService';
import toast from 'react-hot-toast';
import { PROPERTY_TYPES, BANGALORE_LOCALITIES, AMENITIES } from '../../constants';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';

export default function AdminCreateProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { listingType: 'buy', propertyType: 'apartment', status: 'active', priceUnit: 'total' }
  });

  const listingType = watch('listingType');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) { toast.error('Maximum 10 images allowed'); return; }
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleAmenity = (val) => {
    setSelectedAmenities(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);
  };

  const onSubmit = async (data) => {
    if (images.length === 0) { toast.error('Please upload at least one image'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      ['title', 'description', 'propertyType', 'listingType', 'price', 'priceUnit', 'status',
       'bedrooms', 'bathrooms', 'balconies', 'ageOfProperty', 'facing'].forEach(key => {
        if (data[key] !== '' && data[key] !== undefined) formData.append(key, data[key]);
      });
      formData.append('location', JSON.stringify({
        address: data.address, locality: data.locality,
        city: 'Bangalore', state: 'Karnataka', pincode: data.pincode
      }));
      formData.append('area', JSON.stringify({ total: data.totalArea, carpet: data.carpetArea, unit: data.areaUnit || 'sqft' }));
      if (data.currentFloor || data.totalFloors) {
        formData.append('floor', JSON.stringify({ current: data.currentFloor, total: data.totalFloors }));
      }
      formData.append('amenities', JSON.stringify(selectedAmenities));
      images.forEach(img => formData.append('images', img));

      await propertyService.createProperty(formData);
      toast.success('Property created successfully!');
      navigate('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input-field';
  const labelClass = 'block text-sm font-medium text-text-main mb-1.5';
  const sectionClass = 'bg-white rounded-xl border border-border p-6 mb-6';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Add New Property</h1>
        <p className="text-text-sub mt-1">Create a new property listing as admin</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Basic Information</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Property Title *</label>
              <input {...register('title', { required: 'Title is required' })} placeholder="e.g. Spacious 3BHK in Whitefield" className={inputClass} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Listing Type *</label>
                <select {...register('listingType')} className={inputClass}>
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Property Type *</label>
                <select {...register('propertyType')} className={inputClass}>
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Min 50 characters' } })}
                rows={5} placeholder="Describe the property in detail..." className={`${inputClass} resize-none`} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be positive' } })}
                type="number" placeholder="Enter price" className={inputClass} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Price Type</label>
              <select {...register('priceUnit')} className={inputClass}>
                <option value="total">Total Price</option>
                {listingType === 'rent' && <option value="per_month">Per Month</option>}
                <option value="per_sqft">Per Sqft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Location</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Street Address *</label>
              <input {...register('address', { required: 'Address is required' })} placeholder="Building name, street, landmark" className={inputClass} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Locality *</label>
                <select {...register('locality', { required: 'Locality is required' })} className={inputClass}>
                  <option value="">Select Locality</option>
                  {BANGALORE_LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input {...register('pincode')} placeholder="560001" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Property Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div><label className={labelClass}>Bedrooms</label>
              <select {...register('bedrooms')} className={inputClass}>
                <option value="">Select</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Bathrooms</label>
              <select {...register('bathrooms')} className={inputClass}>
                <option value="">Select</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Balconies</label>
              <select {...register('balconies')} className={inputClass}>
                <option value="">Select</option>
                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Total Area (sqft) *</label>
              <input {...register('totalArea', { required: 'Area is required' })} type="number" placeholder="e.g. 1200" className={inputClass} />
              {errors.totalArea && <p className="text-red-500 text-xs mt-1">{errors.totalArea.message}</p>}
            </div>
            <div><label className={labelClass}>Carpet Area (sqft)</label>
              <input {...register('carpetArea')} type="number" placeholder="e.g. 950" className={inputClass} />
            </div>
            <div><label className={labelClass}>Area Unit</label>
              <select {...register('areaUnit')} className={inputClass}>
                <option value="sqft">Sqft</option>
                <option value="sqmt">Sq. Meter</option>
                <option value="sqyd">Sq. Yard</option>
              </select>
            </div>
            <div><label className={labelClass}>Current Floor</label>
              <input {...register('currentFloor')} type="number" placeholder="e.g. 5" className={inputClass} />
            </div>
            <div><label className={labelClass}>Total Floors</label>
              <input {...register('totalFloors')} type="number" placeholder="e.g. 12" className={inputClass} />
            </div>
            <div><label className={labelClass}>Facing</label>
              <select {...register('facing')} className={inputClass}>
                <option value="">Select</option>
                {['north','south','east','west','north_east','north_west','south_east','south_west'].map(f => (
                  <option key={f} value={f}>{f.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div><label className={labelClass}>Age of Property (years)</label>
              <input {...register('ageOfProperty')} type="number" placeholder="e.g. 3" className={inputClass} />
            </div>
            <div><label className={labelClass}>Status</label>
              <select {...register('status')} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AMENITIES.map(a => (
              <label key={a.value} className="cursor-pointer">
                <input type="checkbox" className="sr-only" checked={selectedAmenities.includes(a.value)} onChange={() => toggleAmenity(a.value)} />
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${selectedAmenities.includes(a.value) ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-background border-border text-text-sub hover:border-primary'}`}>
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedAmenities.includes(a.value) ? 'bg-primary border-primary' : 'border-border'}`}>
                    {selectedAmenities.includes(a.value) && <span className="text-dark text-xs">✓</span>}
                  </span>
                  {a.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-2">Property Images *</h2>
          <p className="text-text-sub text-sm mb-5">Upload up to 10 images. First image will be the cover photo.</p>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <FaUpload className="text-3xl text-text-sub mx-auto mb-3" />
              <p className="font-medium text-text-main mb-1">Click to upload images</p>
              <p className="text-text-sub text-sm">JPG, PNG, WebP up to 5MB each</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-5">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <div className="absolute top-2 left-2 bg-primary text-dark text-xs font-bold px-2 py-0.5 rounded-full">Cover</div>}
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
              {previews.length < 10 && (
                <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary transition-colors">
                  <FaPlus className="text-text-sub text-xl mb-1" />
                  <span className="text-text-sub text-xs">Add More</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Publishing...
              </span>
            ) : 'Publish Property'}
          </button>
          <button type="button" onClick={() => navigate('/admin/properties')} className="btn-outline py-3 px-8">Cancel</button>
        </div>
      </form>
    </div>
  );
}