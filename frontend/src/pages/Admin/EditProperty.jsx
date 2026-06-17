import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { propertyService } from '../../services/property/propertyService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { PROPERTY_TYPES, BANGALORE_LOCALITIES, AMENITIES } from '../../constants';
import { FaTrash, FaUpload, FaTimes } from 'react-icons/fa';

export default function AdminEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const listingType = watch('listingType');

  useEffect(() => {
    propertyService.getProperty(id)
      .then(res => {
        const p = res.data.property;
        setProperty(p);
        setSelectedAmenities(p.amenities || []);
        setExistingImages(p.images || []);
        reset({
          title: p.title,
          description: p.description,
          listingType: p.listingType,
          propertyType: p.propertyType,
          price: p.price,
          priceUnit: p.priceUnit,
          status: p.status,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          balconies: p.balconies,
          ageOfProperty: p.ageOfProperty,
          facing: p.facing,
          address: p.location?.address,
          locality: p.location?.locality,
          pincode: p.location?.pincode,
          totalArea: p.area?.total,
          carpetArea: p.area?.carpet,
          areaUnit: p.area?.unit || 'sqft',
          currentFloor: p.floor?.current,
          totalFloors: p.floor?.total
        });
      })
      .catch(() => toast.error('Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const deleteExistingImage = async (publicId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await propertyService.deleteImage(id, publicId);
      setExistingImages(prev => prev.filter(img => img.public_id !== publicId));
      toast.success('Image deleted');
    } catch { toast.error('Failed to delete image'); }
  };

  const toggleAmenity = (val) => {
    setSelectedAmenities(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);
  };

  const onSubmit = async (data) => {
    setSaving(true);
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
      formData.append('amenities', JSON.stringify(selectedAmenities));
      newImages.forEach(img => formData.append('images', img));

      await propertyService.updateProperty(id, formData);
      toast.success('Property updated successfully!');
      navigate('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return <div className="text-center py-20"><p className="text-text-sub">Property not found</p></div>;

  const inputClass = 'input-field';
  const labelClass = 'block text-sm font-medium text-text-main mb-1.5';
  const sectionClass = 'bg-white rounded-xl border border-border p-6 mb-6';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Edit Property</h1>
        <p className="text-text-sub mt-1 truncate">{property.title}</p>
        {property.agent && (
          <p className="text-xs text-primary mt-1">Listed by agent: {property.agent?.name || 'Unknown'}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Basic Information</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Property Title *</label>
              <input {...register('title', { required: 'Title is required' })} className={inputClass} />
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
              <textarea {...register('description', { required: 'Description is required' })}
                rows={5} className={`${inputClass} resize-none`} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Pricing & Status</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input {...register('price', { required: 'Price is required' })} type="number" className={inputClass} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Price Type</label>
              <select {...register('priceUnit')} className={inputClass}>
                <option value="total">Total</option>
                {listingType === 'rent' && <option value="per_month">Per Month</option>}
                <option value="per_sqft">Per Sqft</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
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
              <input {...register('address', { required: 'Address is required' })} className={inputClass} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Locality *</label>
                <select {...register('locality', { required: 'Locality is required' })} className={inputClass}>
                  {BANGALORE_LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input {...register('pincode')} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className={sectionClass}>
          <h2 className="font-bold text-text-main text-lg mb-5">Property Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'bedrooms', label: 'Bedrooms', opts: [1,2,3,4,5,6] },
              { name: 'bathrooms', label: 'Bathrooms', opts: [1,2,3,4,5] },
              { name: 'balconies', label: 'Balconies', opts: [0,1,2,3,4] }
            ].map(f => (
              <div key={f.name}>
                <label className={labelClass}>{f.label}</label>
                <select {...register(f.name)} className={inputClass}>
                  <option value="">Select</option>
                  {f.opts.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className={labelClass}>Total Area (sqft)</label>
              <input {...register('totalArea')} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Carpet Area (sqft)</label>
              <input {...register('carpetArea')} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Current Floor</label>
              <input {...register('currentFloor')} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Floors</label>
              <input {...register('totalFloors')} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Facing</label>
              <select {...register('facing')} className={inputClass}>
                <option value="">Select</option>
                {['north','south','east','west','north_east','north_west','south_east','south_west'].map(f => (
                  <option key={f} value={f}>{f.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Age of Property (years)</label>
              <input {...register('ageOfProperty')} type="number" className={inputClass} />
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
          <h2 className="font-bold text-text-main text-lg mb-5">Property Images</h2>
          {existingImages.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-text-sub mb-3">Current Images</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((img, i) => (
                  <div key={img.public_id || i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <div className="absolute top-2 left-2 bg-primary text-dark text-xs font-bold px-2 py-0.5 rounded-full">Cover</div>}
                    {img.public_id && (
                      <button type="button" onClick={() => deleteExistingImage(img.public_id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
              <FaUpload className="text-2xl text-text-sub mx-auto mb-2" />
              <p className="text-sm font-medium text-text-main">Add more images</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
          </label>

          {newPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </span>
            ) : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/properties')} className="btn-outline py-3 px-8">Cancel</button>
        </div>
      </form>
    </div>
  );
}